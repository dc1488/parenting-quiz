'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  CATEGORY_ICONS,
  getLevelLabel,
  type QuizResult,
} from '@/lib/quiz-data';
import { Copy, RotateCcw, Check, Heart, PenLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommitmentPageProps {
  result: QuizResult;
  commitment: string;
  onSaveCommitment: (text: string) => void;
  onReset: () => void;
}

export default function CommitmentPage({
  result,
  commitment: savedCommitment,
  onSaveCommitment,
  onReset,
}: CommitmentPageProps) {
  const [commitment, setCommitment] = useState(savedCommitment);
  const [isSaved, setIsSaved] = useState(!!savedCommitment);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!commitment.trim()) {
      toast({
        title: "Tulis komitmen Anda terlebih dahulu",
        description: "Komitmen membantu Anda tetap fokus pada area yang ingin diperkuat.",
        variant: "destructive",
      });
      return;
    }
    onSaveCommitment(commitment);
    setIsSaved(true);
    toast({
      title: "Komitmen tersimpan! 🎉",
      description: "Terima kasih telah berkomitmen untuk bertumbuh sebagai orang tua.",
    });
  };

  const handleCopy = async () => {
    const summary = generateSummary(result, commitment);
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast({
        title: "Berhasil disalin! 📋",
        description: "Ringkasan telah disalin ke clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = summary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast({
        title: "Berhasil disalin! 📋",
        description: "Ringkasan telah disalin ke clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            <PenLine className="w-7 h-7 text-warm-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-2">
            Komitmen Saya
          </h1>
          <p className="text-warm-600">
            Tuliskan komitmen Anda untuk bertumbuh sebagai orang tua
          </p>
        </motion.div>

        {/* Commitment textarea */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-warm-200 bg-white/90 backdrop-blur-sm shadow-md mb-6">
            <CardContent className="p-6">
              <Textarea
                value={commitment}
                onChange={(e) => {
                  setCommitment(e.target.value);
                  setIsSaved(false);
                }}
                placeholder="Komitmen saya sebagai orang tua mulai hari ini adalah..."
                className="min-h-[140px] text-base border-warm-200 focus:border-warm-400 focus:ring-warm-400 bg-warm-50/50 resize-none"
                disabled={isSaved}
              />
              {!isSaved && (
                <Button
                  onClick={handleSave}
                  className="w-full mt-4 bg-warm-800 hover:bg-warm-900 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Simpan Komitmen
                </Button>
              )}
              {isSaved && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                  <Check className="w-4 h-4" />
                  Komitmen Anda telah tersimpan
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary card */}
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-warm-300 bg-warm-50 shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-warm-900">Ringkasan Parenting 360</h3>
                </div>

                {/* Scores */}
                <div className="space-y-3 mb-5">
                  {result.scores.map((catScore) => (
                    <div key={catScore.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{CATEGORY_ICONS[catScore.category]}</span>
                        <span className="text-sm font-medium text-warm-800">{catScore.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-warm-900">
                          {catScore.score}/{catScore.maxScore}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-600">
                          {getLevelLabel(catScore.level)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Focus area */}
                <div className="p-3 bg-white rounded-lg border border-warm-200 mb-4">
                  <p className="text-xs font-medium text-warm-500 mb-1">Area Utama</p>
                  <p className="text-sm font-semibold text-warm-900">
                    {CATEGORY_ICONS[result.lowestCategory]} {result.lowestLabel}
                  </p>
                </div>

                {/* Commitment */}
                <div className="p-3 bg-white rounded-lg border border-warm-200">
                  <p className="text-xs font-medium text-warm-500 mb-1">Komitmen Saya</p>
                  <p className="text-sm text-warm-800 italic">&ldquo;{commitment}&rdquo;</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 pb-8"
        >
          {isSaved && (
            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full h-12 border-warm-200 text-warm-700 hover:bg-warm-50 rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Salin Ringkasan
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onReset}
            className="w-full h-12 border-warm-200 text-warm-600 hover:bg-warm-50 hover:text-warm-800 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Mulai Quiz Baru
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Generate a text summary for copying to clipboard
 */
function generateSummary(result: QuizResult, commitment: string): string {
  const lines: string[] = [];

  lines.push('🌟 Parenting 360 Quiz - Hasil Saya 🌟\n');

  result.scores.forEach((catScore) => {
    lines.push(
      `${CATEGORY_ICONS[catScore.category]} ${catScore.label}: ${catScore.score}/${catScore.maxScore} (${getLevelLabel(catScore.level)})`
    );
  });

  lines.push(`\n🎯 Area Utama: ${result.lowestLabel}`);
  lines.push(`\n📝 Komitmen Saya:\n"${commitment}"`);
  lines.push('\nDibuat dengan ❤️ melalui Parenting 360 Quiz');

  return lines.join('\n');
}
