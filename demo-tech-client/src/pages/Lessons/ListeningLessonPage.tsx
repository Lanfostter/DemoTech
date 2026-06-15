import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import { getLessonContent } from '../../services/module.service';
import type { ListeningContent, ReadingQuestion, ScriptLine } from '../../models/learning';
import {
  PlayIcon,
  PauseIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface LocationState {
  lessonTitle?: string;
}

interface QuestionState {
  selected: string | null;
  submitted: boolean;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

// Deterministic waveform bars from a seed string
function buildWaveform(seed: string, count = 60): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    const h = ((seed.charCodeAt(i % seed.length) * (i + 7) * 13) % 80) + 20;
    bars.push(h);
  }
  return bars;
}

export default function ListeningLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [content, setContent] = useState<ListeningContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showScript, setShowScript] = useState(true);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'listen' | 'quiz'>('listen');
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const waveformRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const lessonTitle = state?.lessonTitle ?? 'Bài nghe';

  useEffect(() => {
    if (!lessonId) return;
    getLessonContent(lessonId)
      .then(c => setContent(JSON.parse(c.contentJson) as ListeningContent))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Sync active script line
  useEffect(() => {
    if (!content) return;
    const line = content.script.find(s => currentTime >= s.startTime && currentTime < s.endTime);
    setActiveLineId(line?.id ?? null);
  }, [currentTime, content]);

  // Auto-scroll active line into view
  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeLineId]);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }, []);

  const onEnded = useCallback(() => setIsPlaying(false), []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(audio.currentTime);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seekTo(ratio * duration);
  };

  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const seekToLine = (line: ScriptLine) => {
    seekTo(line.startTime);
    const audio = audioRef.current;
    if (audio && !isPlaying) { audio.play().catch(() => {}); setIsPlaying(true); }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const waveform = content ? buildWaveform(content.audioUrl, 60) : [];

  const handleAnswerSelect = (qId: string, option: string) => {
    if (questionStates[qId]?.submitted) return;
    setQuestionStates(prev => ({ ...prev, [qId]: { selected: option, submitted: false } }));
  };

  const handleSubmitAnswer = (qId: string) => {
    setQuestionStates(prev => ({ ...prev, [qId]: { ...prev[qId], submitted: true } }));
  };

  const allAnswered = content?.questions.every(q => questionStates[q.id]?.submitted) ?? false;
  const correctCount = content?.questions.filter(q => {
    const s = questionStates[q.id];
    return s?.submitted && s.selected === q.answer;
  }).length ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl h-28 animate-pulse" style={{ background: COLORS.border }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bodyBg }}>
        <div className="text-center space-y-3">
          <p style={{ color: COLORS.textSecondary }}>Không tìm thấy nội dung bài nghe này.</p>
          <button onClick={() => navigate(-1)} style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer' }}>← Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bodyBg }}>
      <audio
        ref={audioRef}
        src={content.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} style={{ color: COLORS.textSecondary, background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate" style={{ color: COLORS.textPrimary }}>{lessonTitle}</h1>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>🎧 Nghe hiểu · {content.script.length} câu · {content.questions.length} câu hỏi</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: COLORS.border }}>
          {[
            { key: 'listen', label: 'Bài nghe', icon: DocumentTextIcon },
            { key: 'quiz', label: `Câu hỏi (${content.questions.length})`, icon: AcademicCapIcon },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'listen' | 'quiz')}
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

        {activeTab === 'listen' && (
          <div className="space-y-4">
            {/* Player card */}
            <div className="rounded-2xl p-5" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {/* Waveform */}
              <div
                ref={waveformRef}
                className="flex items-end gap-0.5 mb-4 cursor-pointer"
                style={{ height: 64 }}
                onClick={handleSeekClick}>
                {waveform.map((h, i) => {
                  const barProgress = (i / waveform.length) * 100;
                  const isPast = barProgress <= progressPct;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-colors"
                      style={{
                        height: `${h}%`,
                        background: isPast ? COLORS.primary : `${COLORS.primary}30`,
                        minWidth: 2,
                      }}
                    />
                  );
                })}
              </div>

              {/* Time */}
              <div className="flex items-center justify-between text-xs mb-4" style={{ color: COLORS.textMuted }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={cycleSpeed}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: `${COLORS.primary}15`, color: COLORS.primary, border: 'none', cursor: 'pointer' }}>
                  {speed}x
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-105"
                  style={{ background: COLORS.primary }}>
                  {isPlaying
                    ? <PauseIcon className="w-6 h-6" />
                    : <PlayIcon className="w-6 h-6" style={{ marginLeft: 2 }} />
                  }
                </button>

                <button
                  onClick={() => setShowScript(s => !s)}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
                  style={{ background: showScript ? `${COLORS.primary}15` : COLORS.bodyBg, color: showScript ? COLORS.primary : COLORS.textSecondary, border: `1px solid ${showScript ? COLORS.primary : COLORS.border}`, cursor: 'pointer' }}>
                  {showScript ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  Script
                </button>
              </div>
            </div>

            {/* Script */}
            {showScript && (
              <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div className="px-5 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <p className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Script — click vào câu để tua đến đó</p>
                </div>
                <div className="p-4 space-y-1 max-h-72 overflow-y-auto">
                  {content.script.map(line => {
                    const isActive = line.id === activeLineId;
                    return (
                      <div
                        key={line.id}
                        ref={isActive ? activeLineRef : null}
                        onClick={() => seekToLine(line)}
                        className="px-3 py-2 rounded-xl text-sm cursor-pointer transition-all"
                        style={{
                          background: isActive ? `${COLORS.primary}12` : 'transparent',
                          color: isActive ? COLORS.primary : COLORS.textPrimary,
                          fontWeight: isActive ? 600 : 400,
                          borderLeft: isActive ? `3px solid ${COLORS.primary}` : '3px solid transparent',
                        }}>
                        <span className="text-xs mr-2" style={{ color: COLORS.textMuted }}>{formatTime(line.startTime)}</span>
                        {line.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vocab */}
            <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div className="px-5 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <h3 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>Từ vựng ({content.vocabulary.length} từ)</h3>
              </div>
              <div className="divide-y" style={{ borderColor: COLORS.border }}>
                {content.vocabulary.map((v, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3">
                    <span className="font-medium text-sm w-36 flex-shrink-0" style={{ color: COLORS.textPrimary }}>{v.word}</span>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: COLORS.primary }}>{v.definition}</p>
                      {v.example && <p className="text-xs italic mt-0.5" style={{ color: COLORS.textSecondary }}>"{v.example}"</p>}
                    </div>
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
                    {correctCount === content.questions.length ? 'Xuất sắc!' : 'Xem lại phần giải thích bên dưới.'}
                  </p>
                </div>
              </div>
            )}

            {content.questions.map((q, idx) => (
              <ListeningQuestionCard
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

function ListeningQuestionCard({ question, index, state, onSelect, onSubmit }: {
  question: ReadingQuestion;
  index: number;
  state: QuestionState;
  onSelect: (opt: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.cardBg, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
          <span style={{ color: COLORS.textMuted }}>Câu {index}. </span>{question.text}
        </p>
      </div>
      <div className="p-4 space-y-2">
        {question.options.map(opt => {
          const letter = opt.charAt(0);
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
            className="px-4 py-2 rounded-lg text-sm font-semibold"
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
