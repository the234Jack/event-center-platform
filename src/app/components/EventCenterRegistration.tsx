import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building2, ArrowLeft, Check } from 'lucide-react';
import EventCenterDetails from './event-center/EventCenterDetails';
import HallDetails from './event-center/HallDetails';
import FacilitiesServices from './event-center/FacilitiesServices';
import ReviewSubmit from './event-center/ReviewSubmit';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface EventCenterRegistrationProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export interface EventCenterFormData {
  // Step 1: Event Center Details
  centerName: string;
  venueCategory: string;
  description: string;
  state: string;
  city: string;
  lga: string;
  address: string;
  landmark: string;
  contactPhone: string;
  contactEmail: string;
  coverImageUrl: string;
  galleryImageUrls: string[];

  // Step 2: Hall Details
  halls: Hall[];

  // Step 3: Facilities & Services
  facilities: FacilityItem[];
  services: ServiceItem[];
}

export interface Hall {
  id: string;
  name: string;
  type: string;
  seatingCapacity: string;
  standingCapacity: string;
  size: string;
  airConditioned: boolean;
  pricePerHour: string;
  pricePerDay: string;
  imageUrls: string[];
}

export interface FacilityItem {
  name: string;
  selected: boolean;
  quantity?: string;
  cost?: string;
}

export interface ServiceItem {
  name: string;
  selected: boolean;
  cost?: string;
}

const steps = [
  { number: 1, title: 'Event Center Details', description: 'Basic information' },
  { number: 2, title: 'Hall Details', description: 'Add halls' },
  { number: 3, title: 'Facilities & Services', description: 'Available amenities' },
  { number: 4, title: 'Review & Submit', description: 'Final review' },
];

export default function EventCenterRegistration({
  onBack,
  onComplete,
}: EventCenterRegistrationProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleBack = onBack || (() => navigate('/register'));
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventCenterFormData>({
    centerName: '',
    venueCategory: '',
    description: '',
    state: '',
    city: '',
    lga: '',
    address: '',
    landmark: '',
    contactPhone: '',
    contactEmail: '',
    coverImageUrl: '',
    galleryImageUrls: [],
    halls: [],
    facilities: [
      { name: 'Parking Space', selected: false, quantity: '', cost: '' },
      { name: 'Toilets', selected: false, quantity: '', cost: '' },
      { name: 'Power Supply', selected: false, quantity: '', cost: '' },
      { name: 'Stage', selected: false, quantity: '', cost: '' },
      { name: 'Chairs', selected: false, quantity: '', cost: '' },
      { name: 'Tables', selected: false, quantity: '', cost: '' },
      { name: 'Sound System', selected: false, quantity: '', cost: '' },
      { name: 'Lighting', selected: false, quantity: '', cost: '' },
      { name: 'Dressing Room', selected: false, quantity: '', cost: '' },
    ],
    services: [
      { name: 'Catering', selected: false, cost: '' },
      { name: 'Decoration', selected: false, cost: '' },
      { name: 'Cleaning', selected: false, cost: '' },
      { name: 'Security', selected: false, cost: '' },
    ],
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const updateFormData = (data: Partial<EventCenterFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to register an event center.');
      navigate('/login');
      return;
    }

    try {
      const facilities = formData.facilities.filter((f) => f.selected).map((f) => f.name);
      const maxCapacity = formData.halls.reduce((max, h) => Math.max(max, parseInt(h.seatingCapacity) || 0), 0);

      const venueId = crypto.randomUUID();
      const { data: venue, error: venueError } = await supabase.from('venues').insert({
        id: venueId,
        name: formData.centerName,
        category: formData.venueCategory || 'corporate',
        description: formData.description,
        state: formData.state,
        city: formData.city || formData.state, // use city field, fallback to state
        address: formData.address || '',
        landmark: formData.landmark || '',
        phone: formData.contactPhone,
        email: formData.contactEmail,
        facilities,
        cover_image: formData.coverImageUrl || null,
        gallery_images: formData.galleryImageUrls.filter(Boolean),
        owner_id: user.id,
        max_capacity: maxCapacity || null,
        verified: false,
      }).select('id').single();

      if (venueError) throw venueError;

      if (formData.halls.length > 0) {
        const { error: hallsError } = await supabase.from('halls').insert(
          formData.halls.map((h) => ({
            id: crypto.randomUUID(),
            venue_id: venue.id,
            name: h.name,
            type: h.type,
            seating_capacity: parseInt(h.seatingCapacity) || null,
            standing_capacity: parseInt(h.standingCapacity) || null,
            size_sqm: parseInt(h.size) || null,
            price_per_hour: parseFloat(h.pricePerHour) || null,
            price_per_day: parseFloat(h.pricePerDay) || null,
            air_conditioned: h.airConditioned,
            images: h.imageUrls.filter(Boolean),
          }))
        );
        if (hallsError) throw hallsError;
      }

      toast.success('Event center registered successfully! Awaiting admin approval.');
      if (onComplete) { onComplete(); } else { navigate('/dashboard/owner'); }
    } catch (err) {
      console.error('Event center registration error:', err);
      toast.error('Failed to register event center. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventCenterDetails
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <HallDetails
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <FacilitiesServices
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ReviewSubmit
            data={formData}
            onEdit={handleStepClick}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl mb-2">Event Center Registration</h1>
          <p className="text-gray-600">
            Complete the following steps to register your event center
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.number)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep === step.number
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : currentStep > step.number
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium hidden md:block ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 hidden lg:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Back to Registration */}
        {currentStep === 1 && (
          <div className="text-center mt-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
