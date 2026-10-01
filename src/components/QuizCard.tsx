import type { Question, UserAnswer } from '../types/quiz';

export function QuizCard({ question, answer, onAnswer }: { question: Question; answer?: UserAnswer; onAnswer: (choice: number) => void }) {
  return <>
    <span className="badge">{question.category}</span>
    <h1 className="question" tabIndex={-1}>{question.question}</h1>
    <p className="muted">가장 알맞은 답을 하나 골라주세요.</p>
    <div className="choices">
      {question.choices.map((choice, index) => {
        const correct = !!answer && index === question.answer;
        const wrong = !!answer && index === answer.choice && !answer.correct;
        return <button key={index} className={`choice ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
          disabled={!!answer} onClick={() => onAnswer(index)}>
          <span className="choice-number">{index + 1}</span><span>{choice}</span>
          {correct && <span className="choice-label">✓ 정답</span>}{wrong && <span className="choice-label">✕ 오답</span>}
        </button>;
      })}
    </div>
    <div aria-live="polite" aria-atomic="true">
      {answer && <section className={`feedback ${answer.correct ? 'success' : 'error'}`}>
        <strong>{answer.correct ? '정답입니다! +10점' : '오답입니다.'}</strong>
        {!answer.correct && <p>정답: {question.choices[question.answer]}</p>}
        <p>{question.explanation}</p>
      </section>}
    </div>
  </>;
}
