import React from 'react';
import { FurnitureItem, PlacedFurniture } from '../../types/house';

interface FurnitureVectorProps {
  item: FurnitureItem;
  placed?: PlacedFurniture;
}

export const FurnitureVector: React.FC<FurnitureVectorProps> = ({ item, placed }) => {
  const isOn = placed?.state?.isOn ?? true;
  const photoUrl = placed?.customPhotoUrl;

  switch (item.svgType) {
    // ==========================================
    // 🧱 WALL DECORATIONS
    // ==========================================
    case 'wall_mirror_sun':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Sun rays */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="12"
                x2="50"
                y2="24"
                stroke="#D4AF37"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="26" fill="#F4E0A5" stroke="#D4AF37" strokeWidth="4" />
            <circle cx="50" cy="50" r="21" fill="#E8F4F8" />
            <path d="M 38,40 Q 50,32 62,40" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.8" />
            <text x="44" y="56" fontSize="12">✨</text>
          </svg>
        </div>
      );

    case 'wall_clock_cuckoo':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Wooden house shape */}
            <polygon points="50,15 80,38 20,38" fill="#7F5539" stroke="#582F0E" strokeWidth="2" />
            <rect x="25" y="38" width="50" height="42" rx="3" fill="#9C6644" stroke="#582F0E" strokeWidth="2" />
            {/* Clock Face */}
            <circle cx="50" cy="58" r="14" fill="#FFFDF9" stroke="#582F0E" strokeWidth="2" />
            <line x1="50" y1="58" x2="50" y2="49" stroke="#2B2D42" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="58" x2="57" y2="58" stroke="#E63946" strokeWidth="1.5" strokeLinecap="round" />
            {/* Pendulum */}
            <line x1="50" y1="80" x2="50" y2="94" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="50" cy="94" r="4" fill="#D4AF37" />
            <text x="44" y="34" fontSize="10">🐦</text>
          </svg>
        </div>
      );

    case 'wall_tapestry_moon':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 140 100" className="w-full h-full">
            {/* Wooden Rod & Hanging Cord */}
            <line x1="70" y1="10" x2="20" y2="22" stroke="#8D6E63" strokeWidth="1.5" />
            <line x1="70" y1="10" x2="120" y2="22" stroke="#8D6E63" strokeWidth="1.5" />
            <rect x="15" y="20" width="110" height="5" rx="2.5" fill="#7F5539" />
            {/* Macrame woven banner */}
            <polygon points="25,25 115,25 115,65 70,85 25,65" fill="#FDF8F0" stroke="#E6CCB2" strokeWidth="2" />
            {/* Moon phases icons */}
            <text x="35" y="48" fontSize="10">🌒</text>
            <text x="50" y="48" fontSize="12">🌓</text>
            <text x="65" y="48" fontSize="14">🌕</text>
            <text x="82" y="48" fontSize="12">🌗</text>
            <text x="96" y="48" fontSize="10">🌘</text>
            {/* Fringes hanging down */}
            {[35, 45, 55, 65, 75, 85, 95, 105].map((x) => (
              <line key={x} x1={x} y1="65" x2={x} y2="92" stroke="#DDB892" strokeWidth="1.5" strokeDasharray="3,2" />
            ))}
          </svg>
        </div>
      );

    case 'wall_shelf_plants':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 140 90" className="w-full h-full">
            {/* Floating wooden board */}
            <rect x="15" y="55" width="110" height="8" rx="2" fill="#DDB892" stroke="#9C6644" strokeWidth="2" />
            {/* Shelf Brackets */}
            <path d="M 28,63 L 28,78 L 38,63" fill="none" stroke="#7F5539" strokeWidth="2" />
            <path d="M 112,63 L 112,78 L 102,63" fill="none" stroke="#7F5539" strokeWidth="2" />
            {/* Plants & Books on Shelf */}
            <rect x="25" y="32" width="7" height="23" rx="1" fill="#E63946" />
            <rect x="33" y="35" width="6" height="20" rx="1" fill="#457B9D" />
            <rect x="40" y="30" width="8" height="25" rx="1" fill="#2A9D8F" />
            {/* Little cactus pot */}
            <rect x="60" y="44" width="14" height="11" rx="2" fill="#E07A5F" />
            <text x="61" y="40" fontSize="12">🌵</text>
            {/* Love letter in bottle */}
            <text x="88" y="50" fontSize="14">💌</text>
            <text x="106" y="50" fontSize="12">🌱</text>
          </svg>
        </div>
      );

    case 'wall_neon_love':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 150 80" className="w-full h-full">
            {/* Acrylic Backing */}
            <rect x="15" y="15" width="120" height="50" rx="16" fill="#1A181B" opacity="0.85" />
            {/* Glowing Neon Sign */}
            <g className={isOn ? 'animate-pulse' : 'opacity-40'}>
              <path
                d="M 30,45 Q 40,25 50,45 Q 60,65 70,45 Q 85,25 95,45 Q 110,30 120,45"
                fill="none"
                stroke={isOn ? '#FF4D6D' : '#888'}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <text x="35" y="46" fill="#FFF0F3" fontSize="12" fontWeight="bold" fontFamily="Caveat, cursive">
                better together
              </text>
              <circle cx="124" cy="32" r="4" fill="#FF758F" />
              <text x="118" y="36" fontSize="10">❤️</text>
            </g>
          </svg>
        </div>
      );

    case 'wall_art_constellations':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="12" y="12" width="76" height="76" rx="6" fill="#0B132B" stroke="#D4AF37" strokeWidth="4" />
            {/* Star circle */}
            <circle cx="50" cy="50" r="28" fill="#1C2541" stroke="#48CAE4" strokeWidth="1" strokeDasharray="3,3" />
            {/* Constellation lines */}
            <line x1="38" y1="40" x2="50" y2="35" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="50" y1="35" x2="62" y2="45" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="62" y1="45" x2="55" y2="62" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="55" y1="62" x2="42" y2="58" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Stars */}
            <circle cx="38" cy="40" r="2.5" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="50" cy="35" r="3" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="62" cy="45" r="2.5" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="55" cy="62" r="3" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="42" cy="58" r="2" fill="#FFEAA7" className="animate-pulse" />
            <text x="35" y="80" fontSize="7" fill="#E0FBFC" fontStyle="italic">Luna & Mateo</text>
          </svg>
        </div>
      );

    case 'wall_fairy_curtain':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 180 90" className="w-full h-full">
            <line x1="10" y1="12" x2="170" y2="12" stroke="#B08968" strokeWidth="3" strokeLinecap="round" />
            {[25, 50, 75, 100, 125, 155].map((x, colIdx) => (
              <g key={colIdx}>
                <line x1={x} y1="14" x2={x} y2="85" stroke="#E9D8A6" strokeWidth="1" strokeDasharray="2,2" />
                {[25, 42, 58, 75].map((y, rowIdx) => (
                  <g key={rowIdx}>
                    <circle
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill={isOn ? '#FFD166' : '#CCC'}
                      className={isOn ? 'animate-pulse' : ''}
                    />
                    {isOn && <circle cx={x} cy={y} r="6" fill="#FFE29A" opacity="0.3" />}
                  </g>
                ))}
              </g>
            ))}
          </svg>
        </div>
      );

    // ==========================================
    // ☕ CAFÉ, MÚSICA, SETUP & RELAX
    // ==========================================
    case 'decor_coffee_corner':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="88" rx="40" ry="7" fill="#EADCD5" />
            {/* Wooden Counter */}
            <rect x="15" y="55" width="70" height="32" rx="4" fill="#7F5539" stroke="#582F0E" strokeWidth="2" />
            {/* Espresso Machine */}
            <rect x="25" y="24" width="34" height="32" rx="4" fill="#E63946" stroke="#BA181B" strokeWidth="2" />
            <rect x="28" y="28" width="28" height="12" rx="2" fill="#2B2D42" />
            {/* Steam wand & Portafilter */}
            <line x1="42" y1="40" x2="42" y2="48" stroke="#D4AF37" strokeWidth="2" />
            <rect x="37" y="47" width="10" height="3" fill="#D4AF37" />
            {/* Two Sweet Coffee Mugs */}
            <rect x="64" y="42" width="10" height="12" rx="2" fill="#FFB7B2" />
            <rect x="76" y="42" width="10" height="12" rx="2" fill="#B5EAD7" />
            {/* Steam clouds */}
            <text x="36" y="20" fontSize="10" className="animate-bounce-slow">♨️</text>
            <text x="68" y="38" fontSize="8" className="animate-pulse">☕</text>
          </svg>
        </div>
      );

    case 'decor_piano_upright':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 150 140" className="w-full h-full">
            <ellipse cx="75" cy="130" rx="65" ry="8" fill="#EADCD5" />
            {/* Piano Body */}
            <rect x="20" y="20" width="110" height="105" rx="6" fill="#3D2619" stroke="#25160E" strokeWidth="3" />
            {/* Upper front panel */}
            <rect x="25" y="25" width="100" height="40" rx="3" fill="#583724" />
            {/* Music Stand & Sheet with Hearts */}
            <rect x="55" y="35" width="40" height="24" rx="2" fill="#FFFDF9" stroke="#DDB892" strokeWidth="1.5" />
            <text x="65" y="52" fontSize="12">🎶</text>
            {/* Keyboard Bed */}
            <rect x="15" y="65" width="120" height="18" rx="3" fill="#25160E" />
            {/* White keys */}
            <rect x="20" y="68" width="110" height="12" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
            {/* Black keys */}
            {[26, 34, 46, 54, 62, 74, 82, 94, 102, 110, 122].map((x) => (
              <rect key={x} x={x} y="68" width="5" height="7" fill="#1F2937" />
            ))}
            {/* Legs */}
            <rect x="22" y="83" width="8" height="45" rx="2" fill="#25160E" />
            <rect x="120" y="83" width="8" height="45" rx="2" fill="#25160E" />
            {/* Golden Pedals */}
            <rect x="68" y="122" width="5" height="5" fill="#D4AF37" />
            <rect x="77" y="122" width="5" height="5" fill="#D4AF37" />
          </svg>
        </div>
      );

    case 'decor_vinyl_stand':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="88" rx="38" ry="7" fill="#EADCD5" />
            {/* Wooden crate */}
            <rect x="20" y="45" width="60" height="40" rx="3" fill="#9C6644" stroke="#7F5539" strokeWidth="2" />
            {/* Slat Lines */}
            <line x1="20" y1="58" x2="80" y2="58" stroke="#7F5539" strokeWidth="2" />
            <line x1="20" y1="71" x2="80" y2="71" stroke="#7F5539" strokeWidth="2" />
            {/* Vinyl record sleeves poking out */}
            <rect x="26" y="24" width="22" height="26" rx="2" fill="#FF8FAB" transform="rotate(-8 37 37)" />
            <rect x="42" y="22" width="22" height="26" rx="2" fill="#84DCC6" transform="rotate(4 53 35)" />
            <rect x="58" y="25" width="20" height="25" rx="2" fill="#FFD166" transform="rotate(12 68 37)" />
            <circle cx="53" cy="35" r="5" fill="#2B2D42" />
            <text x="32" y="38" fontSize="10">🎵</text>
          </svg>
        </div>
      );

    case 'decor_gaming_setup':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 150 100" className="w-full h-full">
            <ellipse cx="75" cy="90" rx="65" ry="7" fill="#EADCD5" />
            {/* Desk */}
            <rect x="15" y="45" width="120" height="10" rx="3" fill="#2B2D42" />
            <rect x="20" y="55" width="6" height="34" fill="#1D1E2C" />
            <rect x="124" y="55" width="6" height="34" fill="#1D1E2C" />
            {/* Left Screen (Pink theme) */}
            <rect x="25" y="16" width="42" height="27" rx="3" fill="#FFCCD5" stroke="#FF758F" strokeWidth="2" />
            <text x="38" y="34" fontSize="14">🎮</text>
            {/* Right Screen (Matcha/Sky theme) */}
            <rect x="83" y="16" width="42" height="27" rx="3" fill="#D8F3DC" stroke="#52B788" strokeWidth="2" />
            <text x="96" y="34" fontSize="14">🕹️</text>
            {/* Couple Headsets with Cat Ears */}
            <polygon points="30,12 34,4 40,12" fill="#FF758F" />
            <polygon points="46,12 52,4 56,12" fill="#FF758F" />
            <polygon points="88,12 92,4 98,12" fill="#52B788" />
            <polygon points="104,12 110,4 114,12" fill="#52B788" />
            {/* RGB glow bar */}
            <line x1="20" y1="46" x2="130" y2="46" stroke="#C77DFF" strokeWidth="2" className="animate-pulse" />
          </svg>
        </div>
      );

    case 'decor_diffuser':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 70 100" className="w-full h-full">
            <ellipse cx="35" cy="90" rx="22" ry="6" fill="#EADCD5" />
            {/* Ceramic Diffuser Vase */}
            <path d="M 22,88 Q 12,65 26,45 L 30,30 L 40,30 L 44,45 Q 58,65 48,88 Z" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="2" />
            {/* Wood Base Ring */}
            <ellipse cx="35" cy="86" rx="14" ry="4" fill="#DDB892" />
            {/* Glowing Ring */}
            <line x1="20" y1="65" x2="50" y2="65" stroke={isOn ? '#FFB7B2' : '#CED4DA'} strokeWidth="3" className="animate-pulse" />
            {/* Heart Aroma Vapors */}
            {isOn && (
              <g className="animate-bounce-slow">
                <text x="30" y="24" fontSize="10">🌸</text>
                <text x="32" y="12" fontSize="8">💕</text>
              </g>
            )}
          </svg>
        </div>
      );

    case 'kitchen_pancake_station':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="85" rx="38" ry="8" fill="#EADCD5" />
            {/* Ceramic plate */}
            <ellipse cx="50" cy="75" rx="38" ry="12" fill="#FFFFFF" stroke="#FFCCD5" strokeWidth="2.5" />
            {/* Stack of fluffy pancakes */}
            <ellipse cx="50" cy="70" rx="28" ry="8" fill="#F4A261" stroke="#E76F51" strokeWidth="1.5" />
            <ellipse cx="50" cy="63" rx="27" ry="8" fill="#F4A261" stroke="#E76F51" strokeWidth="1.5" />
            <ellipse cx="50" cy="56" rx="26" ry="8" fill="#F4A261" stroke="#E76F51" strokeWidth="1.5" />
            <ellipse cx="50" cy="49" rx="25" ry="8" fill="#F6BD60" stroke="#E76F51" strokeWidth="1.5" />
            {/* Melting Butter & Strawberries */}
            <rect x="44" y="42" width="12" height="8" rx="2" fill="#FFE66D" />
            <text x="32" y="45" fontSize="12">🍓</text>
            <text x="56" y="45" fontSize="10">🍯</text>
            <text x="44" y="32" fontSize="12" className="animate-bounce-slow">✨</text>
          </svg>
        </div>
      );

    case 'kitchen_fridge_retro':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 100 140" className="w-full h-full">
            <ellipse cx="50" cy="132" rx="38" ry="6" fill="#EADCD5" />
            {/* Pastel Mint/Pink Fridge Body */}
            <rect x="18" y="15" width="64" height="115" rx="14" fill="#B5EAD7" stroke="#7BCBAF" strokeWidth="3" />
            {/* Door seam */}
            <line x1="18" y1="52" x2="82" y2="52" stroke="#7BCBAF" strokeWidth="2.5" />
            {/* Chrome handles */}
            <rect x="24" y="36" width="4" height="12" rx="2" fill="#FFFFFF" stroke="#CED4DA" strokeWidth="1" />
            <rect x="24" y="58" width="4" height="18" rx="2" fill="#FFFFFF" stroke="#CED4DA" strokeWidth="1" />
            {/* Polaroids & Cute Magnets on Fridge */}
            <rect x="42" y="24" width="16" height="18" rx="1" fill="#FFFFFF" transform="rotate(-5 50 33)" />
            <text x="44" y="36" fontSize="8">❤️</text>
            <rect x="46" y="66" width="22" height="26" rx="1" fill="#FFFFFF" transform="rotate(4 57 79)" />
            <text x="50" y="80" fontSize="10">📸</text>
            <text x="35" y="75" fontSize="10">🥑</text>
            <text x="35" y="95" fontSize="10">💌</text>
          </svg>
        </div>
      );

    case 'plant_terrarium':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 90 100" className="w-full h-full">
            <ellipse cx="45" cy="88" rx="28" ry="6" fill="#EADCD5" />
            {/* Geometric Glass Container */}
            <polygon points="45,15 75,38 68,85 22,85 15,38" fill="#E8F4F8" stroke="#48CAE4" strokeWidth="2" opacity="0.9" />
            {/* Earth & Moss Base */}
            <path d="M 22,85 L 25,68 Q 45,62 65,68 L 68,85 Z" fill="#6C584C" />
            <ellipse cx="45" cy="68" rx="18" ry="6" fill="#52B788" />
            {/* Plants & Fairy Lights inside */}
            <text x="32" y="60" fontSize="14">🌱</text>
            <text x="46" y="58" fontSize="12">🌵</text>
            <circle cx="36" cy="40" r="2.5" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="54" cy="45" r="2.5" fill="#FFEAA7" className="animate-pulse" />
          </svg>
        </div>
      );

    case 'pet_shiba_inu':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md animate-wiggle">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            <ellipse cx="50" cy="70" rx="35" ry="7" fill="#EADCD5" />
            {/* Shiba Body */}
            <ellipse cx="48" cy="52" rx="28" ry="18" fill="#E76F51" stroke="#D45B3D" strokeWidth="2" />
            <ellipse cx="46" cy="56" rx="18" ry="10" fill="#FFFDF9" />
            {/* Head */}
            <circle cx="70" cy="38" r="16" fill="#E76F51" stroke="#D45B3D" strokeWidth="2" />
            <ellipse cx="70" cy="44" rx="10" ry="8" fill="#FFFDF9" />
            {/* Ears */}
            <polygon points="62,28 66,12 73,24" fill="#D45B3D" />
            <polygon points="73,24 80,12 84,28" fill="#D45B3D" />
            {/* Face */}
            <circle cx="66" cy="36" r="2" fill="#1D2A44" />
            <circle cx="76" cy="36" r="2" fill="#1D2A44" />
            <ellipse cx="71" cy="41" rx="3" ry="2" fill="#1D2A44" />
            {/* Curled Tail */}
            <path d="M 22,50 Q 15,35 28,38" fill="none" stroke="#E76F51" strokeWidth="6" strokeLinecap="round" />
            <text x="55" y="22" fontSize="12">💤</text>
          </svg>
        </div>
      );

    case 'pet_hamster':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-sm">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <ellipse cx="40" cy="72" rx="26" ry="5" fill="#EADCD5" />
            {/* Hamster Wheel Frame */}
            <circle cx="40" cy="40" r="30" fill="none" stroke="#84DCC6" strokeWidth="3" />
            <line x1="40" y1="40" x2="40" y2="70" stroke="#84DCC6" strokeWidth="2" />
            {/* Little Round Hamster */}
            <ellipse cx="40" cy="50" rx="14" ry="12" fill="#F4A261" stroke="#E76F51" strokeWidth="1.5" />
            <ellipse cx="40" cy="53" rx="9" ry="7" fill="#FFFFFF" />
            <circle cx="46" cy="46" r="1.5" fill="#2B2D42" />
            <polygon points="48,49 50,49 49,51" fill="#FF8FAB" />
            {/* Tiny Ears */}
            <circle cx="34" cy="40" r="3" fill="#FFCCD5" />
            <circle cx="42" cy="40" r="3" fill="#FFCCD5" />
            <text x="46" y="58" fontSize="8">🌻</text>
          </svg>
        </div>
      );

    case 'balcony_star_bench':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 150 100" className="w-full h-full">
            <ellipse cx="75" cy="90" rx="65" ry="7" fill="#EADCD5" />
            {/* Wicker Bench Frame */}
            <rect x="20" y="35" width="110" height="40" rx="6" fill="#DDB892" stroke="#9C6644" strokeWidth="2" />
            {/* Slats */}
            <line x1="20" y1="52" x2="130" y2="52" stroke="#9C6644" strokeWidth="2" />
            {/* Cozy Blankets & Pillows */}
            <rect x="28" y="42" width="94" height="18" rx="6" fill="#FFCCD5" />
            <circle cx="45" cy="48" r="8" fill="#FFF" />
            <text x="40" y="52" fontSize="10">🌸</text>
            <circle cx="105" cy="48" r="8" fill="#FFF" />
            <text x="100" y="52" fontSize="10">✨</text>
            {/* Bench legs */}
            <rect x="25" y="75" width="6" height="16" rx="2" fill="#7F5539" />
            <rect x="119" y="75" width="6" height="16" rx="2" fill="#7F5539" />
            {/* Warm Lantern sitting beside */}
            <text x="125" y="72" fontSize="14" className="animate-pulse">🏮</text>
          </svg>
        </div>
      );

    case 'garden_fountain':
      return (
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 140 140" className="w-full h-full">
            <ellipse cx="70" cy="125" rx="60" ry="10" fill="#EADCD5" />
            {/* Base Pond */}
            <ellipse cx="70" cy="115" rx="55" ry="18" fill="#48CAE4" stroke="#6C757D" strokeWidth="4" />
            <ellipse cx="70" cy="115" rx="46" ry="12" fill="#90E0EF" />
            {/* Center Pedestal */}
            <rect x="63" y="60" width="14" height="50" rx="3" fill="#ADB5BD" stroke="#6C757D" strokeWidth="2" />
            {/* Upper Tier Bowl */}
            <ellipse cx="70" cy="60" rx="32" ry="10" fill="#48CAE4" stroke="#6C757D" strokeWidth="3" />
            <ellipse cx="70" cy="60" rx="26" ry="6" fill="#90E0EF" />
            {/* Top Spout */}
            <rect x="66" y="35" width="8" height="25" rx="2" fill="#ADB5BD" />
            <text x="63" y="32" fontSize="14" className="animate-bounce-slow">💧</text>
            {/* Floating Water Lilies */}
            <text x="42" y="120" fontSize="12">🪷</text>
            <text x="88" y="120" fontSize="12">🪷</text>
          </svg>
        </div>
      );

    // ==========================================
    // 🛋️ CLASSIC COZY ITEMS
    // ==========================================
    case 'sofa_cloud':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 160 100" className="w-full h-full">
            <ellipse cx="80" cy="85" rx="65" ry="12" fill="#EADCD5" />
            <path d="M 25,60 C 25,25 50,15 80,15 C 110,15 135,25 135,60 Z" fill="#FFAAA6" />
            <path d="M 35,55 C 35,28 55,20 80,20 C 105,20 125,28 125,55 Z" fill="#FFB7B2" />
            <rect x="25" y="48" width="52" height="32" rx="14" fill="#FFC6C2" stroke="#FFAAA6" strokeWidth="2" />
            <rect x="83" y="48" width="52" height="32" rx="14" fill="#FFC6C2" stroke="#FFAAA6" strokeWidth="2" />
            <rect x="16" y="42" width="22" height="36" rx="11" fill="#FFAAA6" />
            <rect x="122" y="42" width="22" height="36" rx="11" fill="#FFAAA6" />
            <rect x="36" y="40" width="24" height="24" rx="6" fill="#FFF1C5" transform="rotate(-10 48 52)" />
            <text x="44" y="56" fontSize="12">❤️</text>
            <rect x="100" y="40" width="24" height="24" rx="6" fill="#E2F0CB" transform="rotate(10 112 52)" />
            <text x="108" y="56" fontSize="12">✨</text>
            <rect x="32" y="78" width="6" height="12" rx="2" fill="#C89F81" />
            <rect x="122" y="78" width="6" height="12" rx="2" fill="#C89F81" />
          </svg>
        </div>
      );

    case 'armchair_cozy':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="85" rx="38" ry="10" fill="#EADCD5" />
            <path d="M 20,55 C 20,25 35,18 50,18 C 65,18 80,25 80,55 Z" fill="#F6BD60" />
            <rect x="22" y="48" width="56" height="32" rx="12" fill="#F7C575" stroke="#E09F3E" strokeWidth="2" />
            <rect x="12" y="44" width="16" height="32" rx="8" fill="#E09F3E" />
            <rect x="72" y="44" width="16" height="32" rx="8" fill="#E09F3E" />
            <circle cx="50" cy="58" r="12" fill="#FFF" />
            <text x="44" y="62" fontSize="10">🌸</text>
            <rect x="26" y="78" width="5" height="12" rx="2" fill="#8C5835" />
            <rect x="69" y="78" width="5" height="12" rx="2" fill="#8C5835" />
          </svg>
        </div>
      );

    case 'beanbag':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="82" rx="40" ry="10" fill="#EADCD5" />
            <ellipse cx="50" cy="55" rx="38" ry="32" fill="#C6A0F6" />
            <ellipse cx="50" cy="48" rx="28" ry="22" fill="#D7BEF9" />
            <circle cx="50" cy="24" r="6" fill="#A57BE2" />
            <text x="44" y="55" fontSize="16">☁️</text>
          </svg>
        </div>
      );

    case 'hammock':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 150 100" className="w-full h-full">
            <path d="M 20,30 Q 75,85 130,30" fill="#FDF8F0" stroke="#DDB892" strokeWidth="4" />
            <circle cx="75" cy="58" r="14" fill="#FFCCD5" />
            <text x="70" y="63" fontSize="12">💖</text>
          </svg>
        </div>
      );

    case 'bed_canopy':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 180 150" className="w-full h-full">
            <ellipse cx="90" cy="138" rx="80" ry="12" fill="#EADCD5" />
            <rect x="25" y="60" width="130" height="75" rx="8" fill="#DDB892" stroke="#B08968" strokeWidth="3" />
            <rect x="25" y="35" width="130" height="35" rx="6" fill="#B08968" />
            <rect x="30" y="65" width="120" height="65" rx="6" fill="#FFFFFF" />
            <path d="M 30,85 Q 90,95 150,85 L 150,130 Q 90,135 30,130 Z" fill="#FFCCD5" />
            <path d="M 30,85 Q 90,95 150,85 L 150,95 Q 90,105 30,95 Z" fill="#FFB3C1" />
            <rect x="40" y="48" width="42" height="26" rx="6" fill="#FFF0F3" stroke="#FFCCD5" strokeWidth="1.5" />
            <rect x="98" y="48" width="42" height="26" rx="6" fill="#FFF0F3" stroke="#FFCCD5" strokeWidth="1.5" />
            <text x="56" y="65" fontSize="12">💤</text>
            <text x="114" y="65" fontSize="12">💖</text>
            <rect x="22" y="10" width="6" height="130" rx="3" fill="#7F5539" />
            <rect x="152" y="10" width="6" height="130" rx="3" fill="#7F5539" />
            <rect x="22" y="10" width="136" height="6" rx="3" fill="#7F5539" />
            <path d="M 25,12 Q 50,40 35,90" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity="0.85" />
            <path d="M 155,12 Q 130,40 145,90" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity="0.85" />
            <circle cx="45" cy="13" r="3" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="75" cy="13" r="3" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="105" cy="13" r="3" fill="#FFEAA7" className="animate-pulse" />
            <circle cx="135" cy="13" r="3" fill="#FFEAA7" className="animate-pulse" />
          </svg>
        </div>
      );

    case 'bed_wood':
    case 'futon':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 150 120" className="w-full h-full">
            <ellipse cx="75" cy="110" rx="65" ry="8" fill="#EADCD5" />
            <rect x="20" y="35" width="110" height="75" rx="6" fill="#DDB892" stroke="#9C6644" strokeWidth="3" />
            <rect x="25" y="42" width="100" height="65" rx="4" fill="#FFFFFF" />
            <path d="M 25,65 L 125,65 L 125,107 L 25,107 Z" fill="#B5EAD7" />
            <rect x="35" y="46" width="32" height="18" rx="4" fill="#FFF" stroke="#E2F0CB" strokeWidth="1" />
            <rect x="83" y="46" width="32" height="18" rx="4" fill="#FFF" stroke="#E2F0CB" strokeWidth="1" />
            <text x="48" y="60" fontSize="10">🌿</text>
            <text x="96" y="60" fontSize="10">☕</text>
          </svg>
        </div>
      );

    case 'table_tea':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 90" className="w-full h-full">
            <ellipse cx="50" cy="78" rx="38" ry="8" fill="#EADCD5" />
            <ellipse cx="50" cy="45" rx="38" ry="18" fill="#E6CCB2" stroke="#B08968" strokeWidth="2.5" />
            <ellipse cx="50" cy="43" rx="34" ry="15" fill="#EDE0D4" />
            <rect x="25" y="45" width="5" height="32" rx="2" fill="#7F5539" />
            <rect x="70" y="45" width="5" height="32" rx="2" fill="#7F5539" />
            <ellipse cx="40" cy="40" rx="8" ry="4" fill="#FF8FAB" />
            <text x="36" y="38" fontSize="8">☕</text>
            <ellipse cx="60" cy="40" rx="8" ry="4" fill="#84DCC6" />
            <text x="56" y="38" fontSize="8">🍵</text>
            <text x="45" y="28" fontSize="10" className="animate-bounce-slow">✨</text>
          </svg>
        </div>
      );

    case 'desk_couple':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 160 100" className="w-full h-full">
            <ellipse cx="80" cy="90" rx="70" ry="8" fill="#EADCD5" />
            <rect x="15" y="40" width="130" height="14" rx="4" fill="#DDB892" stroke="#9C6644" strokeWidth="2" />
            <rect x="20" y="54" width="6" height="35" rx="2" fill="#7F5539" />
            <rect x="134" y="54" width="6" height="35" rx="2" fill="#7F5539" />
            <rect x="77" y="54" width="6" height="35" rx="2" fill="#7F5539" />
            <rect x="30" y="15" width="38" height="24" rx="3" fill="#495057" stroke="#212529" strokeWidth="1.5" />
            <rect x="33" y="18" width="32" height="18" rx="2" fill="#FFB7B2" />
            <circle cx="49" cy="27" r="4" fill="#FFF" />
            <rect x="46" y="39" width="6" height="4" fill="#6C757D" />
            <rect x="92" y="15" width="38" height="24" rx="3" fill="#495057" stroke="#212529" strokeWidth="1.5" />
            <rect x="95" y="18" width="32" height="18" rx="2" fill="#B5EAD7" />
            <circle cx="111" cy="27" r="4" fill="#FFF" />
            <rect x="108" y="39" width="6" height="4" fill="#6C757D" />
            <circle cx="80" cy="38" r="5" fill="#88D49E" />
            <text x="76" y="36" fontSize="10">🌱</text>
          </svg>
        </div>
      );

    case 'plant_monstera':
    case 'plant_tulips':
    case 'plant_hanging':
    case 'plant_bonsai':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="88" rx="26" ry="6" fill="#EADCD5" />
            <path d="M 32,58 L 36,88 L 64,88 L 68,58 Z" fill="#E07A5F" stroke="#C45A3F" strokeWidth="2" />
            <rect x="30" y="55" width="40" height="6" rx="2" fill="#F4A261" />
            <path d="M 50,60 C 35,40 20,45 25,25 C 32,35 45,45 50,60" fill="#2D6A4F" />
            <path d="M 50,60 C 65,40 80,45 75,25 C 68,35 55,45 50,60" fill="#40916C" />
            <path d="M 50,60 C 50,30 40,15 50,10 C 60,15 50,30 50,60" fill="#52B788" />
            <text x="44" y="45" fontSize="12">🌿</text>
          </svg>
        </div>
      );

    case 'light_moon':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 80 120" className="w-full h-full">
            <ellipse cx="40" cy="110" rx="20" ry="5" fill="#EADCD5" />
            <rect x="38" y="55" width="4" height="55" rx="2" fill="#3D3A45" />
            <path d="M 30,110 L 50,110 L 45,105 L 35,105 Z" fill="#3D3A45" />
            <circle
              cx="40"
              cy="35"
              r="24"
              fill={isOn ? '#FFF9DB' : '#E9ECEF'}
              stroke={isOn ? '#FFE066' : '#CED4DA'}
              strokeWidth="3"
              className={isOn ? 'animate-pulse' : ''}
            />
            <circle cx="34" cy="28" r="4" fill={isOn ? '#FFF3BF' : '#DEE2E6'} />
            <circle cx="48" cy="40" r="5" fill={isOn ? '#FFF3BF' : '#DEE2E6'} />
            <circle cx="45" cy="25" r="3" fill={isOn ? '#FFF3BF' : '#DEE2E6'} />
          </svg>
        </div>
      );

    case 'light_candles':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 70 80" className="w-full h-full">
            <ellipse cx="35" cy="72" rx="26" ry="6" fill="#EADCD5" />
            <rect x="18" y="42" width="14" height="30" rx="2" fill="#FFFDF0" stroke="#FDE2E4" strokeWidth="1" />
            <rect x="38" y="32" width="16" height="40" rx="2" fill="#FFFDF0" stroke="#FDE2E4" strokeWidth="1" />
            <circle cx="25" cy="36" r="3.5" fill="#FFBA08" className="animate-pulse" />
            <circle cx="46" cy="26" r="4" fill="#FFBA08" className="animate-pulse" />
          </svg>
        </div>
      );

    case 'frame_photo':
    case 'frame_polaroid':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          {photoUrl ? (
            <div className="w-full h-full p-2 bg-amber-100 rounded-lg border-4 border-amber-600 shadow-inner flex flex-col items-center justify-center overflow-hidden">
              <img src={photoUrl} alt="Pareja" className="w-full h-full object-cover rounded" />
              {placed?.customNote && (
                <span className="text-[9px] font-handwriting text-stone-700 bg-white/90 px-1 rounded absolute bottom-3 truncate max-w-[90%]">
                  {placed.customNote}
                </span>
              )}
            </div>
          ) : (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="10" y="10" width="80" height="80" rx="8" fill="#FFFDF9" stroke="#D4AF37" strokeWidth="6" />
              <rect x="18" y="18" width="64" height="64" rx="4" fill="#FFE5EC" />
              <circle cx="42" cy="45" r="10" fill="#FF8FAB" />
              <circle cx="58" cy="45" r="10" fill="#84DCC6" />
              <path d="M 32,70 Q 50,55 68,70" fill="#FFAAA6" />
              <text x="44" y="32" fontSize="14">📸</text>
            </svg>
          )}
        </div>
      );

    case 'pet_cat':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-sm animate-wiggle">
          <svg viewBox="0 0 80 70" className="w-full h-full">
            <ellipse cx="40" cy="55" rx="26" ry="10" fill="#EADCD5" />
            <ellipse cx="40" cy="42" rx="22" ry="16" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
            <circle cx="30" cy="30" r="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
            <polygon points="20,24 24,10 30,20" fill="#FFCCD5" stroke="#E5E7EB" strokeWidth="1.5" />
            <polygon points="32,20 38,10 42,24" fill="#FFCCD5" stroke="#E5E7EB" strokeWidth="1.5" />
            <circle cx="25" cy="30" r="2" fill="#1F2937" />
            <circle cx="34" cy="30" r="2" fill="#1F2937" />
            <polygon points="28,34 31,34 29.5,36" fill="#FF758F" />
            <path d="M 58,45 Q 70,35 68,25" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            <circle cx="32" cy="42" r="3" fill="#E63946" />
            <text x="48" y="24" fontSize="12">💤</text>
          </svg>
        </div>
      );

    case 'pet_corgi':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-sm">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            <ellipse cx="50" cy="68" rx="35" ry="8" fill="#EADCD5" />
            <ellipse cx="45" cy="50" rx="30" ry="18" fill="#F4A261" stroke="#E76F51" strokeWidth="2" />
            <ellipse cx="45" cy="55" rx="20" ry="10" fill="#FFFFFF" />
            <circle cx="70" cy="36" r="16" fill="#F4A261" stroke="#E76F51" strokeWidth="2" />
            <ellipse cx="70" cy="42" rx="9" ry="7" fill="#FFFFFF" />
            <polygon points="60,28 64,8 72,22" fill="#E76F51" />
            <polygon points="72,22 80,8 84,28" fill="#E76F51" />
            <circle cx="66" cy="34" r="2" fill="#264653" />
            <circle cx="76" cy="34" r="2" fill="#264653" />
            <ellipse cx="71" cy="39" rx="3" ry="2" fill="#264653" />
            <text x="55" y="20" fontSize="12">💖</text>
          </svg>
        </div>
      );

    case 'pet_bunny':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-sm">
          <svg viewBox="0 0 80 70" className="w-full h-full">
            <ellipse cx="40" cy="55" rx="24" ry="8" fill="#EADCD5" />
            <ellipse cx="40" cy="44" rx="20" ry="15" fill="#FFFDF9" stroke="#E5E7EB" strokeWidth="1.5" />
            <circle cx="32" cy="34" r="12" fill="#FFFDF9" stroke="#E5E7EB" strokeWidth="1.5" />
            <ellipse cx="28" cy="18" rx="4" ry="12" fill="#FFCCD5" stroke="#E5E7EB" strokeWidth="1" />
            <ellipse cx="36" cy="18" rx="4" ry="12" fill="#FFCCD5" stroke="#E5E7EB" strokeWidth="1" />
            <circle cx="28" cy="34" r="1.5" fill="#1F2937" />
            <text x="46" y="32" fontSize="10">🥕</text>
          </svg>
        </div>
      );

    case 'decor_fireplace':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-lg">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <rect x="15" y="20" width="90" height="90" rx="6" fill="#6C584C" stroke="#4A3E3D" strokeWidth="3" />
            <rect x="10" y="15" width="100" height="12" rx="3" fill="#8C7A6B" />
            <rect x="30" y="45" width="60" height="60" rx="6" fill="#2B221B" />
            <rect x="40" y="88" width="40" height="8" rx="3" fill="#582F0E" transform="rotate(-5 60 92)" />
            <rect x="40" y="88" width="40" height="8" rx="3" fill="#7F4F24" transform="rotate(5 60 92)" />
            <path d="M 50,90 Q 60,50 60,65 Q 65,45 70,90 Z" fill="#E63946" className="animate-pulse" />
            <path d="M 54,90 Q 60,60 62,75 Q 66,58 68,90 Z" fill="#FFBA08" className="animate-pulse" />
          </svg>
        </div>
      );

    case 'decor_gramophone':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <ellipse cx="50" cy="88" rx="35" ry="7" fill="#EADCD5" />
            <rect x="25" y="60" width="50" height="25" rx="4" fill="#7F5539" stroke="#582F0E" strokeWidth="2" />
            <circle cx="50" cy="68" r="14" fill="#212529" />
            <circle cx="50" cy="68" r="5" fill="#E9ECEF" />
            <path d="M 58,62 Q 70,45 60,35 Q 40,20 65,10 Q 85,25 75,50 Z" fill="#D4AF37" stroke="#AA8C2C" strokeWidth="2" />
            <text x="30" y="25" fontSize="14" className="animate-bounce-slow">🎶</text>
          </svg>
        </div>
      );

    case 'decor_bookshelf':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 120 160" className="w-full h-full">
            <rect x="15" y="10" width="90" height="140" rx="4" fill="#9C6644" stroke="#7F5539" strokeWidth="3" />
            <rect x="15" y="45" width="90" height="6" fill="#7F5539" />
            <rect x="15" y="85" width="90" height="6" fill="#7F5539" />
            <rect x="15" y="125" width="90" height="6" fill="#7F5539" />
            <rect x="22" y="18" width="8" height="27" fill="#E63946" rx="1" />
            <rect x="31" y="22" width="7" height="23" fill="#457B9D" rx="1" />
            <rect x="39" y="16" width="10" height="29" fill="#2A9D8F" rx="1" />
            <text x="65" y="38" fontSize="14">🌵</text>
            <text x="30" y="75" fontSize="12">💌</text>
          </svg>
        </div>
      );

    case 'decor_telescope':
      return (
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-md">
          <svg viewBox="0 0 90 120" className="w-full h-full">
            <ellipse cx="45" cy="112" rx="25" ry="6" fill="#EADCD5" />
            <line x1="45" y1="65" x2="25" y2="112" stroke="#6C584C" strokeWidth="4" strokeLinecap="round" />
            <line x1="45" y1="65" x2="65" y2="112" stroke="#6C584C" strokeWidth="4" strokeLinecap="round" />
            <g transform="rotate(-30 45 55)">
              <rect x="20" y="48" width="55" height="14" rx="4" fill="#D4AF37" stroke="#AA8C2C" strokeWidth="2" />
              <rect x="70" y="45" width="10" height="20" rx="3" fill="#AA8C2C" />
            </g>
            <text x="55" y="25" fontSize="14" className="animate-pulse">✨</text>
          </svg>
        </div>
      );

    case 'decor_rug':
      return (
        <div className="relative w-full h-full flex items-center justify-center opacity-90">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="54" fill="#F4E8C1" stroke="#DDB892" strokeWidth="4" strokeDasharray="6,4" />
            <circle cx="60" cy="60" r="42" fill="#E8D5B5" />
            <circle cx="60" cy="60" r="28" fill="#F4E8C1" />
            <circle cx="60" cy="60" r="14" fill="#DDB892" />
            <text x="54" y="65" fontSize="14">❤️</text>
          </svg>
        </div>
      );

    default:
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-white/80 rounded-xl border-2 border-rose-200 shadow-sm">
          <span className="text-3xl">{item.icon}</span>
          <span className="text-[10px] font-bold text-stone-700 text-center leading-tight mt-1">{item.name}</span>
        </div>
      );
  }
};
