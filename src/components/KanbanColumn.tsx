import { motion } from 'framer-motion';
import { type Status } from '@/store/taskStore';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

const columnConfig: Record<Status, { title: string; icon: React.ReactNode; dotColor: string }> = {
  'todo': { title: 'To Do', icon: <Circle className="w-4 h-4" />, dotColor: 'bg-destructive' },
  'in-progress': { title: 'In Progress', icon: <Clock className="w-4 h-4" />, dotColor: 'bg-priority-medium' },
  'done': { title: 'Done', icon: <CheckCircle2 className="w-4 h-4" />, dotColor: 'bg-primary' },
};

interface KanbanColumnProps {
  status: Status;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
    status: Status;
  }>;
  onDrop: (taskId: string, status: Status) => void;
}

export function KanbanColumn({ status, tasks, onDrop }: KanbanColumnProps) {
  const config = columnConfig[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-primary/30');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary/30');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-primary/30');
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) onDrop(taskId, status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="kanban-column rounded-xl transition-all"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        <h3 className="font-semibold text-sm">{config.title}</h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 ml-auto">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
          >
            <TaskCard task={task} />
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="dotted-border rounded-xl p-6 text-center">
            <p className="text-xs text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
