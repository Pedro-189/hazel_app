import React, { useState, useRef } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { FurnitureVector } from './FurnitureVector';
import { 
  RotateCw, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Plus, 
  Check,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpToLine,
  ArrowDownToLine,
  Palette
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface RoomCanvasProps {
  onOpenStore: () => void;
  onOpenPhotoModal: (placedId: string) => void;
  onOpenActivity: () => void;
  onOpenThemeModal: () => void;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  onOpenStore,
  onOpenPhotoModal,
  onOpenActivity,
  onOpenThemeModal,
}) => {
  const {
    house,
    couple,
    furnitureCatalog,
    moveFurniture,
    rotateFurniture,
    changeFurnitureLayer,
    removeFurniture,
    interactWithFurniture,
    changeRoom,
  } = useCouple();

  const currentRoom = house.rooms[house.currentRoomId];
  const placedInRoom = house.placedItems.filter((p) => p.roomId === house.currentRoomId);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showDpad, setShowDpad] = useState<boolean>(true);
  const gridRef = useRef<HTMLDivElement>(null);

  const selectedPlacedItem = placedInRoom.find((p) => p.id === selectedItemId);
  const selectedFurnitureMeta = selectedPlacedItem
    ? furnitureCatalog.find((f) => f.id === selectedPlacedItem.furnitureId)
    : null;

  // Grid constants: 9 columns (0..8) and 7 rows (0..6)
  const GRID_COLS = 9;
  const GRID_ROWS = 7;

  const handleSelect = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    sound.playPop();
    setSelectedItemId(id);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (selectedItemId && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const col = Math.floor((clickX / rect.width) * GRID_COLS);
      const row = Math.floor((clickY / rect.height) * GRID_ROWS);

      const targetX = Math.max(0, Math.min(GRID_COLS - (selectedFurnitureMeta?.width || 1), col));
      const targetY = Math.max(0, Math.min(GRID_ROWS - (selectedFurnitureMeta?.height || 1), row));

      moveFurniture(selectedItemId, targetX, targetY);
    } else {
      setSelectedItemId(null);
    }
  };

  // Directional D-Pad movement with 1-tile precision
  const moveByStep = (dx: number, dy: number) => {
    if (!selectedPlacedItem || !selectedFurnitureMeta) return;
    const currentX = selectedPlacedItem.x;
    const currentY = selectedPlacedItem.y;

    const maxX = GRID_COLS - selectedFurnitureMeta.width;
    const maxY = GRID_ROWS - selectedFurnitureMeta.height;

    const nextX = Math.max(0, Math.min(maxX, currentX + dx));
    const nextY = Math.max(0, Math.min(maxY, currentY + dy));

    moveFurniture(selectedPlacedItem.id, nextX, nextY);
  };

  const getFloorStyle = () => {
    switch (currentRoom.floorType) {
      case 'wood':
        return 'bg-[#F2E8DC] bg-[radial-gradient(#D6C2AC_1px,transparent_1px)] [background-size:16px_16px] border-t-4 border-[#CBB39C]';
      case 'carpet':
        return 'bg-[#F9ECEF] bg-[radial-gradient(#E8C5CE_1.5px,transparent_1.5px)] [background-size:12px_12px] border-t-4 border-[#E2B7C2]';
      case 'tiles':
        return 'bg-[#F0F7F4] bg-[linear-gradient(to_right,#D8EBE4_1px,transparent_1px),linear-gradient(to_bottom,#D8EBE4_1px,transparent_1px)] [background-size:24px_24px] border-t-4 border-[#B9DDD0]';
      case 'grass':
        return 'bg-[#E5F4E3] bg-[radial-gradient(#BDE3B9_2px,transparent_2px)] [background-size:16px_16px] border-t-4 border-[#A3D99C]';
      case 'brick':
        return 'bg-[#F7EBE8] bg-[linear-gradient(90deg,#E8CCC7_2px,transparent_2px),linear-gradient(0deg,#E8CCC7_2px,transparent_2px)] [background-size:20px_10px] border-t-4 border-[#D9AEA7]';
      default:
        return 'bg-[#F5EDE0] border-t-4 border-[#D8C7B0]';
    }
  };

  return (
    <div className="flex flex-col h-full relative select-none">
      {/* Room Header Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-stone-200/70 z-10">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currentRoom.icon}</span>
          <div>
            <h2 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
              {currentRoom.name}
              <span className="text-[10px] font-normal px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                {placedInRoom.length} objetos
              </span>
            </h2>
            <p className="text-[11px] text-stone-500 line-clamp-1">{currentRoom.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenThemeModal}
            className="p-1.5 rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 transition-transform active:scale-95"
            title="Estilo de Paredes y Suelo"
          >
            <Palette className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenActivity}
            className="p-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-transform active:scale-95"
            title="Actividad de la casa"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenStore}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold text-xs shadow-md shadow-rose-200 hover:shadow-lg transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Decorar</span>
          </button>
        </div>
      </div>

      {/* Main Room Canvas Viewport */}
      <div
        ref={gridRef}
        onClick={handleCanvasClick}
        style={{ backgroundColor: currentRoom.wallColor }}
        className="relative flex-1 w-full overflow-hidden flex flex-col justify-end transition-colors duration-500 shadow-inner"
      >
        {/* Wall Accent / Windows / Sky Background */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="w-full flex justify-around pt-3">
            <div className="w-16 h-20 bg-sky-200/80 rounded-t-full border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-2 right-2 w-4 h-4 bg-amber-300 rounded-full animate-pulse" />
              <div className="w-full h-0.5 bg-white absolute" />
              <div className="h-full w-0.5 bg-white absolute" />
            </div>
            <div className="w-14 h-16 bg-sky-200/80 rounded-t-full border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-0.5 bg-white absolute" />
              <div className="h-full w-0.5 bg-white absolute" />
            </div>
          </div>
          {/* Couple Avatars in Room */}
          <div className="w-full flex justify-between px-6 pb-20 opacity-80 pointer-events-none">
            <div className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-full text-xs text-stone-700 shadow-sm animate-bounce-slow">
              <span>{couple.partner1.avatar}</span>
              <span className="font-bold text-[10px]">{couple.partner1.name}</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-full text-xs text-stone-700 shadow-sm animate-bounce-slow" style={{ animationDelay: '1s' }}>
              <span>{couple.partner2.avatar}</span>
              <span className="font-bold text-[10px]">{couple.partner2.name}</span>
            </div>
          </div>
        </div>

        {/* Floor Section */}
        <div className={`w-full h-[68%] ${getFloorStyle()} relative transition-all duration-300`}>
          {/* Grid Tile Overlay when item is selected */}
          {selectedItemId && (
            <div className="absolute inset-0 grid grid-cols-9 grid-rows-7 pointer-events-none">
              {Array.from({ length: 63 }).map((_, i) => {
                const col = i % GRID_COLS;
                const row = Math.floor(i / GRID_COLS);
                const isUnderSelected = selectedPlacedItem && selectedFurnitureMeta && (
                  col >= selectedPlacedItem.x &&
                  col < selectedPlacedItem.x + selectedFurnitureMeta.width &&
                  row >= selectedPlacedItem.y &&
                  row < selectedPlacedItem.y + selectedFurnitureMeta.height
                );

                return (
                  <div
                    key={i}
                    className={`border border-rose-300/30 transition-colors ${
                      isUnderSelected ? 'bg-rose-400/25 border-rose-500' : ''
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Placed Furniture Items */}
          {placedInRoom.map((placed) => {
            const meta = furnitureCatalog.find((f) => f.id === placed.furnitureId);
            if (!meta) return null;

            const isSelected = placed.id === selectedItemId;
            const leftPercent = (placed.x / GRID_COLS) * 100;
            const topPercent = (placed.y / GRID_ROWS) * 100;
            const widthPercent = (meta.width / GRID_COLS) * 100;
            const heightPercent = (meta.height / GRID_ROWS) * 100;

            const placedPartner = placed.placedBy === 'partner1' ? couple.partner1 : couple.partner2;
            const layerOffset = placed.layer || 0;
            const baseZ = Math.floor(placed.y * 10) + meta.height + (layerOffset * 5);

            return (
              <div
                key={placed.id}
                onClick={(e) => handleSelect(e, placed.id)}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${widthPercent}%`,
                  height: `${heightPercent}%`,
                  zIndex: isSelected ? 40 : baseZ,
                  transform: `rotate(${placed.rotation}deg)`,
                }}
                className={`absolute cursor-pointer transition-transform duration-100 ${
                  isSelected
                    ? 'ring-2 ring-rose-500 ring-offset-2 rounded-xl scale-105 shadow-xl'
                    : 'hover:scale-102'
                }`}
              >
                <FurnitureVector item={meta} placed={placed} />

                {/* Placed By Badge */}
                {isSelected && (
                  <div
                    style={{ transform: `rotate(-${placed.rotation}deg)` }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900/80 backdrop-blur-md text-white text-[9px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1 z-50"
                  >
                    <span>{placedPartner.avatar}</span>
                    <span>Puesto por {placedPartner.name} (X:{placed.x}, Y:{placed.y})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Item Control Bar + Precision D-Pad Panel */}
        {selectedPlacedItem && selectedFurnitureMeta && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md border border-rose-200/90 rounded-3xl p-3 shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-3 duration-200 space-y-2.5">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{selectedFurnitureMeta.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">{selectedFurnitureMeta.name}</h4>
                  <p className="text-[10px] text-stone-500">
                    Posición: ({selectedPlacedItem.x}, {selectedPlacedItem.y}) • Giro: {selectedPlacedItem.rotation}°
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* Special Action (Pet, Water, Light) */}
                {selectedFurnitureMeta.specialAction && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      interactWithFurniture(selectedPlacedItem.id);
                    }}
                    className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors animate-pulse"
                    title="Interactuar"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}

                {/* Photo Frame Modal Button */}
                {selectedFurnitureMeta.canHostPhoto && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPhotoModal(selectedPlacedItem.id);
                    }}
                    className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                    title="Cambiar Foto"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFurniture(selectedPlacedItem.id);
                    setSelectedItemId(null);
                  }}
                  className="p-2 rounded-xl bg-red-100 hover:bg-red-500 hover:text-white text-red-600 transition-colors"
                  title="Guardar en Inventario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Done Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemId(null);
                  }}
                  className="p-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                  title="Listo"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Precision Controls Row: D-Pad, Rotation, and Layering */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
              {/* D-PAD DIRECTIONAL CONTROLS */}
              <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-2xl">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveByStep(-1, 0);
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all"
                  title="Mover a la izquierda"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex flex-col space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveByStep(0, -1);
                    }}
                    className="p-1.5 rounded-xl bg-white hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all flex items-center justify-center"
                    title="Mover arriba"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveByStep(0, 1);
                    }}
                    className="p-1.5 rounded-xl bg-white hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all flex items-center justify-center"
                    title="Mover abajo"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveByStep(1, 0);
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all"
                  title="Mover a la derecha"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* ROTATE & LAYER BUTTONS */}
              <div className="flex items-center space-x-1.5">
                {/* Rotate 90 deg */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    rotateFurniture(selectedPlacedItem.id);
                  }}
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-700 font-bold text-xs active:scale-95 transition-all shadow-xs"
                  title="Girar 90 grados"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Girar</span>
                </button>

                {/* Layer Forward */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    changeFurnitureLayer(selectedPlacedItem.id, 1);
                  }}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-purple-100 text-stone-700 active:scale-95 transition-all shadow-xs"
                  title="Traer al frente"
                >
                  <ArrowUpToLine className="w-4 h-4" />
                </button>

                {/* Layer Backward */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    changeFurnitureLayer(selectedPlacedItem.id, -1);
                  }}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-purple-100 text-stone-700 active:scale-95 transition-all shadow-xs"
                  title="Enviar al fondo"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Room Carousel Switcher */}
      <div className="bg-white border-t border-stone-200/80 px-3 py-2 flex items-center space-x-2 overflow-x-auto no-scrollbar z-10">
        {(Object.keys(house.rooms) as (keyof typeof house.rooms)[]).map((rKey) => {
          const room = house.rooms[rKey];
          const isActive = house.currentRoomId === rKey;

          return (
            <button
              key={room.id}
              onClick={() => {
                if (room.unlocked) {
                  changeRoom(room.id);
                } else {
                  onOpenStore();
                }
              }}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                  : room.unlocked
                  ? 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-600'
                  : 'bg-stone-100/60 text-stone-400 border border-dashed border-stone-300'
              }`}
            >
              <span>{room.icon}</span>
              <span>{room.name.split(' ')[0]}</span>
              {!room.unlocked && <span className="text-[10px]">🔒 {room.unlockCost}❤️</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
