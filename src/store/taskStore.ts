import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  searchQuery: string;
  priorityFilter: Priority | 'all';
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | 'all') => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: '1',
          title: 'Design System Setup',
          description: 'Create a comprehensive design system with tokens and components',
          deadline: '2026-02-25',
          priority: 'high',
          status: 'todo',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'API Integration',
          description: 'Connect frontend with backend REST API endpoints',
          deadline: '2026-02-28',
          priority: 'medium',
          status: 'in-progress',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Landing Page',
          description: 'Build responsive landing page with hero section',
          deadline: '2026-02-22',
          priority: 'low',
          status: 'done',
          createdAt: new Date().toISOString(),
        },
      ],
      searchQuery: '',
      priorityFilter: 'all',
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
      getFilteredTasks: () => {
        const { tasks, searchQuery, priorityFilter } = get();
        return tasks.filter((t) => {
          const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
          return matchesSearch && matchesPriority;
        });
      },
    }),
    { name: 'task-store' }
  )
);
