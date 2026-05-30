'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowRight, RotateCcw } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  hasProgress: boolean;
}

export default function LandingPage({ onStart, hasProgress }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Header illustration */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warm-100 mb-6"
          >
            <span className="text-5xl">👨‍👩‍👧‍👦</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-900 mb-3">
            Parenting 360
          </h1>
          <p className="text-lg text-warm-600 font-medium">
            Quiz Kesadaran Orang Tua
          </p>
        </div>

        {/* Description card */}
        <Card className="border-warm-200 bg-white/80 backdrop-blur-sm shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-warm-800 text-center leading-relaxed">
                Temukan seberapa dalam kesadaran Anda sebagai orang tua melalui 3 dimensi:
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-warm-50">
                  <span className="text-2xl">🪞</span>
                  <div>
                    <p className="font-semibold text-warm-900">Self Awareness</p>
                    <p className="text-sm text-warm-600">Kesadaran terhadap diri sendiri</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-warm-50">
                  <span className="text-2xl">👶</span>
                  <div>
                    <p className="font-semibold text-warm-900">Child Awareness</p>
                    <p className="text-sm text-warm-600">Kesadaran terhadap anak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-warm-50">
                  <span className="text-2xl">🏡</span>
                  <div>
                    <p className="font-semibold text-warm-900">Parenting Awareness</p>
                    <p className="text-sm text-warm-600">Kesadaran terhadap pola asuh</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-sm text-warm-500 justify-center">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>30 pertanyaan · 5-10 menit · Tanpa penilaian salah</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            onClick={onStart}
            className="w-full h-14 text-lg font-semibold bg-warm-800 hover:bg-warm-900 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            Mulai Quiz
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {hasProgress && (
            <p className="text-center text-sm text-warm-500 flex items-center justify-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Anda memiliki progres tersimpan
            </p>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-warm-400 mt-8">
          Dibuat dengan ❤️ untuk orang tua yang ingin bertumbuh
        </p>
      </motion.div>
    </div>
  );
}
