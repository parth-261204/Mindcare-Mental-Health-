import { useState, useRef, useEffect } from 'react';
import { getBotResponse, WELCOME_MESSAGE } from '../lib/chatbotResponses';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME_MESSAGE }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setIsLoading(true);

    setTimeout(() => {
      const reply = getBotResponse(text);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
      setIsLoading(false);
    }, 400);
  };

  return (
    <>
      {/* Floating button - top-right corner */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed top-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-rose-400 text-white px-4 py-2.5 font-medium shadow-lg hover:bg-rose-500 transition-colors"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <span className="text-sm">Chatbot</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 z-[55] h-full w-full max-w-md bg-white shadow-xl border-l border-pink-200 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-pink-200 bg-pink-50">
          <h2 className="font-semibold text-black">Mental health chat</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-gray-700 hover:bg-pink-200 hover:text-black transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="p-4 border-t border-pink-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 rounded-lg border border-pink-300 px-4 py-2.5 text-black placeholder-pink-400 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-lg bg-rose-400 text-white px-4 py-2.5 font-medium hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop when open (optional - close on outside click) */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close chat"
          className="fixed inset-0 z-[54] bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
