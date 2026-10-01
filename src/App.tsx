import { useEffect, useState } from 'react';
import { questions } from './data/questions';
import type { QuizState } from './types/quiz';
import { answerQuestion, createGame, nextQuestion } from './utils/quiz';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Result } from './pages/Result';
import { Ranking } from './pages/Ranking';

type Page = 'home' | 'quiz' | 'result' | 'ranking';
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [game, setGame] = useState<QuizState | null>(null);
  const [entryId, setEntryId] = useState('');
  function start() { setGame(createGame(questions)); setEntryId(crypto.randomUUID()); setPage('quiz'); }
  function home() {
    if (page === 'quiz' && !window.confirm('홈으로 이동하면 진행 중인 게임이 종료됩니다. 이동할까요?')) return;
    setPage('home');
  }
  function next(id: number) {
    if (!game || game.questions[game.currentQuestionIndex].id !== id || game.answers.length !== game.currentQuestionIndex + 1) return;
    if (game.answers.length === game.questions.length) setPage('result');
    else setGame(previous => previous ? nextQuestion(previous, id) : previous);
  }
  useEffect(() => {
    // 화면 전환을 키보드와 화면 읽기 도구 사용자도 바로 알아볼 수 있게 합니다.
    const heading = document.querySelector<HTMLElement>('main h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [page, game?.currentQuestionIndex]);
  return <div className="app-shell"><header><button className="brand" onClick={home} aria-label="QUIZ 40 홈"><span className="brand-icon">Q</span>QUIZ <strong>40</strong></button><span className="header-note">하루를 채우는 작은 호기심</span>{page !== 'home' && <button className="text-button" onClick={home}>홈으로</button>}</header>
    <main>{page === 'home' && <Home onStart={start} onRanking={() => setPage('ranking')} />}
      {page === 'quiz' && game && <Quiz game={game} onAnswer={(id, choice) => setGame(previous => previous ? answerQuestion(previous, id, choice) : previous)} onNext={next} />}
      {page === 'result' && game && <Result key={entryId} game={game} entryId={entryId} onStart={start} onRanking={() => setPage('ranking')} />}
      {page === 'ranking' && <Ranking onStart={start} />}
    </main><footer>QUIZ 40 <span>지식보다 즐거운 건, 알아가는 것.</span></footer></div>;
}
