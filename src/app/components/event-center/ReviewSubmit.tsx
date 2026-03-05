import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { CheckCircle2, Edit, MapPin, Phone, Mail, Building, Users } from 'lucide-react';
import { EventCenterFormData } from '../EventCenterRegistration';

interface ReviewSubmitProps {
  data: EventCenterFormData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onPrevious: () => void;
}

export default function ReviewSubmit({ data, onEdit, onSubmit, onPrevious }: ReviewSubmitProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    onSubmit();
  };

  const selectedFacilities = data.facilities.filter((f) => f.selected);
  const selectedServices = data.services.filter((s) => s.selected);

  return (
    <div className="space-y-6">
      {/* Event Center Details Summary */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Event Center Details</h3>
            <p className="text-sm text-gray-600">Basic information about your event center</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-semibold text-blue-600">{data.centerName}</h4>
            <p className="text-gray-700 mt-2">{data.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">
                  {data.lga}, {data.state}
                  {data.landmark && ` (${data.landmark})`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Contact Phone</p>
                <p className="text-sm text-gray-600">{data.contactPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Contact Email</p>
                <p className="text-sm text-gray-600">{data.contactEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Halls</p>
                <p className="text-sm text-gray-600">{data.halls.length} hall(s) registered</p>
              </div>
            </div>
          </div>

          {data.coverImage && (
            <div>
              <p className="text-sm font-medium mb-2">Cover Image</p>
              <img
                src={URL.createObjectURL(data.coverImage)}
                alt="Cover"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {data.galleryImages.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">
                Gallery Images ({data.galleryImages.length})
              </p>
              <div className="grid grid-cols-4 gap-2">
                {data.galleryImages.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
              {data.galleryImages.length > 4 && (
                <p className="text-xs text-gray-500 mt-2">
                  +{data.galleryImages.length - 4} more images
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Halls Summary */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Hall Details</h3>
            <p className="text-sm text-gray-600">
              {data.halls.length} hall{data.halls.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          {data.halls.map((hall, index) => (
            <Card key={hall.id} className="p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-base">{hall.name}</h4>
                  <Badge variant="secondary" className="mt-1">
                    {hall.type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Seating Capacity</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {hall.seatingCapacity}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Standing Capacity</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {hall.standingCapacity}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Size</p>
                  <p className="font-medium">{hall.size} sqm</p>
                </div>
                <div>
                  <p className="text-gray-600">Air Conditioned</p>
                  <p className="font-medium">{hall.airConditioned ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Price per Hour</p>
                  <p className="font-medium text-blue-600">₦{Number(hall.pricePerHour).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price per Day</p>
                  <p className="font-medium text-blue-600">₦{Number(hall.pricePerDay).toLocaleString()}</p>
                </div>
              </div>

              {hall.images.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">
                    {hall.images.length} image{hall.images.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex gap-2">
                    {hall.images.slice(0, 3).map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={URL.createObjectURL(image)}
                        alt={`Hall ${imgIndex + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                    {hall.images.length > 3 && (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                        +{hall.images.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Facilities & Services Summary */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Facilities & Services</h3>
            <p className="text-sm text-gray-600">Available amenities and services</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          {selectedFacilities.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Facilities ({selectedFacilities.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedFacilities.map((facility) => (
                  <div key={facility.name} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{facility.name}</p>
                      {(facility.quantity || facility.cost) && (
                        <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                          {facility.quantity && <p>Quantity: {facility.quantity}</p>}
                          {facility.cost && <p>Extra Cost: ₦{Number(facility.cost).toLocaleString()}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFacilities.length === 0 && (
            <p className="text-sm text-gray-500">No facilities selected</p>
          )}

          <Separator />

          {selectedServices.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Services ({selectedServices.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedServices.map((service) => (
                  <div key={service.name} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      {service.cost && (
                        <p className="text-xs text-gray-600 mt-1">
                          Cost: ₦{Number(service.cost).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedServices.length === 0 && (
            <p className="text-sm text-gray-500">No services selected</p>
          )}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={handleSubmitClick} className="bg-green-600 hover:bg-green-700">
          Submit Registration
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your event center registration? Please review all
              information before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Event Center:</span> {data.centerName}
              </p>
              <p>
                <span className="font-medium">Location:</span> {data.lga}, {data.state}
              </p>
              <p>
                <span className="font-medium">Halls:</span> {data.halls.length}
              </p>
              <p>
                <span className="font-medium">Facilities:</span> {selectedFacilities.length}
              </p>
              <p>
                <span className="font-medium">Services:</span> {selectedServices.length}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} className="bg-green-600 hover:bg-green-700">
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
