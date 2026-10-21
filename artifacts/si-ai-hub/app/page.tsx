'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { BookOpen, Code2, Database, Menu, MessageSquare, Plus, Send, Square } from 'lucide-react';
import { AI_MODELS, type AIModel } from '@/config/models';
import type { ChatMessage, Conversation } from '@/types/chat';
import { ModelCard } from './components/model-card';
import { MessageItem } from './components/message-item';

const MODELS = AI_MODELS;
const STORAGE_KEY = 'si-ai-hub-conversations-v1';
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const pricingLabel = (status: AIModel['pricingStatus']) => status === 'unknown' ? 'Harga belum diverifikasi' : status === 'free' ? 'Gratis' : 'Berbayar';
const suggestions = [
  { icon: BookOpen, text: 'Jelaskan konsep basis data relasional dengan contoh sederhana.' },
  { icon: Database, text: 'Apa perbedaan primary key dan foreign key?' },
  { icon: Code2, text: 'Bantu saya memahami tahapan analisis kebutuhan sistem.' },
  { icon: MessageSquare, text: 'Buat kerangka belajar untuk mata kuliah Sistem Informasi.' },
];

export default function Page() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [modelId, setModelId] = useState(MODELS.find((model) => model.enabled)?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const activeConversation = useMemo(() => conversations.find((conversation) => conversation.id === activeId) ?? null, [conversations, activeId]);
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Conversation[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setConversations(parsed);
          if (parsed[0]) setActiveId(parsed[0].id);
        }
      }
    } catch {
      setError('Riwayat lokal tidak dapat dibaca. Anda tetap dapat memulai percakapan baru.');
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations)); }
    catch { setError('Penyimpanan browser penuh. Riwayat baru mungkin tidak tersimpan.'); }
  }, [conversations, hydrated]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages.length, loading]);

  const newChat = () => {
    if (loading) stopRequest();
    setActiveId(null);
    setDraft('');
    setError('');
    setMobileNav(false);
  };
  const stopRequest = () => abortRef.current?.abort();

  const submitPrompt = async (event?: FormEvent) => {
    event?.preventDefault();
    const prompt = draft.trim();
    if (!prompt || loading || !modelId) return;
    setDraft('');
    setError('');
    const currentId = activeId ?? makeId();
    const now = new Date().toISOString();
    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: prompt, createdAt: now };
    setActiveId(currentId);
    setConversations((items) => {
      const index = items.findIndex((item) => item.id === currentId);
      if (index < 0) return [{ id: currentId, title: prompt.slice(0, 54), updatedAt: now, messages: [userMessage] }, ...items];
      return items.map((item) => item.id === currentId ? { ...item, updatedAt: now, messages: [...item.messages, userMessage] } : item);
    });
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const response = await fetch('/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modelId, conversationId: currentId }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(typeof result?.error === 'string' ? result.error : 'Pesan belum dapat diproses. Silakan coba lagi.');
      if (result?.mode !== 'demo' || typeof result?.reply !== 'string') {
        throw new Error('Respons server tidak sesuai format demo yang diharapkan.');
      }
      const assistantMessage: ChatMessage = { id: makeId(), role: 'assistant', content: result.reply, createdAt: new Date().toISOString(), mode: 'demo' };
      setConversations((items) => items.map((item) => item.id === currentId
        ? { ...item, id: typeof result.conversationId === 'string' ? result.conversationId : item.id, updatedAt: assistantMessage.createdAt, messages: [...item.messages, assistantMessage] }
        : item));
      if (typeof result.conversationId === 'string') setActiveId(result.conversationId);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setDraft(prompt);
      setError(caught instanceof Error ? caught.message : 'Terjadi kendala. Silakan coba kembali.');
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitPrompt();
    }
  };
  const activeModel = MODELS.find((model) => model.id === modelId);

  return (
    <div className="app-shell">
      <button className={`mobile-overlay ${mobileNav ? 'open' : ''}`} aria-label="Tutup navigasi" onClick={() => setMobileNav(false)} />
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`} aria-label="Navigasi percakapan">
        <div className="brand">
          <img src="/sistem-informasi-logo.png" alt="Sistem Informasi" />
          <div><div className="brand-name">SI AI Hub</div><div className="brand-caption">Ruang belajar</div></div>
        </div>
        <button type="button" className="new-chat" onClick={newChat} aria-label="Mulai percakapan baru" data-testid="button-new-chat">
          <Plus size={16} strokeWidth={2.2} /> Percakapan baru
        </button>
        <div className="side-label">Riwayat percakapan</div>
        <div className="history-list" aria-live="polite">
          {!hydrated ? <div className="history-empty">Memuat riwayat…</div> :
            conversations.length === 0 ? <div className="history-empty">Percakapan yang Anda simpan akan muncul di sini.</div> :
              conversations.map((conversation) => (
                <button type="button" key={conversation.id} className={`history-item ${conversation.id === activeId ? 'active' : ''}`}
                  onClick={() => { setActiveId(conversation.id); setError(''); setMobileNav(false); }} aria-current={conversation.id === activeId ? 'page' : undefined}
                  aria-label={`Buka percakapan ${conversation.title}`} data-testid={`history-${conversation.id}`}>
                  <MessageSquare size={14} /><span className="history-title">{conversation.title}</span>
                </button>
              ))}
        </div>
        <div className="sidebar-bottom">
          <div className="profile-mark">SI</div>
          <div><div className="profile-title">Mahasiswa SI</div><div className="profile-subtitle">Ruang belajar pribadi</div></div>
        </div>
      </aside>

      <main className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Buka navigasi"><Menu size={17} /></button>
            <div className="workspace-label"><Code2 size={17} /><span>Ruang kerja Sistem Informasi</span></div>
          </div>
          <div className="topbar-right"><span className="live-dot" /> MODE DEMO</div>
        </header>
        <div className="demo-banner" role="status">
          <span className="live-dot" /> <strong>DEMO</strong> — OpenRouter belum terhubung. Semua jawaban dari endpoint adalah jawaban demo, bukan keluaran AI.
        </div>

        <section className="content" aria-label="Ruang percakapan">
          <div className="chat-heading">
            <div>
              <div className="eyebrow">Asisten belajar · Sistem Informasi</div>
              <h1>{activeConversation?.title ?? 'Apa yang ingin kamu pelajari?'}</h1>
              <div className="subtitle">Ruang untuk bertanya, memahami konsep, dan merapikan ide kuliah.</div>
            </div>
            <label className="model-select-wrap">
              <span className="model-caption">Model</span>
              <select className="model-select" value={modelId} onChange={(event) => setModelId(event.target.value)} aria-label="Pilih model" data-testid="select-model">
                {MODELS.filter((model) => model.enabled).map((model) => <option key={model.id} value={model.id}>{model.name} · {model.provider}</option>)}
              </select>
            </label>
          </div>
          <div className="model-card-grid" role="group" aria-label="Pilih model demo">
            {MODELS.map((model) => (
              <ModelCard key={model.id} model={model} selected={model.id === modelId} onSelect={setModelId} />
            ))}
            {MODELS.length === 0 && <p className="model-catalog-empty">Belum ada model yang dikonfigurasi.</p>}
          </div>
          <p className="model-catalog-note">Katalog contoh; ketersediaan model dan harga belum diverifikasi.</p>

          <div className="messages" aria-live="polite" aria-busy={loading}>
            {!hydrated ? (
              <div className="welcome" role="status"><div className="welcome-symbol"><MessageSquare size={23} /></div><h2>Menyiapkan ruang belajar</h2><p>Memuat riwayat percakapan Anda…</p></div>
            ) : messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-symbol"><BookOpen size={24} /></div>
                <h2>Mulai dari satu pertanyaan</h2>
                <p>Tanyakan materi kuliah atau pilih contoh di bawah. Jawaban saat ini berasal dari endpoint demo dan belum menggunakan model AI.</p>
                <div className="suggestions">
                  {suggestions.map(({ icon: Icon, text }) => <button key={text} type="button" className="suggestion" onClick={() => setDraft(text)}><Icon size={14} style={{ marginBottom: 8, color: '#b9d9a7' }} /><br />{text}</button>)}
                </div>
              </div>
            ) : (
                messages.map((message) => <MessageItem key={message.id} message={message} />)
            )}
            {loading && <article className="message assistant" role="status" aria-label="Sedang menunggu jawaban demo">
              <div className="avatar">SI</div><div className="message-body"><div className="message-meta"><span>Asisten SI</span><span className="demo-tag">Jawaban demo</span></div><div className="loading-dots"><span /><span /><span /></div></div>
            </article>}
            {error && <div className="error-note" role="alert">{error} Kamu dapat mengirim ulang pesan melalui kolom di bawah.</div>}
            <div ref={bottomRef} />
          </div>

          <div className="composer-area">
            <form className="composer" onSubmit={(event) => void submitPrompt(event)}>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown}
                placeholder="Tulis pertanyaan atau topik yang ingin kamu pahami…" aria-label="Tulis pesan" rows={2}
                maxLength={4000} data-testid="input-chat-prompt" />
              <div className="composer-bottom">
                <span className="composer-hint">{draft.length}/4.000 · Enter untuk kirim · Shift + Enter untuk baris baru</span>
                {loading ?
                  <button type="button" className="send-button stop-button" onClick={stopRequest} aria-label="Hentikan permintaan" data-testid="button-stop"><Square size={13} /> Hentikan</button> :
                  <button type="submit" className="send-button" disabled={!draft.trim() || !activeModel} aria-label="Kirim pesan" data-testid="button-send"><Send size={13} /> Kirim</button>}
              </div>
            </form>
            <div className="fine-print">{activeModel?.provider ?? 'SI AI Hub'} · <strong>{activeModel ? pricingLabel(activeModel.pricingStatus) : 'Harga belum diverifikasi'}</strong> · <strong>OpenRouter belum terhubung</strong></div>
          </div>
        </section>
      </main>
    </div>
  );
}
