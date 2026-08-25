import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Send,
  MessageSquare,
  Search,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get('conversation');

  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);

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
          setActiveConversation(res.data.data[0]);
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
    return conv.participants.find((p) => p._id !== user?._id) || conv.participants[0] || {};
  };

  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    return other?.name?.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-6rem)]">
      <div className="h-full rounded-3xl glass-card border border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Left Sidebar: Conversations List */}
        <div className="border-r border-slate-800/80 bg-[#0B0F19]/90 flex flex-col h-full">
          {/* Top Search */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Messages</h2>
              <span className="text-xs text-indigo-400 font-semibold">
                {conversations.length} Active
              </span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations found
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
                    className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/10 border-l-2 border-indigo-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={other?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                        alt={other?.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      {online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#0B0F19]"></div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">
                          {other?.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {conv.lastMessage?.createdAt
                            ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {conv.lastMessage?.text || 'Start conversation...'}
                      </p>
                      {conv.deal && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-indigo-400 font-semibold">
                          <Briefcase className="w-2.5 h-2.5" />
                          <span>Deal: {conv.deal.title?.slice(0, 18)}...</span>
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
        <div className="md:col-span-2 flex flex-col h-full bg-[#111726]/60">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              {(() => {
                const other = getOtherParticipant(activeConversation);
                const online = isUserOnline(other._id);

                return (
                  <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={other?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                          alt={other?.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        {online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#0B0F19]"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {other?.name}
                          {other?.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              online ? 'bg-emerald-400' : 'bg-slate-600'
                            }`}
                          ></span>
                          <span>{online ? 'Active Now' : 'Offline'}</span>
                          <span className="text-slate-600">•</span>
                          <span className="capitalize">{other?.role}</span>
                        </div>
                      </div>
                    </div>

                    {activeConversation.deal && (
                      <a
                        href={`/deals/${activeConversation.deal._id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                        <span>View Deal Room</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })()}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;

                  return (
                    <div
                      key={idx}
                      className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <img
                          src={msg.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                          alt={msg.sender?.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                      )}
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                            : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/50'
                        }`}
                      >
                        <div>{msg.text}</div>
                        <div
                          className={`text-[9px] text-right mt-1 font-medium ${
                            isMe ? 'text-indigo-200' : 'text-slate-400'
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
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing indicator */}
              {typingUser && (
                <div className="px-6 py-1 text-[11px] text-indigo-400 italic">
                  {typingUser} is typing...
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-800/80 bg-slate-900/80 flex items-center gap-3"
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
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-600" />
              <div className="text-sm font-semibold text-white">Select a conversation</div>
              <p className="text-xs max-w-xs">
                Pick a creator or brand from the left sidebar to start negotiating campaign deliverables.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
