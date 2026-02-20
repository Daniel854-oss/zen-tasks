import { useTaskStore, type Priority } from '@/store/taskStore';
import { Search, Filter } from 'lucide-react';

const priorities: Array<{ value: Priority | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function SearchFilter() {
  const { searchQuery, setSearchQuery, priorityFilter, setPriorityFilter } = useTaskStore();

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full bg-card/70 backdrop-blur-sm border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl">
        {priorities.map((p) => (
          <button
            key={p.value}
            onClick={() => setPriorityFilter(p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              priorityFilter === p.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
