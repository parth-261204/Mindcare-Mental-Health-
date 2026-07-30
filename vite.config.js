import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApiPlugin } from './server/api.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const chatbotApi = {
    name: 'mindcare-chatbot-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { Allow: 'POST' })
          res.end('Method not allowed')
          return
        }

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', async () => {
          try {
            const { messages } = JSON.parse(body)
            if (!Array.isArray(messages) || messages.length === 0) {
              throw new Error('A message is required.')
            }

            let response
            let data
            for (const model of ['gemini-3.5-flash', 'gemini-3.5-flash-lite']) {
              response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-goog-api-key': env.CHATBOT_API_KEY,
                },
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{
                      text: 'You are Mindcare, a supportive mental-health information chatbot. Answer the user\'s question directly and conversationally. Do not diagnose or replace a clinician. Encourage emergency services or a local crisis line if the user is in immediate danger, plans to harm themselves or someone else, or cannot stay safe. Keep replies concise, compassionate, and practical.',
                    }],
                  },
                  contents: messages.map(({ role, text }) => ({
                    role: role === 'bot' ? 'model' : 'user',
                    parts: [{ text }],
                  })),
                  generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
                }),
              },
              )
              data = await response.json()
              if (response.ok || ![429, 503].includes(response.status)) break
            }
            if (!response.ok) {
              throw new Error(data?.error?.message || 'Gemini could not answer right now.')
            }

            const text = data?.candidates?.[0]?.content?.parts
              ?.map((part) => part.text || '')
              .join('')
              .trim()
            if (!text) throw new Error('Gemini returned an empty response.')

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ text }))
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: error.message || 'Unable to answer right now.' }))
          }
        })
      })
    },
  }

  return {
    plugins: [react(), tailwindcss(), chatbotApi, createApiPlugin(env)],
  }
})
