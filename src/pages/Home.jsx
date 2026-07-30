import { Link } from 'react-router-dom';

const recoveryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    alt: 'Mindfulness and meditation',
    caption: 'Finding calm',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    alt: 'Person in nature',
    caption: 'Reconnecting',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    alt: 'Yoga and wellness',
    caption: 'Moving forward',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    alt: 'Support and connection',
    caption: 'Together',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80',
    alt: 'Peaceful morning',
    caption: 'New beginnings',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    alt: 'Quiet reflection',
    caption: 'Self-care',
  },
];

const articles = [
  {
    id: 1,
    title: 'Understanding anxiety and simple coping strategies',
    excerpt: 'Learn what anxiety is, why it happens, and evidence-based ways to manage daily worry and physical symptoms.',
    category: 'Anxiety',
    slug: 'understanding-anxiety',
  },
  {
    id: 2,
    title: 'Sleep and mental health: why rest matters',
    excerpt: 'How sleep affects mood, focus, and resilience, and practical steps to improve your sleep routine.',
    category: 'Wellness',
    slug: 'sleep-mental-health',
  },
  {
    id: 3,
    title: 'Building resilience in difficult times',
    excerpt: 'Ways to strengthen your emotional resilience and adapt to stress and change in a healthy way.',
    category: 'Resilience',
    slug: 'building-resilience',
  },
  {
    id: 4,
    title: 'When to seek professional help',
    excerpt: 'Signs that talking to a therapist or doctor could help, and how to take the first step.',
    category: 'Support',
    slug: 'seeking-professional-help',
  },
  {
    id: 5,
    title: 'Mindfulness and grounding techniques',
    excerpt: 'Simple exercises to stay present, reduce overwhelm, and calm your nervous system.',
    category: 'Mindfulness',
    slug: 'mindfulness-grounding',
  },
  {
    id: 6,
    title: 'Managing low mood and motivation',
    excerpt: 'Understanding low mood, small steps that help, and when it might be more than a rough patch.',
    category: 'Mood',
    slug: 'managing-low-mood',
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-pink-200 min-h-[28rem] sm:min-h-[32rem] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="flex h-full animate-scroll-vertical gap-0 w-max">
            {[...recoveryImages, ...recoveryImages].map((img) => (
              <div key={`${img.id}-${img.src}`} className="h-full w-[80vw] sm:w-[50vw] md:w-[40vw] flex-shrink-0">
                <img src={img.src} alt="" aria-hidden className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 z-[1] bg-pink-900/50" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight max-w-2xl drop-shadow-md">
            Your space for mental wellness
          </h1>
          <p className="mt-4 text-white/95 max-w-xl text-lg drop-shadow-sm">
            Access articles, understand your needs through a short questionnaire, and find support. You’re not alone.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/questionnaire"
              className="inline-flex items-center justify-center rounded-lg bg-rose-400 text-white px-5 py-2.5 font-medium hover:bg-rose-500 transition-colors shadow-md"
            >
              Start questionnaire
            </Link>
            <Link
              to="/articles"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/90 bg-white/10 text-white px-5 py-2.5 font-medium hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              Browse latest articles
            </Link>
          </div>
        </div>
      </section>

      <section id="articles" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold text-black mb-2">Articles</h2>
        <p className="text-gray-800 mb-8 max-w-2xl">
          Evidence-based reads on mental health, coping, and when to seek help. Complete the questionnaire to get suggestions tailored to you.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl border border-pink-200 p-6 hover:border-pink-300 hover:shadow-sm transition-all"
            >
              <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">{article.category}</span>
              <h3 className="mt-2 text-lg font-semibold text-black">{article.title}</h3>
              <p className="mt-2 text-gray-800 text-sm leading-relaxed">{article.excerpt}</p>
              <span className="mt-4 inline-block text-sm font-medium text-gray-700 hover:text-black">
                Read more →
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
