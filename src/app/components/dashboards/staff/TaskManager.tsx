import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Plus, Trash2, CheckSquare, Circle, AlertTriangle, Minus, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import TaskModal, { Task } from './TaskModal';
import { useAuth } from '../../../context/AuthContext';
import { fetchStaffTasks, createTask, updateTask, deleteTask as dbDeleteTask } from '../../../../lib/api/staff';
import { supabase } from '../../../../lib/supabase';


const PRIORITY_CONFIG: Record<string, { label: string; icon: React.ReactNode; badge: string }> = {
  high: { label: 'High', icon: <AlertTriangle className="h-3.5 w-3.5" />, badge: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Medium', icon: <Minus className="h-3.5 w-3.5" />, badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: 'Low', icon: <ChevronDown className="h-3.5 w-3.5" />, badge: 'bg-green-100 text-green-700 border-green-200' },
};

export default function TaskManager() {
  const { user } = useAuth();
  const [staffMemberId, setStaffMemberId] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('staff_members').select('id').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (!data) return;
        setStaffMemberId(data.id);
        // tasks.staff_id references profiles(id) = user.id, NOT staff_members.id
        return fetchStaffTasks(user.id);
      })
      .then((rows: any) => {
        if (!rows) return;
        setTasks(rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          priority: r.priority,
          dueDate: r.due_date,
          category: r.category ?? 'General',
          notes: r.notes ?? '',
          completed: r.completed,
        })));
      })
      .catch(() => {});
  }, [user?.id]);

  const pending = tasks.filter((t) => !t.completed && (filterPriority === 'all' || t.priority === filterPriority));
  const completed = tasks.filter((t) => t.completed);

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    try {
      await updateTask(id, { completed: newCompleted });
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: newCompleted } : t));
      toast.success(newCompleted ? 'Task marked complete!' : 'Task moved back to pending.');
    } catch { toast.error('Failed to update task.'); }
  };

  const deleteTask = async (id: string) => {
    try {
      await dbDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted.');
    } catch { toast.error('Failed to delete task.'); }
  };

  const handleAddTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (!user?.id) { toast.error('Not authenticated.'); return; }
    try {
      // tasks.staff_id references profiles(id) = user.id
      const created = await createTask(user.id, {
        title: task.title,
        priority: task.priority,
        due_date: task.dueDate,
        category: task.category,
        notes: task.notes,
      });
      const newTask: Task = {
        id: created.id,
        title: created.title,
        priority: created.priority,
        dueDate: created.due_date,
        category: created.category ?? 'General',
        notes: created.notes ?? '',
        completed: created.completed,
      };
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task added successfully!');
    } catch { toast.error('Failed to add task.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Task Manager</h2>
          <p className="text-sm text-gray-500">{pending.length} pending · {completed.length} completed</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Task
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-500">Filter by priority:</span>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">🔴 High</SelectItem>
            <SelectItem value="medium">🟡 Medium</SelectItem>
            <SelectItem value="low">🟢 Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Circle className="h-4 w-4 text-yellow-500" />
            <h3 className="font-semibold text-gray-700">Pending Tasks</h3>
            <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{pending.length}</span>
          </div>
          {pending.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
              <CheckSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pending.map((task) => {
                const pc = PRIORITY_CONFIG[task.priority];
                const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
                return (
                  <div key={task.id} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleComplete(task.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        {task.notes && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.notes}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${pc.badge}`}>
                            {pc.icon}{pc.label}
                          </span>
                          <span className="text-xs text-gray-400">{task.category}</span>
                          <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                            {isOverdue ? '⚠ ' : ''}Due {new Date(task.dueDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold text-gray-700">Completed</h3>
            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{completed.length}</span>
          </div>
          {completed.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
              <p className="text-sm text-gray-400">No completed tasks yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {completed.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleComplete(task.id)} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400 line-through">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{task.category}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal open={modalOpen} onOpenChange={setModalOpen} onSave={handleAddTask} />
    </div>
  );
}
