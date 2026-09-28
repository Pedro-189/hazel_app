import React, { useState, useEffect } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { PartnerMoodCard } from './PartnerMoodCard';
import { LoveTouchBar } from './LoveTouchBar';
import { UpdateMoodModal } from './UpdateMoodModal';
import { 
  Sparkles, 
  Plane,
  Sun,
  Moon,
  Clock
} from 'lucide-react';

function getPartnerTime(tz?: string) {
  const now = new Date();
  if (!tz) {
    const hours = now.getHours();
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      hours,
      isDay: hours >= 6 && hours < 20,
    };
  }

  // 1. Try standard IANA timezone
  try {
    const formatter = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: tz,
    });
    const parts = formatter.formatToParts(now);
    const hourPart = parts.find((p) => p.type === 'hour');
    const hour = hourPart ? parseInt(hourPart.value, 10) : now.getHours();
    return {
      time: formatter.format(now),
      hours: hour,
      isDay: hour >= 6 && hour < 20,
    };
  } catch {
    // 2. Parse offset (e.g. GMT+2, GMT-3, UTC+1, +02:00)
    const match = tz.match(/(?:GMT|UTC)?([+-])(\d{1,2})(?::?(\d{2}))?/i);
    if (match) {
      const sign = match[1] === '+' ? 1 : -1;
      const hoursOffset = parseInt(match[2], 10);
      const minsOffset = match[3] ? parseInt(match[3], 10) : 0;
      const totalMinutesOffset = sign * (hoursOffset * 60 + minsOffset);

      const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetDate = new Date(utcMs + (totalMinutesOffset * 60000));
      const hour = targetDate.getHours();
      return {
        time: targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        hours: hour,
        isDay: hour >= 6 && hour < 20,
      };
    }

    // 3. Fallback to local time
    const hours = now.getHours();
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      hours,
      isDay: hours >= 6 && hours < 20,
    };
  }
}

export const MoodScreen: React.FC = () => {
  const { couple, activePartner, otherPartner } = useCouple();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [, setTick] = useState(0);

  // Re-calculate clocks every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const partner1 = couple.partner1;
  const partner2 = couple.partner2;

  const p1Time = getPartnerTime(partner1.timezone);
  const p2Time = getPartnerTime(partner2.timezone);

  let diffHours = p2Time.hours - p1Time.hours;
  if (diffHours > 12) diffHours -= 24;
  if (diffHours < -12) diffHours += 24;
  const diffLabel = diffHours === 0 
    ? 'Misma hora' 
    : `${Math.abs(diffHours)}h de diferencia`;

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-stone-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Conexión Emocional</span>
            <h2 className="text-base font-serif font-bold text-stone-800 flex items-center gap-1.5 tracking-tight">
              Estado de Ánimo & Radar 💖
            </h2>
          </div>

          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mi Estado</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* LDR Connection Bridge with Dual Local Clocks */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 rounded-3xl p-4 text-white shadow-lg shadow-rose-200/60 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            {/* Partner 1 Info & Local Clock */}
            <div className="flex items-center space-x-2.5">
              <span className="text-3xl p-1 bg-white/20 backdrop-blur-xs rounded-2xl border border-white/30 shadow-xs">
                {partner1.avatar}
              </span>
              <div>
                <span className="text-xs font-serif font-bold block leading-tight">{partner1.name}</span>
                <span className="text-[10px] text-rose-100 block leading-tight truncate max-w-[85px]">
                  {partner1.location.split(',')[0]}
                </span>
                {/* Live Clock Pill */}
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs text-[10px] font-medium border border-white/20 shadow-xs">
                  {p1Time.isDay ? (
                    <Sun className="w-2.5 h-2.5 text-amber-200" />
                  ) : (
                    <Moon className="w-2.5 h-2.5 text-sky-200" />
                  )}
                  <span className="font-mono tracking-tight font-bold">{p1Time.time}</span>
                </div>
              </div>
            </div>

            {/* Connection Bridge Graphic & Time Diff */}
            <div className="flex flex-col items-center px-2 flex-shrink-0">
              <div className="flex items-center space-x-1 text-[11px] font-bold text-amber-200">
                <Plane className="w-3 h-3 animate-pulse" />
                <span>Distancia</span>
              </div>
              <div className="w-16 h-0.5 bg-white/40 my-1 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <span className="text-[9px] text-rose-100 bg-white/15 px-2 py-0.2 rounded-full font-medium">
                {diffLabel}
              </span>
            </div>

            {/* Partner 2 Info & Local Clock */}
            <div className="flex items-center space-x-2.5 text-right">
              <div>
                <span className="text-xs font-serif font-bold block leading-tight">{partner2.name}</span>
                <span className="text-[10px] text-rose-100 block leading-tight truncate max-w-[85px]">
                  {partner2.location.split(',')[0]}
                </span>
                {/* Live Clock Pill */}
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs text-[10px] font-medium border border-white/20 shadow-xs">
                  {p2Time.isDay ? (
                    <Sun className="w-2.5 h-2.5 text-amber-200" />
                  ) : (
                    <Moon className="w-2.5 h-2.5 text-sky-200" />
                  )}
                  <span className="font-mono tracking-tight font-bold">{p2Time.time}</span>
                </div>
              </div>
              <span className="text-3xl p-1 bg-white/20 backdrop-blur-xs rounded-2xl border border-white/30 shadow-xs">
                {partner2.avatar}
              </span>
            </div>
          </div>
        </div>

        {/* Both Partner Mood Cards */}
        <div className="space-y-3">
          <PartnerMoodCard
            partner={activePartner}
            isMe={true}
            onUpdateClick={() => setIsUpdateModalOpen(true)}
          />

          <PartnerMoodCard
            partner={otherPartner}
            isMe={false}
          />
        </div>

        {/* Quick Love Touch Buttons */}
        <LoveTouchBar />

        {/* Recent Affection History Feed */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-serif font-bold text-stone-800 flex items-center gap-1.5 tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Interacciones Recientes</span>
            </h4>
            <span className="text-[10px] text-stone-400 font-medium">
              {couple.recentInteractions.length} mimos
            </span>
          </div>

          <div className="space-y-2">
            {couple.recentInteractions.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">
                Aún no se han enviado caricias hoy. ¡Manda un abrazo con los botones de arriba!
              </p>
            ) : (
              couple.recentInteractions.slice(0, 5).map((item) => {
                const timeStr = new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {item.type === 'hug' && '🫂'}
                        {item.type === 'kiss' && '💋'}
                        {item.type === 'poke' && '✨'}
                        {item.type === 'miss_you' && '🥺'}
                        {item.type === 'heart_bomb' && '💖'}
                      </span>
                      <span className="text-stone-700 font-medium">{item.message}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 flex-shrink-0 ml-2">{timeStr}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Update Mood Modal */}
      <UpdateMoodModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
};
