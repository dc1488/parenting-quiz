import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const LEVEL_LABELS: Record<string, string> = {
  high: "Tinggi",
  growing: "Berkembang",
  low: "Rendah",
};

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { registration, result } = await req.json();
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

    const html = `
      <h2>📋 Quiz Parenting 360 — Peserta Baru</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:4px 12px;font-weight:bold;">Nama</td><td style="padding:4px 12px;">${name}</td></tr>
        <tr><td style="padding:4px 12px;font-weight:bold;">Email</td><td style="padding:4px 12px;">${email}</td></tr>
        <tr><td style="padding:4px 12px;font-weight:bold;">HP / WA</td><td style="padding:4px 12px;">${phone}</td></tr>
        <tr><td style="padding:4px 12px;font-weight:bold;">Area Fokus</td><td style="padding:4px 12px;">${result.lowestLabel}</td></tr>
      </table>
      <h3 style="margin-top:20px;">Skor per Dimensi</h3>
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
