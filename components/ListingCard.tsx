import React from 'react';
import { CarListing } from '../types';
import { MessageCircle, Clock, Tag } from 'lucide-react';

interface ListingCardProps {
  listing: CarListing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(price).replace('₺', '') + ' CPM';
  };

  const handleContact = () => {
    alert(`Satıcıyla (${listing.sellerName}) iletişime geçiliyor... (Simülasyon)`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            <Clock size={12} className="inline mr-1 mb-0.5" />
            {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={listing.title}>
            {listing.title}
            </h3>
        </div>
        
        <p className="text-2xl font-extrabold text-blue-600 mb-3 tracking-tight">
          {formatPrice(listing.price)}
        </p>

        <div className="flex items-center gap-2 mb-3">
            <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                {listing.sellerName}
            </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow border-t pt-2 border-dashed border-gray-200">
          {listing.description}
        </p>

        {/* Action Button */}
        <button 
            onClick={handleContact}
            className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:bg-green-700"
        >
          <MessageCircle size={18} />
          Satıcıya Mesaj At
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
