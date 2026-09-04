import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { 
  Heart, 
  Calendar, 
  Mail, 
  Send, 
  Plane, 
  Settings, 
  Edit3, 
  RotateCcw
} from 'lucide-react';
import { clearAllData } from '../../utils/storage';

export const MemoryScreen: React.FC = () => {
  const {
    couple,
    pairing,
    logoutUser,
    otherPartner,
    addLoveNote,
    updateMeetupDate,
    updatePartnerProfile,
  } = useCouple();

  const [noteText, setNoteText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('💌');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSettingDate, setIsSettingDate] = useState(false);
  const [tempDate, setTempDate] = useState(
    couple.nextMeetupDate ? couple.nextMeetupDate.split('T')[0] : ''
  );

  // Profile Edit State
  const [p1Name, setP1Name] = useState(couple.partner1.name);
  const [p1Avatar, setP1Avatar] = useState(couple.partner1.avatar);
  const [p1City, setP1City] = useState(couple.partner1.location);

  const [p2Name, setP2Name] = useState(couple.partner2.name);
  const [p2Avatar, setP2Avatar] = useState(couple.partner2.avatar);
  const [p2City, setP2City] = useState(couple.partner2.location);

  const stickers = ['💌', '🌸', '☕', '🍫', '🧸', '💍', '🏖️', '🐱', '✨', '💐'];

  // Days together calculation
  const startTimestamp = new Date(couple.relationshipStartDate).getTime();
  const diffDays = Math.max(1, Math.floor((Date.now() - startTimestamp) / (1000 * 60 * 60 * 24)));

  // Next meetup countdown
  let daysToMeetup: number | null = null;
  if (couple.nextMeetupDate) {
    const meetTimestamp = new Date(couple.nextMeetupDate).getTime();
    const diff = meetTimestamp - Date.now();
    daysToMeetup = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addLoveNote(noteText.trim(), selectedSticker);
    setNoteText('');
  };

  const handleSaveMeetupDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempDate) {
      updateMeetupDate(new Date(tempDate).toISOString());
    } else {
      updateMeetupDate(null);
    }
    setIsSettingDate(false);
  };

  const handleSaveProfiles = (e: React.FormEvent) => {
    e.preventDefault();
    updatePartnerProfile('partner1', {
      name: p1Name.trim() || 'Luna',
      avatar: p1Avatar.trim() || '🌸',
      location: p1City.trim() || 'Madrid, España',
    });
    updatePartnerProfile('partner2', {
      name: p2Name.trim() || 'Mateo',
      avatar: p2Avatar.trim() || '🐻',
      location: p2City.trim() || 'Buenos Aires, Argentina',
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-stone-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Nuestra Historia</span>
            <h2 className="text-base font-extrabold text-stone-800 flex items-center gap-1.5">
              Recuerdos & Buzón 💌
            </h2>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title="Editar Nombres & Ciudades"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Settings Drawer when opened */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfiles}
            className="bg-white rounded-3xl p-4 border border-rose-200 shadow-md space-y-3 animate-in fade-in duration-200"
          >
            <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-rose-500" />
              <span>Personalizar Nombres y Pareja</span>
            </h3>

            {/* Partner 1 */}
            <div className="p-2.5 bg-rose-50/50 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-rose-700 uppercase">Pareja 1 (Tú)</span>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={p1Avatar}
                  onChange={(e) => setP1Avatar(e.target.value)}
                  className="w-12 text-center text-lg p-1.5 border border-stone-200 rounded-xl bg-white"
                  title="Emoji Avatar"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  placeholder="Nombre"
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-white"
                  required
                />
              </div>
              <input
                type="text"
                value={p1City}
                onChange={(e) => setP1City(e.target.value)}
                placeholder="Ciudad / País"
                className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-white"
              />
            </div>

            {/* Partner 2 */}
            <div className="p-2.5 bg-sky-50/50 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-sky-700 uppercase">Pareja 2</span>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={p2Avatar}
                  onChange={(e) => setP2Avatar(e.target.value)}
                  className="w-12 text-center text-lg p-1.5 border border-stone-200 rounded-xl bg-white"
                  title="Emoji Avatar"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  placeholder="Nombre"
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-white"
                  required
                />
              </div>
              <input
                type="text"
                value={p2City}
                onChange={(e) => setP2City(e.target.value)}
                placeholder="Ciudad / País"
                className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-white"
              />
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-sm"
              >
                Guardar Cambios
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-400">
              <button
                type="button"
                onClick={logoutUser}
                className="text-stone-600 hover:text-stone-900 font-bold"
              >
                Cerrar Sesión / Desvincular
              </button>
              <button
                type="button"
                onClick={clearAllData}
                className="text-red-500 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reiniciar datos
              </button>
            </div>
          </form>
        )}

        {/* Couple Invite Code Banner */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-4 border border-rose-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-white text-lg shadow-xs border border-rose-100">
              🔑
            </span>
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                Código de Nuestra Casita
              </span>
              <span className="text-sm font-extrabold text-stone-800 font-mono tracking-wider">
                {pairing.coupleCode || 'HAZEL-LUNA99'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(pairing.coupleCode || 'HAZEL-LUNA99');
              alert('¡Código de pareja copiado al portapapeles!');
            }}
            className="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 shadow-xs transition-colors"
          >
            Copiar
          </button>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Days Together Counter */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-3xl p-4 text-white shadow-md shadow-rose-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-100 uppercase">Juntos desde</span>
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="my-2">
              <span className="text-3xl font-black">{diffDays}</span>
              <span className="text-xs font-bold text-rose-100 block">Días de Amor</span>
            </div>
            <span className="text-[10px] text-rose-100">
              {couple.partner1.name} & {couple.partner2.name} 💕
            </span>
          </div>

          {/* Next Meetup Countdown */}
          <div
            onClick={() => setIsSettingDate(true)}
            className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Próximo Vuelo</span>
              <Plane className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-2">
              {daysToMeetup !== null && daysToMeetup > 0 ? (
                <>
                  <span className="text-3xl font-black text-stone-800">{daysToMeetup}</span>
                  <span className="text-xs font-bold text-amber-600 block">Días para vernos</span>
                </>
              ) : daysToMeetup === 0 ? (
                <>
                  <span className="text-2xl font-black text-rose-500">¡HOY! 🎉</span>
                  <span className="text-xs font-bold text-stone-600 block">El gran reencuentro</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-stone-400">Sin fecha</span>
                  <span className="text-[10px] text-stone-400 block">Toca para definir</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-stone-400">Toca para cambiar fecha</span>
          </div>
        </div>

        {/* Date Picker Modal / Section */}
        {isSettingDate && (
          <form
            onSubmit={handleSaveMeetupDate}
            className="p-4 bg-amber-50 border border-amber-200 rounded-3xl space-y-3 animate-in fade-in duration-150"
          >
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Definir fecha de la próxima visita:</span>
            </h4>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold"
            />
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsSettingDate(false)}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold text-stone-600 bg-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600"
              >
                Guardar Fecha
              </button>
            </div>
          </form>
        )}

        {/* Love Notes Mailbox (Cartitas de Amor) */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-rose-500" />
              <span>Buzón de Cartitas de Amor</span>
            </h4>
            <span className="text-[10px] text-stone-400">{couple.loveNotes.length} cartitas</span>
          </div>

          {/* New Letter Composer */}
          <form onSubmit={handleSendNote} className="space-y-2">
            <div className="relative">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={`Escribe una cartita dulce para ${otherPartner.name}...`}
                rows={3}
                className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white resize-none font-handwriting text-sm"
                required
              />
            </div>

            {/* Sticker selector */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 overflow-x-auto pb-1 max-w-[200px] no-scrollbar">
                {stickers.map((stk) => (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => setSelectedSticker(stk)}
                    className={`text-base p-1 rounded-lg transition-transform ${
                      selectedSticker === stk ? 'bg-rose-100 scale-110' : 'hover:bg-stone-100'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!noteText.trim()}
                className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-xs transition-transform active:scale-95"
              >
                <Send className="w-3 h-3" />
                <span>Enviar (+15❤️)</span>
              </button>
            </div>
          </form>

          {/* Letters List */}
          <div className="space-y-2.5 pt-2">
            {couple.loveNotes.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">
                El buzón está vacío. ¡Sorprende a tu amor con una carta!
              </p>
            ) : (
              couple.loveNotes.map((note) => {
                const sender = note.from === 'partner1' ? couple.partner1 : couple.partner2;
                const isFromMe = note.from === couple.activePartnerId;
                const timeStr = new Date(note.createdAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={note.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isFromMe
                        ? 'bg-rose-50/50 border-rose-100'
                        : 'bg-amber-50/60 border-amber-100 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 mb-1">
                      <span className="flex items-center gap-1">
                        <span>{note.sticker}</span>
                        <span>De {sender.name} {sender.avatar}</span>
                      </span>
                      <span className="text-[10px] text-stone-400">{timeStr}</span>
                    </div>
                    <p className="text-xs text-stone-800 font-handwriting text-sm leading-relaxed">
                      {note.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
