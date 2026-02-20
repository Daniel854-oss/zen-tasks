import { motion } from 'framer-motion';
import { useTaskStore, type Status } from '@/store/taskStore';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskForm } from '@/components/TaskForm';
import { SearchFilter } from '@/components/SearchFilter';
import { LayoutDashboard } from 'lucide-react';

const columns: Status[] = ['todo', 'in-progress', 'done'];

const Index = () => {
  const { moveTask, getFilteredTasks } = useTaskStore();
  const tasks = getFilteredTasks();

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-card border-b border-border/50 px-4 sm:px-6 lg:px-8 py-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">TaskFlow</h1>
              <p className="text-xs text-muted-foreground">Manage your projects</p>
            </div>
          </div>
          <SearchFilter />
          <TaskForm />
        </div>
      </motion.header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            { label: 'Total Tasks', value: stats.total, color: 'text-foreground' },
            { label: 'To Do', value: stats.todo, color: 'text-destructive' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-priority-medium' },
            { label: 'Completed', value: stats.done, color: 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col}
              status={col}
              tasks={tasks.filter((t) => t.status === col)}
              onDrop={moveTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
