import type { Task, TaskPriority, TaskStatus } from '../models/Task';

export function validateTask(title: string, dueDate: string): void {
    if (!title.trim()) {
        throw new Error('Užduoties pavadinimas privalomas');
    }

    if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        throw new Error('Nurodykite tinkamą terminą');
    }

    const date = new Date(`${dueDate}T00:00:00`);

    if (
        Number.isNaN(date.getTime()) ||
        date.getFullYear() !== Number(dueDate.slice(0, 4)) ||
        date.getMonth() + 1 !== Number(dueDate.slice(5, 7)) ||
        date.getDate() !== Number(dueDate.slice(8, 10))
    ) {
        throw new Error('Nurodykite galiojančią datą');
    }
}

export function isOverdue(task: Task, today: string): boolean {
    return task.status !== 'done' && task.dueDate < today;
}

export function calculateProgress(tasks: Task[]): number {
    if (tasks.length === 0) return 0;

    const completed = tasks.filter(task => task.status === 'done').length;

    return Math.round((completed / tasks.length) * 1000) / 10;
}

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];

export function validatePriority(priority: string): void {
    if (!(PRIORITIES as string[]).includes(priority)) {
        throw new Error('Neteisingas užduoties prioritetas');
    }
}

export function validateStatus(status: string): void {
    if (!(STATUSES as string[]).includes(status)) {
        throw new Error('Neteisinga užduoties būsena');
    }
}

const PRIORITY_ORDER: Record<TaskPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
};

// Rikiavimo taisyklė: aktyvios prieš atliktas; tarp aktyvių – vėluojančios,
// tada pagal prioritetą, tada pagal artimiausią terminą.
export function sortTasks(tasks: Task[], today: string): Task[] {
    return [...tasks].sort((a, b) => {
        const aDone = a.status === 'done';
        const bDone = b.status === 'done';
        if (aDone !== bDone) return aDone ? 1 : -1;

        const aLate = isOverdue(a, today);
        const bLate = isOverdue(b, today);
        if (aLate !== bLate) return aLate ? -1 : 1;

        const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        if (byPriority !== 0) return byPriority;

        return a.dueDate.localeCompare(b.dueDate);
    });
}
