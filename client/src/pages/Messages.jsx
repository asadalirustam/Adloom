import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Search,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Sparkles,
  LayoutDashboard,
  User,
  Layers,
  Bell,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get('conversation');
  const navigate = useNavigate();

  const { user, isCreator, isBusiness, isAdmin } = useAuth();
  const { socket, isUserOnline } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);

  const getDashboardLink = () => {
    if (isCreator) return '/creator/dashboard';
    if (isBusiness) return '/business/dashboard';
    if (isAdmin) return '/admin/dashboard';
    return '/';
  };

  const getDealsLink = () => {
    if (isCreator) return '/creator/deals';
    if (isBusiness) return '/business/deals';
    if (isAdmin) return '/admin/deals';
    return '/';
  };

  const getExploreLink = () => {
    if (isCreator) return { label: 'Campaigns', path: '/requirements' };
    return { label: 'Find Creators', path: '/creators' };
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(getDashboardLink());
    }
  };

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chat/conversations');
      if (res.data.success) {
        setConversations(res.data.data);
        if (initialConvId) {
          const match = res.data.data.find((c) => c._id === initialConvId);
          if (match) setActiveConversation(match);
          else if (res.data.data.length > 0) setActiveConversation(res.data.data[0]);
        } else if (res.data.data.length > 0) {
          // On mobile screens, don't auto-open conversation unless specified by query param
          if (window.innerWidth >= 768) {
            setActiveConversation(res.data.data[0]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${activeConversation._id}`);
        if (res.data.success) {
          setMessages(res.data.data);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    fetchMessages();

    // Join socket room
    if (socket) {
      socket.emit('join_chat', activeConversation._id);
    }
  }, [activeConversation, socket]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessage) => {
      if (activeConversation && activeConversation._id === newMessage.conversation) {
        setMessages((prev) => [...prev, newMessage]);
      }
      // Update last message in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c._id === newMessage.conversation
            ? { ...c, lastMessage: { text: newMessage.text, sender: newMessage.sender, createdAt: new Date() } }
            : c
        )
      );
    };

    const handleTyping = (userName) => setTypingUser(userName);
    const handleStopTyping = () => setTypingUser(null);

    socket.on('message_received', handleMessageReceived);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket, activeConversation]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      const res = await api.post('/chat/messages', {
        conversationId: activeConversation._id,
        text: messageText,
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.data]);

        // Emit via socket
        if (socket) {
          socket.emit('send_message', res.data.data);
          socket.emit('stop_typing', activeConversation._id);
        }
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const getOtherParticipant = (conv) => {
    return conv?.participants?.find((p) => p._id !== user?._id) || conv?.participants?.[0] || {};
  };

  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    return other?.name?.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Top Breadcrumb & Quick Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold shadow-sm transition"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-coral" />
            <span className="hidden xs:inline">Back to</span> Dashboard
          </button>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to={getDashboardLink()} className="hover:text-foreground transition font-medium">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-semibold">Messages & Chat</span>
          </div>
        </div>

        {/* Quick Shortcut Navigation Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
          <Link
            to={getDashboardLink()}
            className="px-2.5 py-1.5 rounded-xl bg-card border border-border hover:border-coral/40 text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition shrink-0"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-coral" />
            <span className="hidden sm:inline">My</span> Dashboard
          </Link>
          <Link
            to={getDealsLink()}
            className="px-2.5 py-1.5 rounded-xl bg-card border border-border hover:border-purple-500/40 text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition shrink-0"
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-500" />
            <span>Deals</span>
          </Link>
          <Link
            to={getExploreLink().path}
            className="px-2.5 py-1.5 rounded-xl bg-card border border-border hover:border-emerald-500/40 text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>{getExploreLink().label}</span>
          </Link>
          <Link
            to="/notifications"
            className="px-2.5 py-1.5 rounded-xl bg-card border border-border hover:border-amber-500/40 text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition shrink-0"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Notifications</span>
          </Link>
        </div>
      </div>

      {/* Main Messages Card Container */}
      <div className="flex-1 min-h-0 rounded-2xl sm:rounded-3xl glass-card border border-border overflow-hidden grid grid-cols-1 md:grid-cols-3 shadow-xl">
        {/* Left Sidebar: Conversations List */}
        <div
          className={`border-r border-border bg-card flex flex-col h-full ${
            activeConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top Search & Header */}
          <div className="p-3.5 sm:p-4 border-b border-border space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-coral/10 text-coral">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-foreground">Conversations</h2>
              </div>
              <span className="text-[11px] text-coral font-semibold px-2 py-0.5 rounded-full bg-coral/10 border border-coral/20">
                {conversations.length} Active
              </span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-accent text-muted-foreground flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-foreground">No conversations yet</div>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  Direct message creators from their profiles or brands from their campaign listings.
                </p>
                <Link
                  to={getExploreLink().path}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs font-semibold shadow-md shadow-coral/20 transition mt-2"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse {getExploreLink().label}</span>
                </Link>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = activeConversation?._id === conv._id;
                const online = isUserOnline(other._id);

                return (
                  <div
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-coral/10 border-l-4 border-coral font-medium'
                        : 'hover:bg-accent/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={other?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                        alt={other?.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-border"
                      />
                      {online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-card"></div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground truncate">
                          {other?.name || 'User'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {conv.lastMessage?.createdAt
                            ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.lastMessage?.text || 'Start conversation...'}
                      </p>
                      {conv.deal && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                          <Briefcase className="w-2.5 h-2.5" />
                          <span className="truncate max-w-[140px]">Deal: {conv.deal.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat Window */}
        <div
          className={`md:col-span-2 flex flex-col h-full bg-background/50 ${
            !activeConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              {(() => {
                const other = getOtherParticipant(activeConversation);
                const online = isUserOnline(other._id);

                return (
                  <div className="p-3.5 sm:p-4 border-b border-border bg-card flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      {/* Mobile Back to Conversation List Button */}
                      <button
                        onClick={() => setActiveConversation(null)}
                        className="md:hidden p-1.5 rounded-lg border border-border bg-accent text-foreground hover:text-coral transition"
                        title="Back to all conversations"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <div className="relative shrink-0">
                        <img
                          src={other?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                          alt={other?.name}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-1 ring-border"
                        />
                        {online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-card"></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5 truncate">
                          <span className="truncate">{other?.name || 'User'}</span>
                          {other?.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-coral shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              online ? 'bg-emerald-400' : 'bg-muted-foreground'
                            }`}
                          ></span>
                          <span>{online ? 'Active Now' : 'Offline'}</span>
                          <span>•</span>
                          <span className="capitalize">{other?.role || 'Member'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Chat Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {other?._id && other?.role === 'creator' && (
                        <Link
                          to={`/creators/${other._id}`}
                          className="px-2.5 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground hover:text-coral text-xs font-semibold flex items-center gap-1.5 transition"
                          title="View creator profile"
                        >
                          <User className="w-3.5 h-3.5 text-coral" />
                          <span className="hidden sm:inline">Profile</span>
                        </Link>
                      )}

                      {activeConversation.deal && (
                        <Link
                          to={`/deals/${activeConversation.deal._id}`}
                          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition"
                          title="Open Deal Room"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                          <span className="hidden sm:inline">Deal Room</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3 sm:space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-2">
                    <Sparkles className="w-8 h-8 text-coral/60 animate-bounce" />
                    <div className="text-xs font-bold text-foreground">Start the conversation</div>
                    <p className="text-[11px] max-w-xs text-muted-foreground">
                      Discuss deliverables, timelines, pricing, or content specifications.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;

                    return (
                      <div
                        key={idx}
                        className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <img
                            src={msg.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                            alt={msg.sender?.name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-border shrink-0"
                          />
                        )}
                        <div
                          className={`max-w-md p-3 sm:p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-gradient-to-r from-coral to-coral-600 text-white rounded-br-none shadow-coral/20'
                              : 'bg-card text-foreground rounded-bl-none border border-border'
                          }`}
                        >
                          <div>{msg.text}</div>
                          <div
                            className={`text-[9px] text-right mt-1 font-medium ${
                              isMe ? 'text-white/80' : 'text-muted-foreground'
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing indicator */}
              {typingUser && (
                <div className="px-4 py-1 text-[11px] text-coral italic shrink-0">
                  {typingUser} is typing...
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-border bg-card flex items-center gap-2 sm:gap-3 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (socket && activeConversation) {
                      socket.emit('typing', {
                        room: activeConversation._id,
                        senderName: user?.name,
                      });
                    }
                  }}
                  onBlur={() => {
                    if (socket && activeConversation) {
                      socket.emit('stop_typing', activeConversation._id);
                    }
                  }}
                  placeholder="Type your message, negotiation, or question..."
                  className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-coral hover:bg-coral-600 text-white shadow-lg shadow-coral/20 transition disabled:opacity-40 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-coral/10 text-coral flex items-center justify-center shadow-lg shadow-coral/10">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-foreground">Select a conversation</div>
                <p className="text-xs max-w-sm text-muted-foreground">
                  Pick a creator or brand from the left sidebar to start negotiating campaign deliverables.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Link
                  to={getDashboardLink()}
                  className="px-3.5 py-2 rounded-xl bg-card border border-border hover:border-coral/40 text-xs font-semibold text-foreground flex items-center gap-1.5 transition shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-coral" />
                  <span>Go to Dashboard</span>
                </Link>
                <Link
                  to={getExploreLink().path}
                  className="px-3.5 py-2 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-coral/20"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{getExploreLink().label}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
