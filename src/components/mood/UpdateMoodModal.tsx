import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { X, BatteryCharging, Heart, Send } from 'lucide-react';

interface UpdateMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { emoji: '🥰', label: 'Enamorado/a & Mimoso/a', color: '#FFB7B2' },
  { emoji: '✨', label: 'Feliz & Radiante', color: '#FFF1C5' },
  { emoji: '🥺', label: 'Te Extraño Mucho', color: '#FFDAC6' },
  { emoji: '🧸', label: 'Necesito Tus Abrazos', color: '#E8DFF5' },
  { emoji: '😴', label: 'Cansado/a & Con Sueño', color: '#D4F0F7' },
  { emoji: '🌟', label: 'Motivado/a & Con Energía', color: '#E2F0CB' },
  { emoji: '☕', label: 'Modo Chill / Relax', color: '#EBD4CB' },
  { emoji: '💆', label: 'Estresado/a / Ocupado/a', color: '#D8B4E2' },
  { emoji: '🌧️', label: 'Un Poco Sensible / Triste', color: '#C2DFE3' },
  { emoji: '🤒', label: 'Malito/a / Cuidándome', color: '#F7D1CD' },
  { emoji: '🔥', label: 'Pensando en Ti...', color: '#FFAAA6' },
  { emoji: '🥳', label: 'Celebrando / Emocionado/a', color: '#FFE699' },
];

export const UpdateMoodModal: React.FC<UpdateMoodModalProps> = ({ isOpen, onClose }) => {
  const { activePartner, updateMood } = useCouple();

  const [selectedMood, setSelectedMood] = useState(
    MOOD_OPTIONS.find((m) => m.emoji === activePartner.currentMood.emoji) || MOOD_OPTIONS[0]
  );
  const [energy, setEnergy] = useState<number>(activePartner.currentMood.energy);
  const [note, setNote] = useState<string>(activePartner.currentMood.note);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMood(selectedMood.emoji, selectedMood.label, energy, note, selectedMood.color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600 text-lg">{selectedMood.emoji}</span>
            <div>
              <h3 className="text-sm font-bold text-stone-800">¿Cómo te sientes hoy?</h3>
              <p className="text-[11px] text-stone-500">Para que tu amor siempre lo sepa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Mood Options Grid */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1.5">
              Elige tu estado de ánimo:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MOOD_OPTIONS.map((m, idx) => {
                const isSelected = selectedMood.emoji === m.emoji;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    style={{ backgroundColor: isSelected ? m.color : undefined }}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      isSelected
                        ? 'border-stone-800 shadow-md scale-105'
                        : 'border-stone-200/70 bg-stone-50/60 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[9px] font-bold text-stone-800 mt-1 truncate max-w-full text-center">
                      {m.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy Battery Level */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                <span>Nivel de Batería de Energía:</span>
              </label>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {energy}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[9px] text-stone-400 mt-1">
              <span>🪫 Agotado/a</span>
              <span>🔋 A tope</span>
            </div>
          </div>

          {/* Daily Note */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">
              Mensajito o qué estás haciendo:
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Tomando café y pensando en ti..."
              className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              maxLength={80}
            />
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] text-rose-600 font-bold bg-rose-50 p-2 rounded-xl">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Ganarás +10 ❤️ por actualizar tu estado hoy</span>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-200 transition-all flex items-center justify-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Guardar Estado</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
