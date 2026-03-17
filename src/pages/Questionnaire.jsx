import { useState } from 'react';
import { Link } from 'react-router-dom';

const questions = [
  { id: 'q1', text: 'How often have you felt low or down in the last two weeks?', options: ['Rarely or not at all', 'Some days', 'More than half the days', 'Nearly every day'] },
  { id: 'q2', text: 'How would you rate your sleep quality recently?', options: ['Good', 'Fair', 'Poor', 'Very poor'] },
  { id: 'q3', text: 'How often do you feel anxious or worried?', options: ['Rarely', 'Sometimes', 'Often', 'Almost always'] },
  { id: 'q4', text: 'Do you have interest or pleasure in doing things?', options: ['Yes, as usual', 'A little less', 'Quite a bit less', 'Not at all'] },
  { id: 'q5', text: 'How is your energy level most days?', options: ['Good', 'Moderate', 'Low', 'Very low'] },
];

const articleSuggestions = {
  default: [
    { title: 'Understanding anxiety and simple coping strategies', slug: 'understanding-anxiety', category: 'Anxiety' },
    { title: 'Sleep and mental health: why rest matters', slug: 'sleep-mental-health', category: 'Wellness' },
    { title: 'Building resilience in difficult times', slug: 'building-resilience', category: 'Resilience' },
  ],
  anxiety: [
    { title: 'Understanding anxiety and simple coping strategies', slug: 'understanding-anxiety', category: 'Anxiety' },
    { title: 'Mindfulness and grounding techniques', slug: 'mindfulness-grounding', category: 'Mindfulness' },
    { title: 'When to seek professional help', slug: 'seeking-professional-help', category: 'Support' },
  ],
  mood: [
    { title: 'Managing low mood and motivation', slug: 'managing-low-mood', category: 'Mood' },
    { title: 'Sleep and mental health: why rest matters', slug: 'sleep-mental-health', category: 'Wellness' },
    { title: 'Building resilience in difficult times', slug: 'building-resilience', category: 'Resilience' },
  ],
  sleep: [
    { title: 'Sleep and mental health: why rest matters', slug: 'sleep-mental-health', category: 'Wellness' },
    { title: 'Mindfulness and grounding techniques', slug: 'mindfulness-grounding', category: 'Mindfulness' },
    { title: 'Understanding anxiety and simple coping strategies', slug: 'understanding-anxiety', category: 'Anxiety' },
  ],
};

function getSuggestions(answers) {
  const hasAnxiety = answers.q3 === 'Often' || answers.q3 === 'Almost always';
  const hasMood = answers.q1 === 'More than half the days' || answers.q1 === 'Nearly every day';
  const hasSleep = answers.q2 === 'Poor' || answers.q2 === 'Very poor';
  if (hasAnxiety) return articleSuggestions.anxiety;
  if (hasMood) return articleSuggestions.mood;
  if (hasSleep) return articleSuggestions.sleep;
  return articleSuggestions.default;
}

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [suggestions, setSuggestions] = useState(null);

  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;

  const handleAnswer = (value) => {
    const next = { ...answers, [currentQuestion.id]: value };
    setAnswers(next);
    if (isLastStep) {
      setSuggestions(getSuggestions(next));
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setSuggestions(null);
  };

  if (step >= questions.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-pink-200 p-8">
          <h2 className="text-2xl font-semibold text-black">Thank you for completing the questionnaire</h2>
          <p className="mt-2 text-gray-800">
            Based on your responses, we suggest these articles. They are for information only and do not replace professional care.
          </p>
          <ul className="mt-6 space-y-4">
            {suggestions.map((art, i) => (
              <li key={i} className="flex items-start gap-3 p-4 rounded-lg bg-pink-50 border border-pink-200">
                <span className="text-xs font-medium text-gray-700 uppercase">{art.category}</span>
                <span className="font-medium text-black">{art.title}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleRestart}
              className="rounded-lg border border-pink-300 bg-white text-black px-4 py-2 font-medium hover:bg-pink-50"
            >
              Retake questionnaire
            </button>
            <Link to="/#articles" className="rounded-lg bg-rose-400 text-white px-4 py-2 font-medium hover:bg-rose-500">
              Browse all articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-black">Mental wellness questionnaire</h1>
        <p className="mt-1 text-gray-800">Your answers help us suggest relevant articles. They are confidential and not stored.</p>
        <div className="mt-4 h-1.5 w-full bg-pink-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-400 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-700">Question {step + 1} of {questions.length}</p>
      </div>
      <div className="bg-white rounded-xl border border-pink-200 p-8">
        <h3 className="text-lg font-medium text-black">{currentQuestion.text}</h3>
        <ul className="mt-6 space-y-3">
          {currentQuestion.options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => handleAnswer(opt)}
                className="w-full text-left rounded-lg border border-pink-200 px-4 py-3 font-medium text-black hover:border-pink-400 hover:bg-pink-50 transition-colors"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
