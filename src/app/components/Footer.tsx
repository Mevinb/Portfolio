import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, FilmSlate, Copy, DownloadSimple, GithubLogo, LinkedinLogo, EnvelopeSimple, MapPin, PaperPlaneTilt } from './icons';
import { getPublicAssetUrl } from '../../lib/supabase';

const EMAIL = 'mevinbenty507@gmail.com';
const RESUME_URL = getPublicAssetUrl('resume/Mevin_Benty_Resume.pdf');

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
      <div className="border-b border-[var(--contact-line)] bg-[var(--contact-panel)] px-5 py-16 text-[var(--contact-ink)] md:px-10 lg:border-b-0 lg:border-r lg:py-24">
        <motion.p initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="label-mono text-[#8d2c23]">Contact channel</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-5 max-w-xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-6xl">Send the brief. I will map the system.</motion.h2>
        <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }} className="mt-7 max-w-md leading-relaxed text-[var(--contact-muted)]">Useful messages include the current workflow, the failure point, the target environment, and what needs to be automated or hardened.</motion.p>
        <div className="mt-10 grid gap-px border border-[var(--contact-line)] bg-[var(--contact-line)] sm:grid-cols-2">
          <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} onClick={copyEmail} className="group flex items-center justify-between bg-[var(--contact-card)] p-5 text-left shadow-[0_0_0_rgba(10,18,40,0)] hover:shadow-[0_12px_28px_rgba(10,18,40,0.16)] sm:col-span-2"><span className="flex items-center gap-3"><EnvelopeSimple size={17} className="text-[#1557ff]" /><span><span className="label-mono block text-[#6e7480]">Email</span><span className="text-sm font-semibold">{EMAIL}</span></span></span>{copied ? <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }}><Check size={17} className="text-[#1557ff]" /></motion.span> : <Copy size={17} className="transition-transform group-hover:scale-110" />}</motion.button>
          <motion.a whileHover={{ y: -4 }} href="https://github.com/Mevinb" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[var(--contact-card)] p-5 hover:shadow-[0_12px_28px_rgba(10,18,40,0.16)]"><GithubLogo size={17} className="text-[#1557ff]" /><span><span className="label-mono block text-[#6e7480]">GitHub</span><span className="text-sm font-semibold">@Mevinb</span></span></motion.a>
          <motion.a whileHover={{ y: -4 }} href="https://www.linkedin.com/in/mevin-benty-17305a322" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[var(--contact-card)] p-5 hover:shadow-[0_12px_28px_rgba(10,18,40,0.16)]"><LinkedinLogo size={17} className="text-[#ff594d]" /><span><span className="label-mono block text-[#6e7480]">LinkedIn</span><span className="text-sm font-semibold">Mevin Benty</span></span></motion.a>
          <div className="flex items-center gap-3 bg-[var(--contact-card)] p-5 sm:col-span-2"><MapPin size={17} className="text-[#1557ff]" /><span><span className="label-mono block text-[#6e7480]">Base</span><span className="text-sm font-semibold">Thrissur, Kerala / Remote-friendly</span></span></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} href={RESUME_URL} target="_blank" rel="noreferrer" download="Mevin_Benty_Resume.pdf" className="inline-flex items-center gap-2 border border-[var(--contact-line)] px-4 py-3 text-xs font-semibold text-[var(--contact-ink)] transition-colors hover:bg-[var(--contact-ink)] hover:text-[var(--contact-panel)]"><DownloadSimple size={15} /> Download résumé</motion.a>
          {onReplayIntro && <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} type="button" onClick={onReplayIntro} className="inline-flex items-center gap-2 border border-[var(--contact-line)] bg-[var(--contact-ink)] px-4 py-3 text-xs font-semibold text-[var(--contact-panel)]"><FilmSlate size={15} /> Replay cinematic</motion.button>}
        </div>
      </div>
      <div className="bg-[var(--form-panel)] px-5 py-16 text-white md:px-10 lg:py-24">
        <motion.form initial={{ opacity: 0, y: 30, rotate: 0.8 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }} onSubmit={submit} className="border border-white/25 bg-[#151923] shadow-[18px_18px_0_rgba(21,87,255,0.55)]">
          <div className="flex items-center justify-between border-b border-white/15 px-6 py-4"><span className="label-mono text-[var(--highlight)]">New inquiry</span><span className="label-mono text-white/45">Mailto handoff</span></div>
          <div className="space-y-5 p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">{[['name', 'Name', 'Your name'], ['email', 'Email', 'you@example.com']].map(([name, label, placeholder]) => <label key={name} className="label-mono text-white/55">{label}<input required type={name === 'email' ? 'email' : 'text'} value={form[name as 'name' | 'email']} onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder={placeholder} className="mt-2 block h-12 w-full border border-white/20 bg-white/[0.04] px-4 font-sans text-sm text-white outline-none placeholder:text-white/30 focus:border-[var(--accent)]" /></label>)}</div>
            <label className="label-mono text-white/55">Message<textarea required rows={6} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Describe the workflow, bug, system, or build." className="mt-2 block w-full resize-none border border-white/20 bg-white/[0.04] p-4 font-sans text-sm text-white outline-none placeholder:text-white/30 focus:border-[var(--accent)]" /></label>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" className="shine-button relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden bg-[var(--signal)] text-sm font-semibold text-white"><span className="relative z-10">Send message</span> <PaperPlaneTilt size={15} className="relative z-10" /></motion.button>
          </div>
        </motion.form>
      </div>
    </div>
    <div className="border-t border-white/15 bg-[var(--form-panel)]"><div className="label-mono mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-5 py-7 text-white/45 sm:flex-row md:px-10"><span>© {new Date().getFullYear()} Mevin Benty</span><span>React / TypeScript / Tailwind</span></div></div>
  </footer>;
}
