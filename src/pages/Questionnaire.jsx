import { useMemo, useState } from 'react';

const scale = [
  ['1', 'Not at all'], ['2', 'A little'], ['3', 'Somewhat'], ['4', 'A lot'], ['5', 'Extremely'],
];

const concernAreas = [
  ['depression', 'Low mood or loss of interest'], ['anxiety', 'Persistent worry or tension'],
  ['panic', 'Sudden surges of fear or physical panic'], ['social', 'Fear in social or performance situations'],
  ['ocd', 'Unwanted thoughts or repetitive behaviours'], ['ptsd', 'Distress linked to a difficult event'],
  ['bipolar', 'Unusually high energy or little need for sleep'], ['adhd', 'Attention, organisation, or restlessness'],
  ['psychosis', 'Unusual perceptions, beliefs, or feeling disconnected from reality'],
  ['burnout', 'Burnout or exhaustion'], ['stress', 'Ongoing stress'], ['insomnia', 'Sleep difficulties'],
  ['grief', 'Grief or a significant loss'], ['eating', 'Food, eating, or body-image concerns'],
  ['substance', 'Alcohol, drugs, or other substance use'], ['health', 'Worry about health or illness'],
  ['emotion', 'Intense or hard-to-manage emotions'], ['loneliness', 'Loneliness or isolation'],
  ['work', 'Work or study stress'], ['relationship', 'Relationship or family distress'],
];

const clusterDetails = {
  depression: ['Depression', 'PHQ-9', 'During this time, how often have low mood, reduced interest, or low motivation affected you?'],
  anxiety: ['Generalized Anxiety', 'GAD-7', 'How often have worry, tension, or difficulty switching off affected you?'],
  panic: ['Panic Disorder', 'PDSS-SR', 'How often have you had sudden episodes of intense fear with physical symptoms such as a racing heart, breathlessness, or dizziness?'],
  social: ['Social Anxiety', 'Mini-SPIN', 'How often has fear of being judged led you to avoid or endure social, meeting, or performance situations?'],
  ocd: ['OCD', 'OCI-R', 'How often have unwanted thoughts or urges, or repeated checking, cleaning, counting, or reassurance-seeking, felt hard to resist?'],
  ptsd: ['PTSD', 'PCL-5', 'How often have memories, reminders, avoidance, or feeling on edge related to a distressing event affected you?'],
  bipolar: ['Bipolar-spectrum symptoms', 'MDQ', 'How often have you had periods of unusually high energy, less need for sleep, racing thoughts, or impulsive behaviour that felt unlike you?'],
  adhd: ['ADHD-related symptoms', 'ASRS', 'How often have difficulties with attention, organisation, forgetfulness, or restlessness affected you across settings?'],
  psychosis: ['Psychosis-related experiences', 'PQ-B', 'How often have unusual perceptions, beliefs others do not share, or feeling disconnected from reality caused distress or affected how you function?'],
  burnout: ['Burnout', 'Copenhagen Burnout Inventory', 'How often have you felt emotionally exhausted, detached, or unable to recover from demands?'],
  stress: ['Chronic Stress', 'Perceived Stress Scale', 'How often have demands felt difficult to manage or outside your control?'],
  insomnia: ['Insomnia', 'Insomnia Severity Index', 'How often have trouble falling asleep, staying asleep, or waking rested affected you?'],
  grief: ['Grief', 'Prolonged Grief Disorder-13', 'How often has a loss brought intense sadness, yearning, guilt, or difficulty re-engaging with life?'],
  eating: ['Eating-related concerns', 'SCOFF / EDE-Q', 'How often have food, eating, weight, shape, restriction, bingeing, or compensatory behaviours caused distress?'],
  substance: ['Substance Misuse', 'AUDIT / DAST-10', 'How often has alcohol, drugs, or another substance been difficult to cut down, caused regret, or affected responsibilities?'],
  health: ['Health Anxiety', 'Health Anxiety Inventory', 'How often has worry about illness or bodily sensations led to repeated checking, reassurance-seeking, or avoidance?'],
  emotion: ['Emotional Dysregulation', 'DERS', 'How often have emotions felt very intense, changed quickly, or led to actions you later regretted?'],
  loneliness: ['Loneliness', 'UCLA Loneliness Scale', 'How often have you felt isolated, disconnected, or lacking meaningful support?'],
  work: ['Workplace Stress', 'Perceived Stress Scale', 'How often have work or study demands, conflict, or lack of control affected your wellbeing?'],
  relationship: ['Relationship Distress', 'Relationship Assessment Scale', 'How often have relationship or family difficulties caused ongoing distress or affected daily life?'],
};

const frequency = [['1', 'Never'], ['2', 'Occasionally'], ['3', 'Some days'], ['4', 'Most days'], ['5', 'Nearly every day']];

function questionsFor(answers) {
  const selected = answers.concerns || [];
  const clusterQuestions = selected.flatMap((id) => {
    const [, , prompt] = clusterDetails[id];
    const questions = [{ id: `${id}Frequency`, stage: 3, type: 'choice', text: prompt, options: frequency }];
    if (Number(answers[`${id}Frequency`]) >= 3) {
      questions.push({
        id: `${id}Specific`, stage: 3, type: 'choice',
        text: 'When this is present, how distressing or difficult is it to manage?', options: scale,
      });
    }
    return questions;
  });

  return [
    { id: 'adult', stage: 1, type: 'choice', text: 'This screening is designed for adults. Are you 18 or older?', options: [['yes', 'Yes, I am 18 or older'], ['no', 'No']] },
    { id: 'wellbeing', stage: 1, type: 'choice', text: 'Overall, how has your emotional wellbeing been lately?', options: [['5', 'Very good'], ['4', 'Good'], ['3', 'Mixed'], ['2', 'Difficult'], ['1', 'Very difficult']] },
    { id: 'duration', stage: 1, type: 'choice', text: 'How long have these feelings or concerns been noticeable?', options: [['1', 'Less than two weeks'], ['2', 'A few weeks'], ['3', 'One to six months'], ['4', 'More than six months']] },
    { id: 'concerns', stage: 2, type: 'multi', text: 'Which areas would you like to explore? Select any that fit. You can leave this blank if none feel relevant.', options: concernAreas },
    ...clusterQuestions,
    { id: 'severity', stage: 4, type: 'choice', text: 'At their most difficult, how intense have these experiences felt?', options: scale },
    { id: 'impairment', stage: 5, type: 'choice', text: 'How much have these experiences affected sleep, self-care, work or study, relationships, or everyday tasks?', options: scale },
    { id: 'reflection', stage: 5, type: 'open', optional: true, text: 'If you wish, what is the main change you have noticed in your daily life? (Optional)' },
    { id: 'protective', stage: 6, type: 'multi', text: 'What supports are available to you right now? Select any that apply.', options: [['people', 'People I can contact'], ['routine', 'A helpful routine or activity'], ['care', 'A healthcare or mental-health professional'], ['coping', 'Coping skills that usually help'], ['none', 'I do not feel I have support right now']] },
    { id: 'safety', stage: 7, type: 'choice', text: 'A brief safety check: in the past two weeks, have you had thoughts of harming yourself, ending your life, or felt unable to keep yourself safe?', options: [['none', 'No'], ['passive', 'I have had thoughts, but no plan or intention'], ['urgent', 'I have thoughts and feel I may act on them'], ['immediate', 'I may be in immediate danger or have a plan / means']] },
  ];
}

function buildReport(answers) {
  const selected = answers.concerns || [];
  const severity = Number(answers.severity || 1);
  const impairment = Number(answers.impairment || 1);
  const duration = Number(answers.duration || 1);
  const safety = answers.safety || 'none';
  const riskLevel = safety === 'immediate' ? 'Immediate' : safety === 'urgent' ? 'High' : safety === 'passive' || impairment >= 4 ? 'Moderate' : 'Low';
  const possible = selected
    .map((id) => {
      const [condition] = clusterDetails[id];
      const frequencyScore = Number(answers[`${id}Frequency`] || 1);
      const specificScore = Number(answers[`${id}Specific`] || frequencyScore);
      const confidence = Math.min(0.9, 0.15 + (frequencyScore * 0.09) + (specificScore * 0.06) + (impairment * 0.05) + (duration * 0.03));
      const level = frequencyScore >= 4 || specificScore >= 4 || (severity >= 4 && impairment >= 4) ? 'High' : frequencyScore >= 3 || severity >= 3 ? 'Moderate' : 'Low';
      return { condition, confidence: Number(confidence.toFixed(2)), severity: level };
    })
    .filter((item) => item.confidence >= 0.45)
    .sort((a, b) => b.confidence - a.confidence);
  const screeners = [...new Set(selected.map((id) => clusterDetails[id][1]))];
  if (riskLevel !== 'Low') screeners.push('C-SSRS');
  const wellbeing = Math.max(0, Math.min(100, Math.round(100 - ((5 - Number(answers.wellbeing || 5)) * 15) - (severity * 5) - (impairment * 6) - (duration * 3))));
  const needsProfessional = riskLevel !== 'Low' || severity >= 4 || impairment >= 3 || possible.some((item) => item.severity === 'High');
  const steps = riskLevel === 'Immediate'
    ? ['Contact local emergency services or a crisis line now.', 'If possible, move near a trusted person and do not stay alone.', 'This screening is paused because immediate safety matters most.']
    : riskLevel === 'High'
      ? ['Contact a trusted person or local crisis support now.', 'Arrange an urgent conversation with a licensed mental-health professional or doctor.', 'Reduce access to anything you could use to hurt yourself and stay with support if you can.']
      : needsProfessional
        ? ['Consider discussing these experiences with a licensed mental-health professional or doctor.', 'Use the suggested validated screeners only with an appropriate professional interpretation.', 'Choose one small, realistic support step this week, such as contacting someone you trust or protecting sleep.']
        : ['Continue noticing patterns in mood, sleep, stress, and functioning.', 'Use supportive routines and connection that work for you.', 'Consider professional support if symptoms become more frequent, intense, or disruptive.'];

  return {
    overall_wellbeing_score: wellbeing,
    possible_areas_of_concern: possible,
    risk_level: riskLevel,
    symptom_summary: possible.length ? `Your responses suggest that ${possible.map((item) => item.condition).join(', ')} may be worth exploring further, particularly in relation to daily impact.` : 'Your answers do not identify a strong symptom pattern in the areas selected. This does not rule out concerns or replace professional support.',
    recommended_next_steps: steps,
    recommended_validated_screeners: screeners,
    professional_evaluation_recommended: needsProfessional,
    emergency_intervention_recommended: riskLevel === 'Immediate',
  };
}

export default function Questionnaire() {
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const questions = useMemo(() => questionsFor(answers), [answers]);
  const current = questions.find((question) => answers[question.id] === undefined);
  const report = !current && started ? buildReport(answers) : null;

  const answer = (id, value) => setAnswers((currentAnswers) => ({ ...currentAnswers, [id]: value }));
  const restart = () => { setAnswers({}); setStarted(false); };

  if (!started) return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="bg-white rounded-xl border border-pink-200 p-8 shadow-sm">
        <p className="text-sm font-medium text-rose-600">Adult mental-health screening</p>
        <h1 className="mt-2 text-3xl font-semibold text-black">A short, adaptive wellbeing check-in</h1>
        <p className="mt-4 text-gray-800 leading-relaxed">This is not a diagnosis or medical assessment. It asks only the follow-up questions that fit your answers, then offers a structured screening summary and practical next steps. Your answers stay in this browser and are not stored.</p>
        <p className="mt-3 text-sm text-gray-700">If you are in immediate danger or may act on thoughts of self-harm, contact local emergency services or a crisis line now rather than continuing.</p>
        <button onClick={() => setStarted(true)} className="mt-6 rounded-lg bg-rose-400 px-5 py-3 font-medium text-white hover:bg-rose-500">Start check-in</button>
      </section>
    </div>
  );

  if (answers.adult === 'no') return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><section className="bg-white rounded-xl border border-pink-200 p-8"><h1 className="text-2xl font-semibold text-black">This check-in is for adults</h1><p className="mt-3 text-gray-800">Please speak with a parent, guardian, school counsellor, or a qualified youth mental-health service. If there is an immediate safety concern, contact local emergency support now.</p><button onClick={restart} className="mt-6 rounded-lg border border-pink-300 px-4 py-2">Back</button></section></div>
  );

  if (report) return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className={`rounded-xl border p-8 ${report.risk_level === 'Immediate' ? 'border-red-300 bg-red-50' : 'border-pink-200 bg-white'}`}>
        <p className="text-sm font-medium text-rose-600">Screening summary — not a diagnosis</p>
        <h1 className="mt-2 text-2xl font-semibold text-black">Your wellbeing report</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-lg bg-pink-50 p-4"><p className="text-sm text-gray-700">Overall wellbeing score</p><p className="text-3xl font-semibold text-black">{report.overall_wellbeing_score}<span className="text-base font-normal">/100</span></p></div><div className="rounded-lg bg-pink-50 p-4"><p className="text-sm text-gray-700">Safety level</p><p className="text-2xl font-semibold text-black">{report.risk_level}</p></div></div>
        <p className="mt-6 text-gray-800 leading-relaxed">{report.symptom_summary}</p>
        {report.possible_areas_of_concern.length > 0 && <div className="mt-6"><h2 className="font-semibold text-black">Possible areas to explore</h2><ul className="mt-3 space-y-2">{report.possible_areas_of_concern.map((item) => <li key={item.condition} className="rounded-lg border border-pink-200 p-3 text-gray-800"><strong>{item.condition}</strong> — {item.severity} indication ({Math.round(item.confidence * 100)}% screening confidence)</li>)}</ul></div>}
        <div className="mt-6"><h2 className="font-semibold text-black">Recommended next steps</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">{report.recommended_next_steps.map((step) => <li key={step}>{step}</li>)}</ul></div>
        {report.recommended_validated_screeners.length > 0 && <p className="mt-6 text-sm text-gray-700">Validated screeners to discuss with a professional: {report.recommended_validated_screeners.join(', ')}.</p>}
        <details className="mt-6 rounded-lg bg-gray-50 p-4"><summary className="cursor-pointer font-medium text-black">View structured report data</summary><pre className="mt-3 overflow-auto text-xs text-gray-800">{JSON.stringify(report, null, 2)}</pre></details>
        <button onClick={restart} className="mt-6 rounded-lg border border-pink-300 px-4 py-2 font-medium text-black hover:bg-pink-50">Start again</button>
      </section>
    </div>
  );

  const completed = questions.filter((question) => answers[question.id] !== undefined).length;
  const progress = Math.round((completed / Math.max(questions.length, 1)) * 100);
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6"><p className="text-sm font-medium text-rose-600">Stage {current.stage} of 7</p><h1 className="mt-1 text-2xl font-semibold text-black">Mental wellbeing check-in</h1><div className="mt-4 h-2 rounded-full bg-pink-100"><div className="h-full rounded-full bg-rose-400 transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-sm text-gray-700">This adapts to your answers; you can skip optional reflection questions.</p></div>
      <section className="rounded-xl border border-pink-200 bg-white p-7 shadow-sm"><h2 className="text-lg font-medium leading-relaxed text-black">{current.text}</h2>
        {current.type === 'choice' && <div className="mt-6 space-y-3">{current.options.map(([value, label]) => <button key={value} onClick={() => answer(current.id, value)} className="w-full rounded-lg border border-pink-200 px-4 py-3 text-left font-medium text-black hover:border-pink-400 hover:bg-pink-50">{label}</button>)}</div>}
        {current.type === 'multi' && <MultiSelect key={current.id} question={current} value={answers[current.id] || []} onSubmit={(value) => answer(current.id, value)} />}
        {current.type === 'open' && <OpenResponse onSubmit={(value) => answer(current.id, value)} />}
      </section>
    </div>
  );
}

function MultiSelect({ question, value, onSubmit }) {
  const [selected, setSelected] = useState(value);
  const toggle = (id) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <div className="mt-6"><div className="space-y-2">{question.options.map(([id, label]) => <label key={id} className="flex cursor-pointer gap-3 rounded-lg border border-pink-200 px-4 py-3 text-black hover:bg-pink-50"><input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} className="mt-1 accent-rose-500" />{label}</label>)}</div><button onClick={() => onSubmit(selected)} className="mt-5 rounded-lg bg-rose-400 px-5 py-2.5 font-medium text-white hover:bg-rose-500">Continue</button></div>;
}

function OpenResponse({ onSubmit }) {
  const [text, setText] = useState('');
  return <div className="mt-6"><textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={500} rows={4} className="w-full rounded-lg border border-pink-300 p-3 text-black" placeholder="Write as much or as little as you wish" /><div className="mt-4 flex gap-3"><button onClick={() => onSubmit(text)} className="rounded-lg bg-rose-400 px-5 py-2.5 font-medium text-white hover:bg-rose-500">Continue</button><button onClick={() => onSubmit('')} className="rounded-lg border border-pink-300 px-4 py-2.5 text-black">Skip</button></div></div>;
}
