import React, { useState, useRef, useCallback } from 'react';
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
  Palette,
  Layers,
  Move
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
  const [showDpad, setShowDpad] = useState<boolean>(false);
  const floorRef = useRef<HTMLDivElement>(null);

  // Dragging state tracking
  const dragRef = useRef<{
    isDragging: boolean;
    placedId: string | null;
    startPointerX: number;
    startPointerY: number;
    origX: number;
    origY: number;
    hasMoved: boolean;
  }>({
    isDragging: false,
    placedId: null,
    startPointerX: 0,
    startPointerY: 0,
    origX: 0,
    origY: 0,
    hasMoved: false,
  });

  const selectedPlacedItem = placedInRoom.find((p) => p.id === selectedItemId);
  const selectedFurnitureMeta = selectedPlacedItem
    ? furnitureCatalog.find((f) => f.id === selectedPlacedItem.furnitureId)
    : null;

  // Grid constants: 9 columns (0..8) and 7 rows (0..6)
  const GRID_COLS = 9;
  const GRID_ROWS = 7;

  // Tap or Click to select item
  const handleSelect = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    if (!dragRef.current.hasMoved) {
      sound.playPop();
      setSelectedItemId(id);
    }
  };

  // Direct Pointer Drag & Drop for tactile touch movement
  const handlePointerDown = (e: React.PointerEvent, placed: (typeof placedInRoom)[0]) => {
    e.stopPropagation();
    setSelectedItemId(placed.id);

    dragRef.current = {
      isDragging: true,
      placedId: placed.id,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      origX: placed.x,
      origY: placed.y,
      hasMoved: false,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDragging || !dragRef.current.placedId || !floorRef.current) return;

    const deltaPixelX = e.clientX - dragRef.current.startPointerX;
    const deltaPixelY = e.clientY - dragRef.current.startPointerY;

    if (Math.abs(deltaPixelX) > 4 || Math.abs(deltaPixelY) > 4) {
      dragRef.current.hasMoved = true;
    }

    if (!dragRef.current.hasMoved) return;

    const rect = floorRef.current.getBoundingClientRect();
    const tileWidth = rect.width / GRID_COLS;
    const tileHeight = rect.height / GRID_ROWS;

    const meta = furnitureCatalog.find((f) => {
      const item = house.placedItems.find((p) => p.id === dragRef.current.placedId);
      return item ? f.id === item.furnitureId : false;
    });

    const itemWidth = meta?.width || 1;
    const itemHeight = meta?.height || 1;

    const deltaCols = Math.round(deltaPixelX / tileWidth);
    const deltaRows = Math.round(deltaPixelY / tileHeight);

    const targetX = Math.max(0, Math.min(GRID_COLS - itemWidth, dragRef.current.origX + deltaCols));
    const targetY = Math.max(0, Math.min(GRID_ROWS - itemHeight, dragRef.current.origY + deltaRows));

    const currentItem = house.placedItems.find((p) => p.id === dragRef.current.placedId);
    if (currentItem && (currentItem.x !== targetX || currentItem.y !== targetY)) {
      moveFurniture(dragRef.current.placedId, targetX, targetY);
      sound.playPop();
    }
  }, [furnitureCatalog, house.placedItems, moveFurniture]);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current.isDragging) {
      dragRef.current.isDragging = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Click on empty floor tile to move selected item directly there
  const handleFloorClick = (e: React.MouseEvent) => {
    if (dragRef.current.hasMoved) return;

    if (selectedItemId && floorRef.current && selectedFurnitureMeta) {
      const rect = floorRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const col = Math.floor((clickX / rect.width) * GRID_COLS);
      const row = Math.floor((clickY / rect.height) * GRID_ROWS);

      const targetX = Math.max(0, Math.min(GRID_COLS - selectedFurnitureMeta.width, col));
      const targetY = Math.max(0, Math.min(GRID_ROWS - selectedFurnitureMeta.height, row));

      moveFurniture(selectedItemId, targetX, targetY);
      sound.playPop();
    } else {
      setSelectedItemId(null);
    }
  };

  // Directional D-Pad step movement (1 tile precision)
  const moveByStep = (dx: number, dy: number) => {
    if (!selectedPlacedItem || !selectedFurnitureMeta) return;
    const currentX = selectedPlacedItem.x;
    const currentY = selectedPlacedItem.y;

    const maxX = GRID_COLS - selectedFurnitureMeta.width;
    const maxY = GRID_ROWS - selectedFurnitureMeta.height;

    const nextX = Math.max(0, Math.min(maxX, currentX + dx));
    const nextY = Math.max(0, Math.min(maxY, currentY + dy));

    moveFurniture(selectedPlacedItem.id, nextX, nextY);
    sound.playPop();
  };

  const getFloorStyle = () => {
    switch (currentRoom.floorType) {
      case 'wood':
        return 'bg-[#F4ECE1] bg-[radial-gradient(#D6C2AC_1.2px,transparent_1.2px)] [background-size:18px_18px] border-t-4 border-[#CBB39C]/80';
      case 'carpet':
        return 'bg-[#FBF0F2] bg-[radial-gradient(#E8C5CE_1.5px,transparent_1.5px)] [background-size:12px_12px] border-t-4 border-[#E2B7C2]/80';
      case 'tiles':
        return 'bg-[#F3F9F6] bg-[linear-gradient(to_right,#D8EBE4_1px,transparent_1px),linear-gradient(to_bottom,#D8EBE4_1px,transparent_1px)] [background-size:24px_24px] border-t-4 border-[#B9DDD0]/80';
      case 'grass':
        return 'bg-[#EBF7EA] bg-[radial-gradient(#BDE3B9_2px,transparent_2px)] [background-size:16px_16px] border-t-4 border-[#A3D99C]/80';
      case 'brick':
        return 'bg-[#F9ECE9] bg-[linear-gradient(90deg,#E8CCC7_2px,transparent_2px),linear-gradient(0deg,#E8CCC7_2px,transparent_2px)] [background-size:20px_10px] border-t-4 border-[#D9AEA7]/80';
      default:
        return 'bg-[#F5EDE0] border-t-4 border-[#D8C7B0]/80';
    }
  };

  return (
    <div className="flex flex-col h-full relative select-none bg-stone-100">
      {/* Room Header Info */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white/85 backdrop-blur-md border-b border-stone-200/70 z-10">
        <div className="flex items-center space-x-2">
          <span className="text-2xl drop-shadow-xs">{currentRoom.icon}</span>
          <div>
            <h2 className="text-xs font-black text-stone-800 flex items-center gap-1.5">
              <span>{currentRoom.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.2 bg-rose-100 text-rose-700 rounded-full">
                {placedInRoom.length} {placedInRoom.length === 1 ? 'mueble' : 'muebles'}
              </span>
            </h2>
            <p className="text-[10px] text-stone-500 line-clamp-1">{currentRoom.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenThemeModal}
            className="p-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-transform active:scale-95 shadow-xs"
            title="Estilo de Paredes y Suelo"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenActivity}
            className="p-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-transform active:scale-95 shadow-xs"
            title="Historial de la casa"
          >
            <Sparkles className="w-3.5 h-3.5" />
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
        style={{ backgroundColor: currentRoom.wallColor }}
        className="relative flex-1 w-full overflow-hidden flex flex-col justify-end transition-colors duration-500 shadow-inner"
      >
        {/* Cozy Ambient Light Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/35 via-transparent to-stone-900/10 pointer-events-none z-1" />

        {/* Windows and Sky Wall Decor */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-45">
          <div className="w-full flex justify-around pt-3">
            {/* Window 1 with sunbeam */}
            <div className="w-16 h-20 bg-sky-200/80 rounded-t-full border-4 border-white/90 shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-2 right-2 w-4 h-4 bg-amber-300 rounded-full animate-pulse" />
              <div className="w-full h-0.5 bg-white absolute" />
              <div className="h-full w-0.5 bg-white absolute" />
            </div>

            {/* Window 2 */}
            <div className="w-14 h-16 bg-sky-200/80 rounded-t-full border-4 border-white/90 shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-0.5 bg-white absolute" />
              <div className="h-full w-0.5 bg-white absolute" />
            </div>
          </div>

          {/* Couple Avatars Floating in Room */}
          <div className="w-full flex justify-between px-5 pb-20 opacity-80 pointer-events-none">
            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-stone-700 shadow-xs border border-rose-100 animate-bounce-slow">
              <span>{couple.partner1.avatar}</span>
              <span className="font-bold">{couple.partner1.name}</span>
            </div>
            <div 
              className="flex items-center space-x-1 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-stone-700 shadow-xs border border-rose-100 animate-bounce-slow" 
              style={{ animationDelay: '1.2s' }}
            >
              <span>{couple.partner2.avatar}</span>
              <span className="font-bold">{couple.partner2.name}</span>
            </div>
          </div>
        </div>

        {/* Floor Section */}
        <div
          ref={floorRef}
          onClick={handleFloorClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`w-full h-[68%] ${getFloorStyle()} relative transition-all duration-300 touch-none z-2`}
        >
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
                    className={`border border-rose-300/30 transition-all ${
                      isUnderSelected 
                        ? 'bg-rose-400/30 border-rose-400 shadow-inner' 
                        : 'hover:bg-rose-100/10'
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Empty Room Cozy Welcome Message */}
          {placedInRoom.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-auto z-10">
              <div className="bg-white/90 backdrop-blur-md border border-rose-200/90 rounded-3xl p-4 text-center max-w-xs shadow-xl space-y-2.5 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center text-2xl shadow-inner animate-bounce-slow">
                  🏡
                </div>
                <div>
                  <h3 className="text-xs font-black text-stone-800">¡Su casita empieza aquí!</h3>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed">
                    Esta habitación está limpia y lista. Tienen regalos de bienvenida en su inventario para colocar juntos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenStore}
                  className="w-full py-2 px-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 hover:shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ver Inventario y Tienda</span>
                </button>
              </div>
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
                onPointerDown={(e) => handlePointerDown(e, placed)}
                onClick={(e) => handleSelect(e, placed.id)}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  width: `${widthPercent}%`,
                  height: `${heightPercent}%`,
                  zIndex: isSelected ? 40 : baseZ,
                  transform: `rotate(${placed.rotation}deg)`,
                  filter: isSelected
                    ? 'drop-shadow(0 8px 12px rgba(244,63,94,0.3))'
                    : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                }}
                className={`absolute cursor-grab active:cursor-grabbing transition-transform duration-75 touch-none ${
                  isSelected
                    ? 'ring-2 ring-rose-500 ring-offset-2 rounded-2xl scale-105 shadow-xl'
                    : 'hover:scale-102'
                }`}
              >
                <FurnitureVector item={meta} placed={placed} />

                {/* Placement Tag Badge */}
                {isSelected && (
                  <div
                    style={{ transform: `rotate(-${placed.rotation}deg)` }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900/85 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md pointer-events-none flex items-center gap-1 z-50"
                  >
                    <span>{placedPartner.avatar}</span>
                    <span>Puesto por {placedPartner.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Quick Action Controls for Selected Furniture */}
        {selectedPlacedItem && selectedFurnitureMeta && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md border border-rose-200/90 rounded-3xl p-3 shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-2">
            {/* Header / Info Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl p-1 bg-rose-50 rounded-xl border border-rose-100">{selectedFurnitureMeta.icon}</span>
                <div>
                  <h4 className="text-xs font-black text-stone-800">{selectedFurnitureMeta.name}</h4>
                  <p className="text-[9px] text-stone-500 font-medium">
                    Arrastra con el dedo para mover • Giro {selectedPlacedItem.rotation}°
                  </p>
                </div>
              </div>

              {/* Action Buttons: Special, Photo, Done */}
              <div className="flex items-center space-x-1">
                {/* Special Action (Pet, Water, Lamp) */}
                {selectedFurnitureMeta.specialAction && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      interactWithFurniture(selectedPlacedItem.id);
                    }}
                    className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                    title="Interactuar"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Photo Frame Modal Button */}
                {selectedFurnitureMeta.canHostPhoto && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPhotoModal(selectedPlacedItem.id);
                    }}
                    className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                    title="Cambiar Foto"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* D-Pad Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDpad(!showDpad);
                  }}
                  className={`p-1.5 rounded-xl border transition-colors ${
                    showDpad
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                  title="Ajuste fino con flechas"
                >
                  <Move className="w-3.5 h-3.5" />
                </button>

                {/* Delete / Store Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFurniture(selectedPlacedItem.id);
                    setSelectedItemId(null);
                  }}
                  className="p-1.5 rounded-xl bg-red-100 hover:bg-red-500 hover:text-white text-red-600 transition-colors"
                  title="Guardar en Inventario"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Done Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemId(null);
                  }}
                  className="p-1.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                  title="Listo"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions Row: Rotate + Layering */}
            <div className="flex items-center justify-between pt-1.5 border-t border-stone-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  rotateFurniture(selectedPlacedItem.id);
                }}
                className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-[11px] flex items-center justify-center space-x-1 active:scale-95 transition-all shadow-xs mr-1.5"
              >
                <RotateCw className="w-3 h-3" />
                <span>Girar 90°</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeFurnitureLayer(selectedPlacedItem.id, 1);
                }}
                className="p-1.5 bg-stone-100 hover:bg-purple-100 text-stone-700 border border-stone-200 rounded-xl text-[10px] font-bold flex items-center space-x-0.5 active:scale-95 transition-all mr-1"
                title="Traer al frente"
              >
                <ArrowUpToLine className="w-3 h-3" />
                <span className="hidden sm:inline">Al frente</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeFurnitureLayer(selectedPlacedItem.id, -1);
                }}
                className="p-1.5 bg-stone-100 hover:bg-purple-100 text-stone-700 border border-stone-200 rounded-xl text-[10px] font-bold flex items-center space-x-0.5 active:scale-95 transition-all"
                title="Enviar al fondo"
              >
                <ArrowDownToLine className="w-3 h-3" />
                <span className="hidden sm:inline">Al fondo</span>
              </button>
            </div>

            {/* Optional D-Pad for pixel-precision */}
            {showDpad && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-center space-x-1.5 animate-in fade-in">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveByStep(-1, 0);
                  }}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex flex-col space-y-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveByStep(0, -1);
                    }}
                    className="p-1 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all flex items-center justify-center"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveByStep(0, 1);
                    }}
                    className="p-1 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all flex items-center justify-center"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveByStep(1, 0);
                  }}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-700 active:scale-90 shadow-xs transition-all"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Room Carousel Switcher */}
      <div className="bg-white border-t border-stone-200/80 px-2.5 py-1.5 flex items-center space-x-1.5 overflow-x-auto no-scrollbar z-10">
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
              className={`flex-shrink-0 flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-200 scale-102'
                  : room.unlocked
                  ? 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-600'
                  : 'bg-stone-100/60 text-stone-400 border border-dashed border-stone-300'
              }`}
            >
              <span>{room.icon}</span>
              <span>{room.name.split(' ')[0]}</span>
              {!room.unlocked && <span className="text-[9px]">🔒 {room.unlockCost}❤️</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
