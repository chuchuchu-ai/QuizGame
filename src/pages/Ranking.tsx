import { useState } from 'react';
import { readRankings } from '../utils/ranking';
export function Ranking({ onStart }: { onStart: () => void }) {
  const [data] = useState(() => { try { return { entries: readRankings(), error: false }; } catch { return { entries: [], error: true }; } });
  return <section className="ranking-layout"><div className="section-heading"><span className="eyebrow">THE CURIOSITY CLUB</span><h1>상식의 전당</h1><p className="muted">차곡차곡 쌓이는 나의 도전 기록</p></div>
    <div className="card ranking-card"><div className="ranking-title"><h2>이 브라우저의 랭킹</h2><span className="badge">TOP 100</span></div>
      {data.error ? <p className="empty" role="alert">랭킹을 불러오지 못했습니다. 브라우저 저장 권한 또는 기록 데이터를 확인해주세요.</p> : data.entries.length === 0 ? <div className="empty"><span aria-hidden="true">☆</span><h3>첫 번째 주인공을 기다려요</h3><p>퀴즈를 풀고 첫 기록을 남겨보세요.</p></div> : <div className="table-scroll"><table><caption className="sr-only">점수 높은 순, 동점은 먼저 등록한 순서</caption><thead><tr><th scope="col">순위</th><th scope="col">닉네임</th><th scope="col">점수</th><th scope="col">정답률</th><th scope="col">플레이 날짜</th></tr></thead><tbody>{data.entries.map((entry, index) => <tr key={entry.id}><td><span className={index < 3 ? 'rank-medal' : ''}>{index + 1}</span></td><td className="nickname-cell">{entry.nickname}</td><td><strong>{entry.score}</strong></td><td>{entry.correctCount / 40 * 100}%</td><td>{new Date(entry.playedAt).toLocaleDateString('ko-KR')}</td></tr>)}</tbody></table></div>}
    </div><p className="footnote">점수가 같으면 먼저 등록한 기록이 앞에 표시됩니다.<br />이 기기의 현재 브라우저 기록만 표시되며, 브라우저 데이터를 지우면 기록도 삭제됩니다.</p><button className="primary" onClick={onStart}>새로운 도전 시작 →</button>
  </section>;
}
