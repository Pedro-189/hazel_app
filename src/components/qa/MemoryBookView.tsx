import React from 'react';
import { useCouple } from '../../context/CoupleContext';
import { X, BookHeart } from 'lucide-react';

interface MemoryBookViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryBookView: React.FC<MemoryBookViewProps> = ({ isOpen, onClose }) => {
  const { allQuestions, qa, couple } = useCouple();

  if (!isOpen) return null;

  // Filter only questions that are revealed
  const revealedQuestions = allQuestions.filter((q) => {
    const record = qa.records[q.id];
    return record && record.isRevealed;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-50 rounded-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-200">
              <BookHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-800">Libro de Recuerdos</h3>
              <p className="text-xs text-stone-500">{revealedQuestions.length} momentos y respuestas guardadas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {revealedQuestions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-4xl">📖✨</span>
              <h4 className="text-sm font-bold text-stone-700">Aún no tienen recuerdos revelados</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Respondan preguntas juntos en el minijuego. Cuando ambos contesten una pregunta, se guardará aquí para siempre.
              </p>
            </div>
          ) : (
            revealedQuestions.map((question) => {
              const record = qa.records[question.id];
              return (
                <div
                  key={question.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                        {question.categoryEmoji} {question.categoryLabel}
                      </span>
                      <h4 className="text-xs font-bold text-stone-800 mt-0.5">{question.title}</h4>
                      <p className="text-xs text-stone-600 italic mt-1 font-serif">"{question.prompt}"</p>
                    </div>
                  </div>

                  {/* Answers Comparison Cards */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    {/* Partner 1 */}
                    <div className="p-2.5 bg-rose-50/70 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-rose-900">
                        <span>{couple.partner1.name} {couple.partner1.avatar}</span>
                        {record.reactions.partner1Emoji && (
                          <span className="text-xs bg-white px-1.5 py-0.5 rounded-full shadow-xs">
                            {record.reactions.partner1Emoji}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-700">{record.partner1Answer}</p>
                    </div>

                    {/* Partner 2 */}
                    <div className="p-2.5 bg-sky-50/70 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-sky-900">
                        <span>{couple.partner2.name} {couple.partner2.avatar}</span>
                        {record.reactions.partner2Emoji && (
                          <span className="text-xs bg-white px-1.5 py-0.5 rounded-full shadow-xs">
                            {record.reactions.partner2Emoji}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-700">{record.partner2Answer}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
