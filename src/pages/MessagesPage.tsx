import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { fetchUserConversations, sendMessage } from '../lib/db'
import type { Conversation } from '../types'

export function MessagesPage() {
  const { profile } = useAuth()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const fetchConversations = () => fetchUserConversations(profile!.id)
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', profile?.id],
    queryFn: fetchConversations,
    enabled: Boolean(profile?.id),
  }) as { data: Conversation[] | undefined; isLoading: boolean }

  const selected = conversations?.find((conversation) => conversation.id === selectedId) ?? conversations?.[0]

  const handleSend = async () => {
    if (!selected || !profile || !message.trim()) {
      return
    }

    await sendMessage({
      listing_id: selected.listing_id,
      sender_id: profile.id,
      receiver_id: selected.sender_id === profile.id ? selected.receiver_id : selected.sender_id,
      body: message.trim(),
    })

    setMessage('')
  }

  return (
    <main className="mt-6">
      <section className="card">
        <div className="section-title">
          <h2>Messages</h2>
          <span className="text-muted">Campus conversations and listing inquiries.</span>
        </div>
        <div className="grid grid-2 gap-6 mt-6">
          <div className="card">
            <h3>Conversations</h3>
            {isLoading ? (
              <p className="text-muted">Loading conversations…</p>
            ) : conversations?.length ? (
              <div className="conversation-list">
                {conversations.map((conversation) => {
                  const otherName = conversation.sender_id === profile?.id ? conversation.receiver?.full_name : conversation.sender?.full_name
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      className={`conversation-item ${selected?.id === conversation.id ? 'active' : ''}`}
                      onClick={() => setSelectedId(conversation.id)}
                    >
                      <strong>{otherName}</strong>
                      <p className="text-muted">{conversation.listing.title}</p>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted">No conversations yet. Contact a seller from a listing.</p>
            )}
          </div>
          <div className="card">
            <h3>Conversation</h3>
            {selected ? (
              <>
                <p className="text-muted">Listing: {selected.listing.title}</p>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  placeholder="Write a message to the seller"
                />
                <button type="button" className="primary mt-3" onClick={handleSend}>
                  Send message
                </button>
              </>
            ) : (
              <p className="text-muted">Select a conversation to continue the chat.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
