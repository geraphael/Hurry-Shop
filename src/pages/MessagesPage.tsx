import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { fetchUserConversations, sendMessage, fetchConversationMessages, markMessagesRead } from '../lib/db'
import type { Conversation, Message } from '../types'

export function MessagesPage() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchConversations = () => fetchUserConversations(profile!.id)
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', profile?.id],
    queryFn: fetchConversations,
    enabled: Boolean(profile?.id),
  }) as { data: Conversation[] | undefined; isLoading: boolean }

  const selected = conversations?.find((c) => c.id === selectedId) ?? conversations?.[0]

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', selected?.id],
    queryFn: () => fetchConversationMessages(selected!.id),
    enabled: Boolean(selected?.id),
    refetchInterval: 5000,
  })

  /* Mark messages as read when viewing */
  useEffect(() => {
    if (selected?.id && profile?.id) {
      markMessagesRead(selected.id, profile.id)
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    }
  }, [selected?.id, profile?.id, queryClient])

  /* Auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!selected || !profile || !message.trim()) return

    await sendMessage({
      listing_id: selected.listing_id,
      sender_id: profile.id,
      receiver_id: selected.sender_id === profile.id ? selected.receiver_id : selected.sender_id,
      body: message.trim(),
    })

    setMessage('')
    queryClient.invalidateQueries({ queryKey: ['messages', selected.id] })
    queryClient.invalidateQueries({ queryKey: ['conversations', profile.id] })
  }

  const otherPerson = (c: Conversation) =>
    c.sender_id === profile?.id ? c.receiver?.full_name : c.sender?.full_name

  const isMine = (msg: Message) => msg.sender_id === profile?.id

  return (
    <main className="mt-6">
      <section className="card messages-layout">
        <div className="section-title">
          <h2>Messages</h2>
          <span className="text-muted">Campus conversations and listing inquiries.</span>
        </div>

        <div className="messages-container">
          {/* ── Sidebar ── */}
          <aside className="messages-sidebar">
            <h3>Conversations</h3>
            {isLoading ? (
              <p className="text-muted">Loading…</p>
            ) : conversations?.length ? (
              <div className="conversation-list">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`conversation-item ${selected?.id === c.id ? 'active' : ''}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <strong>{otherPerson(c)}</strong>
                    <p className="text-muted">{c.listing.title}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted">No conversations yet.</p>
            )}
          </aside>

          {/* ── Chat area ── */}
          <div className="messages-chat">
            {selected ? (
              <>
                <div className="chat-header">
                  <strong>{otherPerson(selected)}</strong>
                  <span className="text-muted">Re: {selected.listing.title}</span>
                </div>

                <div className="chat-messages">
                  {messages.length ? (
                    messages.map((msg) => (
                      <div key={msg.id} className={`chat-bubble ${isMine(msg) ? 'mine' : 'theirs'}`}>
                        <p>{msg.body}</p>
                        <span className="chat-time">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No messages yet. Start the conversation.</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    placeholder="Type a message…"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  />
                  <button type="button" className="primary" onClick={handleSend} disabled={!message.trim()}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="chat-empty">
                <p className="text-muted">Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
