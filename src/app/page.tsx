'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LandingPage from '@/components/quiz/LandingPage';
import QuizPage from '@/components/quiz/QuizPage';
import RegistrationPage from '@/components/quiz/RegistrationPage';
import ResultPage from '@/components/quiz/ResultPage';
import CommitmentPage from '@/components/quiz/CommitmentPage';
import { calculateResults, type QuizResult } from '@/lib/quiz-data';
import { type RegistrationData } from '@/lib/storage';

type AppPage = 'landing' | 'quiz' | 'register' | 'result' | 'commitment';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [commitment, setCommitment] = useState('');
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const resultRef = useRef(result);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const handleAnswer = useCallback((questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleQuizComplete = useCallback(() => {
    const quizResult = calculateResults(answersRef.current);
    setResult(quizResult);
    setCurrentPage('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartQuiz = useCallback(() => {
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRegistrationSubmit = useCallback((data: RegistrationData) => {
    setRegistration(data);
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const currentResult = resultRef.current;
    if (currentResult) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration: data, result: currentResult }),
      }).catch((err) => console.error('notify fetch failed:', err));
    } else {
      console.error('notify skipped: result is null');
    }
  }, []);

  const handleGoToCommitment = useCallback(() => {
    setCurrentPage('commitment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSaveCommitment = useCallback((text: string) => {
    setCommitment(text);
  }, []);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    setRegistration(null);
    setQuizKey((prev) => prev + 1);
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    setRegistration(null);
    setQuizKey((prev) => prev + 1);
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'landing' && (
        <LandingPage onStart={handleStartQuiz} />
      )}
      {currentPage === 'quiz' && (
        <QuizPage
          key={quizKey}
          answers={answers}
          onAnswer={handleAnswer}
          onComplete={handleQuizComplete}
        />
      )}
      {currentPage === 'register' && (
        <RegistrationPage onSubmit={handleRegistrationSubmit} />
      )}
      {currentPage === 'result' && result && registration && (
        <ResultPage
          result={result}
          registration={registration}
          onRetake={handleRetake}
          onCommitment={handleGoToCommitment}
        />
      )}
      {currentPage === 'commitment' && result && registration && (
        <CommitmentPage
          result={result}
          registration={registration}
          commitment={commitment}
          onSaveCommitment={handleSaveCommitment}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
