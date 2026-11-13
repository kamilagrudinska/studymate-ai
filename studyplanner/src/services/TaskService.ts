import type { Task, TaskPriority, TaskStatus } from '../models/Task';
import { validateTask } from '../utils/taskLogic';

export interface CreateTaskInput {
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
}

export class TaskService {
    private tasks: Task[];

    constructor(initialTasks: Task[] = []) {
        this.tasks = initialTasks.map(task => ({ ...task }));
    }

    // Grąžina tik pasirinktam klientui priklausančias užduotis
    getTasks(clientId: string): Task[] {
        return this.tasks
            .filter(task => task.clientId === clientId)
            .map(task => ({ ...task }));
    }

    // Sukuria naują užduotį
    createTask(clientId: string, input: CreateTaskInput): Task {
        validateTask(input.title, input.dueDate);

        const task: Task = {
            id: crypto.randomUUID(),
            clientId,
            title: input.title.trim(),
            description: input.description,
            dueDate: input.dueDate,
            priority: input.priority,
            status: 'todo',
        };

        this.tasks.push(task);
        return { ...task };
    }

    // Pakeičia užduoties duomenis
    updateTask(clientId: string, taskId: string, changes: Partial<CreateTaskInput>): Task {
        const task = this.findClientTask(clientId, taskId);

        const updated: Task = {
            ...task,
            ...changes,
            clientId: task.clientId,
            id: task.id,
        };

        validateTask(updated.title, updated.dueDate);

        Object.assign(task, updated);
        return { ...task };
    }

    // Pakeičia užduoties būseną
    changeStatus(clientId: string, taskId: string, status: TaskStatus): Task {
        const task = this.findClientTask(clientId, taskId);

        if (!(['todo', 'in-progress', 'done'] as string[]).includes(status)) {
            throw new Error('Neteisinga užduoties būsena');
        }

        task.status = status;
        return { ...task };
    }

    // Pašalina užduotį

    deleteTask(clientId: string, taskId: string): void {
        this.findClientTask(clientId, taskId);

        this.tasks = this.tasks.filter(
            task => !(task.id === taskId && task.clientId === clientId)
        );
    }


    // Patikrina, ar užduotis priklauso pasirinktam klientui
    private findClientTask(clientId: string, taskId: string): Task {
        const task = this.tasks.find(
            task => task.id === taskId && task.clientId === clientId
        );

        if (!task) {
            throw new Error('Užduotis nerasta arba neturite prieigos');
        }

        return task;
    }

    // Grąžina visų klientų užduotis saugojimui
    getAllTasksForStorage(): Task[] {
        return this.tasks.map(task => ({ ...task }));
    }

}
