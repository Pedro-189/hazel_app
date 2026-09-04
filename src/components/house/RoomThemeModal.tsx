import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Room } from '../../types/house';
import { X, Palette, Check, Sparkles, Home } from 'lucide-react';
import { sound } from '../../utils/audio';

interface RoomThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALL_PALETTES = [
  { name: 'Crema Vainilla', color: '#F7EFE5', bgClass: 'bg-[#F7EFE5]' },
  { name: 'Rosa Algodón', color: '#FFEBE8', bgClass: 'bg-[#FFEBE8]' },
  { name: 'Lavanda Dulce', color: '#EBE5F5', bgClass: 'bg-[#EBE5F5]' },
  { name: 'Matcha Relajante', color: '#E2F3E5', bgClass: 'bg-[#E2F3E5]' },
  { name: 'Mantequilla Suave', color: '#FFF8E7', bgClass: 'bg-[#FFF8E7]' },
  { name: 'Azul Brisa', color: '#E0F2FE', bgClass: 'bg-[#E0F2FE]' },
  { name: 'Terracota Cálido', color: '#FCEADE', bgClass: 'bg-[#FCEADE]' },
  { name: 'Noche Estrellada', color: '#1E293B', bgClass: 'bg-[#1E293B]' },
];

const FLOOR_OPTIONS: Array<{ type: Room['floorType']; name: string; icon: string; preview: string }> = [
  { type: 'wood', name: 'Madera Nórdica', icon: '🪵', preview: 'bg-[#F2E8DC] border-t-2 border-[#D6C2AC]' },
  { type: 'carpet', name: 'Alfombra Afelpada', icon: '🧶', preview: 'bg-[#F9ECEF] border-t-2 border-[#E8C5CE]' },
  { type: 'tiles', name: 'Baldosa Mosaico', icon: '🍳', preview: 'bg-[#F0F7F4] border-t-2 border-[#D8EBE4]' },
  { type: 'grass', name: 'Pasto Florido', icon: '🌿', preview: 'bg-[#E5F4E3] border-t-2 border-[#BDE3B9]' },
  { type: 'brick', name: 'Ladrillo Rústico', icon: '🧱', preview: 'bg-[#F7EBE8] border-t-2 border-[#E8CCC7]' },
];

export const RoomThemeModal: React.FC<RoomThemeModalProps> = ({ isOpen, onClose }) => {
  const { house, updateRoomTheme } = useCouple();
  const currentRoom = house.rooms[house.currentRoomId];

  const [selectedWall, setSelectedWall] = useState<string>(currentRoom.wallColor);
  const [selectedFloor, setSelectedFloor] = useState<Room['floorType']>(currentRoom.floorType);

  if (!isOpen) return null;

  const handleApply = () => {
    sound.playHeartCollect();
    updateRoomTheme(house.currentRoomId, selectedWall, selectedFloor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-pink-100 text-pink-600 text-lg">🎨</span>
            <div>
              <h3 className="text-sm font-bold text-stone-800">Estilo de Habitación</h3>
              <p className="text-[11px] text-stone-500">Personaliza paredes y suelo de {currentRoom.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallpaper Picker */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              <span>Color de Pared & Papel Tapiz:</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {WALL_PALETTES.map((wp) => {
                const isSelected = selectedWall.toLowerCase() === wp.color.toLowerCase();
                return (
                  <button
                    key={wp.color}
                    type="button"
                    onClick={() => setSelectedWall(wp.color)}
                    style={{ backgroundColor: wp.color }}
                    className={`h-11 rounded-2xl border-2 transition-transform relative flex items-center justify-center ${
                      isSelected
                        ? 'border-stone-800 scale-110 shadow-md ring-2 ring-rose-300'
                        : 'border-stone-200/80 hover:scale-105'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-stone-800 font-black" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floor Type Picker */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1.5 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-amber-500" />
              <span>Tipo de Suelo & Piso:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FLOOR_OPTIONS.map((fl) => {
                const isSelected = selectedFloor === fl.type;
                return (
                  <button
                    key={fl.type}
                    type="button"
                    onClick={() => setSelectedFloor(fl.type)}
                    className={`p-2.5 rounded-2xl border flex items-center space-x-2 text-left transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-200 shadow-sm'
                        : 'bg-white border-stone-200/80 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xl">{fl.icon}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-stone-800 block truncate">{fl.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-3 rounded-2xl border border-stone-200 flex items-center justify-between bg-stone-50">
            <span className="text-xs font-bold text-stone-700">Previsualización:</span>
            <div className="w-20 h-10 rounded-xl overflow-hidden border border-stone-300 flex flex-col shadow-inner">
              <div style={{ backgroundColor: selectedWall }} className="flex-1" />
              <div className={`h-4 ${FLOOR_OPTIONS.find((f) => f.type === selectedFloor)?.preview}`} />
            </div>
          </div>

          {/* Save Action */}
          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-200 transition-all flex items-center justify-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Guardar Estilo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
