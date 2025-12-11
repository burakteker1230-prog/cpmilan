import React from 'react';
import { PlusCircle, Car } from 'lucide-react';

interface NavbarProps {
  onOpenModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  return (
    <nav className="sticky top-0 z-50 bg-yellow-400 shadow-md border-b border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer select-none">
            <div className="bg-black p-2 rounded-full mr-2">
                <Car className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-black tracking-tight">CPM<span className="text-white bg-black px-1 mx-1 rounded text-lg">Pazar</span></span>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg transform hover:scale-105 active:scale-95"
            >
              <PlusCircle size={20} />
              <span className="hidden sm:inline">Ücretsiz İlan Ver</span>
              <span className="sm:hidden">İlan Ver</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
