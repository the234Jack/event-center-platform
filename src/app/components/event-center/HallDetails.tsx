import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { AlertCircle, Plus, Trash2, Edit, X, Link as LinkIcon } from 'lucide-react';
import { EventCenterFormData, Hall } from '../EventCenterRegistration';

interface HallDetailsProps {
  data: EventCenterFormData;
  updateData: (data: Partial<EventCenterFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const emptyHall = (): Hall => ({
  id: Date.now().toString(),
  name: '',
  type: '',
  seatingCapacity: '',
  standingCapacity: '',
  size: '',
  airConditioned: false,
  pricePerHour: '',
  pricePerDay: '',
  imageUrls: [],
});

export default function HallDetails({ data, updateData, onNext, onPrevious }: HallDetailsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hall, setHall] = useState<Hall>(emptyHall());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imgUrlInput, setImgUrlInput] = useState('');

  const validateHall = () => {
    const e: Record<string, string> = {};
    if (!hall.name.trim()) e.name = 'Hall name is required';
    if (!hall.type) e.type = 'Hall type is required';
    if (!hall.seatingCapacity) e.seatingCapacity = 'Seating capacity is required';
    if (!hall.standingCapacity) e.standingCapacity = 'Standing capacity is required';
    if (!hall.pricePerDay) e.pricePerDay = 'Price per day is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveHall = () => {
    if (!validateHall()) return;
    if (editingIndex !== null) {
      const updated = [...data.halls];
      updated[editingIndex] = hall;
      updateData({ halls: updated });
      setEditingIndex(null);
    } else {
      updateData({ halls: [...data.halls, hall] });
    }
    setHall(emptyHall());
    setErrors({});
    setImgUrlInput('');
  };

  const handleEdit = (i: number) => {
    setHall(data.halls[i]);
    setEditingIndex(i);
  };

  const handleDelete = (i: number) => {
    updateData({ halls: data.halls.filter((_, idx) => idx !== i) });
  };

  const handleCancel = () => {
    setHall(emptyHall());
    setEditingIndex(null);
    setErrors({});
    setImgUrlInput('');
  };

  const change = (field: string, value: string | boolean) => {
    setHall((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const addImageUrl = () => {
    const url = imgUrlInput.trim();
    if (!url) return;
    setHall((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, url] }));
    setImgUrlInput('');
  };

  const removeImageUrl = (i: number) =>
    setHall((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== i) }));

  const Err = ({ f }: { f: string }) =>
    errors[f] ? (
      <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
        <AlertCircle className="h-3 w-3" /> {errors[f]}
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      {/* Hall Form */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold text-base mb-4">
          {editingIndex !== null ? 'Edit Hall' : 'Add New Hall'}
        </h3>

        <div className="space-y-4">
          {/* Name + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Hall Name <span className="text-red-500">*</span></Label>
              <Input
                value={hall.name}
                onChange={(e) => change('name', e.target.value)}
                placeholder="e.g., Grand Ballroom"
                className={errors.name ? 'border-red-500' : ''}
              />
              <Err f="name" />
            </div>

            <div className="space-y-1">
              <Label>Hall Type <span className="text-red-500">*</span></Label>
              <Select value={hall.type} onValueChange={(v) => change('type', v)}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="mixed">Mixed (Indoor + Outdoor)</SelectItem>
                </SelectContent>
              </Select>
              <Err f="type" />
            </div>
          </div>

          {/* Capacities + Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Seating Capacity <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={hall.seatingCapacity}
                onChange={(e) => change('seatingCapacity', e.target.value)}
                placeholder="e.g., 500"
                className={errors.seatingCapacity ? 'border-red-500' : ''}
              />
              <Err f="seatingCapacity" />
            </div>

            <div className="space-y-1">
              <Label>Standing Capacity <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={hall.standingCapacity}
                onChange={(e) => change('standingCapacity', e.target.value)}
                placeholder="e.g., 800"
                className={errors.standingCapacity ? 'border-red-500' : ''}
              />
              <Err f="standingCapacity" />
            </div>

            <div className="space-y-1">
              <Label>Hall Size (sqm)</Label>
              <Input
                type="number"
                value={hall.size}
                onChange={(e) => change('size', e.target.value)}
                placeholder="e.g., 1200"
              />
            </div>
          </div>

          {/* AC + Prices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Air Conditioned</Label>
              <Select
                value={hall.airConditioned ? 'yes' : 'no'}
                onValueChange={(v) => change('airConditioned', v === 'yes')}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Price per Hour (₦)</Label>
              <Input
                type="number"
                value={hall.pricePerHour}
                onChange={(e) => change('pricePerHour', e.target.value)}
                placeholder="e.g., 50000"
              />
            </div>

            <div className="space-y-1">
              <Label>Price per Day (₦) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={hall.pricePerDay}
                onChange={(e) => change('pricePerDay', e.target.value)}
                placeholder="e.g., 300000"
                className={errors.pricePerDay ? 'border-red-500' : ''}
              />
              <Err f="pricePerDay" />
            </div>
          </div>

          {/* Hall Image URLs */}
          <div className="space-y-2">
            <Label>Hall Images (URLs)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={imgUrlInput}
                  onChange={(e) => setImgUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                  placeholder="https://example.com/hall.jpg"
                  className="pl-9"
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {hall.imageUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {hall.imageUrls.map((url, i) => (
                  <div key={i} className="relative group w-20 h-16">
                    <img src={url} alt="" className="w-full h-full object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" onClick={handleSaveHall} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {editingIndex !== null ? 'Update Hall' : 'Add Hall'}
            </Button>
            {editingIndex !== null && (
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            )}
          </div>
        </div>
      </Card>

      {/* Added Halls */}
      {data.halls.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-base">Added Halls ({data.halls.length})</h3>
          {data.halls.map((h, i) => (
            <Card key={h.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{h.name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    <span className="capitalize">{h.type}</span>
                    <span>{parseInt(h.seatingCapacity).toLocaleString()} seated · {parseInt(h.standingCapacity).toLocaleString()} standing</span>
                    {h.size && <span>{h.size} sqm</span>}
                    <span className="text-green-700 font-medium">₦{parseInt(h.pricePerDay).toLocaleString()}/day</span>
                    {h.airConditioned && <span className="text-blue-600">AC</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(i)} aria-label="Edit hall">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleDelete(i)} aria-label="Delete hall">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data.halls.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Please add at least one hall before proceeding.
        </p>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>Previous</Button>
        <Button
          type="button"
          onClick={() => data.halls.length > 0 ? onNext() : undefined}
          disabled={data.halls.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
