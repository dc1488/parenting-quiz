'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegistrationPageProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

export default function RegistrationPage({ onSubmit }: RegistrationPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Nomor HP wajib diisi';
    } else if (!/^[\d+\-\s()]{8,15}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor HP tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast({
        title: 'Lengkapi formulir',
        description: 'Harap isi semua data dengan benar.',
        variant: 'destructive',
      });
      return;
    }

    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() });
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
            <ShieldCheck className="w-7 h-7 text-warm-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-2">
            Hasil Quiz Parenting 360
          </h1>
          <p className="text-warm-600 leading-relaxed">
            Isi data Anda untuk mendapatkan hasil lengkap, rekomendasi personal, dan akses sesi khusus Parenting 360.
          </p>
        </motion.div>

        {/* Benefits card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-warm-200 bg-warm-50 shadow-sm mb-6">
            <CardContent className="p-5">
              <h3 className="font-bold text-warm-900 mb-3 text-sm">Yang akan Anda dapatkan:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-warm-700">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>Skor lengkap 3 dimensi kesadaran orang tua</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-warm-700">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>Interpretasi & rekomendasi personal</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-warm-700">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>Area fokus yang perlu diperkuat</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-warm-700">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>Akses sesi khusus <strong>Parenting 360 Workshop</strong></span>
                </li>
                <li className="flex items-start gap-2 text-sm text-warm-700">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span>Template komitmen orang tua</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Registration form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-warm-200 bg-white/90 backdrop-blur-sm shadow-md">
            <CardContent className="p-6">
              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-warm-800 font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-warm-500" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })); }}
                    placeholder="Masukkan nama lengkap Anda"
                    className={`h-12 border-warm-200 focus:border-warm-400 focus:ring-warm-400 bg-warm-50/50 ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-warm-800 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-warm-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
                    placeholder="contoh@email.com"
                    className={`h-12 border-warm-200 focus:border-warm-400 focus:ring-warm-400 bg-warm-50/50 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-warm-800 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-warm-500" />
                    Nomor HP / WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: '' })); }}
                    placeholder="08xxxxxxxxxx"
                    className={`h-12 border-warm-200 focus:border-warm-400 focus:ring-warm-400 bg-warm-50/50 ${errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-3 pb-8"
        >
          <Button
            onClick={handleSubmit}
            className="w-full h-14 text-lg font-semibold bg-warm-800 hover:bg-warm-900 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            Dapatkan Hasil Sekarang
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-center text-xs text-warm-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Data Anda aman & hanya digunakan untuk sesi Parenting 360
          </p>
        </motion.div>
      </div>
    </div>
  );
}
