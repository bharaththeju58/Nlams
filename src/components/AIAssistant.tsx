import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; page: string; section?: string }[];
}

import { useApp } from '../context/AppContext';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isSendingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const { role, portalUserType } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (portalUserType !== 'officer' && portalUserType !== 'auditor') {
    return null;
  }

  const handleSend = async (overrideText?: string | React.MouseEvent | React.KeyboardEvent) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : inputValue;
    if (!textToSend.trim() || isSendingRef.current) return;
    isSendingRef.current = true;
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim()
    };
    
    setMessages(prev => [...prev, userMsg]);
    if (typeof overrideText !== 'string') {
      setInputValue('');
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg.content,
          language: i18n.language, 
          history: messages.map(m => ({ role: m.role, content: m.content })),
          userRole: role,
          portalUserType: portalUserType
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error('Chat error Details:', error.message || error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: String(t('ai.error', error.message || 'I was unable to search the NLAMS records. Please try again.'))
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all z-[9999] flex items-center gap-2"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
        <span className="font-medium pr-2">AI Assistant</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-[9999]"
          >
            {/* Header */}
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-sm">NLAMS AI Assistant</h3>
                  <p className="text-[10px] text-blue-100">{t('ai.powered', 'Powered by RAG & Gemini')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearConversation}
                  className="p-1 hover:bg-blue-500 rounded text-xs px-2 transition-colors"
                  title="Clear conversation"
                >
                  {t('common.clear', 'Clear')}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-500 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm px-4">
                    {t('ai.welcome', 'Ask me anything about NLAMS policies, workflows, or compensation.')}
                  </p>
                  
                  <div className="w-full px-4 mt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-left">
                      {t('ai.suggestedHeading', 'Suggested Questions')}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {[
                        t('ai.suggest.q1', 'What is the compensation status for LP-001?'),
                        t('ai.suggest.q2', 'Has compensation been paid for LP-002?'),
                        t('ai.suggest.q3', 'What is the verification status of LP-003?'),
                        t('ai.suggest.q4', 'Has possession been completed for LP-004?'),
                        t('ai.suggest.q5', 'What is the rehabilitation status of LP-005?'),
                        t('ai.suggest.q6', 'What is the acquisition status of LP-006?'),
                        t('ai.suggest.q7', 'Are there any pending actions for LP-007?')
                      ].map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(question)}
                          disabled={isLoading}
                          className="text-xs text-left p-2.5 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-50"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      
                      {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                            {t('ai.sources', 'Sources')}
                          </span>
                          <ul className="space-y-1">
                            {msg.sources.map((s, idx) => (
                              <li key={idx} className="text-[11px] text-blue-600 flex items-start gap-1">
                                <span className="mt-0.5">•</span>
                                <span>
                                  {s.title} — Page {s.page}
                                  {s.section && ` (${s.section})`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">{t('ai.thinking', 'Searching documents...')}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-end gap-2 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('ai.placeholder', 'Ask a question about NLAMS...')}
                  className="w-full max-h-32 min-h-[44px] bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm resize-none transition-all placeholder:text-slate-400"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
