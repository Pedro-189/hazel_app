import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { X, Image as ImageIcon, Upload } from 'lucide-react';

interface PhotoUploadModalProps {
  placedId: string | null;
  onClose: () => void;
}

const PRESET_ROMANTIC_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80',
    title: 'Manos Juntas',
  },
  {
    url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&auto=format&fit=crop&q=80',
    title: 'Atardecer en la Playa',
  },
  {
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    title: 'Cielo Estrellado',
  },
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&auto=format&fit=crop&q=80',
    title: 'Café & Flores',
  },
];

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ placedId, onClose }) => {
  const { house, setCustomPhotoOnFrame } = useCouple();
  const placedItem = house.placedItems.find((p) => p.id === placedId);

  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(placedItem?.customPhotoUrl || '');
  const [customNote, setCustomNote] = useState<string>(placedItem?.customNote || '');

  if (!placedId || !placedItem) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedPhotoUrl) {
      setCustomPhotoOnFrame(placedId, selectedPhotoUrl, customNote);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600 text-lg">🖼️</span>
            <div>
              <h3 className="text-sm font-bold text-stone-800">Marco de Foto Real</h3>
              <p className="text-[11px] text-stone-500">Cuelguen un recuerdo en su pared</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo Preview in Frame */}
        <div className="my-4 flex flex-col items-center justify-center">
          <div className="w-44 h-44 p-2.5 bg-amber-100 border-4 border-amber-600 rounded-2xl shadow-md flex flex-col items-center justify-center relative overflow-hidden">
            {selectedPhotoUrl ? (
              <img
                src={selectedPhotoUrl}
                alt="Foto de pareja"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center p-3">
                <ImageIcon className="w-8 h-8 mx-auto text-amber-400 mb-1" />
                <p className="text-[10px] text-amber-800 font-medium">Sube una foto tuya y de tu pareja</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button or choose presets */}
        <div className="space-y-3">
          <label className="flex items-center justify-center space-x-2 w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-dashed border-rose-300 rounded-2xl cursor-pointer transition-colors text-xs font-bold">
            <Upload className="w-4 h-4" />
            <span>Subir foto desde tu dispositivo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <div>
            <span className="text-[11px] font-bold text-stone-600 mb-1 block">O elige un recuerdo:</span>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_ROMANTIC_PHOTOS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoUrl(preset.url)}
                  className={`h-12 rounded-xl overflow-hidden border-2 transition-transform active:scale-95 ${
                    selectedPhotoUrl === preset.url ? 'border-rose-500 ring-2 ring-rose-200' : 'border-transparent'
                  }`}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">Nota o dedicatoria:</label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Ej: Nuestro primer beso bajo la lluvia..."
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-handwriting text-sm"
              maxLength={40}
            />
          </div>
        </div>

        {/* Save button */}
        <div className="mt-5 flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedPhotoUrl}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 shadow-md shadow-rose-200 transition-all"
          >
            Guardar en Pared
          </button>
        </div>
      </div>
    </div>
  );
};
