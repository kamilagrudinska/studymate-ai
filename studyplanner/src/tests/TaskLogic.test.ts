import { describe, it, expect } from 'vitest';

import type { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import {
    calculateProgress,
    sortTasks,
    validateTask,
} from '../utils/taskLogic';

function makeTask(overrides: Partial<Task>): Task {
    return {
        id: 'id',
        clientId: 'client-a',
        title: 'Užduotis',
        description: '',
        dueDate: '2026-10-20',
        priority: 'medium',
        status: 'todo',
        ...overrides,
    };
}

describe('Rikiavimas', () => {
    const today = '2026-10-14';

    it('vėluojanti žemo prioriteto užduotis rodoma prieš aukšto prioriteto nevėluojančią', () => {
        const late = makeTask({ id: 'late', priority: 'low', dueDate: '2026-10-10' });
        const high = makeTask({ id: 'high', priority: 'high', dueDate: '2026-10-20' });

        expect(sortTasks([high, late], today).map(t => t.id)).toEqual(['late', 'high']);
    });

    it('atliktos užduotys rodomos paskutinės, net jei terminas ankstesnis', () => {
        const done = makeTask({ id: 'done', status: 'done', dueDate: '2026-10-01', priority: 'high' });
        const active = makeTask({ id: 'active', dueDate: '2026-10-30', priority: 'low' });

        expect(sortTasks([done, active], today).map(t => t.id)).toEqual(['active', 'done']);
    });

    it('esant vienodam prioritetui rikiuoja pagal artimiausią terminą', () => {
        const later = makeTask({ id: 'later', dueDate: '2026-10-25' });
        const sooner = makeTask({ id: 'sooner', dueDate: '2026-10-16' });

        expect(sortTasks([later, sooner], today).map(t => t.id)).toEqual(['sooner', 'later']);
    });

    it('terminas šiandien nelaikomas vėluojančiu ir rikiuojamas pagal prioritetą', () => {
        const dueToday = makeTask({ id: 'today', dueDate: today, priority: 'low' });
        const high = makeTask({ id: 'high', dueDate: '2026-10-20', priority: 'high' });

        expect(sortTasks([dueToday, high], today).map(t => t.id)).toEqual(['high', 'today']);
    });

    it('nekeičia pradinio masyvo', () => {
        const a = makeTask({ id: 'a', priority: 'low' });
        const b = makeTask({ id: 'b', priority: 'high' });
        const input = [a, b];

        sortTasks(input, today);

        expect(input.map(t => t.id)).toEqual(['a', 'b']);
    });
});

describe('Pažanga ir validacija', () => {
    it('1 atlikta iš 3 užduočių – 33,3 %', () => {
        const tasks = [
            makeTask({ id: '1', status: 'done' }),
            makeTask({ id: '2' }),
            makeTask({ id: '3', status: 'in-progress' }),
        ];

        expect(calculateProgress(tasks)).toBe(33.3);
    });

    it('negaliojanti data atmetama', () => {
        expect(() => validateTask('Pavadinimas', '2026-02-30')).toThrow('Nurodykite galiojančią datą');
        expect(() => validateTask('Pavadinimas', 'netinkama')).toThrow('Nurodykite tinkamą terminą');
        expect(() => validateTask('Pavadinimas', '')).toThrow('Nurodykite tinkamą terminą');
    });

    it('užduotis be termino neišsaugoma', () => {
        const service = new TaskService();

        expect(() =>
            service.createTask('client-a', {
                title: 'Be termino',
                description: '',
                dueDate: '',
                priority: 'medium',
            })
        ).toThrow('Nurodykite tinkamą terminą');

        expect(service.getTasks('client-a')).toHaveLength(0);
    });

    it('netinkamas prioritetas atmetamas kuriant ir redaguojant', () => {
        const service = new TaskService();

        expect(() =>
            service.createTask('client-a', {
                title: 'Užduotis',
                description: '',
                dueDate: '2026-10-20',
                priority: 'urgent' as never,
            })
        ).toThrow('Neteisingas užduoties prioritetas');

        const task = service.createTask('client-a', {
            title: 'Užduotis',
            description: '',
            dueDate: '2026-10-20',
            priority: 'low',
        });

        expect(() =>
            service.updateTask('client-a', task.id, { priority: 'urgent' as never })
        ).toThrow('Neteisingas užduoties prioritetas');

        expect(service.getTasks('client-a')[0].priority).toBe('low');
    });

    it('redaguojant apkerpamas pavadinimas', () => {
        const service = new TaskService();
        const task = service.createTask('client-a', {
            title: 'Pirmas',
            description: '',
            dueDate: '2026-10-20',
            priority: 'low',
        });

        const updated = service.updateTask('client-a', task.id, { title: '  Antras  ' });

        expect(updated.title).toBe('Antras');
    });
});
