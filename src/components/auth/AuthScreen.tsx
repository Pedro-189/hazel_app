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
  LogIn,
  Lock,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { isSupabaseConfigured } from '../../utils/supabaseClient';
import { fetchRemoteCouple, RemoteCoupleRow } from '../../utils/supabaseSync';
import { loadStoredData } from '../../utils/storage';
import { CoupleState, PartnerId } from '../../types/couple';

const AVATARS = ['🌸', '🐻', '🐱', '🦊', '🐰', '🌟', '🍓', '🥑', '🐼', '🐨', '🌻', '🌙'];

type AuthMode = 'login' | 'create';

export const AuthScreen: React.FC = () => {
  const {
    pairing,
    loginUser,
    loginAsExistingPartner,
    registerAsPartner2,
    createCoupleInviteCode,
    joinCoupleByCode,
    startDemoMode,
  } = useCouple();

  const [mode, setMode] = useState<AuthMode>('login');
  const [createStep, setCreateStep] = useState<'profile' | 'invite'>('profile');

  // Create form states
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [location, setLocation] = useState('Madrid, España');
  const [pin, setPin] = useState('');

  // Login form states
  const [coupleCodeInput, setCoupleCodeInput] = useState(pairing.coupleCode || '');
  const [isSearching, setIsSearching] = useState(false);
  const [foundCasita, setFoundCasita] = useState<RemoteCoupleRow | null>(null);
  const [selectedRole, setSelectedRole] = useState<PartnerId | 'new_partner2' | null>(null);
  const [loginPin, setLoginPin] = useState('');

  // Partner 2 registration fields
  const [p2Name, setP2Name] = useState('');
  const [p2Avatar, setP2Avatar] = useState('🐨');
  const [p2Location, setP2Location] = useState('');
  const [p2Pin, setP2Pin] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const currentCode = pairing.coupleCode || 'HAZEL-LOVE24';

  // Buscar casita remota o local por código
  const handleSearchCasita = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const code = coupleCodeInput.trim().toUpperCase();

    if (!code) {
      setErrorMessage('Por favor ingresa el código de tu casita (ej: HAZEL-LUNA99)');
      return;
    }

    if (!code.startsWith('HAZEL-') || code.length < 6) {
      setErrorMessage('El código debe comenzar con "HAZEL-" seguido de tu clave de pareja.');
      return;
    }

    setIsSearching(true);
    sound.playPop();

    try {
      // 1. Intentar buscar en Supabase
      const remote = await fetchRemoteCouple(code);
      if (remote && remote.couple_data) {
        setFoundCasita(remote);
        setSelectedRole(null);
        setLoginPin('');
        setIsSearching(false);
        return;
      }

      // 2. Fallback: verificar si es la casita local guardada
      const localPairing = loadStoredData<any>('hazel_couple_pairing_v1', null);
      const localCouple = loadStoredData<CoupleState | null>('hazel_couple_state_v1', null);

      if (localPairing?.coupleCode === code && localCouple) {
        setFoundCasita({
          id: code,
          couple_data: localCouple,
          house_data: loadStoredData<any>('hazel_house_state_v1', {}),
          qa_data: loadStoredData<any>('hazel_qa_state_v1', {}),
          updated_at: new Date().toISOString(),
        });
        setSelectedRole(null);
        setLoginPin('');
        setIsSearching(false);
        return;
      }

      // Si no se encuentra
      setErrorMessage(`No encontramos ninguna casita con el código "${code}". Verifica que esté bien escrito o crea una casita nueva.`);
    } catch (err) {
      setErrorMessage('Ocurrió un error al buscar la casita. Intenta nuevamente.');
    } finally {
      setIsSearching(false);
    }
  };

  // Login como Jugador 1 o Jugador 2 existente
  const handleExistingPartnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!foundCasita || !selectedRole || selectedRole === 'new_partner2') return;

    if (!loginPin.trim()) {
      setErrorMessage('Por favor ingresa tu PIN de 4 dígitos para acceder');
      return;
    }

    const result = loginAsExistingPartner(
      foundCasita.id,
      selectedRole,
      loginPin.trim(),
      foundCasita
    );

    if (!result.success) {
      setErrorMessage(result.error || 'PIN incorrecto.');
    }
  };

  // Registro de Jugador 2 (Pareja uniéndose por primera vez)
  const handleRegisterPartner2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!foundCasita) return;

    if (!p2Name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre');
      return;
    }

    if (!p2Pin.trim() || p2Pin.trim().length < 4) {
      setErrorMessage('Por favor crea un PIN de 4 dígitos para proteger tu cuenta');
      return;
    }

    setIsSearching(true);
    const result = await registerAsPartner2(
      foundCasita.id,
      p2Name.trim(),
      p2Avatar,
      p2Location.trim(),
      p2Pin.trim(),
      foundCasita
    );
    setIsSearching(false);

    if (!result.success) {
      setErrorMessage(result.error || 'No se pudo vincular como pareja.');
    }
  };

  // Handle Create new couple (Jugador 1)
  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre');
      return;
    }

    if (!pin.trim() || pin.trim().length < 4) {
      setErrorMessage('Por favor crea un PIN personal de 4 dígitos para tu cuenta');
      return;
    }

    loginUser(name.trim(), avatar, location.trim(), pin.trim());
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
      `¡Hola amor! 💕 Esta es nuestra casita virtual en Hazel. Entra en https://hazelapp-ashy.vercel.app/ e ingresa este código: ${currentCode}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEnterCreatedRoom = () => {
    joinCoupleByCode(currentCode);
  };

  // Verificar si la pareja 2 ya está registrada en la casita encontrada
  const isPartner2Registered = Boolean(
    foundCasita?.couple_data?.partner2?.name &&
    foundCasita.couple_data.partner2.name !== 'Mi Pareja' &&
    foundCasita.couple_data.partner2.statusMessage !== 'Esperando conectarse 💖'
  );

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
                  <span>Modo Local (Sin Base de Datos)</span>
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
            <span>Entrar a Casita</span>
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
          {/* ================= MODE 1: ENTRAR A CASITA EXISTENTE ================= */}
          {mode === 'login' && !foundCasita && (
            <form onSubmit={handleSearchCasita} className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <LogIn className="w-4 h-4 text-rose-500" />
                  <span>Entrar con Código de Casita</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ingresa tu código de pareja para acceder a tu cuenta individual
                </p>
              </div>

              {/* Couple Code Input */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-2xl border border-rose-200/80 space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 block text-center">
                  Código de tu Casita:
                </label>
                <input
                  type="text"
                  value={coupleCodeInput}
                  onChange={(e) => setCoupleCodeInput(e.target.value.toUpperCase())}
                  placeholder="HAZEL-XXXX"
                  className="w-full px-3.5 py-3 text-center text-lg font-mono tracking-wider uppercase border border-rose-300 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-black text-rose-700 shadow-inner"
                  required
                />
                <p className="text-[10px] text-stone-500 text-center">
                  Ejemplo: <strong>HAZEL-LOVE4727</strong> o el código que te compartió tu pareja.
                </p>
              </div>

              {errorMessage && (
                <p className="text-[11px] text-red-600 text-center font-bold bg-red-50 p-2.5 rounded-xl border border-red-200 leading-relaxed">
                  {errorMessage}
                </p>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={!coupleCodeInput.trim() || isSearching}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center space-x-2 transition-transform active:scale-98"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Buscando Casita en Supabase...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Buscar Mi Casita</span>
                    </>
                  )}
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

          {/* ================= SUB-PASO 2: SELECCIÓN DE CUENTA INDIVIDUAL & PIN ================= */}
          {mode === 'login' && foundCasita && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🏡</span>
                  <div>
                    <h3 className="text-xs font-black text-stone-800">
                      Casita <span className="font-mono text-rose-600">{foundCasita.id}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500">¿Quién está entrando a la casita?</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFoundCasita(null);
                    setSelectedRole(null);
                    setErrorMessage('');
                  }}
                  className="text-[10px] text-rose-600 hover:underline flex items-center space-x-0.5 font-bold"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Otro código</span>
                </button>
              </div>

              {/* Selector de Perfiles */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-stone-600">
                  Selecciona tu cuenta (cada uno tiene su propio acceso):
                </p>

                {/* Tarjeta Jugador 1 (Anfitrión) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('partner1');
                    setErrorMessage('');
                    setLoginPin('');
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedRole === 'partner1'
                      ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                      : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-2xl shadow-xs">
                      {foundCasita.couple_data.partner1.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                        <span>{foundCasita.couple_data.partner1.name}</span>
                        <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">
                          Jugador 1
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        {foundCasita.couple_data.partner1.location || 'Anfitrión de la casita'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-stone-400">
                    <Lock className="w-3.5 h-3.5 text-stone-400 mr-1" />
                    <span className="text-[10px] font-bold text-stone-500">Soy yo</span>
                  </div>
                </button>

                {/* Tarjeta Jugador 2 (Pareja Registrada O Disponible) */}
                {isPartner2Registered ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('partner2');
                      setErrorMessage('');
                      setLoginPin('');
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      selectedRole === 'partner2'
                        ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-xs">
                        {foundCasita.couple_data.partner2.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                          <span>{foundCasita.couple_data.partner2.name}</span>
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                            Jugador 2
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">
                          {foundCasita.couple_data.partner2.location || 'Pareja vinculada'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-stone-400">
                      <Lock className="w-3.5 h-3.5 text-stone-400 mr-1" />
                      <span className="text-[10px] font-bold text-stone-500">Soy yo</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('new_partner2');
                      setErrorMessage('');
                    }}
                    className={`w-full p-3 rounded-2xl border-2 border-dashed text-left flex items-center justify-between transition-all ${
                      selectedRole === 'new_partner2'
                        ? 'bg-pink-50 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                        : 'bg-white border-rose-200 hover:bg-rose-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200 flex items-center justify-center text-2xl shadow-xs">
                        ✨
                      </div>
                      <div>
                        <div className="text-xs font-black text-rose-700 flex items-center gap-1.5">
                          <span>¡Unirme como Pareja!</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                            Disponible
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">
                          {foundCasita.couple_data.partner1.name} te está esperando
                        </div>
                      </div>
                    </div>
                    <UserPlus className="w-4 h-4 text-rose-500" />
                  </button>
                )}
              </div>

              {/* Formulario de PIN si seleccionó Partner 1 o Partner 2 existente */}
              {(selectedRole === 'partner1' || selectedRole === 'partner2') && (
                <form onSubmit={handleExistingPartnerLogin} className="p-3.5 bg-stone-100/80 rounded-2xl border border-stone-200 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        PIN de acceso para {foundCasita.couple_data[selectedRole].name}:
                      </span>
                    </label>
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="PIN de 4 dígitos (ej: 1234)"
                    className="w-full px-3.5 py-2.5 text-center text-base tracking-widest font-mono border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-black text-stone-800 shadow-inner"
                    required
                    autoFocus
                  />
                  <p className="text-[10px] text-stone-500 text-center">
                    Cada pareja tiene su propio PIN personal. Nadie más puede acceder a tu cuenta.
                  </p>

                  <button
                    type="submit"
                    disabled={!loginPin.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 transition-transform active:scale-98"
                  >
                    <span>Entrar como {foundCasita.couple_data[selectedRole].name}</span>
                  </button>
                </form>
              )}

              {/* Formulario de Registro para Pareja 2 si aún no está registrada */}
              {selectedRole === 'new_partner2' && (
                <form onSubmit={handleRegisterPartner2} className="p-3.5 bg-gradient-to-br from-rose-50/70 to-pink-50/70 rounded-2xl border border-rose-200 space-y-3 animate-in fade-in">
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">
                      Configura tu Perfil de Jugador 2:
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      Te unirás a la casita de <strong>{foundCasita.couple_data.partner1.name}</strong>
                    </p>
                  </div>

                  {/* Avatar Selector */}
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-1">
                      Elige tu Avatar Emoji:
                    </label>
                    <div className="grid grid-cols-6 gap-1">
                      {AVATARS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setP2Avatar(em)}
                          className={`h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                            p2Avatar === em
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
                    <label className="text-[10px] font-bold text-stone-600 block mb-0.5">
                      Tu Nombre o Apodo:
                    </label>
                    <input
                      type="text"
                      value={p2Name}
                      onChange={(e) => setP2Name(e.target.value)}
                      placeholder="Ej: Camila, Mateo..."
                      className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold"
                      required
                    />
                  </div>

                  {/* Location Input */}
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-0.5">
                      Tu Ciudad / País:
                    </label>
                    <input
                      type="text"
                      value={p2Location}
                      onChange={(e) => setP2Location(e.target.value)}
                      placeholder="Ej: Buenos Aires, Argentina"
                      className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
                    />
                  </div>

                  {/* PIN Input */}
                  <div>
                    <label className="text-[10px] font-bold text-stone-700 block mb-0.5 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-500" />
                      <span>Crea tu PIN de 4 dígitos:</span>
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={p2Pin}
                      onChange={(e) => setP2Pin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ej: 5678"
                      className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-black text-stone-800"
                      required
                    />
                    <p className="text-[9px] text-stone-500 mt-0.5">
                      Este PIN asegurará que solo tú puedas entrar a tu perfil de Jugador 2.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!p2Name.trim() || p2Pin.length < 4 || isSearching}
                    className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-200 transition-transform active:scale-98"
                  >
                    <span>¡Unirme a la Casita como Jugador 2! 💕</span>
                  </button>
                </form>
              )}

              {errorMessage && (
                <p className="text-[11px] text-red-600 text-center font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {errorMessage}
                </p>
              )}
            </div>
          )}

          {/* ================= MODE 2: CREAR NUEVA CASITA (JUGADOR 1) ================= */}
          {mode === 'create' && createStep === 'profile' && (
            <form onSubmit={handleCreateProfileSubmit} className="space-y-3.5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>Crear Nueva Casita</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Configura tu perfil como <strong>Jugador 1 (Anfitrión)</strong> y tu PIN personal
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

              {/* PIN Input */}
              <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200">
                <label className="text-[11px] font-bold text-rose-900 block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Crea tu PIN de seguridad (4 dígitos):</span>
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej: 1234"
                  className="w-full px-3.5 py-2 text-center text-sm font-mono tracking-widest border border-rose-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 font-black text-rose-700 shadow-inner"
                  required
                />
                <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                  🔒 Este PIN protegerá tu cuenta para que solo tú puedas entrar como Jugador 1.
                </p>
              </div>

              {errorMessage && (
                <p className="text-[11px] text-red-500 text-center font-bold">{errorMessage}</p>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={!name.trim() || pin.length < 4}
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
                  Tú eres el <strong>Jugador 1 (Anfitrión)</strong>. Comparte este código con tu pareja:
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-3xl p-4 text-center space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                  Código Único de Casita
                </span>
                <div className="text-2xl font-black text-stone-800 tracking-wider font-mono py-1.5 px-3 bg-white rounded-2xl border border-rose-200 shadow-inner">
                  {currentCode}
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Tu pareja solo debe entrar a Hazel, ingresar este código y configurar su perfil como <strong>Jugador 2</strong> con su propio PIN.
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
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tu sesión como Jugador 1 está protegida con tu PIN personal.</span>
              </div>

              <button
                type="button"
                onClick={handleEnterCreatedRoom}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center space-x-1.5 transition-transform active:scale-98"
              >
                <span>Entrar a Mi Casita</span>
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
