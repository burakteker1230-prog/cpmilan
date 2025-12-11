import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { NewListingInput } from '../types';
import { generateAdDescription } from '../services/geminiService';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewListingInput) => void;
}

const CreateAdModal: React.FC<CreateAdModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewListingInput>({
    title: '',
    price: '',
    description: '',
    sellerName: '',
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.title || !formData.price) {
      alert("Yapay zeka desteği için lütfen en azından Araç Modelini ve Fiyatını girin.");
      return;
    }

    setIsGenerating(true);
    // Features field isn't in main form but used for prompting, just grab from existing description if any
    const desc = await generateAdDescription(formData.title, formData.price, formData.description || "Hızlı, modifiyeli");
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.sellerName) {
        alert("Lütfen zorunlu alanları doldurun.");
        return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({ title: '', price: '', description: '', sellerName: '', imageFile: null });
    setPreviewUrl(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Yeni İlan Oluştur</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="adForm" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Araç Fotoğrafı</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all ${previewUrl ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <div className="text-center text-gray-500">
                    <Upload className="mx-auto h-10 w-10 mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Fotoğraf Yüklemek İçin Tıkla</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                  </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Araç Modeli</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Örn: BMW M5 F90"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (CPM)</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Örn: 1500000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    required
                />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satıcı Adı (Oyun Nick)</label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleInputChange}
                placeholder="Örn: KingDrifter01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">İlan Açıklaması</label>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded-md transition-colors font-semibold"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Yapay Zeka ile Yaz
                </button>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Aracın özelliklerini buraya yazın veya Yapay Zeka butonunu kullanın..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            type="submit"
            form="adForm"
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            İlanı Yayınla
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAdModal;
