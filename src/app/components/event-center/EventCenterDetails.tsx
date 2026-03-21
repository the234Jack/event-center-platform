import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertCircle, Plus, X, Link as LinkIcon } from 'lucide-react';
import { EventCenterFormData } from '../EventCenterRegistration';
import { VENUE_CATEGORIES, NIGERIAN_STATES } from '../../../lib/constants';

interface EventCenterDetailsProps {
  data: EventCenterFormData;
  updateData: (data: Partial<EventCenterFormData>) => void;
  onNext: () => void;
}

const LAGOS_LGAS = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa',
  'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye',
  'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland',
  'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere',
];

export default function EventCenterDetails({ data, updateData, onNext }: EventCenterDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!data.centerName.trim()) newErrors.centerName = 'Event center name is required';
    if (!data.venueCategory) newErrors.venueCategory = 'Please select a venue category';
    if (!data.description.trim()) newErrors.description = 'Description is required';
    if (!data.state) newErrors.state = 'State is required';
    if (!data.city.trim()) newErrors.city = 'City is required';
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
    if (validateForm()) onNext();
  };

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const addGalleryUrl = () => {
    const url = galleryUrlInput.trim();
    if (!url) return;
    updateData({ galleryImageUrls: [...(data.galleryImageUrls ?? []), url] });
    setGalleryUrlInput('');
  };

  const removeGalleryUrl = (index: number) => {
    updateData({ galleryImageUrls: data.galleryImageUrls.filter((_, i) => i !== index) });
  };

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
        <AlertCircle className="h-4 w-4" />
        <span>{errors[field]}</span>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      {/* Center Name */}
      <div className="space-y-2">
        <Label htmlFor="centerName">Event Center Name <span className="text-red-500">*</span></Label>
        <Input
          id="centerName"
          value={data.centerName}
          onChange={(e) => handleChange('centerName', e.target.value)}
          placeholder="e.g., Grand Palace Event Center"
          className={errors.centerName ? 'border-red-500' : ''}
        />
        <ErrorMsg field="centerName" />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Venue Category <span className="text-red-500">*</span></Label>
        <Select value={data.venueCategory} onValueChange={(v) => handleChange('venueCategory', v)}>
          <SelectTrigger className={errors.venueCategory ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select venue category" />
          </SelectTrigger>
          <SelectContent>
            {VENUE_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ErrorMsg field="venueCategory" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your event center, its unique features, and what makes it special..."
          rows={4}
          className={errors.description ? 'border-red-500' : ''}
        />
        <ErrorMsg field="description" />
      </div>

      {/* State + City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>State <span className="text-red-500">*</span></Label>
          <Select value={data.state} onValueChange={(v) => handleChange('state', v)}>
            <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {NIGERIAN_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMsg field="state" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g., Lagos, Abuja, Port Harcourt"
            className={errors.city ? 'border-red-500' : ''}
          />
          <ErrorMsg field="city" />
        </div>
      </div>

      {/* LGA + Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lga">Local Government Area (LGA)</Label>
          {data.state === 'Lagos' ? (
            <Select value={data.lga} onValueChange={(v) => handleChange('lga', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                {LAGOS_LGAS.map((lga) => (
                  <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="lga"
              value={data.lga}
              onChange={(e) => handleChange('lga', e.target.value)}
              placeholder="e.g., Ikeja"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Full Address</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="e.g., 12 Allen Avenue, Ikeja"
          />
        </div>
      </div>

      {/* Landmark */}
      <div className="space-y-2">
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input
          id="landmark"
          value={data.landmark}
          onChange={(e) => handleChange('landmark', e.target.value)}
          placeholder="e.g., Opposite City Mall, Near Ikeja Under Bridge"
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone <span className="text-red-500">*</span></Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="08012345678"
            value={data.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            className={errors.contactPhone ? 'border-red-500' : ''}
          />
          <ErrorMsg field="contactPhone" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email <span className="text-red-500">*</span></Label>
          <Input
            id="contactEmail"
            type="email"
            value={data.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            className={errors.contactEmail ? 'border-red-500' : ''}
          />
          <ErrorMsg field="contactEmail" />
        </div>
      </div>

      {/* Cover Image URL */}
      <div className="space-y-2">
        <Label htmlFor="coverImageUrl">Cover Image URL</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="coverImageUrl"
              value={data.coverImageUrl}
              onChange={(e) => handleChange('coverImageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="pl-9"
            />
          </div>
          {data.coverImageUrl && (
            <button
              type="button"
              onClick={() => handleChange('coverImageUrl', '')}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {data.coverImageUrl && (
          <img
            src={data.coverImageUrl}
            alt="Cover preview"
            className="w-full h-40 object-cover rounded-lg mt-2 border"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <p className="text-xs text-gray-400">Paste a direct image URL. You can use Unsplash, Cloudinary, or any hosted image link.</p>
      </div>

      {/* Gallery Image URLs */}
      <div className="space-y-2">
        <Label>Gallery Images (URLs)</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())}
              placeholder="https://example.com/gallery-1.jpg"
              className="pl-9"
            />
          </div>
          <Button type="button" variant="outline" onClick={addGalleryUrl} className="flex-shrink-0">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {data.galleryImageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {data.galleryImageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => removeGalleryUrl(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400">Add multiple image URLs. Press Enter or click Add after each URL.</p>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
          Next Step
        </Button>
      </div>
    </div>
  );
}
