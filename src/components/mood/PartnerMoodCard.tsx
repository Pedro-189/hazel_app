import React from 'react';
import { Partner } from '../../types/couple';
import { BatteryCharging, Clock, MapPin, Sparkles } from 'lucide-react';

interface PartnerMoodCardProps {
  partner: Partner;
  isMe: boolean;
  onUpdateClick?: () => void;
}

export const PartnerMoodCard: React.FC<PartnerMoodCardProps> = ({
  partner,
  isMe,
  onUpdateClick,
}) => {
  const { currentMood } = partner;
  const energy = currentMood.energy;

  // Energy battery color
  const getBatteryColor = (lvl: number) => {
    if (lvl > 70) return 'bg-emerald-500 text-emerald-600';
    if (lvl > 35) return 'bg-amber-500 text-amber-600';
    return 'bg-rose-500 text-rose-600';
  };

  const timeAgo = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Hace un momento';
    if (mins < 60) return `Hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${Math.floor(hours / 24)} d`;
  };

  return (
    <div
      style={{ backgroundColor: `${currentMood.color}25` }}
      className="p-4 rounded-3xl border border-stone-200/80 shadow-sm relative overflow-hidden transition-all"
    >
      {/* Top Profile Strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="text-3xl p-1.5 bg-white/90 rounded-2xl shadow-xs border border-white">
            {partner.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-stone-800">{partner.name}</h3>
              {isMe && (
                <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-500 text-white rounded-full">
                  Tú
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span className="truncate max-w-[140px]">{partner.location}</span>
              <span className="text-stone-300">•</span>
              <span className="text-[10px]">{partner.timezone}</span>
            </div>
          </div>
        </div>

        {/* Big Emoji Status Pill */}
        <div className="flex flex-col items-end">
          <div className="text-3xl filter drop-shadow-sm animate-bounce-slow">
            {currentMood.emoji}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo(currentMood.updatedAt)}
          </span>
        </div>
      </div>

      {/* Mood Title & Note */}
      <div className="mt-3 bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-white/60 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
            <span>{currentMood.emoji}</span>
            <span>{currentMood.label}</span>
          </span>
        </div>

        {currentMood.note ? (
          <p className="text-xs text-stone-600 italic font-sans leading-relaxed">
            "{currentMood.note}"
          </p>
        ) : (
          <p className="text-xs text-stone-400 italic">Sin nota adicional por ahora.</p>
        )}

        {/* Battery Bar */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 mb-1">
            <span className="flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-500" />
              <span>Batería Emocional</span>
            </span>
            <span className={getBatteryColor(energy).split(' ')[1]}>{energy}%</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <div
              style={{ width: `${energy}%` }}
              className={`h-full rounded-full transition-all duration-500 ${getBatteryColor(energy).split(' ')[0]}`}
            />
          </div>
        </div>
      </div>

      {/* Button to Update if Me */}
      {isMe && onUpdateClick && (
        <button
          onClick={onUpdateClick}
          className="mt-3 w-full py-2 bg-white/90 hover:bg-white text-rose-600 rounded-xl font-bold text-xs border border-rose-200 shadow-xs flex items-center justify-center space-x-1.5 transition-transform active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Actualizar mi estado de hoy (+10❤️)</span>
        </button>
      )}
    </div>
  );
};
