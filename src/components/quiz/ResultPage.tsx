'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CATEGORY_ICONS,
  CATEGORY_DESCRIPTIONS,
  getLevelLabel,
  getLevelColor,
  type QuizResult,
} from '@/lib/quiz-data';
import type { RegistrationData } from '@/lib/storage';
import { ArrowRight, RotateCcw, Target, User } from 'lucide-react';

interface ResultPageProps {
  result: QuizResult;
  registration: RegistrationData;
  onRetake: () => void;
  onCommitment: () => void;
}

export default function ResultPage({ result, registration, onRetake, onCommitment }: ResultPageProps) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-100 mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-2">
            Hasil Lengkap Anda
          </h1>
          <p className="text-warm-600">
            Berikut analisa kesadaran Anda sebagai orang tua
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-warm-600 bg-warm-50 px-3 py-1.5 rounded-full">
            <User className="w-3.5 h-3.5" />
            <span>{registration.name}</span>
          </div>
        </motion.div>

        {/* Score cards */}
        <div className="space-y-4 mb-8">
          {result.scores.map((catScore, index) => (
            <motion.div
              key={catScore.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <Card className="border-warm-200 bg-white/90 backdrop-blur-sm shadow-md overflow-hidden">
                <CardContent className="p-5">
                  {/* Category header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{CATEGORY_ICONS[catScore.category]}</span>
                      <h3 className="font-semibold text-warm-900">{catScore.label}</h3>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${getLevelColor(
                        catScore.level
                      )}`}
                    >
                      {getLevelLabel(catScore.level)}
                    </span>
                  </div>

                  {/* Score bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-warm-600 mb-1.5">
                      <span>Skor</span>
                      <span className="font-bold text-warm-900">
                        {catScore.score}/{catScore.maxScore}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-warm-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(catScore.score / catScore.maxScore) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                        className={`h-full rounded-full ${
                          catScore.level === 'high'
                            ? 'bg-emerald-500'
                            : catScore.level === 'growing'
                            ? 'bg-amber-500'
                            : 'bg-orange-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-warm-500 mb-3">
                    {CATEGORY_DESCRIPTIONS[catScore.category]}
                  </p>

                  {/* Interpretation */}
                  <div
                    className={`text-sm p-3 rounded-lg border ${getLevelColor(
                      catScore.level
                    )}`}
                  >
                    {catScore.interpretation}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Focus area card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-warm-300 bg-warm-50 shadow-md mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-warm-700" />
                <h3 className="font-bold text-warm-900">Area Utama yang Perlu Diperkuat</h3>
              </div>
              <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg border border-warm-200">
                <span className="text-2xl">{CATEGORY_ICONS[result.lowestCategory]}</span>
                <div>
                  <p className="font-bold text-warm-900 text-lg">{result.lowestLabel}</p>
                  <p className="text-sm text-warm-600">
                    {CATEGORY_DESCRIPTIONS[result.lowestCategory]}
                  </p>
                </div>
              </div>
              <div className="text-sm text-warm-700 whitespace-pre-line leading-relaxed">
                {result.focusRecommendation}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Event CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-8"
        >
          <Card className="border-warm-200 shadow-lg overflow-hidden">
            {/* Banner image */}
            <img
              src="/event-banner.jpg"
              alt="Parenting 360: Home Sweet Home"
              className="w-full object-cover"
            />
            <CardContent className="p-6 bg-white">
              <h3 className="font-bold text-xl text-warm-900 mb-1">
                Parenting 360: Home Sweet Home
              </h3>
              <p className="text-warm-600 text-sm mb-4 italic">
                A workshop to create connection before correction
              </p>

              <div className="space-y-2 text-sm text-warm-700 mb-4">
                <div className="flex items-start gap-2">
                  <span>📅</span>
                  <span>Sabtu, 20 Juni 2026</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>🕙</span>
                  <span>10.00 – 12.00 WIB</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>📍</span>
                  <span>Eltima Corner — Jl. Bangka VIIIA No. B2, Pela Mampang, Mampang Prapatan, Jakarta Selatan</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>💰</span>
                  <div>
                    <p>Rp 175.000,-/orang/sesi</p>
                    <p>Rp 300.000,-/couple/sesi</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span>🎙️</span>
                  <div>
                    <p className="font-semibold text-warm-900">Andy Kertadjajadi</p>
                    <p className="text-warm-500 text-xs">Fasilitator Mindfulness & Visual Communication</p>
                  </div>
                </div>
              </div>

              <a
                href="https://bit.ly/MFT_360Series_20Jun26"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-14 bg-warm-800 hover:bg-warm-900 text-white text-base font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors duration-200"
              >
                Daftar Event
                <ArrowRight className="w-5 h-5" />
              </a>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-3 pb-8"
        >
          <Button
            variant="outline"
            onClick={onRetake}
            className="w-full h-12 border-warm-200 text-warm-700 hover:bg-warm-50 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Ulangi Quiz
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
