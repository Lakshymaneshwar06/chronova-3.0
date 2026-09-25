import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Compass,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { SpecializationField, ChatMessage, EventItem, StudyResource } from '../../types';

interface ChronovaAiBotProps {
  events: EventItem[];
  resources: StudyResource[];
  onSelectEvent?: (event: EventItem) => void;
  onSelectResource?: (resource: StudyResource) => void;
}

const SPECIALIZATIONS: {
  id: SpecializationField;
  label: string;
  icon: string;
  badge: string;
  promptSuggestions: string[];
}[] = [
  {
    id: 'ai-ml',
    label: 'AI & Machine Learning',
    icon: '🤖',
    badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    promptSuggestions: [
      'Recommend upcoming AI hackathons',
      'Show transformer workshop details',
      'Where can I find Deep Learning PYQs?'
    ]
  },
  {
    id: 'cs',
    label: 'Computer Science & Systems',
    icon: '💻',
    badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    promptSuggestions: [
      'Best notes for Operating Systems CS-301',
      'Explain Raft consensus vs Paxos',
      'Recommend DSA practice resources'
    ]
  },
  {
    id: 'data-science',
    label: 'Data Science & Analytics',
    icon: '📊',
    badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    promptSuggestions: [
      'Show Probability & Math cheat sheets',
      'Data engineering study materials',
      'Upcoming data science competitions'
    ]
  },
  {
    id: 'engineering',
    label: 'Core Engineering & Robotics',
    icon: '⚙️',
    badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    promptSuggestions: [
      'How to join the Autonomous Robotics Club?',
      'Embedded systems lab guides',
      'Digital signal processing notes'
    ]
  },
  {
    id: 'design',
    label: 'UI/UX & Product Design',
    icon: '🎨',
    badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    promptSuggestions: [
      'Design Collective meeting times',
      'Design system cheat sheets',
      'HackFest product pitch guidelines'
    ]
  }
];

export const ChronovaAiBot: React.FC<ChronovaAiBotProps> = ({
  events,
  resources,
  onSelectEvent,
  onSelectResource
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<SpecializationField>('ai-ml');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSpec = SPECIALIZATIONS.find((s) => s.id === selectedField)!;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! I am your **Chronova Academic & Event AI Advisor**. I am currently specialized in **${activeSpec.label}**. Ask me for exam preparation tips, verified study notes, or upcoming hackathons and workshops!`,
      timestamp: 'Just now',
      field: 'ai-ml',
      suggestedPrompts: activeSpec.promptSuggestions
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleFieldChange = (newField: SpecializationField) => {
    setSelectedField(newField);
    const spec = SPECIALIZATIONS.find((s) => s.id === newField)!;
    const switchMsg: ChatMessage = {
      id: `switch-${Date.now()}`,
      sender: 'bot',
      text: `Switched specialization focus to **${spec.label}** ${spec.icon}. How can I assist your ${spec.label} coursework, research, or event calendar today?`,
      timestamp: 'Just now',
      field: newField,
      suggestedPrompts: spec.promptSuggestions
    };
    setMessages((prev) => [...prev, switchMsg]);
  };

  const generateBotResponse = (query: string, field: SpecializationField): string => {
    const q = query.toLowerCase();

    // Event queries
    if (q.includes('event') || q.includes('hackathon') || q.includes('workshop') || q.includes('talk')) {
      const matchedEvents = events.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.category.includes('hackathon')
      );

      if (matchedEvents.length > 0) {
        const top = matchedEvents[0];
        return `Here is a prime recommendation in **${activeSpec.label}**:\n\n🏆 **${top.title}**\n- **Category**: ${top.category.toUpperCase()} (${top.format})\n- **Date**: ${new Date(top.startDate).toLocaleDateString()}\n- **Venue**: ${top.venue}\n- **Prizes/Pass**: ${top.prizes || top.price}\n\nYou can claim your digital pass in **Event Mode**!`;
      }
      return `For **${activeSpec.label}**, we recommend registering for **Chronova HackFest 2026** ($25,000 in bounties) and the **Zero to Transformer LLM Workshop**. Check the Event Mode tabs to claim your free pass!`;
    }

    // Study material / notes queries
    if (q.includes('note') || q.includes('pyq') || q.includes('sheet') || q.includes('exam') || q.includes('syllabus')) {
      const matchedResources = resources.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.courseCode.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );

      if (matchedResources.length > 0) {
        const top = matchedResources[0];
        return `Found verified study material:\n\n📚 **${top.courseCode}: ${top.title}**\n- **Type**: ${top.type.toUpperCase()} • Sem ${top.semester}\n- **Author**: ${top.author.name} (${top.author.role})\n- **Rating**: ⭐ ${top.rating}/5.0 (${top.downloadCount} downloads)\n\nHead to the **Study Hub** or open your Vault to preview and download!`;
      }
      return `In **${activeSpec.label}**, top-rated materials include **CS-301 Operating Systems Mastery Notes**, **CS-204 DSA Complete Cheat Sheet**, and **AI-402 Transformers Lab Guide**. All are accessible with 1-click preview in the Study Material Hub.`;
    }

    // Career / Guidance
    if (q.includes('career') || q.includes('interview') || q.includes('roadmap') || q.includes('guide')) {
      return `### Roadmap for ${activeSpec.label}:\n1. **Core Foundations**: Master algorithms, concurrency, and mathematical foundations.\n2. **Hands-On Portfolio**: Participate in Chronova campus hackathons and push open-source repositories.\n3. **Peer Networking**: Attend weekly technical guilds and obtain verified QR certificates for your LinkedIn!`;
    }

    // Default conversational reply
    return `Great question regarding **${activeSpec.label}**! Chronova integrates both peer-verified course notes and hands-on developer events. You can explore the **Study Hub** for syllabus-aligned materials or attend club meetups to earn verifiable QR credentials.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateBotResponse(text, selectedField);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: 'Just now',
        field: selectedField,
        suggestedPrompts: activeSpec.promptSuggestions
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div id="chronova-ai-bot-widget" className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          id="open-ai-bot-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl transition-all hover:scale-105 cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                Chronova AI Bot
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {activeSpec.icon}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {activeSpec.label} Advisor
            </p>
          </div>
        </button>
      )}

      {/* Expanded AI Bot Window */}
      {isOpen && (
        <div
          id="ai-bot-window"
          className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Chronova AI Advisor
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Domain-specific student copilot
                </p>
              </div>
            </div>

            <button
              id="close-ai-bot-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subject & Specialization Selection Bar */}
          <div className="px-3.5 py-2.5 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 uppercase tracking-wider">
                <Compass className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>Specialization:</span>
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                {activeSpec.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => handleFieldChange(spec.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedField === spec.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{spec.icon}</span>
                  <span className="text-[11px]">{spec.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-white dark:bg-slate-900">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Suggested Prompts if Bot */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Suggested questions:
                      </span>
                      {msg.suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-left text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50/50 dark:bg-indigo-950/30 px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60 transition-colors cursor-pointer"
                        >
                          → {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="italic">Chronova AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                id="ai-bot-query-input"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Ask anything about ${activeSpec.label}...`}
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
