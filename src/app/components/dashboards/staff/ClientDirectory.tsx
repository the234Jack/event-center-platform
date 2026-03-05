import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Search, Phone, Mail, MapPin, Calendar, User, X } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalBookings: number;
  lastEvent: string;
  lastEventDate: string;
  company?: string;
}

const CLIENTS: Client[] = [
  { id: 1, name: 'Emeka Adeyemi', email: 'emeka.adeyemi@email.com', phone: '+234 803 111 2222', city: 'Lagos', totalBookings: 3, lastEvent: 'Wedding Reception', lastEventDate: '2026-03-05', company: '' },
  { id: 2, name: 'Fatima Al-Hassan', email: 'fatima.alhassan@techng.com', phone: '+234 806 333 4444', city: 'Abuja', totalBookings: 5, lastEvent: 'TechNigeria Summit', lastEventDate: '2026-03-08', company: 'TechNigeria Ltd' },
  { id: 3, name: 'Aisha Bello', email: 'aisha.bello@gmail.com', phone: '+234 802 555 6666', city: 'Abuja', totalBookings: 1, lastEvent: '60th Birthday Party', lastEventDate: '2026-03-12', company: '' },
  { id: 4, name: 'Chidi Okonkwo', email: 'chidi@okonkwogroup.com', phone: '+234 701 777 8888', city: 'Port Harcourt', totalBookings: 4, lastEvent: 'Corporate Retreat', lastEventDate: '2026-03-20', company: 'Okonkwo Group' },
  { id: 5, name: 'Biodun Owoeye', email: 'biodun.owoeye@yahoo.com', phone: '+234 808 999 0000', city: 'Ibadan', totalBookings: 2, lastEvent: 'Silver Anniversary', lastEventDate: '2026-04-02', company: '' },
  { id: 6, name: 'Ngozi Eze', email: 'ngozi.eze@unn.edu.ng', phone: '+234 805 112 3344', city: 'Enugu', totalBookings: 1, lastEvent: 'Graduation Ball', lastEventDate: '2026-04-15', company: 'UNN Events Committee' },
  { id: 7, name: 'Kemi Bakare', email: 'kemi.bakare@outlook.com', phone: '+234 803 222 3333', city: 'Lagos', totalBookings: 2, lastEvent: 'Wedding', lastEventDate: '2026-02-15', company: '' },
  { id: 8, name: 'Dr. Musa Ibrahim', email: 'musa.ibrahim@tradeexpo.ng', phone: '+234 706 444 5555', city: 'Abuja', totalBookings: 6, lastEvent: 'Trade Expo', lastEventDate: '2026-02-20', company: 'Abuja Trade Council' },
  { id: 9, name: 'Tola Williams', email: 'tola.williams@fashionng.com', phone: '+234 804 666 7777', city: 'Lagos', totalBookings: 3, lastEvent: 'Fashion Show', lastEventDate: '2026-01-25', company: 'Fashion Nigeria' },
  { id: 10, name: 'Tamuno Briggs', email: 'tamuno.briggs@culturalfest.ng', phone: '+234 803 888 9999', city: 'Port Harcourt', totalBookings: 1, lastEvent: 'Cultural Festival', lastEventDate: '2026-01-18', company: 'Rivers Cultural Board' },
  { id: 11, name: 'Adaeze Nwachukwu', email: 'adaeze.nwachukwu@gmail.com', phone: '+234 816 100 2020', city: 'Enugu', totalBookings: 2, lastEvent: 'Birthday Party', lastEventDate: '2026-01-10', company: '' },
  { id: 12, name: 'Babatunde Fashola', email: 'btfash@corporateng.com', phone: '+234 809 030 4050', city: 'Lagos', totalBookings: 8, lastEvent: 'Annual Gala', lastEventDate: '2025-12-20', company: 'Corporate Nigeria' },
];

export default function ClientDirectory() {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = CLIENTS.filter((c) => {
    const q = search.toLowerCase();
    return !search || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Client Directory</h2>
        <p className="text-sm text-gray-500">{CLIENTS.length} clients managed</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search by name, email, or city..." className="pl-9"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No clients match your search</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">City</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Bookings</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden xl:table-cell">Last Event</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-gray-600">{client.email}</p>
                    <p className="text-gray-400">{client.phone}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{client.city}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="font-semibold">{client.totalBookings}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-gray-600">
                    <p>{client.lastEvent}</p>
                    <p className="text-xs text-gray-400">{new Date(client.lastEventDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedClient(client); setSheetOpen(true); }}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Client Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle>Client Profile</SheetTitle>
          </SheetHeader>
          {selectedClient && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedClient.name}</p>
                  {selectedClient.company && <p className="text-sm text-gray-500">{selectedClient.company}</p>}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <a href={`mailto:${selectedClient.email}`} className="text-blue-600 hover:underline truncate">{selectedClient.email}</a>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <a href={`tel:${selectedClient.phone}`} className="text-blue-600 hover:underline">{selectedClient.phone}</a>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>{selectedClient.city}, Nigeria</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-700">{selectedClient.totalBookings}</p>
                  <p className="text-xs text-blue-600">Total Bookings</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <Calendar className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-green-600 font-medium">Last Event</p>
                  <p className="text-xs text-green-700">{new Date(selectedClient.lastEventDate).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 mb-1">Most Recent Event</p>
                <p className="text-sm font-medium">{selectedClient.lastEvent}</p>
              </div>

              <div className="flex gap-2">
                <a href={`mailto:${selectedClient.email}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full"><Mail className="h-4 w-4 mr-1.5" /> Email</Button>
                </a>
                <a href={`tel:${selectedClient.phone}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full"><Phone className="h-4 w-4 mr-1.5" /> Call</Button>
                </a>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
