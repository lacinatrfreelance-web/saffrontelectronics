import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Send, Mail, MailOpen, Reply } from 'lucide-react'
import { adminApi } from '@/services/api'
import { ADMIN_ENDPOINTS } from '@/services/endpoints'
import { StatusBadge } from '@/admin/components/Common/StatusBadge'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'

export const AdminMessagesPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<any | null>(null)
  const [replyText, setReplyText] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'unreplied'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages', filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter === 'unread') params.append('is_read', 'false')
      if (filter === 'unreplied') params.append('is_replied', 'false')
      const { data } = await adminApi.get(`${ADMIN_ENDPOINTS.MESSAGES}?${params}`)
      return data
    },
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await adminApi.put(ADMIN_ENDPOINTS.MESSAGE_READ(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] })
    },
  })

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: number; reply: string }) => {
      await adminApi.post(ADMIN_ENDPOINTS.MESSAGE_REPLY(id), { reply })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] })
      toast.success('Reponse envoyee')
      setReplyText('')
      setSelected((prev: any) => prev ? { ...prev, is_replied: true } : null)
    },
    onError: () => toast.error('Erreur lors de l\'envoi'),
  })

  const handleSelect = (msg: any) => {
    setSelected(msg)
    setReplyText('')
    if (!msg.is_read) {
      markReadMutation.mutate(msg.id)
    }
  }

  const messages = data?.data || []
  const unreadCount = messages.filter((m: any) => !m.is_read).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900 flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-secondary-500 text-sm mt-1">{messages.length} message{messages.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'all', label: 'Tous' },
          { id: 'unread', label: 'Non lus' },
          { id: 'unreplied', label: 'Sans reponse' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-primary-500 text-white'
                : 'bg-white text-secondary-600 border border-secondary-200 hover:border-primary-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Messages list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-secondary-100 overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-secondary-50">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                  <div className="h-4 bg-secondary-100 rounded animate-pulse w-32" />
                  <div className="h-3 bg-secondary-100 rounded animate-pulse w-48" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={36} className="text-secondary-200 mx-auto mb-3" />
              <p className="text-secondary-500 text-sm">Aucun message</p>
            </div>
          ) : (
            <div className="divide-y divide-secondary-50 overflow-y-auto max-h-[600px]">
              {messages.map((msg: any) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left p-4 hover:bg-secondary-50 transition-colors ${
                    selected?.id === msg.id ? 'bg-primary-50 border-l-2 border-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {msg.is_read ? (
                        <MailOpen size={14} className="text-secondary-400 shrink-0" />
                      ) : (
                        <Mail size={14} className="text-primary-500 shrink-0" />
                      )}
                      <span className={`text-sm truncate ${!msg.is_read ? 'font-semibold text-secondary-900' : 'text-secondary-700'}`}>
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-xs text-secondary-400 shrink-0">{formatDate(msg.created_at)}</span>
                  </div>
                  <p className="text-xs text-secondary-500 truncate ml-5">{msg.subject}</p>
                  <div className="flex gap-1.5 mt-2 ml-5">
                    {!msg.is_read && <StatusBadge status="unread" />}
                    {msg.is_replied && <StatusBadge status="replied" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-secondary-100 h-full flex items-center justify-center py-20">
              <div className="text-center">
                <MessageSquare size={40} className="text-secondary-200 mx-auto mb-3" />
                <p className="text-secondary-500 text-sm">Selectionnez un message pour le lire</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
              {/* Message header */}
              <div className="p-5 border-b border-secondary-100">
                <h3 className="font-semibold text-secondary-900 text-lg mb-2">{selected.subject}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-500">
                  <span><strong className="text-secondary-700">De:</strong> {selected.name}</span>
                  <a href={`mailto:${selected.email}`} className="text-primary-500 hover:underline">
                    {selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="text-primary-500 hover:underline">
                      {selected.phone}
                    </a>
                  )}
                  <span>{formatDate(selected.created_at)}</span>
                </div>
              </div>

              {/* Message body */}
              <div className="p-5 border-b border-secondary-100">
                <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {selected.message}
                </p>
              </div>

              {/* Reply section */}
              {selected.is_replied && selected.reply ? (
                <div className="p-5 bg-emerald-50 border-t border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply size={14} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Votre reponse</span>
                    {selected.replied_at && (
                      <span className="text-xs text-emerald-500">{formatDate(selected.replied_at)}</span>
                    )}
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed">{selected.reply}</p>
                </div>
              ) : (
                <div className="p-5">
                  <h4 className="font-semibold text-secondary-900 text-sm mb-3">Repondre a {selected.name}</h4>
                  <Textarea
                    placeholder="Votre reponse..."
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="mt-3">
                    <Button
                      icon={<Send size={14} />}
                      iconPosition="right"
                      onClick={() => replyMutation.mutate({ id: selected.id, reply: replyText })}
                      loading={replyMutation.isPending}
                      disabled={!replyText.trim()}
                    >
                      Envoyer la reponse
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMessagesPage