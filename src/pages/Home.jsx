import { Link } from 'react-router-dom';

const recoveryImages = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
];

const nextSteps = [
  ['Check in with yourself', 'A short adaptive check-in can help you notice patterns and decide on a practical next step.', '/questionnaire', 'Start check-in'],
  ['Talk it through', 'Ask general questions about stress, sleep, low mood, relationships, or finding professional support.', '/chat', 'Open chat'],
  ['Read trusted updates', 'Explore current mental-health reporting and research from curated sources.', '/articles', 'Browse articles'],
];

export default function Home() {
  return <>
    <section className="relative flex min-h-[32rem] items-center overflow-hidden border-b border-pink-200">
      <div className="absolute inset-0 z-0"><div className="flex h-full w-max animate-scroll-vertical">{[...recoveryImages, ...recoveryImages].map((src, index) => <img key={`${src}-${index}`} src={src} alt="" aria-hidden="true" fetchPriority={index === 0 ? 'high' : 'auto'} loading={index < 2 ? 'eager' : 'lazy'} width="600" height="800" className="h-full w-[65vw] object-cover sm:w-[42vw]" />)}</div></div>
      <div className="absolute inset-0 z-[1] bg-pink-900/55" aria-hidden />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.16em] text-pink-100">Mental wellbeing, one step at a time</p><h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-6xl">Your space to pause, reflect, and find support</h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-white/95">Mindcare offers general information and a supportive check-in—not a diagnosis or emergency service.</p><div className="mt-8 flex flex-wrap gap-4"><Link to="/questionnaire" className="rounded-lg bg-rose-500 px-5 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-rose-600">Start a wellbeing check-in</Link><Link to="/articles" className="rounded-lg border-2 border-white/90 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">Browse latest articles</Link></div><Link to="/support" className="mt-5 inline-block text-sm font-semibold text-white underline underline-offset-4">Need urgent help now? Find support →</Link></div>
    </section>
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.12em] text-rose-600">Choose what feels right today</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your next step can be small</h2><p className="mt-3 max-w-2xl leading-relaxed text-slate-700">Choose the option that matches what you need now. You do not need to have everything figured out.</p><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{nextSteps.map(([title, description, to, action], index) => <article key={title} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-pink-300 hover:shadow-md"><span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 font-bold text-rose-600">0{index + 1}</span><h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">{description}</p><Link to={to} className="mt-5 inline-block text-sm font-bold text-rose-700 hover:text-rose-900">{action} <span aria-hidden="true">→</span></Link></article>)}</div></section>
  </>;
}
