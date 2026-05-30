'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LandingPage from '@/components/quiz/LandingPage';
import QuizPage from '@/components/quiz/QuizPage';
import SneakPeekPage from '@/components/quiz/SneakPeekPage';
import RegistrationPage from '@/components/quiz/RegistrationPage';
import ResultPage from '@/components/quiz/ResultPage';
import CommitmentPage from '@/components/quiz/CommitmentPage';
import { calculateResults, type QuizResult } from '@/lib/quiz-data';
import {
  saveAnswers,
  loadAnswers,
  loadCurrentQuestion,
  saveResult,
  loadResult,
  saveRegistration,
  loadRegistration,
  saveCommitment,
  loadCommitment,
  resetAllData,
  hasSavedProgress,
  hasRegistered,
  saveCurrentQuestion,
  type RegistrationData,
} from '@/lib/storage';

type AppPage = 'landing' | 'quiz' | 'sneak-peek' | 'register' | 'result' | 'commitment';

/**
 * Compute initial page from localStorage (client only)
 */
function getInitialPage(): AppPage {
  if (typeof window === 'undefined') return 'landing';
  const savedResult = loadResult();
  const registered = hasRegistered();
  const savedCommitment = loadCommitment();

  if (savedResult && registered) {
    return savedCommitment ? 'commitment' : 'result';
  }
  if (savedResult && !registered) {
    return 'register';
  }
  return 'landing';
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>(getInitialPage);
  const [answers, setAnswers] = useState<Record<number, number>>(() =>
    typeof window === 'undefined' ? {} : loadAnswers()
  );
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    typeof window === 'undefined' ? 0 : loadCurrentQuestion()
  );
  const [result, setResult] = useState<QuizResult | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadResult() as QuizResult | null;
  });
  const [commitment, setCommitment] = useState(() =>
    typeof window === 'undefined' ? '' : loadCommitment()
  );
  const [registration, setRegistration] = useState<RegistrationData | null>(() =>
    typeof window === 'undefined' ? null : loadRegistration()
  );
  const [hasProgress] = useState(() =>
    typeof window === 'undefined' ? false : hasSavedProgress()
  );

  // Key to force QuizPage remount on retake (ensures internal state resets)
  const [quizKey, setQuizKey] = useState(0);

  // Ref to always have latest answers in handleQuizComplete (avoids stale closure)
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Handle quiz answer
  const handleAnswer = useCallback(
    (questionId: number, value: number) => {
      setAnswers((prev) => {
        const updated = { ...prev, [questionId]: value };
        saveAnswers(updated);
        return updated;
      });
    },
    []
  );

  // Handle quiz question change (persist position)
  const handleQuestionChange = useCallback((index: number) => {
    setCurrentQuestion(index);
    saveCurrentQuestion(index);
  }, []);

  // Handle quiz complete → show sneak peek
  // Uses answersRef to always read the latest answers (fixes stale closure bug)
  const handleQuizComplete = useCallback(() => {
    const latestAnswers = answersRef.current;
    const quizResult = calculateResults(latestAnswers);
    setResult(quizResult);
    saveResult(quizResult);
    setCurrentPage('sneak-peek');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Start quiz
  const handleStartQuiz = useCallback(() => {
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Go to registration from sneak peek
  const handleGoToRegister = useCallback(() => {
    setCurrentPage('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle registration submit → show full results
  const handleRegistrationSubmit = useCallback((data: RegistrationData) => {
    setRegistration(data);
    saveRegistration(data);
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Go to commitment from results
  const handleGoToCommitment = useCallback(() => {
    setCurrentPage('commitment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save commitment
  const handleSaveCommitment = useCallback((text: string) => {
    setCommitment(text);
    saveCommitment(text);
  }, []);

  // Retake quiz — reset ALL state including currentQuestion
  const handleRetake = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    setRegistration(null);
    setCurrentQuestion(0);
    resetAllData();
    setQuizKey((prev) => prev + 1); // Force QuizPage to fully remount
    setCurrentPage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset everything — back to landing
  const handleReset = useCallback(() => {
    setAnswers({});
    setResult(null);
    setCommitment('');
    setRegistration(null);
    setCurrentQuestion(0);
    resetAllData();
    setQuizKey((prev) => prev + 1);
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'landing' && (
        <LandingPage onStart={handleStartQuiz} hasProgress={hasProgress} />
      )}
      {currentPage === 'quiz' && (
        <QuizPage
          key={quizKey}
          answers={answers}
          onAnswer={handleAnswer}
          onComplete={handleQuizComplete}
          onQuestionChange={handleQuestionChange}
          initialQuestion={currentQuestion}
        />
      )}
      {currentPage === 'sneak-peek' && result && (
        <SneakPeekPage result={result} onRegister={handleGoToRegister} />
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
