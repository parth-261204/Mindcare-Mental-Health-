const API_URL = import.meta.env.VITE_API_URL || '';

export async function askChatbot(messages) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: messages.slice(-12) }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Unable to reach the chatbot.')
  return data.text
}

export function startVoiceInput({ onResult, onError }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    onError('Voice input is not supported in this browser. Try Chrome or Safari.')
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.onresult = (event) => onResult(event.results[0][0].transcript)
  recognition.onerror = () => onError('I could not hear that. Please try again.')
  recognition.start()
  return recognition
}
