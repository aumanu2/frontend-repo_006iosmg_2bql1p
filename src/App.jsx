import React, { useEffect, useRef, useState } from 'react'
import ChatMessage from './components/ChatMessage'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function App() {
  const [username, setUsername] = useState('Guest')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/messages`)
      const data = await res.json()
      setMessages(data.items || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSend = async (e) => {
    e.preventDefault()
    if (!text && !file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('username', username || 'Guest')
      if (text) form.append('text', text)
      if (file) form.append('file', file)
      const res = await fetch(`${API_BASE}/api/messages`, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Failed to send')
      setText('')
      setFile(null)
      await fetchMessages()
    } catch (e) {
      console.error(e)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Elegant Chat</h1>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ml-4 text-sm px-3 py-1.5 rounded bg-white/20 placeholder-white/70 focus:outline-none"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="h-[60vh] overflow-y-auto space-y-4 p-6 bg-slate-50">
          {messages.map((m) => (
            <ChatMessage key={m.id + (m.created_at || '')} message={m} />
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={onSend} className="p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer shrink-0">
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">📎</span>
            </label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 h-10 px-4 rounded-lg bg-slate-100 focus:bg-white border focus:border-indigo-300 outline-none transition"
            />
            <button
              disabled={loading || (!text && !file)}
              className="h-10 px-5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          {file && (
            <div className="px-12 mt-2 text-xs text-slate-500">
              Attached: {file.name}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
