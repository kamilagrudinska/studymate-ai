import { describe, it, expect } from 'vitest';

import { TaskService } from '../services/TaskService';
import { calculateProgress, isOverdue } from '../utils/taskLogic';

describe('StudyPlanner pagrindinio modulio testai', () => {

    it('Sukuria užduotį su teisingais duomenimis', () => {
        const service = new TaskService();

        const task = service.createTask('client-a', {
            title: 'Parengti laboratorinį darbą',
            description: 'Java užduotis',
            dueDate: '2026-11-20',
            priority: 'high',
        });

        expect(task.title).toBe('Parengti laboratorinį darbą');
        expect(task.status).toBe('todo');
        expect(service.getTasks('client-a')).toHaveLength(1);
    });

    it('Teisingai apskaičiuoja pažangą', () => {
        const service = new TaskService();

        const first = service.createTask('client-a', {
            title: 'Pirma užduotis',
            description: '',
            dueDate: '2026-11-20',
            priority: 'medium',
        });

        service.createTask('client-a', {
            title: 'Antra užduotis',
            description: '',
            dueDate: '2026-11-21',
            priority: 'low',
        });

        service.changeStatus('client-a', first.id, 'done');

        expect(calculateProgress(service.getTasks('client-a'))).toBe(50);
        expect(calculateProgress([])).toBe(0);
    });

    it('Atmeta užduotį be pavadinimo', () => {
        const service = new TaskService();

        expect(() =>
            service.createTask('client-a', {
                title: '   ',
                description: '',
                dueDate: '2026-11-20',
                priority: 'high',
            })
        ).toThrow('Užduoties pavadinimas privalomas');

        expect(service.getTasks('client-a')).toHaveLength(0);
    });

    it('Teisingai nustato vėluojančias užduotis', () => {
        const service = new TaskService();

        const task = service.createTask('client-a', {
            title: 'Atlikti projektą',
            description: '',
            dueDate: '2026-11-10',
            priority: 'high',
        });

        expect(isOverdue(task, '2026-11-13')).toBe(true);
        expect(isOverdue(task, '2026-11-10')).toBe(false);

        const completed = service.changeStatus(
            'client-a',
            task.id,
            'done'
        );

        expect(isOverdue(completed, '2026-11-13')).toBe(false);
    });

    it('Neleidžia klientui B pasiekti kliento A užduočių', () => {
        const service = new TaskService();

        const taskA = service.createTask('client-a', {
            title: 'Kliento A užduotis',
            description: '',
            dueDate: '2026-11-20',
            priority: 'high',
        });

        const taskB = service.createTask('client-b', {
            title: 'Kliento B užduotis',
            description: '',
            dueDate: '2026-11-21',
            priority: 'medium',
        });

        expect(service.getTasks('client-a')).toHaveLength(1);
        expect(service.getTasks('client-b')).toHaveLength(1);

        expect(service.getTasks('client-b')[0].id).toBe(taskB.id);

        expect(() =>
            service.updateTask('client-b', taskA.id, {
                title: 'Pakeistas pavadinimas',
            })
        ).toThrow('Užduotis nerasta arba neturite prieigos');

        expect(() =>
            service.deleteTask('client-b', taskA.id)
        ).toThrow('Užduotis nerasta arba neturite prieigos');

        expect(() =>
            service.changeStatus('client-b', taskA.id, 'done')
        ).toThrow('Užduotis nerasta arba neturite prieigos');

        expect(service.getTasks('client-a')[0].title)
            .toBe('Kliento A užduotis');
    });

});
