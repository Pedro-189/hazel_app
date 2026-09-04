import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { 
  Heart, 
  Sparkles, 
  Copy, 
  Check, 
  Users, 
  ArrowRight, 
  KeyRound, 
  Play,
  MessageSquare,
  Cloud,
  CloudOff,
  Home,
  LogIn
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { isSupabaseConfigured } from '../../utils/supabaseClient';

const AVATARS = ['🌸', '🐻', '🐱', '🦊', '🐰', '🌟', '🍓', '🥑', '🐼', '🐨', '🌻', '🌙'];

type AuthMode = 'login' | 'create';

export const AuthScreen: React.FC = () => {
  const {
    pairing,
    loginUser,
    loginWithExistingCode,
    createCoupleInviteCode,
    joinCoupleByCode,
    startDemoMode,
  } = useCouple();

  const [mode, setMode] = useState<AuthMode>('login');
  const [createStep, setCreateStep] = useState<'profile' | 'invite'>('profile');

  // Form states
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [location, setLocation] = useState('Madrid, España');
  const [coupleCodeInput, setCoupleCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const currentCode = pairing.coupleCode || 'HAZEL-LOVE24';

  // Handle Login with existing code
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre');
      return;
    }

    const code = coupleCodeInput.trim().toUpperCase();
    if (!code) {
      setErrorMessage('Por favor ingresa el código de tu casita (ej: HAZEL-LUNA99)');
      return;
    }

    if (!code.startsWith('HAZEL-') || code.length < 6) {
      setErrorMessage('El código debe comenzar con "HAZEL-" seguido de tu clave de pareja.');
      return;
    }

    const success = loginWithExistingCode(name.trim(), avatar, location.trim(), code);
    if (!success) {
      setErrorMessage('No se pudo validar el código. Verifica el formato.');
    }
  };

  // Handle Create new couple
  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre');
      return;
    }

    loginUser(name.trim(), avatar, location.trim());
    createCoupleInviteCode();
    setCreateStep('invite');
  };

  const handleCopyCode = () => {
    sound.playPop();
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    sound.playPop();
    const text = encodeURIComponent(
      `¡Hola amor! 💕 Únete a nuestra casita virtual en Hazel con este código: ${currentCode}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEnterCreatedRoom = () => {
    joinCoupleByCode(currentCode);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="w-full max-w-md bg-stone-50 rounded-3xl sm:rounded-[40px] shadow-2xl overflow-hidden border border-rose-200/50 flex flex-col min-h-[640px]">
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl shadow-inner mb-2 animate-bounce-slow">
              🏡
            </div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-1.5 font-sans">
              Hazel <Heart className="w-5 h-5 fill-rose-200 text-rose-200" />
            </h1>
            <p className="text-xs text-rose-100 mt-0.5 max-w-xs font-medium">
              El espacio íntimo y acogedor para parejas
            </p>

            {/* Cloud Status Badge */}
            <div className="mt-2.5 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 backdrop-blur-xs text-rose-50 border border-white/20">
              {isSupabaseConfigured ? (
                <>
                  <Cloud className="w-3 h-3 text-emerald-300" />
                  <span>Nube Supabase Conectada</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3 h-3 text-amber-300" />
                  <span>Modo Local (Falta conectar Supabase)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-3 bg-stone-100/90 border-b border-stone-200 flex gap-1.5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'login'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('create');
              setCreateStep('profile');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'create'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Crear Casita</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
          {/* ================= MODE 1: INICIAR SESIÓN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <LogIn className="w-4 h-4 text-rose-500" />
                  <span>Entrar a tu Casita Existente</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ingresa tu código de pareja para retomar tu sesión compartida
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Elige tu Avatar Emoji:
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {AVATARS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setAvatar(em)}
                      className={`h-10 rounded-2xl text-xl flex items-center justify-center border transition-all ${
                        avatar === em
                          ? 'bg-rose-100 border-rose-400 scale-105 shadow-xs'
                          : 'bg-white border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  ¿Cómo te llamas o te dice tu pareja?:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Luna, Mateo, Mi Amor..."
                  className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold"
                  required
                />
              </div>

              {/* Couple Code Input */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Código de tu Casita:
                </label>
                <input
                  type="text"
                  value={coupleCodeInput}
                  onChange={(e) => setCoupleCodeInput(e.target.value.toUpperCase())}
                  placeholder="HAZEL-XXXX"
                  className="w-full px-3.5 py-2.5 text-center text-sm font-mono tracking-wider uppercase border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-black text-rose-700"
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-[11px] text-red-500 text-center font-bold bg-red-50 p-2 rounded-xl border border-red-200">
                  {errorMessage}
                </p>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={!name.trim() || !coupleCodeInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center space-x-1.5 transition-transform active:scale-98"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Entrar a Nuestra Casita</span>
                </button>

                <button
                  type="button"
                  onClick={startDemoMode}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-bold text-[11px] flex items-center justify-center space-x-1 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-rose-500" />
                  <span>Probar Modo Demostración Rápido (Luna & Mateo)</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 2: CREAR NUEVA CASITA ================= */}
          {mode === 'create' && createStep === 'profile' && (
            <form onSubmit={handleCreateProfileSubmit} className="space-y-3.5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>Crear Nueva Casita</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Crea tu perfil y te daremos un código único para compartir con tu pareja
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Elige tu Avatar Emoji:
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {AVATARS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setAvatar(em)}
                      className={`h-10 rounded-2xl text-xl flex items-center justify-center border transition-all ${
                        avatar === em
                          ? 'bg-rose-100 border-rose-400 scale-105 shadow-xs'
                          : 'bg-white border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Tu Nombre o Apodo:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Sofia, Carlos, Luna..."
                  className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold"
                  required
                />
              </div>

              {/* Location Input */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Tu Ciudad / País:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Barcelona, España"
                  className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                />
              </div>

              {errorMessage && (
                <p className="text-[11px] text-red-500 text-center font-bold">{errorMessage}</p>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center space-x-1.5 transition-transform active:scale-98"
                >
                  <span>Generar Código de Nuestra Casita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={startDemoMode}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-bold text-[11px] flex items-center justify-center space-x-1 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-rose-500" />
                  <span>Probar Modo Demostración Rápido</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE 2 (STEP 2): INVITATION SCREEN ================= */}
          {mode === 'create' && createStep === 'invite' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-500" />
                  <span>¡Casita Creada con Éxito!</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Comparte este código con tu pareja para que se unan
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-3xl p-4 text-center space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                  Tu Código Único de Casita
                </span>
                <div className="text-2xl font-black text-stone-800 tracking-wider font-mono py-1.5 px-3 bg-white rounded-2xl border border-rose-200 shadow-inner">
                  {currentCode}
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Tu pareja solo debe abrir Hazel, pulsar <strong>"Iniciar Sesión"</strong> y pegar este código.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="py-2.5 px-3 bg-white hover:bg-rose-50 border border-stone-200 rounded-2xl font-bold text-xs text-stone-700 flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-rose-500" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-200 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="p-3 bg-stone-100 rounded-2xl flex items-center space-x-2 text-[11px] text-stone-600">
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping shrink-0" />
                <span>Tu pareja puede unirse ahora o más tarde. Ya puedes entrar a ver tu casita.</span>
              </div>

              <button
                type="button"
                onClick={handleEnterCreatedRoom}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center space-x-1.5 transition-transform active:scale-98"
              >
                <span>Entrar a Nuestra Casita</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setCreateStep('profile')}
                  className="text-xs text-stone-400 hover:text-stone-600 font-medium"
                >
                  ← Modificar mis datos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
