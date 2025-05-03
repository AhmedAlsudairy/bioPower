// Chat Memory Service
// This service handles storing and retrieving chat history

import { ChatMessage } from "@/types";

const STORAGE_KEY = 'bioiot_chat_history';

/**
 * Saves chat messages to localStorage
 */
export const saveChatHistory = (messages: ChatMessage[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
};

/**
 * Retrieves chat history from localStorage
 */
export const loadChatHistory = (): ChatMessage[] => {
  if (typeof window !== 'undefined') {
    try {
      const history = localStorage.getItem(STORAGE_KEY);
      if (history) {
        const parsed = JSON.parse(history);
        
        // Convert string timestamps back to Date objects
        return parsed.map((message: { timestamp: string; id: string; content: string; sender: "user" | "bot" }) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }
  
  return [];
};

/**
 * Clears chat history from localStorage
 */
export const clearChatHistory = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }
};

// Context memory for more advanced conversation tracking
interface ConversationContext {
  lastTopics: string[];
  userPreferences: Record<string, string | number | boolean>;
  frequentQueries: Record<string, number>;
}

const CONTEXT_KEY = 'bioiot_chat_context';

/**
 * Updates conversation context with new information
 */
export const updateConversationContext = (update: Partial<ConversationContext>): void => {
  if (typeof window !== 'undefined') {
    try {
      const existingContext = localStorage.getItem(CONTEXT_KEY);
      let context: ConversationContext = {
        lastTopics: [],
        userPreferences: {},
        frequentQueries: {}
      };
      
      if (existingContext) {
        context = JSON.parse(existingContext);
      }
      
      // Merge updates with existing context
      const newContext = { ...context, ...update };
      
      localStorage.setItem(CONTEXT_KEY, JSON.stringify(newContext));
    } catch (error) {
      console.error('Error updating conversation context:', error);
    }
  }
};

/**
 * Gets the current conversation context
 */
export const getConversationContext = (): ConversationContext => {
  if (typeof window !== 'undefined') {
    try {
      const contextData = localStorage.getItem(CONTEXT_KEY);
      if (contextData) {
        return JSON.parse(contextData);
      }
    } catch (error) {
      console.error('Error getting conversation context:', error);
    }
  }
  
  return {
    lastTopics: [],
    userPreferences: {},
    frequentQueries: {}
  };
};

/**
 * Records a topic discussed in the conversation
 */
export const recordTopic = (topic: string): void => {
  const context = getConversationContext();
  const lastTopics = [...context.lastTopics];
  
  // Add new topic to the front of the array
  if (!lastTopics.includes(topic)) {
    lastTopics.unshift(topic);
    
    // Keep only the last 5 topics
    if (lastTopics.length > 5) {
      lastTopics.pop();
    }
  }
  
  updateConversationContext({ lastTopics });
};

/**
 * Records a user query to track frequency
 */
export const recordQuery = (query: string): void => {
  const context = getConversationContext();
  const frequentQueries = { ...context.frequentQueries };
  
  // Normalize the query to a lowercase key
  const queryKey = query.toLowerCase().trim();
  
  // Increment the count for this query
  frequentQueries[queryKey] = (frequentQueries[queryKey] || 0) + 1;
  
  updateConversationContext({ frequentQueries });
};

/**
 * Updates user preferences based on conversation
 */
export const updateUserPreference = (key: string, value: string | number | boolean): void => {
  const context = getConversationContext();
  const userPreferences = { ...context.userPreferences };
  
  userPreferences[key] = value;
  
  updateConversationContext({ userPreferences });
};
