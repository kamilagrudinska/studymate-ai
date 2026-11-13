import type { Task } from '../models/Task';
import { sampleTasks } from '../data/sampleData';
import { validateTask } from '../utils/taskLogic';

const STORAGE_KEY = 'studyplanner-tasks';

function isValidTask(value: unknown): value is Task {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const task = value as Record<string, unknown>;

    if (
        typeof task.id !== 'string' ||
        !task.id.trim() ||
        typeof task.clientId !== 'string' ||
        !task.clientId.trim() ||
        typeof task.title !== 'string' ||
        typeof task.description !== 'string' ||
        typeof task.dueDate !== 'string' ||
        !['low', 'medium', 'high'].includes(String(task.priority)) ||
        !['todo', 'in-progress', 'done'].includes(String(task.status))
    ) {
        return false;
    }

    try {
        validateTask(task.title, task.dueDate);
        return true;
    } catch {
        return false;
    }
}

export class TaskStorage {
    static load(): Task[] {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return sampleTasks.map(task => ({ ...task }));
        }

        try {
            const parsed: unknown = JSON.parse(stored);

            if (!Array.isArray(parsed) || !parsed.every(isValidTask)) {
                throw new Error('Neteisingas duomenų formatas');
            }

            return parsed.map(task => ({ ...task }));
        } catch {
            throw new Error('Nepavyko įkelti išsaugotų užduočių');
        }
    }

    static save(tasks: Task[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch {
            throw new Error('Nepavyko išsaugoti užduočių');
        }
    }
}
