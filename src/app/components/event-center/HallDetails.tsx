import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { AlertCircle, Plus, Trash2, Upload, X, Edit } from 'lucide-react';
import { EventCenterFormData, Hall } from '../EventCenterRegistration';

interface HallDetailsProps {
  data: EventCenterFormData;
  updateData: (data: Partial<EventCenterFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function HallDetails({ data, updateData, onNext, onPrevious }: HallDetailsProps) {
  const [editingHallIndex, setEditingHallIndex] = useState<number | null>(null);
  const [currentHall, setCurrentHall] = useState<Hall>({
    id: Date.now().toString(),
    name: '',
    type: '',
    seatingCapacity: '',
    standingCapacity: '',
    size: '',
    airConditioned: false,
    pricePerHour: '',
    pricePerDay: '',
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateHall = () => {
    const newErrors: Record<string, string> = {};

    if (!currentHall.name.trim()) newErrors.name = 'Hall name is required';
    if (!currentHall.type) newErrors.type = 'Hall type is required';
    if (!currentHall.seatingCapacity) newErrors.seatingCapacity = 'Seating capacity is required';
    if (!currentHall.standingCapacity) newErrors.standingCapacity = 'Standing capacity is required';
    if (!currentHall.size) newErrors.size = 'Hall size is required';
    if (!currentHall.pricePerHour) newErrors.pricePerHour = 'Price per hour is required';
    if (!currentHall.pricePerDay) newErrors.pricePerDay = 'Price per day is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddHall = () => {
    if (validateHall()) {
      if (editingHallIndex !== null) {
        // Update existing hall
        const updatedHalls = [...data.halls];
        updatedHalls[editingHallIndex] = currentHall;
        updateData({ halls: updatedHalls });
        setEditingHallIndex(null);
      } else {
        // Add new hall
        updateData({ halls: [...data.halls, currentHall] });
      }
      // Reset form
      setCurrentHall({
        id: Date.now().toString(),
        name: '',
        type: '',
        seatingCapacity: '',
        standingCapacity: '',
        size: '',
        airConditioned: false,
        pricePerHour: '',
        pricePerDay: '',
        images: [],
      });
      setErrors({});
    }
  };

  const handleEditHall = (index: number) => {
    setCurrentHall(data.halls[index]);
    setEditingHallIndex(index);
  };

  const handleDeleteHall = (index: number) => {
    const updatedHalls = data.halls.filter((_, i) => i !== index);
    updateData({ halls: updatedHalls });
  };

  const handleCancelEdit = () => {
    setCurrentHall({
      id: Date.now().toString(),
      name: '',
      type: '',
      seatingCapacity: '',
      standingCapacity: '',
      size: '',
      airConditioned: false,
      pricePerHour: '',
      pricePerDay: '',
      images: [],
    });
    setEditingHallIndex(null);
    setErrors({});
  };

  const handleHallChange = (field: string, value: string | boolean) => {
    setCurrentHall((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setCurrentHall((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeHallImage = (index: number) => {
    setCurrentHall((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (data.halls.length === 0) {
      alert('Please add at least one hall before proceeding');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Hall Form */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold text-base mb-4">
          {editingHallIndex !== null ? 'Edit Hall' : 'Add New Hall'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hallName">
                Hall Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hallName"
                value={currentHall.name}
                onChange={(e) => handleHallChange('name', e.target.value)}
                placeholder="e.g., Grand Ballroom"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hallType">
                Hall Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={currentHall.type}
                onValueChange={(value) => handleHallChange('type', value)}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.type}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seatingCapacity">
                Seating Capacity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="seatingCapacity"
                type="number"
                value={currentHall.seatingCapacity}
                onChange={(e) => handleHallChange('seatingCapacity', e.target.value)}
                placeholder="e.g., 500"
                className={errors.seatingCapacity ? 'border-red-500' : ''}
              />
              {errors.seatingCapacity && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.seatingCapacity}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="standingCapacity">
                Standing Capacity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="standingCapacity"
                type="number"
                value={currentHall.standingCapacity}
                onChange={(e) => handleHallChange('standingCapacity', e.target.value)}
                placeholder="e.g., 800"
                className={errors.standingCapacity ? 'border-red-500' : ''}
              />
              {errors.standingCapacity && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.standingCapacity}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">
                Hall Size (sqm) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="size"
                type="number"
                value={currentHall.size}
                onChange={(e) => handleHallChange('size', e.target.value)}
                placeholder="e.g., 1200"
                className={errors.size ? 'border-red-500' : ''}
              />
              {errors.size && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.size}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Air Conditioned</Label>
            <Select
              value={currentHall.airConditioned ? 'yes' : 'no'}
              onValueChange={(value) => handleHallChange('airConditioned', value === 'yes')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerHour">
                Price per Hour (₦) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pricePerHour"
                type="number"
                value={currentHall.pricePerHour}
                onChange={(e) => handleHallChange('pricePerHour', e.target.value)}
                placeholder="e.g., 50000"
                className={errors.pricePerHour ? 'border-red-500' : ''}
              />
              {errors.pricePerHour && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.pricePerHour}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerDay">
                Price per Day (₦) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pricePerDay"
                type="number"
                value={currentHall.pricePerDay}
                onChange={(e) => handleHallChange('pricePerDay', e.target.value)}
                placeholder="e.g., 300000"
                className={errors.pricePerDay ? 'border-red-500' : ''}
              />
              {errors.pricePerDay && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.pricePerDay}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hall Images */}
          <div className="space-y-2">
            <Label>Hall Images</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload hall images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </label>

              {currentHall.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {currentHall.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Hall ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeHallImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={handleAddHall} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {editingHallIndex !== null ? 'Update Hall' : 'Add Hall'}
            </Button>
            {editingHallIndex !== null && (
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Added Halls List */}
      {data.halls.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-base">Added Halls ({data.halls.length})</h3>
          {data.halls.map((hall, index) => (
            <Card key={hall.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{hall.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {hall.type}
                    </div>
                    <div>
                      <span className="font-medium">Seating:</span> {hall.seatingCapacity}
                    </div>
                    <div>
                      <span className="font-medium">Standing:</span> {hall.standingCapacity}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {hall.size} sqm
                    </div>
                    <div>
                      <span className="font-medium">₦{hall.pricePerHour}/hr</span>
                    </div>
                    <div>
                      <span className="font-medium">₦{hall.pricePerDay}/day</span>
                    </div>
                    <div>
                      <span className="font-medium">A/C:</span> {hall.airConditioned ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditHall(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteHall(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
