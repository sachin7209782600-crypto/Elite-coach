import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, SkipForward, Mic, MicOff, Home, Sparkles, Volume2 } from "lucide-react";
import { ChatRequest, ChatResponse } from "@shared/api";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech-recognition";

const PERSONAS = [
  {
    id: "mei-ling",
    name: "Mei-Ling",
    role: "Tech Expert",
    image: "bg-gradient-to-br from-blue-400 to-blue-600",
    greeting:
      "Hey! I'm Mei-Ling. Ready to tackle some challenging tech interview questions? Let's start with your background.",
  },
  {
    id: "zara",
    name: "Zara",
    role: "Social Coach",
    image: "bg-gradient-to-br from-pink-400 to-purple-600",
    greeting:
      "Hey! I'm Zara. Let's work on your social confidence and communication skills. What would you like to improve today?",
  },
  {
    id: "elena",
    name: "Elena",
    role: "Speaking Coach",
    image: "bg-gradient-to-br from-emerald-400 to-teal-600",
    greeting:
      "Hello, I'm Elena. I'm here to help you become a confident public speaker. Shall we start?",
  },
  {
    id: "sia",
    name: "Sia",
    role: "Conversation Partner",
    image: "bg-gradient-to-br from-amber-400 to-orange-600",
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

  // Speech recognition and synthesis hooks
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechRecognitionSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, isSupported: isSpeechSynthesisSupported } = useSpeechSynthesis();

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
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!input.trim() || !currentPersona) return;

    // Add user message
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
      // Call the chat API
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

      // Update confidence score if provided
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

      // Play AI response if TTS is supported
      if (isSpeechSynthesisSupported) {
        // Small delay before speaking
        setTimeout(() => {
          speak(data.message, 0);
        }, 300);
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
    const availablePersonas = PERSONAS.filter((p) => p.id !== currentPersonaId);
    const randomPersona =
      availablePersonas[Math.floor(Math.random() * availablePersonas.length)];
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
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-70 transition"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/stats"
              className="flex items-center gap-2 hover:opacity-70 transition text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            >
              <span>Stats</span>
            </Link>
          </div>

          {/* Current Persona */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${currentPersona?.image}`}
            ></div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{currentPersona?.name}</p>
              <p className="text-xs text-muted-foreground">
                {currentPersona?.role}
              </p>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={skipPersona}
            className="px-4 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition text-sm font-medium flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            <span className="hidden sm:inline">Next</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-slide-up ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "ai" && (
                <div
                  className={`w-8 h-8 rounded-full ${currentPersona?.image} flex-shrink-0`}
                ></div>
              )}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-none"
                    : "bg-card border border-border rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div
                className={`w-8 h-8 rounded-full ${currentPersona?.image} flex-shrink-0`}
              ></div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-none px-4 py-3 flex gap-2">
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
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-3xl mx-auto px-6 py-4">
          {/* Interim transcript display */}
          {interimTranscript && (
            <div className="mb-3 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
              <span className="opacity-70">Listening:</span> {interimTranscript}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={toggleVoiceInput}
              disabled={!isSpeechRecognitionSupported}
              className={`p-3 rounded-lg transition ${
                isListening
                  ? "bg-primary text-white animate-pulse"
                  : "bg-card border border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title={
                !isSpeechRecognitionSupported
                  ? "Speech recognition not supported"
                  : ""
              }
            >
              {isListening ? (
                <Mic className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
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
              placeholder="Type your response... (or use voice)"
              className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Confidence Score: {confidenceScore}% • You're doing great! 🚀
          </p>
        </div>
      </div>
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
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold">Aura</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            Pick Your <span className="gradient-text">Coach</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose an AI persona to get started. You can switch anytime during
            your session.
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
                <div
                  className={`w-24 h-24 rounded-2xl ${persona.image} mx-auto flex items-center justify-center`}
                >
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
                    Choose {persona.name}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 text-center text-muted-foreground">
          <p>Pro tip: You can skip to a different persona anytime during chat</p>
        </div>
      </div>
    </div>
  );
}
