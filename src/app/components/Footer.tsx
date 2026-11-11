import { useState } from 'react';
import { Check, FilmSlate, Copy, DownloadSimple, GithubLogo, LinkedinLogo, EnvelopeSimple, MapPin, PaperPlaneTilt } from './icons';

const EMAIL = 'mevinbenty507@gmail.com';
const RESUME_URL = '/resume/Mevin_Benty_Resume.pdf';

const FIELD = 'mt-2 block w-full border border-white/20 bg-white/[0.04] px-4 font-sans text-sm normal-case tracking-normal text-white placeholder:text-white/35 transition-colors focus:border-[var(--highlight)] focus:outline-none';
const CHANNEL = 'flex items-center gap-3 bg-[var(--contact-card)] p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_var(--shadow-tint)]';

export function Footer({ onReplayIntro }: { onReplayIntro?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { window.location.href = `mailto:${EMAIL}`; }
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };
  return <footer id="contact" className="scroll-mt-[72px] bg-[var(--form-panel)]">
    <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.85fr_1.15fr]">
      <div className="on-highlight border-b border-[var(--contact-line)] bg-[var(--contact-panel)] px-5 py-16 text-[var(--contact-ink)] md:px-10 lg:border-b-0 lg:border-r lg:py-24">
        <p className="reveal-side label-mono text-[var(--contact-label)]">Contact channel</p>
        <h2 className="reveal mt-5 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.05em] md:text-6xl">Send the brief. I will map the system.</h2>
        <p className="reveal mt-7 max-w-md leading-relaxed text-[var(--contact-muted)]">Useful messages include the current workflow, the failure point, the target environment, and what needs to be automated or hardened.</p>
        <div className="reveal mt-10 grid gap-px border border-[var(--contact-line)] bg-[var(--contact-line)] sm:grid-cols-2">
          <button type="button" onClick={copyEmail} className={`${CHANNEL} group justify-between text-left sm:col-span-2`}>
            <span className="flex items-center gap-3"><EnvelopeSimple size={17} className="text-[var(--contact-accent)]" /><span><span className="label-mono block text-[var(--contact-faint)]">Email</span><span className="text-sm font-semibold">{EMAIL}</span></span></span>
            {copied ? <Check size={17} className="text-[var(--contact-accent)]" /> : <Copy size={17} className="transition-transform group-hover:scale-110" />}
            <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : 'Copy email address'}</span>
          </button>
          <a href="https://github.com/Mevinb" target="_blank" rel="noreferrer" className={CHANNEL}><GithubLogo size={17} className="text-[var(--contact-accent)]" /><span><span className="label-mono block text-[var(--contact-faint)]">GitHub</span><span className="text-sm font-semibold">@Mevinb</span></span></a>
          <a href="https://www.linkedin.com/in/mevin-benty-17305a322" target="_blank" rel="noreferrer" className={CHANNEL}><LinkedinLogo size={17} className="text-[var(--contact-accent)]" /><span><span className="label-mono block text-[var(--contact-faint)]">LinkedIn</span><span className="text-sm font-semibold">Mevin Benty</span></span></a>
          <div className="flex items-center gap-3 bg-[var(--contact-card)] p-5 sm:col-span-2"><MapPin size={17} className="text-[var(--contact-accent)]" /><span><span className="label-mono block text-[var(--contact-faint)]">Base</span><span className="text-sm font-semibold">Thrissur, Kerala / Remote-friendly</span></span></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={RESUME_URL} target="_blank" rel="noreferrer" download="Mevin_Benty_Resume.pdf" className="inline-flex items-center gap-2 border border-[var(--contact-line)] px-4 py-3 text-xs font-semibold text-[var(--contact-ink)] transition-colors hover:bg-[var(--contact-ink)] hover:text-[var(--contact-panel)] active:scale-[0.98]"><DownloadSimple size={15} /> Download résumé</a>
          {onReplayIntro && <button type="button" onClick={onReplayIntro} className="inline-flex items-center gap-2 border border-[var(--contact-ink)] bg-[var(--contact-ink)] px-4 py-3 text-xs font-semibold text-[var(--contact-panel)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"><FilmSlate size={15} /> Replay cinematic</button>}
        </div>
      </div>
      <div className="on-dark bg-[var(--form-panel)] px-5 py-16 text-white md:px-10 lg:py-24">
        <form onSubmit={submit} className="reveal border border-white/25 bg-[var(--form-card)] shadow-[18px_18px_0_var(--form-shadow)]">
          <div className="flex items-center justify-between border-b border-white/15 px-6 py-4"><span className="label-mono text-[var(--highlight)]">New inquiry</span><span className="label-mono text-white/50">Opens your mail app</span></div>
          <div className="space-y-5 p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="label-mono text-white/60">Name<input required type="text" name="name" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Anjali Menon" className={`${FIELD} h-12`} /></label>
              <label className="label-mono text-white/60">Email<input required type="email" name="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="anjali@studio.dev" className={`${FIELD} h-12`} /></label>
            </div>
            <label className="label-mono block text-white/60">Message<textarea required rows={6} name="message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Describe the workflow, bug, system, or build." className={`${FIELD} resize-none py-4`} /></label>
            <button type="submit" className="shine-button relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)] transition-transform active:scale-[0.99]"><span className="relative z-10">Send message</span> <PaperPlaneTilt size={15} className="relative z-10" /></button>
          </div>
        </form>
      </div>
    </div>
    <div className="border-t border-white/15 bg-[var(--form-panel)]"><div className="label-mono mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-5 py-7 text-white/50 sm:flex-row md:px-10"><span>© {new Date().getFullYear()} Mevin Benty</span><span>React / TypeScript / Tailwind</span></div></div>
  </footer>;
}
