import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
  notes: string;
  completed: boolean;
}

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
  editTask?: Task | null;
}

export default function TaskModal({ open, onOpenChange, onSave, editTask }: TaskModalProps) {
  const [form, setForm] = useState({ title: '', priority: 'medium' as Task['priority'], dueDate: '', category: '', notes: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    if (editTask) {
      setForm({ title: editTask.title, priority: editTask.priority, dueDate: editTask.dueDate, category: editTask.category, notes: editTask.notes });
    } else {
      setForm({ title: '', priority: 'medium', dueDate: '', category: '', notes: '' });
    }
    setErrors({});
  }, [editTask, open]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.title.trim()) e.title = 'Task title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ title: form.title, priority: form.priority, dueDate: form.dueDate, category: form.category || 'General', notes: form.notes });
    toast.success(editTask ? 'Task updated!' : 'Task added successfully!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="taskTitle">Task Title <span className="text-red-500">*</span></Label>
            <Input id="taskTitle" className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g. Confirm catering for event"
              value={form.title} onChange={(e) => update('title', e.target.value)} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => update('priority', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
              <Input id="dueDate" type="date" className={`mt-1 ${errors.dueDate ? 'border-red-500' : ''}`}
                value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" className="mt-1" placeholder="e.g. Logistics, Client, Setup"
              value={form.category} onChange={(e) => update('category', e.target.value)} />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" className="mt-1 resize-none" rows={3}
              placeholder="Add any relevant notes..."
              value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
            {editTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
