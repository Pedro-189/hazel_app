import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Question } from '../../types/qa';
import { 
  X, 
  Heart, 
  Send, 
  Lock, 
  Sparkles, 
  MessageCircleHeart
} from 'lucide-react';

interface AnswerModalProps {
  question: Question | null;
  onClose: () => void;
}

const REACTION_EMOJIS = ['❤️', '🥹', '🥰', '😭', '😂', '🔥', '✨', '💌'];

export const AnswerModal: React.FC<AnswerModalProps> = ({ question, onClose }) => {
  const {
    couple,
    qa,
    activePartner,
    otherPartner,
    submitAnswer,
    addReactionToAnswer,
  } = useCouple();

  const [inputText, setInputText] = useState('');

  if (!question) return null;

  const record = qa.records[question.id];
  const isPartner1 = couple.activePartnerId === 'partner1';

  const myAnswer = isPartner1 ? record?.partner1Answer : record?.partner2Answer;
  const partnerAnswer = isPartner1 ? record?.partner2Answer : record?.partner1Answer;
  const isRevealed = record?.isRevealed ?? false;

  const myReaction = isPartner1 ? record?.reactions?.partner1Emoji : record?.reactions?.partner2Emoji;
  const partnerReaction = isPartner1 ? record?.reactions?.partner2Emoji : record?.reactions?.partner1Emoji;

  const handleSendAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    submitAnswer(question.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div
          style={{ backgroundColor: `${question.accentColor}18` }}
          className="p-4 border-b border-stone-100 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{question.categoryEmoji}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                {question.categoryLabel}
              </span>
              <h3 className="text-base font-bold text-stone-800 line-clamp-1">{question.title}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-white rounded-full text-xs font-bold text-rose-600 shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>+{question.rewardHearts} ❤️</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Prompt Body */}
        <div className="p-4 bg-stone-50/70 border-b border-stone-100">
          <p className="text-sm font-semibold text-stone-800 leading-relaxed font-sans">
            "{question.prompt}"
          </p>
          {question.isCustom && (
            <p className="text-[10px] text-stone-400 mt-1 italic">
              Escrita con amor por {question.createdBy === 'partner1' ? couple.partner1.name : couple.partner2.name} 💌
            </p>
          )}
        </div>

        {/* Dynamic Answer Status Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* CASE 1: BOTH REVEALED (Celebration!) */}
          {isRevealed ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl text-white shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                  <div>
                    <h4 className="text-xs font-bold">¡Respuestas Reveladas!</h4>
                    <p className="text-[10px] text-rose-100">Ambos abrieron su corazón 💕</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
                  +{question.rewardHearts} ❤️ Ganados
                </span>
              </div>

              {/* My Answer Box */}
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg">{activePartner.avatar}</span>
                    <span className="text-xs font-bold text-rose-900">Tu Respuesta ({activePartner.name})</span>
                  </div>
                  {myReaction && (
                    <span className="text-sm bg-white px-2 py-0.5 rounded-full shadow-xs">
                      Reacción: {myReaction}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl shadow-xs">
                  {myAnswer}
                </p>
              </div>

              {/* Partner's Answer Box */}
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg">{otherPartner.avatar}</span>
                    <span className="text-xs font-bold text-sky-900">Respuesta de {otherPartner.name}</span>
                  </div>
                  {partnerReaction && (
                    <span className="text-sm bg-white px-2 py-0.5 rounded-full shadow-xs">
                      Reacción: {partnerReaction}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed bg-white/80 p-3 rounded-xl shadow-xs">
                  {partnerAnswer}
                </p>
              </div>

              {/* Reaction Emojis Bar */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-stone-600 block mb-1.5">
                  ¿Cómo te hizo sentir su respuesta?
                </span>
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReactionToAnswer(question.id, emoji)}
                      className={`text-lg p-2 rounded-xl bg-stone-100 hover:bg-rose-100 transition-transform active:scale-125 ${
                        myReaction === emoji ? 'bg-rose-200 ring-2 ring-rose-400 scale-110' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : myAnswer ? (
            /* CASE 2: I HAVE ANSWERED, WAITING FOR PARTNER (Blind Lock) */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3">
                <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Respuesta guardada en secreto 🔒</h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Esperando a que {otherPartner.name} ({otherPartner.avatar}) responda para revelar lo que ambos escribieron.
                  </p>
                </div>
              </div>

              {/* Preview of my answer */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Tu respuesta:</span>
                <p className="text-xs text-stone-700 font-medium italic">"{myAnswer}"</p>
              </div>

              {/* Mystery Blurred Teaser for Partner's Answer */}
              <div className="bg-stone-100/80 border border-stone-200 border-dashed rounded-2xl p-5 text-center space-y-2">
                <span className="text-2xl">🤫</span>
                <h5 className="text-xs font-bold text-stone-700">La respuesta de {otherPartner.name}</h5>
                <p className="text-[11px] text-stone-400">
                  Permanecerá oculta hasta que {otherPartner.name} complete la pregunta.
                </p>
                {/* Simulated blurred text */}
                <div className="h-6 w-3/4 mx-auto bg-stone-300/60 rounded-md filter blur-xs select-none" />
              </div>
            </div>
          ) : (
            /* CASE 3: I HAVEN'T ANSWERED YET (Input Form) */
            <form onSubmit={handleSendAnswer} className="space-y-3">
              <div className="flex items-center space-x-2 text-stone-600 text-xs font-bold">
                <MessageCircleHeart className="w-4 h-4 text-rose-500" />
                <span>Escribe tu respuesta sincera:</span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Sé vulnerable, cariñoso/a o divertido/a... Tu pareja no verá tu respuesta hasta que ella/él también responda."
                rows={4}
                className="w-full p-3.5 text-xs bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all resize-none leading-relaxed"
                required
              />

              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>🔒 Mecanismo de revelación ciega</span>
                <span>+{question.rewardHearts} ❤️ al completar</span>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-rose-200 transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Respuesta Secreta</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
