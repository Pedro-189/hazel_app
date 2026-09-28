import React, { useState, useMemo } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Question, QuestionCategory } from '../../types/qa';
import { 
  Dices, 
  BookHeart, 
  PlusCircle, 
  Heart, 
  ChevronRight,
  Flame,
  Sparkles,
  Zap,
  AlertCircle
} from 'lucide-react';
import { AnswerModal } from './AnswerModal';
import { CreateQuestionModal } from './CreateQuestionModal';
import { MemoryBookView } from './MemoryBookView';
import { TopicRouletteModal } from './TopicRouletteModal';
import { InfiniteQuestionGeneratorModal } from './InfiniteQuestionGeneratorModal';

export const QAScreen: React.FC = () => {
  const { allQuestions, qa, couple, activePartner, otherPartner } = useCouple();

  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMemoryBookOpen, setIsMemoryBookOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const categories: Array<{ id: QuestionCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'Todas', icon: '✨' },
    { id: 'intimacy', label: 'Amor & Vínculo', icon: '💖' },
    { id: 'spicy', label: 'Química & Pasión', icon: '🌶️' },
    { id: 'dreams', label: 'Sueños & Futuro', icon: '🌌' },
    { id: 'memories', label: 'Recuerdos', icon: '🧸' },
    { id: 'deep', label: 'Profundas', icon: '🧠' },
    { id: 'fun', label: 'Divertidas', icon: '🎭' },
    { id: 'custom', label: 'Personalizadas', icon: '💌' },
  ];

  const filteredQuestions = useMemo(() =>
    allQuestions.filter((q) =>
      selectedCategory === 'all' ? true : q.category === selectedCategory
    ),
    [allQuestions, selectedCategory]
  );

  const dailyQuestion = allQuestions.find((q) => q.id === qa.dailyQuestionId) || allQuestions[0];
  const dailyRecord = qa.records[dailyQuestion.id];

  // Find questions where the OTHER partner has answered, but I haven't yet (Pending Challenge!)
  const isPartner1 = activePartner.id === 'partner1';
  const pendingChallengeQuestion = useMemo(() =>
    allQuestions.find((q) => {
      const rec = qa.records[q.id];
      if (!rec || rec.isRevealed) return false;
      const myAns = isPartner1 ? rec.partner1Answer : rec.partner2Answer;
      const partnerAns = isPartner1 ? rec.partner2Answer : rec.partner1Answer;
      return !myAns && !!partnerAns;
    }),
    [allQuestions, qa.records, isPartner1]
  );

  const getQuestionStatus = (questionId: string) => {
    const record = qa.records[questionId];
    const myAnswer = isPartner1 ? record?.partner1Answer : record?.partner2Answer;
    const partnerAnswer = isPartner1 ? record?.partner2Answer : record?.partner1Answer;

    if (record?.isRevealed) {
      return { label: 'Revelada 🎉', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
    if (myAnswer && !partnerAnswer) {
      return { label: `Esperando a ${otherPartner.name} ⏳`, color: 'bg-amber-100 text-amber-700 border-amber-200' };
    }
    if (!myAnswer && partnerAnswer) {
      return { label: `¡${otherPartner.name} te desafió! ✍️`, color: 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse' };
    }
    return { label: 'Sin responder 💌', color: 'bg-rose-50 text-rose-600 border-rose-100' };
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-stone-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Minijuego</span>
            <h2 className="text-base font-extrabold text-stone-800 flex items-center gap-1.5">
              Conóceme Más 💕
            </h2>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsMemoryBookOpen(true)}
              className="p-2 rounded-2xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 shadow-xs transition-transform active:scale-95 flex items-center gap-1 text-xs font-bold"
              title="Libro de Recuerdos"
            >
              <BookHeart className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Recuerdos</span>
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Escribir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Pending Challenge Alert Banner */}
        {pendingChallengeQuestion && (
          <div
            onClick={() => setActiveQuestion(pendingChallengeQuestion)}
            className="p-4 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 cursor-pointer flex items-center justify-between animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl p-2 bg-white/20 rounded-2xl animate-bounce">💌</span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> ¡Desafío de {otherPartner.name}!
                </span>
                <h4 className="text-xs font-bold leading-snug">{pendingChallengeQuestion.title}</h4>
                <p className="text-[11px] text-purple-100 line-clamp-1 mt-0.5">
                  "{pendingChallengeQuestion.prompt}"
                </p>
              </div>
            </div>

            <button className="px-3 py-1.5 bg-white text-purple-700 font-bold text-xs rounded-xl shadow-xs flex-shrink-0 ml-2">
              Responder →
            </button>
          </div>
        )}

        {/* Action Highlights Row: Random by Topic & Infinite Generator */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Button 1: Elegir Tema al Azar */}
          <button
            onClick={() => setIsRouletteOpen(true)}
            className="p-3.5 bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-3xl shadow-md shadow-rose-200 text-left flex flex-col justify-between transition-transform active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-2xl bg-white/20 text-lg">🎲</span>
              <span className="text-[9px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                Por Tema
              </span>
            </div>
            <div className="mt-2">
              <h4 className="text-xs font-extrabold">Elegir Tema al Azar</h4>
              <p className="text-[10px] text-rose-100 mt-0.5">Ruleta sorpresa para desafiar a tu pareja</p>
            </div>
          </button>

          {/* Button 2: Generador Infinito con IA */}
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="p-3.5 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-3xl shadow-md shadow-purple-200 text-left flex flex-col justify-between transition-transform active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-2xl bg-white/20 text-lg">✨</span>
              <span className="text-[9px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                Ilimitadas
              </span>
            </div>
            <div className="mt-2">
              <h4 className="text-xs font-extrabold">Generador Infinito</h4>
              <p className="text-[10px] text-purple-100 mt-0.5">Crea preguntas nuevas con chispa</p>
            </div>
          </button>
        </div>

        {/* Featured: Sobre Postal Romántico con Sello de Lacre */}
        {dailyQuestion && (
          <div
            onClick={() => setActiveQuestion(dailyQuestion)}
            className="relative bg-[#FAF5EE] border-2 border-[#E7D6C4] rounded-3xl p-5 shadow-xl shadow-stone-200/70 cursor-pointer overflow-hidden group transition-all hover:shadow-2xl active:scale-[0.99] select-none"
          >
            {/* Vintage Airmail Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[repeating-linear-gradient(45deg,#E11D48,#E11D48_10px,#FAF5EE_10px,#FAF5EE_18px,#2563EB_18px,#2563EB_28px,#FAF5EE_28px,#FAF5EE_36px)] opacity-75" />

            {/* Top Row: Postmark Stamp & Category */}
            <div className="flex items-start justify-between relative z-10 pt-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300/80 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-600" /> Carta del Día
                </span>
                <span className="text-[10px] text-stone-500 font-semibold italic">
                  Para {couple.partner1.name} & {couple.partner2.name}
                </span>
              </div>

              {/* Romantic Vintage Stamp */}
              <div className="border-2 border-dashed border-rose-300 bg-white/95 rounded-lg px-2 py-0.5 shadow-xs flex items-center space-x-1.5 rotate-2 group-hover:rotate-0 transition-transform">
                <span className="text-xs">📮</span>
                <div className="text-right">
                  <span className="text-[8px] font-black tracking-widest text-rose-800 block uppercase leading-none">HAZEL POST</span>
                  <span className="text-[10px] font-extrabold text-rose-600 leading-tight">+{dailyQuestion.rewardHearts} ❤️</span>
                </div>
              </div>
            </div>

            {/* Envelope Body with Question Title & Prompt */}
            <div className="my-3 relative z-10">
              <h3 className="text-base font-extrabold text-stone-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                {dailyQuestion.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1 line-clamp-2 italic leading-relaxed bg-white/80 p-2.5 rounded-2xl border border-stone-200/70 shadow-inner">
                "{dailyQuestion.prompt}"
              </p>
            </div>

            {/* Bottom Row: 3D Wax Seal & Interactive Button */}
            <div className="mt-2 pt-3 border-t border-[#E8DACB] flex items-center justify-between relative z-10">
              {/* 3D Wax Seal with embossed Heart */}
              <div className="flex items-center space-x-2.5">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-amber-950 shadow-md shadow-rose-900/30 flex items-center justify-center border-2 border-red-400/50 group-hover:scale-110 transition-transform">
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-red-300/40" />
                  <Heart className="w-4 h-4 fill-white text-white drop-shadow-xs animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-rose-800 block">
                    {dailyRecord?.isRevealed ? 'Sello Abierto' : 'Sello de Lacre'}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-600">
                    {dailyRecord?.isRevealed ? '¡Ambos leyeron! ✨' : 'Revelación secreta 🔒'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="px-3.5 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-200 group-hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>{dailyRecord?.isRevealed ? 'Ver Carta' : 'Abrir Sobre'}</span>
                <span className="text-xs">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div>
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-rose-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions Cards List */}
        <div className="space-y-2.5">
          {filteredQuestions.map((q) => {
            const status = getQuestionStatus(q.id);

            return (
              <div
                key={q.id}
                onClick={() => setActiveQuestion(q)}
                className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-start space-x-3 min-w-0 flex-1 pr-2">
                  <span className="text-2xl p-2 bg-stone-50 rounded-2xl border border-stone-100 flex-shrink-0">
                    {q.categoryEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        {q.categoryLabel}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-800 mt-0.5 truncate group-hover:text-rose-600 transition-colors">
                      {q.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {q.prompt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-500 block">+{q.rewardHearts}❤️</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer Modal */}
      {activeQuestion && (
        <AnswerModal question={activeQuestion} onClose={() => setActiveQuestion(null)} />
      )}

      {/* Topic Roulette Modal */}
      <TopicRouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        onSelectQuestion={(q) => setActiveQuestion(q)}
      />

      {/* Infinite Question Generator Modal */}
      <InfiniteQuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onOpenAnswer={(q) => setActiveQuestion(q)}
      />

      {/* Create Custom Question Modal */}
      <CreateQuestionModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Memory Book View */}
      <MemoryBookView isOpen={isMemoryBookOpen} onClose={() => setIsMemoryBookOpen(false)} />
    </div>
  );
};
