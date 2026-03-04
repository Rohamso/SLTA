'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Matrix types (minimal, to avoid SDK import issues in browser)
interface MatrixMessage {
  eventId: string;
  sender: string;
  body: string;
  timestamp: number;
  type: 'text' | 'notice' | 'emote';
}

interface MatrixChatProps {
  roomId: string;
  roomDisplayName?: string;
  labels: {
    login: string;
    loginTitle: string;
    loginDesc: string;
    username: string;
    password: string;
    homeserver: string;
    loginBtn: string;
    loggingIn: string;
    logout: string;
    sendPlaceholder: string;
    send: string;
    connecting: string;
    connected: string;
    error: string;
    noMessages: string;
    guestNotice: string;
    loginToChat: string;
    today: string;
    yesterday: string;
  };
  isRTL?: boolean;
}

const MATRIX_HOMESERVER = 'https://matrix.org';

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(ts: number, labels: MatrixChatProps['labels']): string {
  const now = new Date();
  const d = new Date(ts);
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return labels.today;
  if (isYesterday) return labels.yesterday;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDisplayName(userId: string): string {
  // Extract name from @username:server.org
  const match = userId.match(/^@([^:]+):/);
  return match ? match[1] : userId;
}

function getSenderColor(userId: string): string {
  const colors = [
    'text-green-400',
    'text-emerald-400',
    'text-teal-400',
    'text-cyan-400',
    'text-lime-400',
    'text-green-300',
    'text-emerald-300',
    'text-teal-300',
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function MatrixChat({ roomId, roomDisplayName, labels, isRTL }: MatrixChatProps) {
  const [messages, setMessages] = useState<MatrixMessage[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);

  // Auth state
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginServer, setLoginServer] = useState('matrix.org');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');
  const [sendError, setSendError] = useState('');
  const homeserverUrlRef = useRef('https://matrix.org');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sinceTokenRef = useRef<string>('');

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch initial messages (guest access)
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Register guest
        const guestRes = await fetch(
          `${MATRIX_HOMESERVER}/_matrix/client/v3/register?kind=guest`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          }
        );

        let token = '';
        if (guestRes.ok) {
          const guestData = await guestRes.json();
          token = guestData.access_token;
        }

        // Try to peek at room messages
        const roomIdEncoded = encodeURIComponent(roomId);
        const messagesUrl = token
          ? `${MATRIX_HOMESERVER}/_matrix/client/v3/rooms/${roomIdEncoded}/messages?dir=b&limit=50&access_token=${token}`
          : `${MATRIX_HOMESERVER}/_matrix/client/v3/rooms/${roomIdEncoded}/messages?dir=b&limit=50`;

        const msgRes = await fetch(messagesUrl);

        if (!msgRes.ok) {
          if (cancelled) return;
          setStatus('connected');
          setMessages([]);
          return;
        }

        const msgData = await msgRes.json();
        if (cancelled) return;

        const parsed = parseTimelineEvents(msgData.chunk || []);
        setMessages(parsed.reverse());
        setStatus('connected');
      } catch (err) {
        if (cancelled) return;
        console.error('Matrix init error:', err);
        setStatus('connected');
        setMessages([]);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [roomId]);

  // Poll for new messages when logged in
  useEffect(() => {
    if (!loggedIn || !accessToken || !roomId) return;

    let cancelled = false;

    async function poll() {
      try {
        const since = sinceTokenRef.current;
        const server = homeserverUrlRef.current;
        const url = since
          ? `${server}/_matrix/client/v3/sync?since=${since}&timeout=10000&filter={"room":{"rooms":["${roomId}"],"timeline":{"limit":50}}}`
          : `${server}/_matrix/client/v3/sync?timeout=0&filter={"room":{"rooms":["${roomId}"],"timeline":{"limit":50}}}`;

        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();

        sinceTokenRef.current = data.next_batch || '';

        const roomData = data.rooms?.join?.[roomId];
        if (roomData?.timeline?.events) {
          const newMsgs = parseTimelineEvents(roomData.timeline.events);
          if (newMsgs.length > 0) {
            setMessages(prev => {
              const existingIds = new Set(prev.map(m => m.eventId));
              const unique = newMsgs.filter(m => !existingIds.has(m.eventId));
              return [...prev, ...unique];
            });
          }
        }
      } catch (err) {
        console.error('Poll error:', err);
      }

      if (!cancelled) {
        pollRef.current = setTimeout(poll, 3000);
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [loggedIn, accessToken, roomId]);

  function parseTimelineEvents(events: any[]): MatrixMessage[] {
    return events
      .filter((e: any) => e.type === 'm.room.message' && e.content?.body)
      .map((e: any) => ({
        eventId: e.event_id,
        sender: e.sender,
        body: e.content.body,
        timestamp: e.origin_server_ts,
        type: e.content.msgtype === 'm.notice' ? 'notice' as const :
              e.content.msgtype === 'm.emote' ? 'emote' as const : 'text' as const,
      }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const server = loginServer.startsWith('http') ? loginServer : `https://${loginServer}`;

      // Login
      const loginRes = await fetch(`${server}/_matrix/client/v3/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'm.login.password',
          identifier: { type: 'm.id.user', user: loginUsername },
          password: loginPassword,
        }),
      });

      if (!loginRes.ok) {
        const err = await loginRes.json();
        throw new Error(err.error || 'Login failed');
      }

      const loginData = await loginRes.json();
      setAccessToken(loginData.access_token);
      setUserId(loginData.user_id);
      homeserverUrlRef.current = server;

      // Join the room by ID
      const roomIdEncoded = encodeURIComponent(roomId);
      const joinRes = await fetch(`${server}/_matrix/client/v3/join/${roomIdEncoded}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.access_token}`,
        },
        body: JSON.stringify({}),
      });

      if (!joinRes.ok) {
        const joinErr = await joinRes.json().catch(() => ({ error: 'Join failed' }));
        throw new Error(joinErr.error || 'Could not join room');
      }

      setLoggedIn(true);
      setShowLogin(false);
      setLoginPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMsg.trim() || !loggedIn || !accessToken || !roomId) return;

    setSending(true);
    setSendError('');
    const msgText = inputMsg.trim();

    try {
      const server = homeserverUrlRef.current;
      const roomIdEncoded = encodeURIComponent(roomId);
      const txnId = `m${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;

      const res = await fetch(
        `${server}/_matrix/client/v3/rooms/${roomIdEncoded}/send/m.room.message/${encodeURIComponent(txnId)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            msgtype: 'm.text',
            body: msgText,
          }),
        }
      );

      if (res.ok) {
        // Don't optimistically add — let sync polling confirm delivery
        setInputMsg('');
      } else {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        console.error('Send failed:', res.status, errData);
        setSendError(errData.error || `Error ${res.status}`);
      }
    } catch (err: any) {
      console.error('Send error:', err);
      setSendError(err.message || 'Network error');
    } finally {
      setSending(false);
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    setAccessToken('');
    setUserId('');
    sinceTokenRef.current = '';
    if (pollRef.current) clearTimeout(pollRef.current);
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: MatrixMessage[] }[] = [];
  let currentDateStr = '';
  for (const msg of messages) {
    const dateStr = new Date(msg.timestamp).toDateString();
    if (dateStr !== currentDateStr) {
      currentDateStr = dateStr;
      groupedMessages.push({ date: dateStr, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-black rounded-2xl border border-green-500/30 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/20 bg-green-950/20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-400' : status === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-green-300/70 text-xs">
            {status === 'connecting' ? labels.connecting : status === 'connected' ? labels.connected : labels.error}
          </span>
          <span className="text-green-500/40 text-xs ml-2 font-mono">{roomDisplayName || roomId}</span>
        </div>
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs font-mono">{getDisplayName(userId)}</span>
              <button
                onClick={handleLogout}
                className="text-green-300/50 hover:text-green-400 text-xs transition"
              >
                {labels.logout}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-3 py-1 text-xs bg-green-900/50 hover:bg-green-900 border border-green-500/30 rounded text-green-400 transition"
            >
              {labels.login}
            </button>
          )}
        </div>
      </div>

      {/* Login modal */}
      {showLogin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
          <div className="bg-green-950/90 border border-green-500/30 rounded-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-green-400 font-bold text-lg mb-1">{labels.loginTitle}</h3>
            <p className="text-green-300/50 text-sm mb-4">{labels.loginDesc}</p>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="text"
                placeholder={labels.username}
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm placeholder:text-green-300/30 focus:outline-none focus:border-green-500/60"
                required
                dir="ltr"
              />
              <input
                type="password"
                placeholder={labels.password}
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm placeholder:text-green-300/30 focus:outline-none focus:border-green-500/60"
                required
                dir="ltr"
              />
              <input
                type="text"
                placeholder={labels.homeserver}
                value={loginServer}
                onChange={e => setLoginServer(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm placeholder:text-green-300/30 focus:outline-none focus:border-green-500/60"
                dir="ltr"
              />

              {loginError && (
                <p className="text-red-400 text-xs">{loginError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-900 text-black font-semibold text-sm rounded-lg transition"
                >
                  {loginLoading ? labels.loggingIn : labels.loginBtn}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowLogin(false); setLoginError(''); }}
                  className="px-4 py-2 border border-green-500/30 text-green-300/70 text-sm rounded-lg hover:bg-green-950 transition"
                >
                  ✕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-1 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
        {status === 'connecting' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-green-300/50 text-sm animate-pulse">{labels.connecting}...</div>
          </div>
        )}

        {status === 'connected' && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-green-300/40 text-sm">{labels.noMessages}</p>
              {!loggedIn && (
                <p className="text-green-300/30 text-xs mt-2">{labels.guestNotice}</p>
              )}
            </div>
          </div>
        )}

        {groupedMessages.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-green-500/10" />
              <span className="text-green-500/30 text-xs">{formatDateSeparator(group.messages[0].timestamp, labels)}</span>
              <div className="flex-1 h-px bg-green-500/10" />
            </div>

            {group.messages.map((msg) => (
              <div key={msg.eventId} className={`group py-1 px-2 rounded hover:bg-green-950/30 transition ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-sm font-semibold ${getSenderColor(msg.sender)}`}>
                    {getDisplayName(msg.sender)}
                  </span>
                  <span className="text-green-500/30 text-[10px] font-mono">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className={`text-green-200/80 text-sm leading-relaxed ${msg.type === 'notice' ? 'italic text-green-300/50' : ''} ${msg.type === 'emote' ? 'italic' : ''}`}>
                  {msg.type === 'emote' ? `* ${getDisplayName(msg.sender)} ${msg.body}` : msg.body}
                </p>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-green-500/20 bg-green-950/10 px-4 py-3 flex-shrink-0">
        {sendError && (
          <div className="text-red-400 text-xs mb-2 px-1">{sendError}</div>
        )}
        {loggedIn ? (
          <form onSubmit={handleSend} className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="text"
              value={inputMsg}
              onChange={e => { setInputMsg(e.target.value); setSendError(''); }}
              placeholder={labels.sendPlaceholder}
              className="flex-1 px-3 py-2 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm placeholder:text-green-300/30 focus:outline-none focus:border-green-500/60"
              disabled={sending}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              disabled={sending || !inputMsg.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:text-green-600 text-black font-semibold text-sm rounded-lg transition"
            >
              {labels.send}
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="w-full py-2 text-center text-green-300/50 hover:text-green-400 text-sm transition border border-green-500/20 rounded-lg hover:border-green-500/40 hover:bg-green-950/30"
          >
            {labels.loginToChat}
          </button>
        )}
      </div>
    </div>
  );
}
