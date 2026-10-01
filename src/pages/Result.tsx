import { useState } from 'react';
import type { QuizState, RankingEntry } from '../types/quiz';
import { categoryResults } from '../utils/quiz';
import { saveRanking } from '../utils/ranking';
export function Result({ game, entryId, onStart, onRanking }: { game: QuizState; entryId: string; onStart: () => void; onRanking: () => void }) {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);
  function register(event: React.FormEvent) {
    event.preventDefault();
    if (saved) return;
    if (!nickname.trim()) { setMessage('닉네임을 입력해주세요.'); return; }
    const entry: RankingEntry = { id: entryId, nickname: nickname.trim(), score: game.score, correctCount: game.correctCount, playedAt: new Date().toISOString() };
    try { saveRanking(entry); setSaved(true); setMessage('점수가 등록되었습니다! 랭킹에서 확인해보세요.'); }
    catch { setMessage('기록을 저장하지 못했습니다. 브라우저 저장 공간이나 저장 권한을 확인해주세요. 기존 기록은 덮어쓰지 않았습니다.'); }
  }
  return <section className="result-layout">
    <div className="section-heading"><span className="eyebrow">CHALLENGE COMPLETE</span><h1>40개의 도전, 완료!</h1><p className="muted">오늘 알게 된 상식이 하나 더 쌓였어요.</p></div>
    <div className="result-grid"><div className="card result-score"><span>나의 최종 점수</span><div className="big-score">{game.score}<small> / 400</small></div><div className="result-stats"><div><strong>{game.correctCount}</strong>정답</div><div><strong>{40 - game.correctCount}</strong>오답</div><div><strong>{game.correctCount / 40 * 100}%</strong>정답률</div></div></div>
      <div className="card category-results"><h2>분야별 성적</h2>{categoryResults(game).map(row => <div className="category-row" key={row.category}><span>{row.category}</span><div className="mini-bar"><span style={{ width: `${row.correct / row.total * 100}%` }} /></div><strong>{row.correct} / {row.total}</strong></div>)}</div></div>
    <form className="card register" onSubmit={register} noValidate><h2>나의 도전을 기록해요</h2><label htmlFor="nickname">닉네임 <span className="muted">(최대 20자)</span></label><div className="input-row"><input id="nickname" maxLength={20} value={nickname} disabled={saved} placeholder="예: 호기심 대장" autoComplete="nickname" aria-describedby="save-message" onChange={e => setNickname(e.target.value)} /><button className="primary" disabled={saved} type="submit">{saved ? '등록 완료' : '점수 등록'}</button></div><p id="save-message" className="form-message" role="status">{message}</p><p className="footnote">기록은 이 브라우저에 저장됩니다.</p></form>
    <div className="actions"><button className="primary" onClick={onStart}>다시 플레이</button><button className="secondary" onClick={onRanking}>랭킹 보기</button></div>
  </section>;
}
