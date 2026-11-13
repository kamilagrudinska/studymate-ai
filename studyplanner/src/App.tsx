import { useState } from 'react';
import type { FormEvent } from 'react';

import type { Task, TaskPriority, TaskStatus } from './models/Task';
import { calculateProgress, isOverdue } from './utils/taskLogic';
import { TaskService } from './services/TaskService';
import { TaskStorage } from './services/TaskStorage';
import { clients } from './data/sampleData';
import './App.css';

const service = new TaskService(TaskStorage.load());

const emptyForm = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium' as TaskPriority,
};

const priorityNames: Record<TaskPriority, string> = {
  low: 'Žemas',
  medium: 'Vidutinis',
  high: 'Aukštas',
};

const statusNames: Record<TaskStatus, string> = {
  todo: 'Neatlikta',
  'in-progress': 'Vykdoma',
  done: 'Atlikta',
};

function App() {
  const [clientId, setClientId] = useState('client-a');
  const [tasks, setTasks] = useState<Task[]>(service.getTasks('client-a'));
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  const progress = calculateProgress(tasks);
  const today = new Date().toLocaleDateString('en-CA');

  function refresh(currentClientId: string) {
    setTasks(service.getTasks(currentClientId));
  }

  function saveChanges() {
    TaskStorage.save(service.getAllTasksForStorage());
    refresh(clientId);
  }

  function handleClientChange(nextClientId: string) {
    setClientId(nextClientId);
    refresh(nextClientId);
    setForm({ ...emptyForm });
    setEditingId(null);
    setError('');
    setSuccess('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        service.updateTask(clientId, editingId, form);
        setSuccess('Užduotis atnaujinta');
      } else {
        service.createTask(clientId, form);
        setSuccess('Užduotis sukurta');
      }

      saveChanges();
      setForm({ ...emptyForm });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Įvyko klaida');
    }
  }

  function handleEdit(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    try {
      service.changeStatus(clientId, taskId, status);
      saveChanges();
      setError('');
      setSuccess('Būsena pakeista');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Įvyko klaida');
    }
  }

  function handleDelete(taskId: string) {
    if (!window.confirm('Ar tikrai norite pašalinti užduotį?')) return;

    try {
      service.deleteTask(clientId, taskId);
      saveChanges();
      setError('');
      setSuccess('Užduotis pašalinta');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Įvyko klaida');
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'date') {
      return a.dueDate.localeCompare(b.dueDate);
    }

    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>StudyPlanner</h1>
          <p>Mokymosi planavimo ir užduočių valdymo sistema</p>
        </div>

        <div className="client-selector">
          <label htmlFor="client">Pasirinkite klientą</label>
          <select
            id="client"
            value={clientId}
            onChange={e => handleClientChange(e.target.value)}
          >
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="container">
        <section className="progress-card">
          <div className="progress-heading">
            <h2>Mokymosi pažanga</h2>
            <strong>{progress.toFixed(1)} %</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>
            Atlikta {tasks.filter(task => task.status === 'done').length}
            {' '}iš {tasks.length} užduočių
          </p>
        </section>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <section className="card">
          <h2>{editingId ? 'Redaguoti užduotį' : 'Nauja užduotis'}</h2>

          <form onSubmit={handleSubmit} className="task-form" noValidate>
            <label>
              Pavadinimas
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Pvz., Parengti Java laboratorinį darbą"
              />
            </label>

            <label>
              Aprašymas
              <textarea
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Užduoties aprašymas"
                rows={3}
              />
            </label>

            <div className="form-row">
              <label>
                Terminas
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </label>

              <label>
                Prioritetas
                <select
                  value={form.priority}
                  onChange={e =>
                    setForm({
                      ...form,
                      priority: e.target.value as TaskPriority,
                    })
                  }
                >
                  <option value="low">Žemas</option>
                  <option value="medium">Vidutinis</option>
                  <option value="high">Aukštas</option>
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingId ? 'Išsaugoti pakeitimus' : 'Pridėti užduotį'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...emptyForm });
                  }}
                >
                  Atšaukti
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="list-heading">
            <h2>Mano užduotys ({tasks.length})</h2>

            <select
              value={sortBy}
              onChange={e =>
                setSortBy(e.target.value as 'date' | 'priority')
              }
            >
              <option value="date">Pagal terminą</option>
              <option value="priority">Pagal prioritetą</option>
            </select>
          </div>

          {sortedTasks.length === 0 ? (
            <p className="empty-state">Užduočių dar nėra.</p>
          ) : (
            <div className="task-list">
              {sortedTasks.map(task => (
                <article className="task-item" key={task.id}>
                  <div className="task-details">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>
                      <span className={`priority priority-${task.priority}`}>
                        {priorityNames[task.priority]}
                      </span>
                    </div>

                    {task.description && <p>{task.description}</p>}

                    <div className="task-meta">
                      <span>Terminas: {task.dueDate}</span>
                      {isOverdue(task, today) && (
                        <span className="overdue">Vėluoja!</span>
                      )}
                    </div>
                  </div>

                  <div className="task-controls">
                    <select
                      value={task.status}
                      onChange={e =>
                        handleStatusChange(
                          task.id,
                          e.target.value as TaskStatus
                        )
                      }
                    >
                      {Object.entries(statusNames).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>

                    <button
                      className="secondary-button"
                      onClick={() => handleEdit(task)}
                    >
                      Redaguoti
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(task.id)}
                    >
                      Šalinti
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
