import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  SkipForward,
  Mic,
  Home,
  Sparkles,
  Volume2Off,
  Volume2,
} from "lucide-react";
import { ChatRequest, ChatResponse } from "@shared/api";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech-recognition";
import { Avatar3D } from "@/components/Avatar3D";

const PERSONAS = [
  {
    id: "mei-ling",
    name: "Mei-Ling",
    role: "Tech Expert",
    greeting:
      "Hey! I'm Mei-Ling. Ready to tackle some challenging tech interview questions? Let's start with your background.",
  },
  {
    id: "zara",
    name: "Zara",
    role: "Social Coach",
    greeting:
      "Hey! I'm Zara. Let's work on your social confidence and communication skills. What would you like to improve today?",
  },
  {
    id: "elena",
    name: "Elena",
    role: "Speaking Coach",
    greeting:
      "Hello, I'm Elena. I'm here to help you become a confident public speaker. Shall we start?",
  },
  {
    id: "sia",
    name: "Sia",
    role: "Conversation Partner",
    greeting:
      "Hi! I'm Sia! I love casual conversations and helping with language learning. What's on your mind?",
  },
];

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  timestamp: number;
}

export default function Chat() {
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(75);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechRecognitionSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, stop, isSupported: isSpeechSynthesisSupported } = useSpeechSynthesis();

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput((prev) => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const currentPersona = PERSONAS.find((p) => p.id === currentPersonaId);

  // Initialize chat with selected persona
  const startChat = (personaId: string) => {
    setCurrentPersonaId(personaId);
    const persona = PERSONAS.find((p) => p.id === personaId);
    if (persona) {
      setMessages([
        {
          id: "1",
          type: "ai",
          text: persona.greeting,
          timestamp: Date.now(),
        },
      ]);
      setShowChat(true);

      // Auto-play greeting if sound enabled
      if (soundEnabled && isSpeechSynthesisSupported) {
        setTimeout(() => {
          setIsSpeaking(true);
          speak(persona.greeting, 0);
          setTimeout(() => setIsSpeaking(false), persona.greeting.length * 100);
        }, 300);
      }
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!input.trim() || !currentPersona) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatRequest: ChatRequest = {
        personaId: currentPersonaId,
        message: input,
        conversationHistory: messages
          .filter((m) => m.id !== userMessage.id)
          .map((m) => ({
            role: m.type === "user" ? "user" : "assistant",
            content: m.text,
          })),
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatRequest),
      });

      if (!response.ok) throw new Error("API request failed");

      const data: ChatResponse = await response.json();

      if (data.confidenceScore) {
        setConfidenceScore(data.confidenceScore);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: data.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak AI response if enabled
      if (soundEnabled && isSpeechSynthesisSupported) {
        setIsSpeaking(true);
        speak(data.message, 0);
        // Estimate speaking time and set flag back to false
        setTimeout(() => {
          setIsSpeaking(false);
        }, data.message.length * 50);
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: "I had trouble understanding that. Could you try again?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Skip to next persona
  const skipPersona = () => {
    const availablePersonas = PERSONAS.filter(
      (p) => p.id !== currentPersonaId
    );
    const randomPersona =
      availablePersonas[Math.floor(Math.random() * availablePersonas.length)];
    stop();
    startChat(randomPersona.id);
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!currentPersonaId) {
    return <PersonaSelectionScreen onSelectPersona={startChat} />;
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-70 transition"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Home</span>
          </Link>

          {/* Confidence and status */}
          <div className="text-center flex-1 mx-4">
            <p className="text-sm font-semibold">{currentPersona?.name}</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Confidence: {confidenceScore}%</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <Volume2Off className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={skipPersona}
              className="px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition text-sm font-medium flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              <span className="hidden sm:inline">Next</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0 overflow-hidden">
        {/* 3D Avatar - Main focus */}
        <div className="lg:col-span-3 bg-black relative">
          <Avatar3D
            personaId={currentPersonaId}
            personaName={currentPersona?.name || ""}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />

          {/* User camera preview (bottom right corner) */}
          <div className="absolute bottom-4 right-4 w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white text-center">
              <div>
                <p className="text-xs font-semibold">Your</p>
                <p className="text-xs">Camera</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:col-span-1 bg-card border-l border-border flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 animate-slide-up text-xs ${
                  message.type === "ai"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.type === "ai"
                      ? "bg-primary/20 text-foreground rounded-bl-none"
                      : "bg-primary text-white rounded-br-none"
                  }`}
                >
                  <p className="text-xs leading-relaxed">{message.text}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="bg-primary/20 rounded-lg rounded-bl-none px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-3 space-y-2">
            {interimTranscript && (
              <div className="p-2 bg-primary/10 border border-primary/20 rounded text-xs text-primary">
                {interimTranscript}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={toggleVoiceInput}
                disabled={!isSpeechRecognitionSupported}
                className={`p-2 rounded transition flex-shrink-0 ${
                  isListening
                    ? "bg-primary text-white animate-pulse"
                    : "bg-card border border-border hover:border-primary/50 disabled:opacity-50"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type or speak..."
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded bg-primary text-white hover:shadow-lg hover:shadow-primary/30 transition disabled:opacity-50 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Toggle */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="lg:hidden absolute bottom-4 left-4 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition z-20"
      >
        {showChat ? "Hide Chat" : "Show Chat"}
      </button>

      {/* Mobile Chat Overlay */}
      {showChat && (
        <div className="lg:hidden absolute inset-0 bg-card z-50 flex flex-col">
          <button
            onClick={() => setShowChat(false)}
            className="p-3 border-b border-border"
          >
            ← Back
          </button>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.type === "ai"
                      ? "bg-primary/20 text-foreground"
                      : "bg-primary text-white"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded transition ${
                  isListening ? "bg-primary text-white" : "bg-card border border-border"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type..."
                className="flex-1 bg-background border border-border rounded px-3 py-2 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="p-2 rounded bg-primary text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PersonaSelectionScreen({
  onSelectPersona,
}: {
  onSelectPersona: (id: string) => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold">Aura</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            Pick Your <span className="gradient-text">Coach</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose an AI persona to chat with. You can skip to another anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {PERSONAS.map((persona, i) => (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className="group relative animate-slide-up hover:scale-105 transition duration-300 text-left"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition duration-300"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 h-full hover:border-primary/50 transition cursor-pointer space-y-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{persona.name}</h2>
                  <p className="text-primary font-semibold text-sm">
                    {persona.role}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {persona.greeting}
                </p>
                <div className="pt-4 border-t border-border">
                  <span className="inline-block w-full py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold group-hover:shadow-lg group-hover:shadow-primary/30 transition text-center">
                    Start Chat
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
