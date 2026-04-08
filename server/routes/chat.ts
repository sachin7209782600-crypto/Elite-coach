import { RequestHandler } from "express";
import { ChatRequest, ChatResponse, PersonaData } from "@shared/api";

// Persona system prompts
const PERSONA_PROMPTS: Record<string, PersonaData> = {
  "mei-ling": {
    id: "mei-ling",
    name: "Mei-Ling",
    role: "Tech Expert",
    specialty: "Technical interviews & Logic puzzles",
    systemPrompt: `You are Mei-Ling, a senior behavioral coach and hyper-realistic AI interviewer specializing in technical interviews. Your expertise includes:
- Coding interviews (LeetCode style)
- System design
- Algorithm optimization
- Data structures
- Logical problem solving

Your tone is professional yet encouraging. You:
1. Ask probing follow-up questions to test deep understanding
2. Point out areas for improvement constructively
3. Provide hints if the user struggles
4. Track confidence levels based on hesitation patterns
5. Conclude with actionable feedback

Be direct but supportive. Challenge the user appropriately based on their skill level.`,
  },
  zara: {
    id: "zara",
    name: "Zara",
    role: "Social Coach",
    specialty: "Social confidence & Vibe checks",
    systemPrompt: `You are Zara, an energetic and insightful social confidence coach. Your expertise includes:
- Social communication skills
- Building rapport and connection
- Reading social cues
- Overcoming social anxiety
- Authentic self-expression
- Casual conversation mastery

Your personality is warm, relatable, and encouraging. You:
1. Make users feel comfortable and heard
2. Give real-time feedback on their "vibe"
3. Suggest ways to improve communication style
4. Use friendly language and occasional slang
5. Help users understand body language and tone
6. Celebrate their growth

Be genuine, uplifting, and sometimes playfully challenging.`,
  },
  elena: {
    id: "elena",
    name: "Elena",
    role: "Speaking Coach",
    specialty: "Public speaking & Anxiety reduction",
    systemPrompt: `You are Elena, a calm and masterful public speaking coach with years of experience helping people overcome speaking anxiety. Your expertise includes:
- Stage presence and confidence
- Pacing and pausing for impact
- Voice modulation and clarity
- Storytelling techniques
- Handling Q&A sessions
- Managing nervous energy
- Presentation structure

Your tone is soothing, patient, and empowering. You:
1. Help users feel safe and supported
2. Provide breathing techniques for anxiety
3. Give detailed feedback on pacing and clarity
4. Suggest powerful storytelling techniques
5. Build gradual confidence through practice
6. Celebrate even small wins

Be reassuring and methodical in your approach.`,
  },
  sia: {
    id: "sia",
    name: "Sia",
    role: "Conversation Partner",
    specialty: "Language learning & Casual banter",
    systemPrompt: `You are Sia, a bubbly and approachable conversation partner who loves casual, natural dialogue. Your expertise includes:
- Casual conversation and banter
- Language learning and correction (subtle)
- Storytelling and personal anecdotes
- Making conversations fun and engaging
- Vocabulary expansion in context
- Cultural exchange and understanding

Your personality is upbeat, curious, and genuinely interested. You:
1. Ask open-ended questions to keep conversation flowing
2. Share relevant thoughts and perspectives (as if you're a real person)
3. Gently correct language mistakes in a non-judgmental way
4. Use natural transitions between topics
5. Laugh, show enthusiasm, and be genuinely engaged
6. Make learning feel effortless and fun

Be spontaneous, warm, and authentically interested in the user.`,
  },
  valkyrie: {
    id: "valkyrie",
    name: "Valkyrie",
    role: "Hardball Interviewer",
    specialty: "Stress-testing & Building resilience",
    systemPrompt: `You are Valkyrie, a no-nonsense, commanding hardball interviewer who prepares people for the toughest corporate and technical scenarios. Your expertise includes:
- Difficult behavioral questions
- Stress interviews
- Salary negotiations
- Handling objections
- Building mental resilience
- Pressure situations
- Strategic thinking under stress

Your tone is direct, professional, and occasionally challenging. You:
1. Ask hard questions without pulling punches
2. Push back on weak answers
3. Test composure and confidence under pressure
4. Provide actionable feedback on handling stress
5. Celebrate when users stand their ground
6. Help users prepare for worst-case scenarios

Be tough but fair. Challenge the user to grow stronger.`,
  },
};

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { personaId, message, conversationHistory } = req.body as ChatRequest;

    // Validate request
    if (!personaId || !message) {
      return res
        .status(400)
        .json({ error: "Missing personaId or message" });
    }

    const persona = PERSONA_PROMPTS[personaId];
    if (!persona) {
      return res.status(400).json({ error: "Invalid persona ID" });
    }

    // In production, integrate with Gemini API
    // For now, return a mock response with structured feedback
    const response: ChatResponse = {
      message: generateMockAIResponse(persona, message),
      confidenceScore: Math.floor(Math.random() * 30) + 70, // 70-100
      suggestions: generateSuggestions(persona, message),
    };

    res.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function generateMockAIResponse(
  persona: PersonaData,
  userMessage: string
): string {
  // Mock responses based on persona
  const meiLingResponses = [
    "That's a solid approach! But let me ask - what's the time complexity? Can we optimize further?",
    "Good start! Walk me through your thinking process here.",
    "Interesting solution. What edge cases have you considered?",
    "Let me dig deeper - how would you handle this constraint?",
  ];

  const zaraResponses = [
    "I love how you phrased that! Very confident energy. Keep it up!",
    "You know, the way you just said that shows real growth. Did you notice your confidence?",
    "That's authentic! I can feel you're being genuine. People respond to that.",
    "Nice! You just showed great active listening skills there.",
  ];

  const elenaResponses = [
    "Excellent pacing there! You gave the thought time to breathe. Let's work on your opening next.",
    "I noticed you paused before answering - that shows thoughtfulness. Very powerful!",
    "Your tone is getting stronger. Let's try that again, but with more conviction this time.",
    "Beautiful storytelling! You're engaging the listener. Now let's add more vocal variety.",
  ];

  const siaResponses = [
    "Oh that's interesting! I didn't know that. Tell me more about it!",
    "Haha, I totally get that. You know, something similar happened to me...",
    "That's a great point! You really think deeply about things, don't you?",
    "I love your perspective on this! Have you thought about it this way too?",
  ];

  const responseMap: Record<string, string[]> = {
    "mei-ling": meiLingResponses,
    zara: zaraResponses,
    elena: elenaResponses,
    sia: siaResponses,
    valkyrie: [
      "That's mediocre. Let me push back here.",
      "Is that really your best answer? Try again.",
      "Interesting, but does that actually solve the problem?",
      "Good, but you need to think bigger.",
    ],
  };

  const responses = responseMap[persona.id] || [
    "That's a thoughtful response. Let me ask you something...",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateSuggestions(persona: PersonaData, userMessage: string): string[] {
  const baselineLength = userMessage.split(" ").length;

  const suggestions: Record<string, string[]> = {
    "mei-ling": [
      "Consider the space complexity next",
      "Walk through an example with your logic",
      "What about error handling?",
    ],
    zara: [
      "You're showing more confidence now!",
      "Try maintaining more eye contact",
      "Your enthusiasm is contagious!",
    ],
    elena: [
      "Use more pauses for impact",
      "Vary your vocal tone more",
      "Tell a story to illustrate the point",
    ],
    sia: [
      "Ask them a follow-up question",
      "Share a relevant personal story",
      "You're being very authentic right now!",
    ],
    valkyrie: [
      "Don't apologize for your ideas",
      "Be more assertive in your response",
      "Back that up with concrete examples",
    ],
  };

  const personaSuggestions = suggestions[persona.id] || [
    "Keep going!",
    "Well done!",
  ];
  return personaSuggestions.slice(
    0,
    Math.floor(Math.random() * 3) + 1
  );
}
