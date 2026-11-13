import type { Task } from '../models/Task';

export const clients = [
    { id: 'client-a', name: 'Studentų grupė A' },
    { id: 'client-b', name: 'Studentų grupė B' },
];

export const sampleTasks: Task[] = [
    {
        id: 'task-1',
        clientId: 'client-a',
        title: 'Parengti Java laboratorinį darbą',
        description: 'Užbaigti programą ir parengti ataskaitą',
        dueDate: '2026-11-15',
        priority: 'high',
        status: 'todo',
    },
    {
        id: 'task-2',
        clientId: 'client-a',
        title: 'Pakartoti duomenų struktūras',
        description: 'Pasiruošti atsiskaitymui',
        dueDate: '2026-11-20',
        priority: 'medium',
        status: 'in-progress',
    },
    {
        id: 'task-3',
        clientId: 'client-a',
        title: 'Užbaigti projektą',
        description: 'Patikrinti pagrindines funkcijas',
        dueDate: '2026-11-25',
        priority: 'high',
        status: 'done',
    },
    {
        id: 'task-4',
        clientId: 'client-b',
        title: 'Parengti matematikos pristatymą',
        description: 'Sukurti skaidres',
        dueDate: '2026-11-18',
        priority: 'medium',
        status: 'todo',
    },
    {
        id: 'task-5',
        clientId: 'client-b',
        title: 'Atlikti duomenų bazės užduotį',
        description: 'Sukurti SQL užklausas',
        dueDate: '2026-11-22',
        priority: 'low',
        status: 'in-progress',
    },
];
