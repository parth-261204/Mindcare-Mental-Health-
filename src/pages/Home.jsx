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
    <section className="relative flex min-h-[30rem] items-center overflow-hidden border-b border-pink-200">
      <div className="absolute inset-0 z-0"><div className="flex h-full w-max animate-scroll-vertical">{[...recoveryImages, ...recoveryImages].map((src, index) => <img key={`${src}-${index}`} src={src} alt="" aria-hidden className="h-full w-[65vw] object-cover sm:w-[42vw]" />)}</div></div>
      <div className="absolute inset-0 z-[1] bg-pink-900/55" aria-hidden />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-pink-100">Mental wellbeing, one step at a time</p><h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">Your space to pause, reflect, and find support</h1><p className="mt-5 max-w-xl text-lg text-white/95">Mindcare offers general information and a supportive check-in—not a diagnosis or emergency service.</p><div className="mt-8 flex flex-wrap gap-4"><Link to="/questionnaire" className="rounded-lg bg-rose-400 px-5 py-3 font-medium text-white shadow-md hover:bg-rose-500">Start a wellbeing check-in</Link><Link to="/articles" className="rounded-lg border-2 border-white/90 bg-white/10 px-5 py-3 font-medium text-white backdrop-blur-sm hover:bg-white/20">Browse latest articles</Link></div><Link to="/support" className="mt-5 inline-block text-sm font-medium text-white underline underline-offset-4">Need urgent help now? Find support →</Link></div>
    </section>
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-rose-600">Choose what feels right today</p><h2 className="mt-1 text-2xl font-semibold text-black">Your next step can be small</h2><p className="mt-2 max-w-2xl text-gray-800">Choose the option that matches what you need now. You do not need to have everything figured out.</p><div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{nextSteps.map(([title, description, to, action]) => <article key={title} className="rounded-xl border border-pink-200 bg-white p-6 transition-all hover:border-pink-300 hover:shadow-sm"><h3 className="text-lg font-semibold text-black">{title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-800">{description}</p><Link to={to} className="mt-4 inline-block text-sm font-medium text-rose-600 hover:text-rose-700">{action} →</Link></article>)}</div></section>
  </>;
}
