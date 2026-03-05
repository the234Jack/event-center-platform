import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Check, ChevronRight, Building2, Calendar, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { venues } from '../../../../data/venues';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBooked?: () => void;
}

const EVENT_TYPES = ['Wedding', 'Corporate', 'Birthday', 'Conference', 'Anniversary', 'Party', 'Graduation', 'Other'];

const STEPS = ['Select Venue', 'Event Details', 'Confirm'];

interface FormData {
  venueId: string;
  hallId: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
  startTime: string;
  endTime: string;
  specialRequirements: string;
}

export default function BookingModal({ open, onOpenChange, onBooked }: BookingModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    venueId: '', hallId: '', eventDate: '', eventType: '', guestCount: '',
    startTime: '10:00', endTime: '18:00', specialRequirements: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const selectedVenue = venues.find((v) => v.id === form.venueId);
  const selectedHall = selectedVenue?.halls.find((h) => h.id === form.hallId);

  const update = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.venueId) e.venueId = 'Select a venue';
    if (!form.hallId) e.hallId = 'Select a hall';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    if (!form.eventDate) e.eventDate = 'Select a date';
    if (!form.eventType) e.eventType = 'Select event type';
    if (!form.guestCount || isNaN(Number(form.guestCount))) e.guestCount = 'Enter valid guest count';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    if (step === 2) {
      handleConfirm();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleConfirm = () => {
    toast.success(`Booking confirmed at ${selectedVenue?.name} — ${selectedHall?.name}! The venue will contact you soon.`);
    onBooked?.();
    onOpenChange(false);
    setStep(0);
    setForm({ venueId: '', hallId: '', eventDate: '', eventType: '', guestCount: '', startTime: '10:00', endTime: '18:00', specialRequirements: '' });
  };

  const estimatedCost = selectedHall ? selectedHall.pricePerDay : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setStep(0); }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Venue</DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 py-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-sm font-medium ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 */}
        {step === 0 && (
          <div className="space-y-4 py-2">
            <div>
              <Label>Select Venue <span className="text-red-500">*</span></Label>
              <Select value={form.venueId} onValueChange={(v) => { update('venueId', v); update('hallId', ''); }}>
                <SelectTrigger className={errors.venueId ? 'border-red-500 mt-1' : 'mt-1'}>
                  <SelectValue placeholder="Choose an event center" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs text-gray-500">{v.city}, {v.state}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.venueId && <p className="text-red-500 text-xs mt-1">{errors.venueId}</p>}
            </div>

            {selectedVenue && (
              <div>
                <Label>Select Hall <span className="text-red-500">*</span></Label>
                <div className="mt-1 space-y-2">
                  {selectedVenue.halls.map((hall) => (
                    <button
                      key={hall.id}
                      onClick={() => update('hallId', hall.id)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${form.hallId === hall.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{hall.name}</p>
                          <p className="text-xs text-gray-500">Up to {hall.seatingCapacity} seated · {hall.standingCapacity} standing</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-700">₦{hall.pricePerDay.toLocaleString()}/day</p>
                          {form.hallId === hall.id && <Check className="h-4 w-4 text-blue-600 ml-auto mt-0.5" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.hallId && <p className="text-red-500 text-xs mt-1">{errors.hallId}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="eventDate">Event Date <span className="text-red-500">*</span></Label>
              <Input id="eventDate" type="date" className={`mt-1 ${errors.eventDate ? 'border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                value={form.eventDate} onChange={(e) => update('eventDate', e.target.value)} />
              {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="time" className="mt-1" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="time" className="mt-1" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Event Type <span className="text-red-500">*</span></Label>
              <Select value={form.eventType} onValueChange={(v) => update('eventType', v)}>
                <SelectTrigger className={`mt-1 ${errors.eventType ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.eventType && <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>}
            </div>

            <div>
              <Label htmlFor="guestCount">Expected Guest Count <span className="text-red-500">*</span></Label>
              <Input id="guestCount" type="number" placeholder="e.g. 200" className={`mt-1 ${errors.guestCount ? 'border-red-500' : ''}`}
                value={form.guestCount} onChange={(e) => update('guestCount', e.target.value)} />
              {errors.guestCount && <p className="text-red-500 text-xs mt-1">{errors.guestCount}</p>}
              {selectedHall && form.guestCount && Number(form.guestCount) > selectedHall.seatingCapacity && (
                <p className="text-yellow-600 text-xs mt-1">⚠ Guest count exceeds hall's seated capacity ({selectedHall.seatingCapacity})</p>
              )}
            </div>

            <div>
              <Label htmlFor="requirements">Special Requirements (optional)</Label>
              <Textarea id="requirements" placeholder="Decorations, catering preferences, accessibility needs..." className="mt-1 resize-none"
                rows={3} value={form.specialRequirements} onChange={(e) => update('specialRequirements', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 3 - Confirm */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-semibold text-blue-900 mb-3">Booking Summary</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <Building2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{selectedVenue?.name}</p>
                    <p className="text-gray-600">{selectedHall?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>{form.eventDate && new Date(form.eventDate).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>{form.guestCount} guests · {form.eventType}</span>
                </div>
                {form.specialRequirements && (
                  <div className="flex items-start gap-2.5">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{form.specialRequirements}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-green-800">Estimated Cost</p>
                <p className="text-xl font-bold text-green-700">₦{estimatedCost.toLocaleString()}</p>
              </div>
              <p className="text-xs text-green-600 mt-1">This is an estimate. Final pricing will be confirmed by the venue.</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
              By confirming, you agree to the venue's booking terms. The venue will contact you within 24 hours to finalize details.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">Back</Button>
          )}
          <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            {step === 2 ? 'Confirm Booking' : (
              <span className="flex items-center gap-1.5">Next <ChevronRight className="h-4 w-4" /></span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
