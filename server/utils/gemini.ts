/**
 * Gemini API Client Wrapper
 * 
 * This module provides a wrapper for the Google Gemini API.
 * To use the real Gemini API, set your GEMINI_API_KEY environment variable.
 * 
 * For free tier access:
 * 1. Get your free API key at https://ai.google.dev/
 * 2. Add GEMINI_API_KEY to your .env file
 * 3. The free tier includes:
 *    - 15 requests per minute
 *    - 1 million tokens per minute
 */

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface GeminiResponse {
  text: string;
  confidence?: number;
  suggestions?: string[];
}

/**
 * Sends a message to Gemini and gets a response
 * Currently uses mock responses. To enable real API:
 * 1. Set GEMINI_API_KEY in .env
 * 2. Uncomment the real API call below
 */
export async function getGeminiResponse(
  personaId: string,
  userMessage: string,
  systemPrompt: string,
  conversationHistory: ConversationMessage[] = []
): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return mock response if API key not set
    return getMockResponse(personaId, userMessage);
  }

  try {
    // Real Gemini API implementation (when API key is available)
    // const response = await callGeminiAPI({
    //   apiKey,
    //   systemPrompt,
    //   userMessage,
    //   conversationHistory,
    // });
    // return response;

    // For now, use mock response
    return getMockResponse(personaId, userMessage);
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback to mock response on error
    return getMockResponse(personaId, userMessage);
  }
}

/**
 * Mock response generator for development
 * Replace this with real Gemini API calls when API key is available
 */
function getMockResponse(personaId: string, userMessage: string): GeminiResponse {
  // Simple mock based on message length and persona
  const messageLength = userMessage.split(" ").length;
  const hasQuestion = userMessage.includes("?");
  const hasExclamation = userMessage.includes("!");

  const meiLingResponses = [
    "That's a solid approach! But let me ask - what's the time complexity? Can we optimize further?",
    "Good start! Walk me through your thinking process here.",
    "Interesting solution. What edge cases have you considered?",
    "Let me dig deeper - how would you handle this constraint?",
    "I like where your head's at. What about the space complexity?",
    "You're on the right track. Can you explain your logic step by step?",
  ];

  const zaraResponses = [
    "I love how you phrased that! Very confident energy. Keep it up!",
    "You know, the way you just said that shows real growth. Did you notice your confidence?",
    "That's authentic! I can feel you're being genuine. People respond to that.",
    "Nice! You just showed great active listening skills there.",
    "I'm impressed by how thoughtful you are. That's magnetic!",
    "Your energy just shifted - that's amazing. Keep leaning into that.",
  ];

  const elenaResponses = [
    "Excellent pacing there! You gave the thought time to breathe. Let's work on your opening next.",
    "I noticed you paused before answering - that shows thoughtfulness. Very powerful!",
    "Your tone is getting stronger. Let's try that again, but with more conviction this time.",
    "Beautiful storytelling! You're engaging the listener. Now let's add more vocal variety.",
    "That was much better! Your confidence shows in your delivery.",
    "I love how you're slowing down and articulating clearly. That's professional!",
  ];

  const siaResponses = [
    "Oh that's interesting! I didn't know that. Tell me more about it!",
    "Haha, I totally get that. You know, something similar happened to me...",
    "That's a great point! You really think deeply about things, don't you?",
    "I love your perspective on this! Have you thought about it this way too?",
    "That made me laugh! You've got a great sense of humor.",
    "Wow, I never thought about it like that before. You're really insightful!",
  ];

  const valkyreResponses = [
    "That's mediocre. Let me push back here. Why should I believe that?",
    "Is that really your best answer? Try again with more conviction.",
    "Interesting, but does that actually solve the problem at scale?",
    "Good, but you need to think bigger. What's the real impact?",
    "You're avoiding the hard question. Let me ask it again differently.",
    "Nice try, but that won't fly in a real negotiation. Be more assertive.",
  ];

  const responseMap: Record<string, string[]> = {
    "mei-ling": meiLingResponses,
    zara: zaraResponses,
    elena: elenaResponses,
    sia: siaResponses,
    valkyrie: valkyreResponses,
  };

  const responses = responseMap[personaId] || meiLingResponses;
  const selectedResponse =
    responses[Math.floor(Math.random() * responses.length)];

  // Calculate confidence score based on input quality
  let confidence = 70 + Math.random() * 25;
  if (messageLength > 20) confidence += 5;
  if (hasQuestion || hasExclamation) confidence += 3;

  return {
    text: selectedResponse,
    confidence: Math.round(confidence),
    suggestions: generateSuggestions(personaId, userMessage),
  };
}

function generateSuggestions(
  personaId: string,
  userMessage: string
): string[] {
  const suggestions: Record<string, string[]> = {
    "mei-ling": [
      "Consider the space complexity next",
      "Walk through an example with your logic",
      "What about error handling?",
      "How would you test this?",
      "Can you break that down more?",
    ],
    zara: [
      "You're showing more confidence now!",
      "Try maintaining more eye contact",
      "Your enthusiasm is contagious!",
      "Smile more - it'll help you relax",
      "You're really connecting with me!",
    ],
    elena: [
      "Use more pauses for impact",
      "Vary your vocal tone more",
      "Tell a story to illustrate the point",
      "Take a breath before the next point",
      "Your pace is improving!",
    ],
    sia: [
      "Ask them a follow-up question",
      "Share a relevant personal story",
      "You're being very authentic right now!",
      "That was a perfect moment for humor",
      "Your curiosity is attractive!",
    ],
    valkyrie: [
      "Don't apologize for your ideas",
      "Be more assertive in your response",
      "Back that up with concrete examples",
      "Own your position confidently",
      "That needs more evidence",
    ],
  };

  const personaSuggestions = suggestions[personaId] || [
    "Keep going!",
    "Well done!",
  ];
  
  // Return 1-3 random suggestions
  const count = Math.floor(Math.random() * 3) + 1;
  return personaSuggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

/**
 * Future integration with real Gemini API
 * 
 * This is where the actual Gemini API call would go:
 * 
 * async function callGeminiAPI(params: {
 *   apiKey: string;
 *   systemPrompt: string;
 *   userMessage: string;
 *   conversationHistory: ConversationMessage[];
 * }): Promise<GeminiResponse> {
 *   const { apiKey, systemPrompt, userMessage, conversationHistory } = params;
 *   
 *   const messages = [
 *     ...conversationHistory,
 *     { role: "user", content: userMessage }
 *   ];
 *   
 *   const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       "x-goog-api-key": apiKey,
 *     },
 *     body: JSON.stringify({
 *       system_instruction: { parts: [{ text: systemPrompt }] },
 *       contents: messages.map(m => ({
 *         role: m.role === "user" ? "user" : "model",
 *         parts: [{ text: m.content }]
 *       }))
 *     })
 *   });
 *   
 *   const data = await response.json();
 *   const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
 *   
 *   return {
 *     text,
 *     confidence: Math.floor(Math.random() * 30) + 70,
 *     suggestions: generateSuggestions("", userMessage)
 *   };
 * }
 */
