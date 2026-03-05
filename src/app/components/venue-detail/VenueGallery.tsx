import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

export default function VenueGallery({ images, venueName }: VenueGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (idx: number) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };

  const prev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  const thumbnails = images.slice(0, 4);
  const remainingCount = images.length > 4 ? images.length - 4 : 0;

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden">
        {/* Main large image */}
        <button
          className="col-span-2 row-span-2 relative group overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <img
            src={images[0]}
            alt={`${venueName} - main`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* Thumbnails */}
        {thumbnails.slice(1).map((img, i) => (
          <button
            key={i}
            className="relative group overflow-hidden"
            onClick={() => openLightbox(i + 1)}
          >
            <img
              src={img}
              alt={`${venueName} - ${i + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80';
              }}
            />
            {/* +N overlay on last thumbnail */}
            {i === 2 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                <Images className="h-5 w-5 text-white" />
                <span className="text-white font-semibold text-sm">+{remainingCount} more</span>
              </div>
            )}
          </button>
        ))}

        {/* Fill empty spots if less than 4 thumbnails */}
        {Array.from({ length: Math.max(0, 3 - thumbnails.slice(1).length) }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-100" />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="max-w-4xl w-full mx-16">
            <img
              src={images[currentIndex]}
              alt={`${venueName} - ${currentIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-white/50 text-sm text-center mt-3">
              {currentIndex + 1} / {images.length}
            </p>
          </div>

          <button
            onClick={next}
            className="absolute right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
