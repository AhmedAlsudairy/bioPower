"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { FiSend, FiUser, FiMessageSquare, FiTrash2 } from "react-icons/fi";
import { ChatMessage } from "@/types";
import { 
  saveChatHistory, 
  loadChatHistory, 
  clearChatHistory, 
  recordTopic, 
  recordQuery,
  getConversationContext 
} from "@/lib/services/chat-memory-service";
import {
  getActiveAlarms,
  generateSystemSummary,
  generateSensorSummary
} from "@/lib/services/chat-data-service";

// Enhanced bot responses with real-time data capability
const getBotResponse = (query: string): string => {
  const queryLower = query.toLowerCase();
  
  // Check for system status request
  if (queryLower.includes('system status') || queryLower.includes('overview') || queryLower.match(/how is the system|system health|status/)) {
    return generateSystemSummary();
  }
  
  // Check for specific sensor data requests
  if (queryLower.includes('temperature') || queryLower.includes('temp')) {
    return generateSensorSummary('temp-1');
  }
  
  if (queryLower.includes('ph') || queryLower.includes('acidity')) {
    return generateSensorSummary('ph-1');
  }
  
  if (queryLower.includes('methane') || queryLower.includes('gas') || queryLower.includes('biogas')) {
    return generateSensorSummary('methane-1');
  }
  
  if (queryLower.includes('pressure')) {
    return generateSensorSummary('pressure-1');
  }
  
  if (queryLower.includes('oxygen') || queryLower.includes('o2')) {
    return generateSensorSummary('oxygen-1');
  }
  
  if (queryLower.includes('weight') || queryLower.includes('mass')) {
    return generateSensorSummary('weight-1');
  }
  
  // Check for alarm information
  if (queryLower.includes('alarm')) {
    const activeAlarms = getActiveAlarms();
    if (activeAlarms.length === 0) {
      return "There are currently no active alarms in the system. All parameters are within their configured safe ranges.";
    } else {
      return `There ${activeAlarms.length === 1 ? 'is' : 'are'} ${activeAlarms.length} active alarm${activeAlarms.length === 1 ? '' : 's'} that require${activeAlarms.length === 1 ? 's' : ''} attention. ${activeAlarms.map(a => a.message).join('. ')}. You can acknowledge these alarms from the Alarms page.`;
    }
  }
  
  // Check for help request
  if (queryLower.includes('help') || queryLower.includes('what can you do')) {
    return "I can provide real-time information about your biodigester system including temperature, pH levels, methane production, and more. I can also inform you about active alarms, system status, and explain what various metrics mean. Just ask me about a specific parameter or ask for a system overview!";
  }
  
  // Provide static responses for general information requests
  if (queryLower.includes('how does') || queryLower.includes('what is') || queryLower.includes('explain')) {
    if (queryLower.includes('temperature') || queryLower.includes('temp')) {
      return "The temperature sensors in your biodigester measure the internal temperature which is crucial for optimal microbial activity. The ideal range is typically between 30-35°C for mesophilic systems.";
    }
    
    if (queryLower.includes('ph')) {
      return "pH levels indicate the acidity or alkalinity of your digester. Most biodigesters operate optimally at a pH between 6.8 and 7.2. Maintaining proper pH is essential for microbial health.";
    }
    
    if (queryLower.includes('methane') || queryLower.includes('gas')) {
      return "Methane is the primary component of biogas that makes it valuable as a fuel. Higher methane concentration (typically 50-70%) indicates efficient anaerobic digestion.";
    }
    
    if (queryLower.includes('pressure')) {
      return "Pressure monitoring ensures the biogas collection system is functioning properly. High pressure might indicate blockages, while low pressure could mean leaks or reduced gas production.";
    }
    
    if (queryLower.includes('oxygen')) {
      return "Oxygen levels should remain very low in your biodigester as the anaerobic bacteria responsible for biogas production operate in oxygen-free environments. Elevated oxygen levels can inhibit methane production.";
    }
    
    if (queryLower.includes('biodigester') || queryLower.includes('system')) {
      return "A biodigester is a system that breaks down organic material through anaerobic digestion. This process produces biogas (primarily methane) which can be used as a renewable energy source, while also treating organic waste. The BioPower system monitors and optimizes this process to maximize efficiency and output.";
    }
  }
  
  // Default response
  return "I'm your BioPower support assistant. How can I help you with your biodigester monitoring system today? Ask me about the current system status, specific sensor readings, or how to interpret the data.";
};

export default function SupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load chat history on initial mount
  useEffect(() => {
    const savedMessages = loadChatHistory();
    
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // Set default welcome message if no history exists
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content: "Hello! I'm your BioIoT support assistant. How can I help you with your biodigester monitoring system today?",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      saveChatHistory([welcomeMessage]);
    }
    
    setIsLoading(false);
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages, isLoading]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Generate a simple ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 11);
  
  // Clear chat history
  const handleClearChat = () => {
    // Keep only the welcome message
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      content: "Hello! I'm your BioIoT support assistant. How can I help you with your biodigester monitoring system today?",
      sender: "bot",
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    clearChatHistory();
    saveChatHistory([welcomeMessage]);
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    // Record the query for analytics
    recordQuery(inputValue);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Get conversation context to provide more relevant responses
    const context = getConversationContext();
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      // Generate response using the data-aware response function
      let responseContent = getBotResponse(inputValue);
      
      // Try to detect the main topic for context tracking
      const userMessageLower = inputValue.toLowerCase();
      let detectedTopic = "";
      
      // List of topics to track
      const topics = ["temperature", "ph", "methane", "pressure", "oxygen", "weight", "alarm", "system"];
      
      // Find the first matching topic
      for (const topic of topics) {
        if (userMessageLower.includes(topic)) {
          detectedTopic = topic;
          break;
        }
      }
      
      // Record the topic if one was detected
      if (detectedTopic) {
        recordTopic(detectedTopic);
      }
      
      // Check if the message references previous topics
      if (userMessageLower.includes("earlier") || userMessageLower.includes("before") || userMessageLower.includes("previous")) {
        // Add reference to previous topics if available
        if (context.lastTopics.length > 0) {
          const previousTopic = context.lastTopics[0];
          responseContent += ` As we discussed earlier about ${previousTopic}, this may be related.`;
        }
      }
      
      const botMessage: ChatMessage = {
        id: generateId(),
        content: responseContent,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Support Chat</h1>
              <button 
                onClick={handleClearChat}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <FiTrash2 className="mr-1" /> Clear Chat
              </button>
            </div>
          </div>
          
          {/* Chat messages container */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user" 
                        ? "bg-indigo-600 text-white rounded-br-none" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className={`flex items-center ${message.sender === "user" ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"} text-sm`}>
                        {message.sender === "user" ? (
                          <>
                            <FiUser className="mr-1" size={12} />
                            <span>You</span>
                          </>
                        ) : (
                          <>
                            <FiMessageSquare className="mr-1" size={12} />
                            <span>BioIoT Assistant</span>
                          </>
                        )}
                      </span>
                      <span className={`ml-2 text-xs ${message.sender === "user" ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base break-words">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message input form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={inputValue.trim() === ""}
            >
              <FiSend size={18} />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
