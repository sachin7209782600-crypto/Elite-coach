import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  SkipForward,
  Mic,
  Home,
  Sparkles,
  VolumeX,
  Volume2,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";
import { ChatRequest, ChatResponse } from "@shared/api";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech-recognition";
import { RealisticAvatar3D } from "@/components/RealisticAvatar3D";
import { CameraPreview } from "@/components/CameraPreview";
import { WelcomeOverlay } from "@/components/WelcomeOverlay";
import { useMultilingual, SUPPORTED_LANGUAGES, type Language } from "@/hooks/use-multilingual";

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
  {
    id: "valkyrie",
    name: "Valkyrie",
    role: "Hardball Interviewer",
    greeting:
      "I'm Valkyrie. Let's prepare you for the toughest challenges. Ready to be pushed to your limits?",
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: isSpeechRecognitionSupported,
    error: speechError,
    clearError: clearSpeechError,
    setLanguage: setSpeechLanguage,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, stop, isSupported: isSpeechSynthesisSupported, setLanguage: setTTSLanguage } = useSpeechSynthesis();
  const { selectedLanguage, updateLanguage } = useMultilingual();

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

  // Update language for both speech recognition and TTS
  useEffect(() => {
    setSpeechLanguage(selectedLanguage.code);
    setTTSLanguage(selectedLanguage.code);
  }, [selectedLanguage, setSpeechLanguage, setTTSLanguage]);

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
      setShowWelcome(false);

      // Auto-play greeting if sound enabled
      if (soundEnabled && isSpeechSynthesisSupported) {
        setTimeout(() => {
          setIsSpeaking(true);
          speak(persona.greeting, 0, selectedLanguage.code);
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
        speak(data.message, 0, selectedLanguage.code);
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
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <WelcomeOverlay isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

      {/* Header - Minimal for OmeTV feel */}
      <header className="h-14 bg-black/80 border-b border-gray-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:opacity-70 transition">
            <Home className="w-5 h-5 text-white" />
          </Link>
          <div className="w-px h-6 bg-gray-700"></div>
          <div className="text-sm">
            <p className="text-white font-semibold">{currentPersona?.name}</p>
            <p className="text-xs text-gray-400">Confidence: {confidenceScore}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="p-2 hover:bg-gray-900 rounded-lg transition flex items-center gap-1"
              title="Change language"
            >
              <Globe className="w-4 h-4 text-white" />
              <span className="text-xs text-white">{selectedLanguage.flag}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto min-w-48">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      updateLanguage(lang);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition ${
                      selectedLanguage.code === lang.code
                        ? "bg-primary/20 text-white"
                        : "text-gray-300"
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-gray-900 rounded-lg transition"
            title={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-white" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={skipPersona}
            className="px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-white text-sm font-medium transition"
            title="Match with different persona"
          >
            <SkipForward className="w-4 h-4 inline mr-1" />
            <span className="hidden sm:inline">Next</span>
          </button>
        </div>
      </header>

      {/* Main OmeTV-style Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden bg-black">
        {/* 3D Avatar - MAIN FOCUS (takes most space) */}
        <div className="lg:col-span-3 relative bg-gradient-to-b from-blue-950 via-slate-900 to-black">
          <RealisticAvatar3D
            personaId={currentPersonaId}
            personaName={currentPersona?.name || ""}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />

          {/* User camera preview (OmeTV corner) */}
          <div className="absolute bottom-6 right-6 w-32 h-40 rounded-lg border-2 border-primary/40 overflow-hidden shadow-2xl bg-black">
            <CameraPreview isListening={isListening} />
          </div>

          {/* Vibe/Status Overlay */}
          <div className="absolute bottom-6 left-6 text-white text-sm space-y-1">
            {isListening && (
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full text-xs">
                <span className="animate-pulse">🎤</span>
                <span>Listening...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full text-xs">
                <span className="animate-pulse">💬</span>
                <span>Speaking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar - Minimal */}
        <div className="lg:col-span-2 bg-gray-950 border-l border-gray-800 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === "ai" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.type === "ai"
                      ? "bg-gray-800 text-gray-100 rounded-bl-none"
                      : "bg-primary text-white rounded-br-none"
                  }`}
                >
                  <p>{message.text}</p>
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
                <div className="bg-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-3 space-y-2 bg-gray-950">
            {speechError && speechError.includes("network") && (
              <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-600 flex items-center gap-2">
                <span className="animate-spin">⟳</span>
                <span>Reconnecting voice...</span>
              </div>
            )}
            {interimTranscript && (
              <div className="p-2 bg-primary/10 border border-primary/20 rounded text-xs text-primary italic">
                {interimTranscript}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={toggleVoiceInput}
                disabled={!isSpeechRecognitionSupported}
                className={`p-2 rounded transition flex-shrink-0 ${
                  isListening
                    ? "bg-green-500 text-white animate-pulse"
                    : "bg-gray-800 border border-gray-700 hover:border-primary/50 text-white disabled:opacity-50"
                }`}
                title={isSpeechRecognitionSupported ? "Click to speak" : "Microphone not available"}
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
                placeholder="Type or use voice..."
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded bg-primary hover:bg-primary/80 text-white transition disabled:opacity-50 flex-shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">Aura</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Pick Your <span className="gradient-text">Coach</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Talk to realistic AI coaches. Practice interviews, social skills, public speaking in any language.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {PERSONAS.map((persona, i) => (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className="group relative animate-slide-up hover:scale-105 transition duration-300 text-left"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition duration-300"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full hover:border-primary/50 transition cursor-pointer space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{persona.name}</h2>
                  <p className="text-primary font-semibold text-sm">{persona.role}</p>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{persona.greeting.slice(0, 60)}...</p>
                <div className="pt-4 border-t border-gray-800">
                  <span className="inline-block w-full py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold group-hover:shadow-lg group-hover:shadow-primary/30 transition text-center text-sm">
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
