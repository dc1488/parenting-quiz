'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Eye, ArrowRight } from 'lucide-react';
import {
  type QuizResult,
  CATEGORY_ICONS,
  CATEGORIES,
} from '@/lib/quiz-data';

interface SneakPeekPageProps {
  result: QuizResult;
  onRegister: () => void;
}

export default function SneakPeekPage({ result, onRegister }: SneakPeekPageProps) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-100 mb-4">
            <Eye className="w-7 h-7 text-warm-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-2">
            Sneak Peek Hasil Anda
          </h1>
          <p className="text-warm-600">
            Ini gambaran singkat kesadaran Anda
          </p>
        </motion.div>

        {/* Global insight card from PDF data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-warm-300 bg-warm-50 shadow-md mb-6">
            <CardContent className="p-5">
              <h3 className="font-bold text-warm-900 mb-3 text-sm uppercase tracking-wide">
                Fakta Parenting Global
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🪞</span>
                  <div>
                    <p className="text-sm font-semibold text-warm-800">Self Awareness</p>
                    <p className="text-xs text-warm-600">60-70% orang tua masih <em>reactive</em> — merespon anak berdasarkan emosi saat itu.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">👶</span>
                  <div>
                    <p className="text-sm font-semibold text-warm-800">Child Awareness</p>
                    <p className="text-xs text-warm-600">50-60% orang tua merasa paham anak, tapi 70% anak merasa tidak didengarkan.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🏡</span>
                  <div>
                    <p className="text-sm font-semibold text-warm-800">Parenting Awareness</p>
                    <p className="text-xs text-warm-600">65-75% mengasuh berdasarkan pola warisan, kurang dari 30% yang sadar memilih polanya.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blurred score preview cards */}
        <div className="space-y-3 mb-6">
          {result.scores.map((catScore, index) => (
            <motion.div
              key={catScore.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-warm-200 bg-white/90 backdrop-blur-sm shadow-md overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{CATEGORY_ICONS[catScore.category]}</span>
                      <h3 className="font-semibold text-warm-900">{catScore.label}</h3>
                    </div>
                  </div>

                  {/* Blurred score bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-warm-600 mb-1.5">
                      <span>Skor Anda</span>
                      <span className="font-bold text-warm-900 blur-sm select-none">
                        {catScore.score}/{catScore.maxScore}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-warm-100 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(catScore.score / catScore.maxScore) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                        className="h-full rounded-full bg-warm-500 blur-[6px]"
                      />
                    </div>
                  </div>

                  {/* Teaser text */}
                  <div className="relative">
                    <p className="text-sm text-warm-700 blur-[3px] select-none leading-relaxed">
                      {catScore.interpretation.substring(0, 80)}...
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 bg-warm-100/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Lock className="w-3.5 h-3.5 text-warm-600" />
                        <span className="text-xs font-semibold text-warm-700">Kunci hasil lengkap</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Lowest category hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-warm-300 bg-warm-50 shadow-md mb-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎯</span>
                <h3 className="font-bold text-warm-900 text-sm">Area yang Perlu Diperkuat</h3>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-warm-200">
                <span className="text-3xl">{CATEGORY_ICONS[result.lowestCategory]}</span>
                <div>
                  <p className="font-bold text-warm-900 text-lg">{result.lowestLabel}</p>
                  <p className="text-sm text-warm-500">
                    Ada area yang bisa Anda tingkatkan...
                  </p>
                </div>
              </div>
              <p className="text-sm text-warm-600 mt-3">
                Daftar sesi khusus Parenting 360 untuk mendapatkan analisa lengkap, rekomendasi personal, dan komitmen Anda sebagai orang tua.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-8"
        >
          <Button
            onClick={onRegister}
            className="w-full h-14 text-lg font-semibold bg-warm-800 hover:bg-warm-900 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            Daftar Sesi Parenting 360
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-center text-xs text-warm-500 mt-3">
            Gratis · Dapatkan hasil lengkap + rekomendasi personal + sesi khusus
          </p>
        </motion.div>
      </div>
    </div>
  );
}
