import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { EventCenterFormData } from '../EventCenterRegistration';

interface EventCenterDetailsProps {
  data: EventCenterFormData;
  updateData: (data: Partial<EventCenterFormData>) => void;
  onNext: () => void;
}

export default function EventCenterDetails({ data, updateData, onNext }: EventCenterDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.centerName.trim()) newErrors.centerName = 'Event center name is required';
    if (!data.description.trim()) newErrors.description = 'Description is required';
    if (!data.state) newErrors.state = 'State is required';
    if (!data.lga.trim()) newErrors.lga = 'LGA is required';
    if (!data.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^[0-9]{11}$/.test(data.contactPhone)) {
      newErrors.contactPhone = 'Phone number must be 11 digits';
    }
    if (!data.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateData({ coverImage: e.target.files[0] });
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      updateData({ galleryImages: [...data.galleryImages, ...newImages] });
    }
  };

  const removeCoverImage = () => {
    updateData({ coverImage: null });
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = data.galleryImages.filter((_, i) => i !== index);
    updateData({ galleryImages: newGallery });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="centerName">
          Event Center Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="centerName"
          value={data.centerName}
          onChange={(e) => handleChange('centerName', e.target.value)}
          placeholder="e.g., Grand Palace Event Center"
          className={errors.centerName ? 'border-red-500' : ''}
        />
        {errors.centerName && (
          <div className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.centerName}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your event center, its unique features, and what makes it special..."
          rows={4}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <div className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.description}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">
            State <span className="text-red-500">*</span>
          </Label>
          <Select value={data.state} onValueChange={(value) => handleChange('state', value)}>
            <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {nigerianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.state}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lga">
            Local Government Area (LGA) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lga"
            value={data.lga}
            onChange={(e) => handleChange('lga', e.target.value)}
            className={errors.lga ? 'border-red-500' : ''}
          />
          {errors.lga && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.lga}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input
          id="landmark"
          value={data.landmark}
          onChange={(e) => handleChange('landmark', e.target.value)}
          placeholder="e.g., Opposite City Mall"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">
            Contact Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="08012345678"
            value={data.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            className={errors.contactPhone ? 'border-red-500' : ''}
          />
          {errors.contactPhone && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.contactPhone}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">
            Contact Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contactEmail"
            type="email"
            value={data.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            className={errors.contactEmail ? 'border-red-500' : ''}
          />
          {errors.contactEmail && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.contactEmail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {data.coverImage ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(data.coverImage)}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeCoverImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 mb-1">
                Click to upload cover image
              </span>
              <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Gallery Images Upload */}
      <div className="space-y-2">
        <Label>Gallery Images (Multiple)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <label className="flex flex-col items-center cursor-pointer mb-4">
            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600 mb-1">
              Click to upload gallery images
            </span>
            <span className="text-xs text-gray-500">PNG, JPG up to 10MB each</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesChange}
              className="hidden"
            />
          </label>

          {data.galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {data.galleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
