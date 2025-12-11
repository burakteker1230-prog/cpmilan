import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ListingCard from './components/ListingCard';
import CreateAdModal from './components/CreateAdModal';
import { CarListing, NewListingInput } from './types';
import { Search } from 'lucide-react';

// Start with empty data
const INITIAL_DATA: CarListing[] = [];

const App: React.FC = () => {
  const [listings, setListings] = useState<CarListing[]>(INITIAL_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to convert file to base64 for display
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreateAd = async (data: NewListingInput) => {
    let imageUrl = 'https://picsum.photos/800/600'; // Default placeholder

    if (data.imageFile) {
      try {
        imageUrl = await fileToBase64(data.imageFile);
      } catch (e) {
        console.error("Image processing error", e);
      }
    }

    const newListing: CarListing = {
      id: Date.now().toString(),
      title: data.title,
      price: parseFloat(data.price),
      description: data.description,
      imageUrl: imageUrl,
      sellerName: data.sellerName,
      createdAt: Date.now(),
    };

    setListings((prev) => [newListing, ...prev]);
    setIsModalOpen(false);
  };

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      {/* Hero / Search Section */}
      <div className="bg-yellow-400 pb-12 pt-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">
            Hayalindeki Arabayı Bul <br/> <span className="text-white">Ya da Hemen Sat</span>
          </h1>
          <p className="text-lg font-medium text-gray-800 opacity-90">
            Car Parking Multiplayer oyuncularının buluşma noktası.
          </p>
          
          <div className="relative max-w-2xl mx-auto shadow-xl rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input 
                type="text" 
                placeholder="Hangi arabayı arıyorsun? (Örn: Golf, Civic, BMW...)" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:ring-4 focus:ring-black/20 outline-none text-lg font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full -mt-8">
        {listings.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl shadow-sm mt-4">
            <p className="text-gray-500 text-xl font-medium">Henüz hiç ilan yok.</p>
            <p className="text-gray-400 mt-2">Sağ üstteki butona tıklayarak ilk ilanı sen oluştur!</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm mt-4">
            <p className="text-gray-500 text-xl font-medium">Aradığınız kriterlere uygun araç bulunamadı.</p>
            <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 font-bold hover:underline"
            >
                Tüm ilanları göster
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CPM İlanlar. Car Parking Multiplayer hayran yapımıdır. Resmi oyunla bağlantısı yoktur.</p>
        </div>
      </footer>

      {/* Modal */}
      <CreateAdModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateAd} 
      />
    </div>
  );
};

export default App;