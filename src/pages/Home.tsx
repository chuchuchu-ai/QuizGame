import { categories } from '../types/quiz';
export function Home({ onStart, onRanking }: { onStart: () => void; onRanking: () => void }) {
  return <section className="home">
    <div className="eyebrow">A LITTLE CURIOSITY, EVERY DAY</div>
    <div className="hero-mark" aria-hidden="true">Q<span>40</span><i>?</i></div>
    <h1>알고 있던 것도,<br /><span>새롭게 알게 될 것도.</span></h1>
    <p className="intro">다섯 분야의 상식으로 채우는 작은 도전.<br />40개의 질문으로 나의 상식을 만나보세요.</p>
    <div className="home-stats"><div><strong>40</strong><span>문제</span></div><div><strong>5</strong><span>분야</span></div><div><strong>400</strong><span>만점</span></div></div>
    <div className="home-actions"><button className="primary" onClick={onStart}>게임 시작 <span aria-hidden="true">→</span></button><button className="secondary" onClick={onRanking}>랭킹 보기</button></div>
    <div className="category-chips">{categories.map((category, index) => <span key={category}><i className={`dot dot-${index}`} />{category}</span>)}</div>
    <p className="footnote">시간 제한 없이, 나만의 속도로 풀어보세요.</p>
  </section>;
}
