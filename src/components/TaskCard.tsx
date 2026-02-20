import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore, type Priority, type Status } from '@/store/taskStore';
import { Calendar, Flag, Trash2, Pencil, X, Check, GripVertical } from 'lucide-react';
import { format } from 'date-fns';

const priorityConfig: Record<Priority, { label: string; class: string }> = {
  high: { label: 'High', class: 'priority-high' },
  medium: { label: 'Medium', class: 'priority-medium' },
  low: { label: 'Low', class: 'priority-low' },
};

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: Priority;
    status: Status;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);

  const handleSave = () => {
    updateTask(task.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const p = priorityConfig[task.priority];
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card-hover rounded-xl p-4 cursor-grab active:cursor-grabbing group"
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={2}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsEditing(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
            <button onClick={handleSave} className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors">
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditing(true)} className="p-1 rounded-md hover:bg-muted transition-colors">
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button onClick={() => deleteTask(task.id)} className="p-1 rounded-md hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.class}`}>
              <Flag className="w-3 h-3 inline mr-1" />
              {p.label}
            </span>
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
              <Calendar className="w-3 h-3" />
              {format(new Date(task.deadline), 'MMM d')}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}
