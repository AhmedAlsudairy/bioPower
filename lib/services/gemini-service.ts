import { AIInsight } from '@/types';

// IMPORTANT: In a production environment, you should never expose API keys in client-side code
// This should be handled through a backend service with proper API key management
// For production, consider using environment variables accessible only on the server side

const GEMINI_API_KEY = 'AIzaSyC0NaNfIs9UsLCgWXe3vL2_H9yHo6xqPWQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateInsightWithGemini(
  sensorData: string,
  systemState: string
): Promise<AIInsight> {
  try {
    const prompt = `
      You are an AI assistant specializing in anaerobic digestion systems and biogas production.
      
      Based on the following sensor data and system state, provide an insightful analysis 
      and recommendation for optimizing the anaerobic digestion process.
      
      SENSOR DATA:
      ${sensorData}
      
      SYSTEM STATE:
      ${systemState}
      
      Format your response as follows:
      1. One sentence summary of the current state
      2. A brief analysis (2-3 sentences)
      3. One clear recommendation for improving the process
      4. A confidence score from 0.1 to 1.0 for your recommendation
    `;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse and structure the Gemini response
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Extract the components from the response for summary extraction
    const summaryLines = rawText.split('\n').filter((line: string) => line.trim() !== '');
    
    // Basic parsing of response
    const summary = summaryLines[0] || 'No summary provided';
    
    // Find confidence score using regex
    const confidenceMatch = rawText.match(/(\d+\.\d+)/);
    
    // Parse and normalize confidence to be between 0 and 1
    let confidence = confidenceMatch ? parseFloat(confidenceMatch[0]) : 0.7;
    
    // Cap confidence at 1.0 (100%) and ensure it's positive
    confidence = Math.min(Math.max(confidence, 0), 1);
    
    // Clean up the text to remove any references to confidence score - try more aggressive approach
    const textLines = rawText.split('\n');
    
    // Filter out any line containing confidence score or related text
    const filteredLines = textLines.filter((line: string) => {
      const lowerLine = line.toLowerCase();
      return !(
        lowerLine.includes('confidence score') || 
        lowerLine.includes('confidence:') || 
        lowerLine.match(/confidence[^a-z]/) ||
        lowerLine.match(/^\s*\d+\.?\s*confidence/)
      );
    });
    
    // Join the remaining lines
    let cleanedText = filteredLines.join('\n');
    
    // Remove markdown formatting (like **bold**)
    cleanedText = cleanedText.replace(/\*\*/g, '');
    
    // Remove numbered list format if present
    cleanedText = cleanedText.replace(/^\d+\. /gm, '');
    
    // Remove extra line breaks and clean up whitespace
    cleanedText = cleanedText.trim().replace(/\n{3,}/g, '\n\n');
    
    console.log('Generated insight with confidence:', confidence, 'Cleaned text:', cleanedText);
    
    // Generate random ID for the insight
    const id = `insight-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      id,
      summary,
      details: cleanedText,
      timestamp: new Date().toISOString(),
      confidence,
      relatedParameters: ['temperature', 'pH', 'methane', 'pressure'],
      status: 'active',
    };
  } catch (error) {
    console.error('Error generating insight with Gemini:', error);
    
    // Return a fallback insight if the API call fails
    return {
      id: `insight-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      summary: 'Unable to generate insight',
      details: 'The AI service is currently unavailable. Please try again later.',
      timestamp: new Date().toISOString(),
      confidence: 0.0,
      relatedParameters: [],
      status: 'error',
    };
  }
}
