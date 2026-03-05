import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2 } from 'lucide-react';
import { Button } from '../ui/button';

export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          Ready to Get Started?
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Your Perfect Event Center
          <br />
          is Just a Search Away
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Whether you're planning a wedding, corporate event, or birthday party — EventHub has the
          ideal venue waiting for you across Nigeria.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate('/browse')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-14 text-base font-semibold shadow-xl shadow-blue-600/20"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse Event Centers
          </Button>
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent px-10 h-14 text-base font-semibold"
          >
            <Building2 className="h-5 w-5 mr-2" />
            Register Your Venue
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Free to browse</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>No hidden fees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Verified venues</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>All states covered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
