import type { Task } from '../models/Task';

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
