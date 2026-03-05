import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card } from '../ui/card';
import { EventCenterFormData, FacilityItem, ServiceItem } from '../EventCenterRegistration';

interface FacilitiesServicesProps {
  data: EventCenterFormData;
  updateData: (data: Partial<EventCenterFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function FacilitiesServices({
  data,
  updateData,
  onNext,
  onPrevious,
}: FacilitiesServicesProps) {
  const handleFacilityToggle = (index: number) => {
    const updatedFacilities = [...data.facilities];
    updatedFacilities[index].selected = !updatedFacilities[index].selected;
    updateData({ facilities: updatedFacilities });
  };

  const handleFacilityChange = (index: number, field: 'quantity' | 'cost', value: string) => {
    const updatedFacilities = [...data.facilities];
    updatedFacilities[index][field] = value;
    updateData({ facilities: updatedFacilities });
  };

  const handleServiceToggle = (index: number) => {
    const updatedServices = [...data.services];
    updatedServices[index].selected = !updatedServices[index].selected;
    updateData({ services: updatedServices });
  };

  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...data.services];
    updatedServices[index].cost = value;
    updateData({ services: updatedServices });
  };

  return (
    <div className="space-y-6">
      {/* Facilities Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-base mb-1">Facilities</h3>
          <p className="text-sm text-gray-600">Select available facilities and specify details</p>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            {data.facilities.map((facility, index) => (
              <div
                key={facility.name}
                className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-2 md:w-48">
                  <Checkbox
                    id={`facility-${index}`}
                    checked={facility.selected}
                    onCheckedChange={() => handleFacilityToggle(index)}
                  />
                  <Label
                    htmlFor={`facility-${index}`}
                    className="cursor-pointer font-medium"
                  >
                    {facility.name}
                  </Label>
                </div>

                {facility.selected && (
                  <div className="flex flex-1 gap-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`facility-quantity-${index}`} className="text-xs text-gray-600">
                        Quantity (Optional)
                      </Label>
                      <Input
                        id={`facility-quantity-${index}`}
                        type="number"
                        placeholder="e.g., 200"
                        value={facility.quantity}
                        onChange={(e) =>
                          handleFacilityChange(index, 'quantity', e.target.value)
                        }
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={`facility-cost-${index}`} className="text-xs text-gray-600">
                        Extra Cost (₦)
                      </Label>
                      <Input
                        id={`facility-cost-${index}`}
                        type="number"
                        placeholder="e.g., 5000"
                        value={facility.cost}
                        onChange={(e) =>
                          handleFacilityChange(index, 'cost', e.target.value)
                        }
                        className="h-9"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-base mb-1">Services</h3>
          <p className="text-sm text-gray-600">Select available services and pricing</p>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            {data.services.map((service, index) => (
              <div
                key={service.name}
                className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-2 md:w-48">
                  <Checkbox
                    id={`service-${index}`}
                    checked={service.selected}
                    onCheckedChange={() => handleServiceToggle(index)}
                  />
                  <Label
                    htmlFor={`service-${index}`}
                    className="cursor-pointer font-medium"
                  >
                    {service.name}
                  </Label>
                </div>

                {service.selected && (
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={`service-cost-${index}`} className="text-xs text-gray-600">
                      Service Cost (₦)
                    </Label>
                    <Input
                      id={`service-cost-${index}`}
                      type="number"
                      placeholder="e.g., 50000"
                      value={service.cost}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      className="h-9"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-900">Selected Summary</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div>
              <span className="font-medium">Facilities:</span>{' '}
              {data.facilities.filter((f) => f.selected).length} selected
            </div>
            <div>
              <span className="font-medium">Services:</span>{' '}
              {data.services.filter((s) => s.selected).length} selected
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
