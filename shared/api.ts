/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Request type for /api/chat
 */
export interface ChatRequest {
  personaId: string;
  message: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

/**
 * Response type for /api/chat
 */
export interface ChatResponse {
  message: string;
  confidenceScore?: number;
  suggestions?: string[];
}

/**
 * Persona data type
 */
export interface PersonaData {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  specialty: string;
}
