import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { QUESTIONS, LIKERT_LABELS } from "@/lib/quiz-data";

const LEVEL_LABELS: Record<string, string> = {
  high: "Tinggi",
  growing: "Berkembang",
  low: "Rendah",
};

const CATEGORY_LABELS: Record<string, string> = {
  self: "Self Awareness",
  child: "Child Awareness",
  parenting: "Parenting Awareness",
};

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { registration, result, answers } = await req.json();
    const { name, email, phone } = registration;

    const scoreRows = result.scores
      .map(
        (s: { label: string; score: number; maxScore: number; level: string }) =>
          `<tr>
            <td style="padding:6px 12px;border:1px solid #e5e7eb;">${s.label}</td>
            <td style="padding:6px 12px;border:1px solid #e5e7eb;text-align:center;">${s.score}/${s.maxScore}</td>
            <td style="padding:6px 12px;border:1px solid #e5e7eb;text-align:center;">${LEVEL_LABELS[s.level] ?? s.level}</td>
          </tr>`
      )
      .join("");

    const categories = ["self", "child", "parenting"] as const;
    const questionSections = categories
      .map((cat) => {
        const qs = QUESTIONS.filter((q) => q.category === cat);
        const rows = qs
          .map((q) => {
            const val = answers?.[q.id];
            const label = val != null ? (LIKERT_LABELS[val] ?? val) : "—";
            const score = val ?? "—";
            return `<tr>
              <td style="padding:5px 10px;border:1px solid #e5e7eb;color:#374151;font-size:13px;">${q.id}. ${q.text}</td>
              <td style="padding:5px 10px;border:1px solid #e5e7eb;text-align:center;font-weight:bold;color:#374151;font-size:13px;">${score}</td>
              <td style="padding:5px 10px;border:1px solid #e5e7eb;font-size:13px;color:#6b7280;">${label}</td>
            </tr>`;
          })
          .join("");
        return `
          <h4 style="margin:20px 0 6px;color:#1f2937;">${CATEGORY_LABELS[cat]}</h4>
          <table style="border-collapse:collapse;font-family:sans-serif;font-size:13px;width:100%;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:5px 10px;border:1px solid #e5e7eb;text-align:left;">Pertanyaan</th>
                <th style="padding:5px 10px;border:1px solid #e5e7eb;width:50px;">Nilai</th>
                <th style="padding:5px 10px;border:1px solid #e5e7eb;">Jawaban</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>`;
      })
      .join("");

    const html = `
      <h2 style="color:#1f2937;">📋 Quiz Parenting 360 — Peserta Baru</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;margin-bottom:16px;">
        <tr><td style="padding:4px 12px;font-weight:bold;">Nama</td><td style="padding:4px 12px;">${name}</td></tr>
        <tr><td style="padding:4px 12px;font-weight:bold;">Email</td><td style="padding:4px 12px;">${email}</td></tr>
        <tr><td style="padding:4px 12px;font-weight:bold;">HP / WA</td><td style="padding:4px 12px;">${phone}</td></tr>
        <tr><td style="padding:4px 12px;font-weight:bold;">Area Fokus</td><td style="padding:4px 12px;">${result.lowestLabel}</td></tr>
      </table>

      <h3 style="color:#1f2937;margin-top:24px;">Skor per Dimensi</h3>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:6px 12px;border:1px solid #e5e7eb;text-align:left;">Dimensi</th>
            <th style="padding:6px 12px;border:1px solid #e5e7eb;">Skor</th>
            <th style="padding:6px 12px;border:1px solid #e5e7eb;">Level</th>
          </tr>
        </thead>
        <tbody>${scoreRows}</tbody>
      </table>

      <h3 style="color:#1f2937;margin-top:28px;">Jawaban per Pertanyaan</h3>
      <p style="font-family:sans-serif;font-size:12px;color:#6b7280;margin:0 0 8px;">Skala 1–5: 1=Sangat Tidak Setuju · 2=Tidak Setuju · 3=Netral · 4=Setuju · 5=Sangat Setuju</p>
      ${questionSections}
    `;

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.OWNER_EMAIL!,
      subject: `[Parenting 360] ${name} baru selesaikan quiz`,
      html,
    });

    if (error) {
      console.error("resend error:", error);
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("notify error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
