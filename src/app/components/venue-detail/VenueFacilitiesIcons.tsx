import React from 'react';
import {
  Car, Toilet, Zap, Mic, Armchair, Coffee, Volume2, Sun, Shirt,
  Wifi, Camera, Utensils, Shield, Sparkles, CheckCircle2, XCircle
} from 'lucide-react';

interface VenueFacilitiesIconsProps {
  facilities: string[];
  services: string[];
}

const facilityIconMap: Record<string, { icon: React.ElementType; label: string }> = {
  'Parking Space': { icon: Car, label: 'Parking' },
  'Toilets': { icon: Toilet, label: 'Toilets' },
  'Power Supply': { icon: Zap, label: 'Power Supply' },
  'Stage': { icon: Mic, label: 'Stage' },
  'Chairs': { icon: Armchair, label: 'Chairs' },
  'Tables': { icon: Coffee, label: 'Tables' },
  'Sound System': { icon: Volume2, label: 'Sound System' },
  'Lighting': { icon: Sun, label: 'Lighting' },
  'Dressing Room': { icon: Shirt, label: 'Dressing Room' },
  'Wifi': { icon: Wifi, label: 'WiFi' },
  'Photography': { icon: Camera, label: 'Photography' },
  'AC': { icon: Sparkles, label: 'Air Con' },
};

const serviceIconMap: Record<string, { icon: React.ElementType; label: string }> = {
  'Catering': { icon: Utensils, label: 'Catering' },
  'Decoration': { icon: Sparkles, label: 'Decoration' },
  'Cleaning': { icon: Sparkles, label: 'Cleaning' },
  'Security': { icon: Shield, label: 'Security' },
};

const allPossibleFacilities = Object.keys(facilityIconMap);

export default function VenueFacilitiesIcons({
  facilities,
  services,
}: VenueFacilitiesIconsProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Facilities & Services</h2>

      {/* Facilities */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Facilities</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {allPossibleFacilities.map((key) => {
            const { icon: Icon, label } = facilityIconMap[key];
            const available = facilities.includes(key);
            return (
              <div
                key={key}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                  available
                    ? 'border-blue-100 bg-blue-50 text-blue-700'
                    : 'border-gray-100 bg-gray-50 text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium leading-tight">{label}</span>
                {available ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Services */}
      {services.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-700 mb-4">Available Services</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.keys(serviceIconMap).map((key) => {
              const { icon: Icon, label } = serviceIconMap[key];
              const available = services.includes(key);
              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    available
                      ? 'border-green-100 bg-green-50'
                      : 'border-gray-100 bg-gray-50 opacity-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${available ? 'text-green-600' : 'text-gray-300'}`} />
                  <div>
                    <p className={`text-sm font-medium ${available ? 'text-gray-900' : 'text-gray-400'}`}>
                      {label}
                    </p>
                    <p className={`text-xs ${available ? 'text-green-600' : 'text-gray-400'}`}>
                      {available ? 'Available' : 'Not available'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
