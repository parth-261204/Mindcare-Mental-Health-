/*
 * Mental health chatbot – elaborate, helpful responses.
 * No API key required. For AI-powered replies, add an API and call it from the Chat page.
 */

const lower = (s) => (s || '').toLowerCase().trim();

export function getBotResponse(userMessage) {
  const msg = lower(userMessage);
  if (!msg) return "I'm here to listen. You can ask me about anxiety, stress, sleep, mood, relationships, trauma, self-esteem, or when to seek help. What's on your mind?";

  // —— Crisis / safety first ——
  if (/\b(hurt myself|suicide|end my life|kill myself|self harm|don't want to live|want to die)\b/.test(msg)) {
    return "I'm sorry you're going through this. Please reach out right now: call a helpline (see our website footer for numbers) or go to your nearest emergency room. You matter, and people want to support you. These feelings can feel overwhelming, but they can change with the right support. Please don't stay alone with this—reach out today.";
  }

  // —— Greetings ——
  if (/^(hi|hello|hey|good morning|good evening|good afternoon)\b/.test(msg) || msg === 'hi' || msg === 'hello') {
    return "Hello. I'm Mindcare's chat. I can give you detailed information about stress, anxiety, sleep, low mood, relationships, trauma, self-esteem, and when to see a professional. Everything I share is for general support only—I'm not a substitute for a doctor or therapist. What would you like to talk about?";
  }

  // —— Anxiety (elaborate) ——
  if (/\b(anxious|anxiety|worry|worried|panic|panic attack|nervous|overwhelm|overwhelmed|racing thoughts)\b/.test(msg)) {
    return "Anxiety is your brain and body reacting to perceived threat—even when there’s no immediate danger. It’s very common and treatable.\n\nWhat can help:\n• Breathing: Slow, deep breaths (e.g. 4 counts in, 6 counts out) can calm your nervous system. Doing this for a few minutes when you notice anxiety rising often helps.\n• Grounding: Name 5 things you see, 4 you hear, 3 you can touch. This brings you back to the present instead of future worries.\n• Small steps: Pick one small thing you can do right now (e.g. one task, one decision). Reducing uncertainty and taking action often eases anxiety.\n• Routine: Regular sleep, movement, and meals support your mood and stress levels. Cutting back on caffeine and alcohol can also help.\n\nIf anxiety is affecting your work, relationships, or daily life, or if you have panic attacks, a doctor or therapist can offer tailored strategies (including therapy and sometimes medication). You can also try our questionnaire and articles on this site.";
  }

  // —— Stress & burnout ——
  if (/\b(stress|stressed|pressure|burnout|exhausted|drained|too much)\b/.test(msg)) {
    return "Stress is your body’s response when demands feel greater than your resources. A little stress can be motivating; too much can affect your health and mood.\n\nShort-term: Take short breaks, prioritise one task at a time, and use slow breathing when you feel tense. Saying 'I’ll deal with this in 10 minutes' and then returning can make it feel more manageable.\n\nLong-term: Protect sleep, set boundaries (e.g. saying no to extra tasks or limiting work messages after hours), and make time for activities that restore you—even 15–20 minutes of something you enjoy or that relaxes you. Recognising that you’re stressed is the first step; asking for support from friends, family, or a manager is a sign of strength.\n\nIf stress feels constant or you feel burned out (exhausted, cynical, or ineffective), talking to a GP or therapist can help you plan changes and recover.";
  }

  // —— Sleep ——
  if (/\b(sleep|insomnia|can't sleep|tired|exhausted|wake up|night)\b/.test(msg)) {
    return "Sleep and mental health are closely linked: poor sleep can worsen mood and anxiety, and low mood or worry can disrupt sleep.\n\nWhat often helps:\n• Consistent schedule: Go to bed and get up around the same time every day, including weekends.\n• Wind-down: In the hour before bed, avoid screens, bright lights, and heavy work. Reading, gentle stretching, or a short relaxation can help.\n• Caffeine and alcohol: Reduce caffeine after midday and go easy on alcohol, which can fragment sleep.\n• If your mind races: Try writing worries or to-dos in a notebook before bed so you’re not trying to 'hold' them in your head. A simple breathing or body-scan exercise can also quiet the mind.\n• Bed = sleep: If you’re awake for a long time, get up, do something calm in dim light, and return to bed when you feel sleepy.\n\nIf sleep problems last for weeks or affect your day, a doctor can check for underlying issues and suggest next steps (e.g. sleep hygiene, therapy, or other treatment).";
  }

  // —— Low mood / depression ——
  if (/\b(sad|depress|low mood|down|hopeless|unmotivated|no energy|empty|numb|can't enjoy)\b/.test(msg)) {
    return "Low mood can happen for many reasons—life events, stress, loss, or changes in body and brain chemistry. It’s common and often improves with support and small steps.\n\nThings that often help:\n• Movement: Even a short walk or light activity can lift mood and energy a little. Start with something very small if motivation is low.\n• Connection: Staying in touch with one or two people you trust—a call, message, or short meet-up—can reduce isolation and remind you that you’re not alone.\n• Routine: Simple structure (regular sleep, meals, one or two small tasks) can make days feel more manageable when everything feels heavy.\n• Compassion: Low mood is not a sign of weakness. Being gentle with yourself and acknowledging that you’re going through a hard time can make it easier to take the next small step.\n\nIf low mood lasts for more than two weeks, affects your work or relationships, or you have thoughts of hurting yourself, please talk to a doctor or therapist. Treatment (therapy, and sometimes medication) can make a real difference. You can also use the helpline numbers on our site anytime.";
  }

  // —— When to seek help / professional ——
  if (/\b(help|therapist|doctor|professional|when to seek|counsel|counselling|treatment|therapy|psychologist)\b/.test(msg)) {
    return "It’s a good idea to talk to a professional when:\n• Your mood or anxiety is affecting your daily life, work, sleep, or relationships.\n• You’re having thoughts of hurting yourself or ending your life.\n• You’re using alcohol, drugs, or other behaviours in a way that worries you.\n• You’ve been through something traumatic and it’s still affecting you.\n• You simply want support and someone to talk to—you don’t have to be in crisis to benefit.\n\nHow to start: A GP can discuss options and refer you to counselling or a mental health professional. You can also look for a licensed psychologist or counsellor directly (many offer in-person and online sessions). Our website lists helpline numbers if you need to talk to someone soon. Taking that first step is brave and can lead to real change.";
  }

  // —— Mindfulness / grounding / calm ——
  if (/\b(calm|relax|mindful|grounding|breathe|breathing|panic|dizzy)\b/.test(msg)) {
    return "When you feel overwhelmed or panicky, grounding and breathing can help your nervous system settle.\n\n5-4-3-2-1 grounding: Name 5 things you see, 4 you hear, 3 you can touch, 2 you can smell, 1 you can taste. This brings your attention to the present and away from spiralling thoughts.\n\nBreathing: Breathe in slowly for 4 counts, hold briefly if comfortable, then breathe out for 6 counts. Repeat for a few minutes. Longer out-breaths can activate the part of your nervous system that helps you calm down.\n\nBody awareness: Notice your feet on the floor, your back against the chair. Feel the weight and support. This can reduce dizziness and dissociation.\n\nPractising these when you’re relatively calm makes them easier to use in moments of stress. Our articles have more on mindfulness and grounding—and a therapist can teach you techniques tailored to you.";
  }

  // —— Loneliness / isolation ——
  if (/\b(lonely|alone|isolat|no friends|no one|left out)\b/.test(msg)) {
    return "Feeling lonely is common and can affect your mood and energy, even when you’re around people. It doesn’t mean you’re unlikeable—it often means your need for connection isn’t being met.\n\nSmall steps that can help:\n• Reach out to one person—a message, call, or short meet-up. You don’t have to share everything; even light contact can help.\n• Join something low-pressure: a class, club, or online community around a hobby or interest. Shared activities can build connection over time.\n• Volunteering can give a sense of purpose and put you in touch with others in a structured way.\n• If you’re new somewhere or have lost touch with people, remember that building relationships usually takes time. One or two regular contacts can make a big difference.\n\nIf loneliness feels overwhelming or is linked to low mood or anxiety, talking to a counsellor can help you understand the feelings and plan steps that fit your life.";
  }

  // —— Grief / loss ——
  if (/\b(grief|grieve|loss|died|death|bereavement|mourning|lost someone)\b/.test(msg)) {
    return "Grief is a natural response to loss. There’s no 'right' way to grieve—it can include sadness, anger, numbness, guilt, or relief, and it often comes in waves.\n\nWhat often helps:\n• Allowing yourself to feel what you feel, without judging it. Crying, being quiet, or needing time alone are all normal.\n• Talking to people you trust, or writing or creating in memory of the person, can help process the loss.\n• Keeping a simple routine (sleep, meals, one or two tasks) can give structure when everything feels unstable.\n• Anniversaries and holidays can be especially hard; planning something that feels right for you (e.g. a ritual, or being with others) can help.\n\nIf grief is lasting a long time, affecting your ability to function, or you’re having thoughts of hurting yourself, please reach out to a GP or a grief counsellor. Support groups and helplines can also offer connection and understanding.";
  }

  // —— Anger / irritability ——
  if (/\b(angry|anger|irritable|rage|frustrat|short temper|lash out)\b/.test(msg)) {
    return "Anger is a normal emotion, but when it’s frequent or hard to control, it can affect your relationships and wellbeing.\n\nUnderstanding it: Anger often masks hurt, fear, or feeling powerless. Noticing what tends to trigger you (e.g. criticism, unfairness, stress) can help you respond rather than react.\n\nIn the moment: Pause if you can—count to 10, leave the room, or take a few slow breaths. Give yourself time before responding. This can prevent saying or doing things you regret.\n\nLonger term: Regular exercise or physical activity can help release tension. Sleep, stress management, and avoiding excess alcohol also support emotional regulation. If you tend to bottle things up, finding safe ways to express feelings (talking, writing, or creative outlets) can reduce built-up anger.\n\nIf anger is affecting your relationships, work, or safety, or you’re worried you might harm someone, a therapist can help you understand triggers and develop healthier coping strategies.";
  }

  // —— Self-esteem / self-worth ——
  if (/\b(self.?esteem|self.?worth|worthless|not good enough|inadequate|compare myself|failure)\b/.test(msg)) {
    return "Struggling with self-worth is common and often linked to past experiences, comparisons, or critical self-talk.\n\nWhat can help:\n• Notice the inner critic: When you think 'I’m not good enough' or similar, try naming it ('That’s my critic again') rather than believing it as fact. Ask yourself: 'Would I say this to a friend?'\n• Focus on actions, not only feelings: Doing something that aligns with your values—helping someone, finishing a small task, or practising a skill—can build a sense of competence even when confidence is low.\n• Limit comparison: Social media and others’ highlight reels can make you feel lacking. Reducing exposure or reminding yourself that you’re seeing a edited version of their life can help.\n• Compassion: Treat yourself as you would someone you care about. Small steps and setbacks are part of being human.\n\nIf negative self-view is constant or affects your decisions and relationships, therapy can help you understand its roots and build a kinder, more realistic view of yourself.";
  }

  // —— Trauma / PTSD ——
  if (/\b(trauma|traumatic|ptsd|flashback|triggered|abuse|assault|nightmare)\b/.test(msg)) {
    return "Trauma is a response to deeply distressing or frightening events. It can affect how you feel, think, and relate to others, and it’s not something you simply 'get over'—but with support, many people find ways to heal.\n\nCommon reactions: Flashbacks, nightmares, avoiding reminders, feeling on edge, or feeling numb are common. They’re your mind and body’s way of trying to protect you.\n\nWhat helps: Feeling safe and in control is important. Grounding techniques (e.g. 5-4-3-2-1, slow breathing) can help when you feel overwhelmed or triggered. A predictable routine and supportive relationships can also support recovery. Avoid pushing yourself to 'relive' the event without professional guidance.\n\nProfessional support: Trauma-focused therapy (e.g. with a trained therapist) is often the most effective way to process what happened and reduce lasting symptoms. A GP can refer you, or you can look for a psychologist or counsellor who specialises in trauma. Our helpline list can connect you to someone to talk to as well.";
  }

  // —— OCD / intrusive thoughts ——
  if (/\b(ocd|obsess|compuls|intrusive thought|repetitive thought|can't stop thinking)\b/.test(msg)) {
    return "OCD involves unwanted, repeated thoughts (obsessions) and urges to do certain actions or mental rituals (compulsions) to reduce anxiety. Many people also have intrusive thoughts without full OCD—disturbing or 'wrong' thoughts that pop up and cause distress.\n\nImportant: Having a thought doesn’t mean you want to act on it. Intrusive thoughts are often the opposite of what you value and don’t define you.\n\nWhat helps: Trying to suppress thoughts often makes them return more. A more helpful approach is to notice the thought, label it ('That’s an intrusive thought'), and gently bring your attention back to what you were doing. Reducing rituals (e.g. checking, washing) step by step, with support, can lower anxiety over time.\n\nProfessional help: OCD and severe intrusive thoughts are often best treated with a specific type of therapy (e.g. CBT with exposure and response prevention). A GP or mental health professional can guide you to the right support. You’re not alone, and effective treatment exists.";
  }

  // —— Eating / body image ——
  if (/\b(eating|eat|diet|body image|weight|binge|restrict|anorexia|bulimia)\b/.test(msg)) {
    return "Relationships with food and body image can be deeply affected by stress, mood, culture, and past experiences.\n\nGeneral support: Eating regularly and including a variety of foods can support both physical and emotional health. If you’re restricting, bingeing, or preoccupied with weight or shape, it’s important to take that seriously. These patterns can affect your health and quality of life.\n\nWhat helps: Being kind to your body and reducing harsh self-talk can be a first step. If you have someone you trust, talking about how you feel can reduce isolation. Avoiding strict diets or extreme rules can help prevent cycles of restriction and overeating.\n\nWhen to seek help: If eating or body image is dominating your thoughts, affecting your health, or causing distress, a GP or a specialist (e.g. dietitian, psychologist) with experience in eating difficulties can help. Early support often makes a big difference. You deserve care that respects your wellbeing, not just weight or appearance.";
  }

  // —— Relationship / family stress ——
  if (/\b(relationship|partner|family|parent|marriage|fight|conflict|breakup|divorce)\b/.test(msg)) {
    return "Relationship and family stress can take a big toll on your mental health. Conflict, lack of support, or major changes (e.g. breakup, divorce) can trigger anxiety, low mood, or loneliness.\n\nWhat can help:\n• Communication: When things are calm, expressing how you feel and what you need (using 'I' statements) can reduce blame and defensiveness. Listening to the other person’s perspective can also help.\n• Boundaries: It’s okay to set limits—e.g. on how much you discuss certain topics, or on time spent with people who drain you. You can be kind and still protect your wellbeing.\n• Support: Talking to a trusted friend or a professional can give you space to process feelings and decide what you want to do. You don’t have to fix everything alone.\n• After a breakup or loss: Give yourself time to grieve. Reconnecting with yourself (hobbies, rest, small goals) and with supportive people can help you heal.\n\nCouples or family therapy can help when you’re stuck in patterns of conflict or disconnection. Individual therapy can also support you in making choices and coping with relationship stress.";
  }

  // —— Work / study stress ——
  if (/\b(work|job|career|study|exam|boss|colleague|workplace)\b/.test(msg)) {
    return "Work or study can be a major source of stress, especially when demands are high, support is low, or you’re facing uncertainty.\n\nPractical steps:\n• Prioritise: List tasks and tackle one at a time. Saying 'no' to non-essential requests can protect your energy.\n• Breaks: Short, regular breaks (even 5 minutes) can improve focus and reduce burnout. Step away from the screen when you can.\n• Boundaries: If possible, keep work or study out of rest time—e.g. no emails after a certain hour. Communicate your limits if you’re overwhelmed.\n• Support: Talk to a manager, teacher, or HR if workload or conditions are unreasonable. Many places have policies or resources for mental health.\n\nIf work or study stress is affecting your sleep, mood, or health, consider talking to a GP or therapist. They can help you develop strategies and, if needed, support you with documentation for adjustments or leave. Your wellbeing matters as much as your performance.";
  }

  // —— Phobias / fear ——
  if (/\b(phobia|phobic|fear of|scared of|afraid of|terrified)\b/.test(msg)) {
    return "Phobias are strong, persistent fears of specific things or situations (e.g. heights, animals, flying, needles). They can cause intense anxiety and avoidance, and they often feel bigger than they are.\n\nWhat helps: Avoiding the trigger reduces anxiety short-term but can strengthen the fear long-term. Gradual, repeated exposure to the feared situation (ideally with guidance) is usually the most effective approach. Learning relaxation or breathing techniques can help you stay calmer during exposure.\n\nProfessional help: A therapist can design a step-by-step exposure plan and support you through it. Many people see significant improvement with a short course of therapy. If a phobia is limiting your life, it’s worth asking a GP for a referral to a psychologist or CBT therapist.";
  }

  // —— Substance use ——
  if (/\b(alcohol|drinking|drug|addict|substance|sober)\b/.test(msg)) {
    return "Substance use can become a way of coping with stress, pain, or boredom, but over time it can worsen mental health and create dependency.\n\nIf you're concerned: Acknowledging that you want to change is a big step. Reducing or stopping is often easier with support—friends, family, or a professional. A GP can discuss options (e.g. counselling, support groups, or referral to specialist services) and any medical aspects of cutting down or quitting.\n\nHarm reduction: If you’re not ready to stop, reducing amount and frequency, avoiding driving or risky situations when under the influence, and not mixing substances can reduce harm. Reaching out to a helpline or support group can provide non-judgmental support and information.\n\nYou don’t have to do this alone. Many people recover with the right support and treatment.";
  }

  // —— Thanks / goodbye ——
  if (/\b(thank|thanks|bye|goodbye)\b/.test(msg)) {
    return "You’re welcome. Take care of yourself. Remember you can use our questionnaire and articles anytime, and the helpline numbers on our website are there if you need to talk. Wishing you well.";
  }

  // —— Default ——
  return "I’m here to offer general information about mental wellness. You can ask me about anxiety, stress, sleep, low mood, grief, trauma, self-esteem, relationships, work stress, or when to see a professional. I’m not a substitute for a doctor or therapist—if something feels urgent or overwhelming, please use the helpline numbers on our site or reach out to a professional. What would you like to know more about?";
}

export const WELCOME_MESSAGE = "Hi. I’m Mindcare’s chat. I can give you detailed information about stress, anxiety, sleep, low mood, relationships, trauma, self-esteem, and when to seek professional help. Everything I share is for general support only—I’m not a substitute for a doctor or therapist. What’s on your mind?";
