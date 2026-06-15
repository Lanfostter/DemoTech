import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import { getLessonContent } from '../../services/module.service';
import { addVocabulary } from '../../services/vocabulary.service';
import type { ReadingContent, VocabEntry, ReadingQuestion } from '../../models/learning';
import {
  LanguageIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusCircleIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

interface LocationState {
  lessonTitle?: string;
  unitTitle?: string;
  moduleTitle?: string;
}

interface WordPopup {
  word: string;
  entry: VocabEntry;
  x: number;
  y: number;
}

interface QuestionState {
  selected: string | null;
  submitted: boolean;
}

export default function ReadingLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const articleRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState<ReadingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bilingual, setBilingual] = useState(false);
  const [popup, setPopup] = useState<WordPopup | null>(null);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const [activeTab, setActiveTab] = useState<'read' | 'quiz'>('read');

  const lessonTitle = state?.lessonTitle ?? 'Bài đọc';

  useEffect(() => {
    if (!lessonId) return;
    getLessonContent(lessonId)
      .then(c => setContent(JSON.parse(c.contentJson) as ReadingContent))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Dismiss popup on outside click
  useEffect(() => {
    const handler = () => setPopup(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const vocabMap = content
    ? Object.fromEntries(content.vocabulary.map(v => [v.word.toLowerCase(), v]))
    : {};

  const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
    e.stopPropagation();
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    const entry = vocabMap[clean];
    if (!entry) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const containerRect = articleRef.current?.getBoundingClientRect();
    setPopup({
      word: clean,
      entry,
      x: rect.left - (containerRect?.left ?? 0),
      y: rect.bottom - (containerRect?.top ?? 0) + 8,
    });
  };

  const handleAddVocab = async (entry: VocabEntry) => {
    try {
      await addVocabulary({ word: entry.word, definition: entry.definition, translation: entry.definition, example: entry.example ?? '' });
      setAddedWords(prev => new Set(prev).add(entry.word.toLowerCase()));
    } catch {
      // silently ignore duplicate
    }
    setPopup(null);
  };

  const renderParagraph = (text: string, paragraphIndex: number) => {
    return text.split(' ').map((token, i) => {
      const clean = token.toLowerCase().replace(/[^a-z]/g, '');
      const isVocab = !!vocabMap[clean];
      return (
        <span key={`${paragraphIndex}-${i}`}>
          <span
            onClick={isVocab ? e => handleWordClick(e, token) : undefined}
            style={{
              cursor: isVocab ? 'pointer' : 'text',
              borderBottom: isVocab ? `2px solid ${COLORS.primary}40` : 'none',
              color: isVocab ? COLORS.primary : 'inherit',
              fontWeight: isVocab ? 500 : 'inherit',
            }}>
            {token}
          </span>
          {' '}
        </span>
      );
    });
  };

  const handleAnswerSelect = (qId: string, option: string) => {
    if (questionStates[qId]?.submitted) return;
    setQuestionStates(prev => ({ ...prev, [qId]: { selected: option, submitted: false } }));
  };

  const handleSubmitAnswer = (qId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [qId]: { ...prev[qId], submitted: true },
    }));
  };

  const allAnswered = content?.questions.every(q => questionStates[q.id]?.submitted) ?? false;
  const correctCount = content?.questions.filter(q => {
    const s = questionStates[q.id];
    return s?.submitted && s.selected === q.answer;
  }).length ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl h-32 animate-pulse" style={{ background: COLORS.border }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <div className="text-center space-y-3">
          <p style={{ color: COLORS.textSecondary }}>Không tìm thấy nội dung bài học này.</p>
          <button onClick={() => navigate(-1)} style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} style={{ color: COLORS.textSecondary, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate" style={{ color: COLORS.textPrimary }}>{lessonTitle}</h1>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>📖 Đọc hiểu · {content.vocabulary.length} từ vựng · {content.questions.length} câu hỏi</p>
          </div>
          <button
            onClick={() => setBilingual(b => !b)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: bilingual ? COLORS.primary : COLORS.bodyBg,
              color: bilingual ? '#fff' : COLORS.textSecondary,
              border: `1px solid ${bilingual ? COLORS.primary : COLORS.border}`,
            }}>
            <LanguageIcon className="w-4 h-4" />
            {bilingual ? 'Song ngữ' : 'Tiếng Anh'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: COLORS.border }}>
          {[
            { key: 'read', label: 'Bài đọc', icon: BookOpenIcon },
            { key: 'quiz', label: `Câu hỏi (${content.questions.length})`, icon: AcademicCapIcon },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'read' | 'quiz')}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? COLORS.cardBg : 'transparent',
                color: activeTab === tab.key ? COLORS.textPrimary : COLORS.textSecondary,
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                border: 'none', cursor: 'pointer',
              }}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'read' && (
          <div className="space-y-4">
            {/* Article */}
            <div className="rounded-2xl p-6 relative" ref={articleRef}
              style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', lineHeight: '1.8', fontSize: '16px' }}>

              {content.paragraphs.map((para, i) => (
                <div key={i} className="mb-5 last:mb-0">
                  <p style={{ color: COLORS.textPrimary }}>
                    {renderParagraph(para.en, i)}
                  </p>
                  {bilingual && (
                    <p className="mt-2 pl-4 italic text-sm" style={{
                      color: COLORS.textSecondary,
                      borderLeft: `3px solid ${COLORS.primary}30`,
                    }}>
                      {para.vi}
                    </p>
                  )}
                </div>
              ))}

              {/* Word popup */}
              {popup && (
                <div
                  onClick={e => e.stopPropagation()}
                  className="absolute z-20 rounded-xl p-3 shadow-lg"
                  style={{
                    left: Math.min(popup.x, 300),
                    top: popup.y,
                    background: COLORS.cardBg,
                    border: `1px solid ${COLORS.border}`,
                    minWidth: 220,
                    maxWidth: 280,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="font-bold text-base" style={{ color: COLORS.textPrimary }}>{popup.entry.word}</span>
                      {popup.entry.phonetic && (
                        <span className="ml-2 text-xs" style={{ color: COLORS.textMuted }}>{popup.entry.phonetic}</span>
                      )}
                    </div>
                    <button onClick={() => setPopup(null)} style={{ color: COLORS.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm mb-1" style={{ color: COLORS.primary, fontWeight: 500 }}>{popup.entry.definition}</p>
                  {popup.entry.example && (
                    <p className="text-xs italic" style={{ color: COLORS.textSecondary }}>"{popup.entry.example}"</p>
                  )}
                  <button
                    onClick={() => handleAddVocab(popup.entry)}
                    disabled={addedWords.has(popup.word)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: addedWords.has(popup.word) ? `${COLORS.success}15` : `${COLORS.primary}15`,
                      color: addedWords.has(popup.word) ? COLORS.success : COLORS.primary,
                      border: 'none', cursor: addedWords.has(popup.word) ? 'default' : 'pointer',
                    }}>
                    {addedWords.has(popup.word)
                      ? <><CheckCircleIcon className="w-3.5 h-3.5" /> Đã thêm vào sổ từ</>
                      : <><PlusCircleIcon className="w-3.5 h-3.5" /> Thêm vào sổ từ</>
                    }
                  </button>
                </div>
              )}
            </div>

            {/* Vocab list */}
            <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="px-5 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <h3 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Từ vựng trong bài ({content.vocabulary.length} từ)</h3>
              </div>
              <div className="divide-y" style={{ borderColor: COLORS.border }}>
                {content.vocabulary.map((v, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm" style={{ color: COLORS.textPrimary }}>{v.word}</span>
                        {v.phonetic && <span className="text-xs" style={{ color: COLORS.textMuted }}>{v.phonetic}</span>}
                      </div>
                      <span className="text-sm" style={{ color: COLORS.primary }}>{v.definition}</span>
                      {v.example && <p className="text-xs italic mt-0.5" style={{ color: COLORS.textSecondary }}>"{v.example}"</p>}
                    </div>
                    <button
                      onClick={() => {
                        if (!addedWords.has(v.word.toLowerCase())) {
                          handleAddVocab(v);
                        }
                      }}
                      style={{ color: addedWords.has(v.word.toLowerCase()) ? COLORS.success : COLORS.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                      {addedWords.has(v.word.toLowerCase())
                        ? <CheckCircleIcon className="w-5 h-5" />
                        : <PlusCircleIcon className="w-5 h-5" />
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('quiz')}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: COLORS.primary }}>
              Làm câu hỏi →
            </button>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-4">
            {allAnswered && (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{
                background: correctCount === content.questions.length ? `${COLORS.success}15` : `${COLORS.warning}15`,
                border: `1px solid ${correctCount === content.questions.length ? COLORS.success : COLORS.warning}40`,
              }}>
                <span className="text-2xl">{correctCount === content.questions.length ? '🎉' : '📝'}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: COLORS.textPrimary }}>
                    Kết quả: {correctCount}/{content.questions.length} câu đúng
                  </p>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                    {correctCount === content.questions.length ? 'Xuất sắc! Bạn đã trả lời đúng tất cả.' : 'Xem lại phần giải thích bên dưới.'}
                  </p>
                </div>
              </div>
            )}

            {content.questions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx + 1}
                state={questionStates[q.id] ?? { selected: null, submitted: false }}
                onSelect={opt => handleAnswerSelect(q.id, opt)}
                onSubmit={() => handleSubmitAnswer(q.id)}
              />
            ))}

            {allAnswered && (
              <button
                onClick={() => navigate(`/lessons/${lessonId}/complete`, { state: { score: Math.round(correctCount / content.questions.length * 100) } })}
                className="w-full py-3 rounded-xl font-semibold text-white"
                style={{ background: COLORS.primary }}>
                Hoàn thành bài học →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ question, index, state, onSelect, onSubmit }: {
  question: ReadingQuestion;
  index: number;
  state: QuestionState;
  onSelect: (opt: string) => void;
  onSubmit: () => void;
}) {
  const optionLetter = (opt: string) => opt.charAt(0);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
          <span style={{ color: COLORS.textMuted }}>Câu {index}. </span>{question.text}
        </p>
      </div>
      <div className="p-4 space-y-2">
        {question.options.map(opt => {
          const letter = optionLetter(opt);
          const isSelected = state.selected === letter;
          const isCorrect = state.submitted && letter === question.answer;
          const isWrong = state.submitted && isSelected && letter !== question.answer;

          let bg = COLORS.bodyBg;
          let borderColor = COLORS.border;
          let textColor = COLORS.textPrimary;
          if (isCorrect) { bg = `${COLORS.success}15`; borderColor = COLORS.success; textColor = COLORS.success; }
          else if (isWrong) { bg = `${COLORS.danger}10`; borderColor = COLORS.danger; textColor = COLORS.danger; }
          else if (isSelected) { bg = `${COLORS.primary}10`; borderColor = COLORS.primary; textColor = COLORS.primary; }

          return (
            <button
              key={opt}
              onClick={() => onSelect(letter)}
              disabled={state.submitted}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{ background: bg, border: `1px solid ${borderColor}`, color: textColor, cursor: state.submitted ? 'default' : 'pointer' }}>
              {opt}
            </button>
          );
        })}
      </div>
      {state.submitted ? (
        <div className="px-5 pb-4">
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background: `${COLORS.primary}08`, color: COLORS.textSecondary }}>
            💡 {question.explanation}
          </p>
        </div>
      ) : (
        <div className="px-5 pb-4">
          <button
            onClick={onSubmit}
            disabled={!state.selected}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: state.selected ? COLORS.primary : COLORS.border,
              color: state.selected ? '#fff' : COLORS.textMuted,
              border: 'none', cursor: state.selected ? 'pointer' : 'default',
            }}>
            Kiểm tra
          </button>
        </div>
      )}
    </div>
  );
}
