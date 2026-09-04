import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { isSupabaseConfigured } from '../../utils/supabaseClient';
import { sound } from '../../utils/audio';
import {
  X,
  LogOut,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Cloud,
  CloudOff,
  Heart,
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    pairing,
    couple,
    activePartner,
    switchActivePartner,
    logoutUser,
  } = useCouple();

  const [copied, setCopied] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  if (!isOpen) return null;

  const coupleCode = pairing.coupleCode || 'HAZEL-DEMO99';

  const handleCopyCode = () => {
    sound.playPop();
    navigator.clipboard.writeText(coupleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    sound.playPop();
    const text = encodeURIComponent(
      `¡Hola amor! 💕 Esta es nuestra casita en Hazel. Puedes unirte o entrar con este código: ${coupleCode}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleConfirmLogout = () => {
    setShowConfirmLogout(false);
    onClose();
    logoutUser();
  };

  const handleTogglePartner = () => {
    const nextId = couple.activePartnerId === 'partner1' ? 'partner2' : 'partner1';
    switchActivePartner(nextId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🏡</span>
            <div>
              <h2 className="text-sm font-black tracking-tight flex items-center gap-1">
                <span>Mi Cuenta</span>
                <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
              </h2>
              <p className="text-[10px] text-rose-100 font-medium">Gestión de sesión y casita</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* User Profile Card */}
          <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-2xl shadow-xs">
                {currentUser?.avatar || activePartner.avatar}
              </div>
              <div>
                <div className="text-xs font-black text-stone-800">
                  {currentUser?.name || activePartner.name}
                </div>
                <div className="text-[10px] text-stone-500 font-medium">
                  {currentUser?.location || activePartner.location}
                </div>
                <div className="text-[9px] text-rose-600 font-bold mt-0.5">
                  Perspectiva actual: {activePartner.name}
                </div>
              </div>
            </div>

            <button
              onClick={handleTogglePartner}
              title="Cambiar perspectiva de vista"
              className="p-2 bg-white hover:bg-rose-50 border border-stone-200 rounded-xl text-stone-600 hover:text-rose-600 shadow-xs transition-colors flex items-center space-x-1"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Couple Code Box */}
          <div className="p-3.5 bg-gradient-to-br from-rose-50/70 to-pink-50/70 border border-rose-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Código de Tu Casita
              </span>
              <span className="text-[9px] font-bold text-stone-400 bg-white/80 px-2 py-0.5 rounded-full border border-stone-200">
                Comparte con tu amor
              </span>
            </div>

            <div className="p-2 bg-white border border-rose-200 rounded-xl font-mono text-center text-base font-black text-stone-800 tracking-wider shadow-inner">
              {coupleCode}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyCode}
                className="py-2 px-2.5 bg-white hover:bg-rose-50 border border-stone-200 rounded-xl font-bold text-[11px] text-stone-700 flex items-center justify-center space-x-1 shadow-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-rose-500" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-2 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-[11px] flex items-center justify-center space-x-1 shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Cloud Connection Status */}
          <div className="p-3 rounded-2xl border text-left flex items-start space-x-2.5 bg-stone-50 border-stone-200">
            {isSupabaseConfigured ? (
              <Cloud className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <CloudOff className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-[11px]">
              <div className="font-bold text-stone-800 flex items-center gap-1">
                <span>{isSupabaseConfigured ? 'Conectado a la Nube (Supabase)' : 'Modo Local (Sin Base de Datos)'}</span>
                {isSupabaseConfigured && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">
                {isSupabaseConfigured
                  ? 'Tus cambios y muebles se sincronizan en tiempo real con tu pareja.'
                  : 'Para sincronizar en vivo con tu pareja en Vercel, agrega las credenciales de Supabase en las variables de entorno.'}
              </p>
            </div>
          </div>

          {/* Logout Confirmation Prompt or Action Button */}
          {showConfirmLogout ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl space-y-2.5 animate-in fade-in">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-red-700 font-medium">
                  ¿Seguro que deseas salir? Podrás volver a entrar en cualquier momento con tu código de casita: <strong className="font-mono">{coupleCode}</strong>.
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  Sí, Cerrar Sesión
                </button>
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="py-2 px-3 bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 rounded-xl font-bold text-xs transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmLogout(true)}
              className="w-full py-2.5 px-3 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200/80 hover:border-red-200 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
