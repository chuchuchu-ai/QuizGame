import type { QuizState } from '../types/quiz';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';
export function Quiz({ game, onAnswer, onNext }: { game: QuizState; onAnswer: (id: number, choice: number) => void; onNext: (id: number) => void }) {
  const question = game.questions[game.currentQuestionIndex];
  const answer = game.answers[game.currentQuestionIndex];
  return <section className="play-layout">
    <div className="quiz-top"><span>문제 <strong>{String(game.currentQuestionIndex + 1).padStart(2, '0')}</strong> / {game.questions.length}</span><span className="score">현재 점수 <strong>{game.score}점</strong></span></div>
    <ProgressBar value={game.answers.length} total={game.questions.length} />
    <div className="progress-caption">{game.answers.length}문제 완료 · {game.answers.length / game.questions.length * 100}%</div>
    <div className="card quiz-card"><QuizCard question={question} answer={answer} onAnswer={choice => onAnswer(question.id, choice)} />
      <button className="primary next" disabled={!answer} onClick={() => onNext(question.id)}>{game.currentQuestionIndex === game.questions.length - 1 ? '결과 보기' : '다음 문제'} <span aria-hidden="true">→</span></button>
    </div>
  </section>;
}
