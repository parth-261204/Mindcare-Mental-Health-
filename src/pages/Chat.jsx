import { useState, useRef, useEffect } from 'react';
import { WELCOME_MESSAGE } from '../lib/chatbotResponses';
import { askChatbot, startVoiceInput } from '../lib/chatApi';
import { Link } from 'react-router-dom';

const prompts = ['I feel stressed and do not know where to start.', 'How can I wind down before sleep?', 'When should I talk to a professional?'];

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const messagePanelRef = useRef(null);

  const scrollToBottom = () => {
    const panel = messagePanelRef.current;
    if (panel) panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setIsLoading(true);
    try {
      const reply = await askChatbot(nextMessages);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: `I couldn't answer that right now: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    setVoiceError('');
    startVoiceInput({
      onResult: (transcript) => setInput((current) => current ? `${current} ${transcript}` : transcript),
      onError: setVoiceError,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-black">Mental health chat</h1>
        <p className="mt-1 text-gray-800 text-sm">
          Ask general questions about stress, anxiety, sleep, or when to seek help. This is informational only, not professional advice.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">{prompts.map((prompt) => <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full bg-pink-100 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-pink-200">{prompt}</button>)}</div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-pink-200 shadow-sm">
        <div ref={messagePanelRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  m.role === 'user'
                    ? 'bg-rose-400 text-white rounded-br-md'
                    : 'bg-pink-100 text-black rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-pink-100 rounded-2xl rounded-bl-md px-4 py-2.5">
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                <span className="ml-2 text-sm text-gray-700">Mindcare is thinking…</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-pink-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 rounded-lg border border-pink-300 px-4 py-2.5 text-black placeholder-pink-400 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              aria-label="Use voice input"
              title="Use voice input"
              className="rounded-lg border border-pink-300 px-3 py-2.5 text-rose-500 hover:bg-pink-50 disabled:opacity-50"
            >
              🎙️
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-lg bg-rose-400 text-white px-4 py-2.5 font-medium hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-700">AI responses are informational only, not emergency care. <Link to="/support" className="font-medium underline">Get urgent support now</Link> if you may harm yourself or cannot stay safe.</p>
          {voiceError && <p className="mt-1 text-xs text-red-600">{voiceError}</p>}
        </form>
      </div>
    </div>
  );
}
