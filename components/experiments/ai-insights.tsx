"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store/store";
import { formatDate } from "@/lib/utils/helpers";
import { generateInsightWithGemini } from "@/lib/services/gemini-service";
import { FiAlertCircle, FiActivity, FiZap, FiTrendingUp, FiStar } from "react-icons/fi";
import { AIInsight } from "@/types";

export function AIInsights() {
  const aiInsights = useAppStore((state) => state.aiInsights);
  const addAIInsight = useAppStore((state) => state.addAIInsight);
  const sensorReadings = useAppStore((state) => state.sensorReadings);
  const systemState = useAppStore((state) => state.systemState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  // Simulate AI insight generation
  const generateInsight = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Prepare sensor data to send to Gemini
      const sensorDataSummary = Object.entries(sensorReadings)
        .map(([sensorId, readings]) => {
          const latestReading = readings[readings.length - 1];
          return latestReading 
            ? `${sensorId}: ${latestReading.value} ${latestReading.unit} (${formatDate(latestReading.timestamp, 'pp')})` 
            : `${sensorId}: No data`;
        })
        .join('\n');
      
      // Prepare system state summary
      const systemStateSummary = `
        Status: ${systemState.status}
        Started: ${formatDate(systemState.startDate, 'PPP')}
        Last updated: ${formatDate(systemState.lastUpdate, 'pp')}
        Runtime: ${systemState.runtime} days
      `;
      
      // Call Gemini API
      const insight = await generateInsightWithGemini(sensorDataSummary, systemStateSummary);
      
      // Add to global state
      addAIInsight(insight);
    } catch (error) {
      console.error('Failed to generate insight:', error);
      
      // Create fallback insight
      const fallbackInsight: AIInsight = {
        id: `insight-error-${Date.now()}`,
        summary: "Unable to generate insight",
        details: "The AI service encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
        confidence: 0,
        relatedParameters: [],
        status: 'error',
      };
      
      addAIInsight(fallbackInsight);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (generationProgress < 100) {
        setGenerationProgress(generationProgress + 10);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [generationProgress]);

  // Generate insight icon based on related parameters
  const getInsightIcon = (relatedParameters: string[]) => {
    if (relatedParameters.includes("temperature")) {
      return <FiZap className="h-6 w-6 text-red-500" />;
    } else if (relatedParameters.includes("methane")) {
      return <FiTrendingUp className="h-6 w-6 text-green-500" />;
    } else if (relatedParameters.includes("ph")) {
      return <FiActivity className="h-6 w-6 text-blue-500" />;
    } else if (relatedParameters.includes("pressure")) {
      return <FiAlertCircle className="h-6 w-6 text-purple-500" />;
    }
    return <FiStar className="h-6 w-6 text-amber-500" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Insights</h2>
          <button
            onClick={generateInsight}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Analyzing Data..." : "Generate New Insight"}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Analyzing sensor data...</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{generationProgress}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {generationProgress < 30
                ? "Collecting sensor data from experiment..."
                : generationProgress < 60
                ? "Analyzing patterns and correlations..."
                : generationProgress < 90
                ? "Generating recommendations..."
                : "Finalizing insights..."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="col-span-1 space-y-4 border-r border-gray-200 dark:border-gray-700 pr-4">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm uppercase tracking-wider">
            Recent Insights
          </h3>
          
          {aiInsights.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No insights available yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  onClick={() => setSelectedInsight(insight)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedInsight?.id === insight.id
                      ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getInsightIcon(insight.relatedParameters)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {insight.title || insight.summary || 'Insight'}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {insight.description || insight.details || 'No details available'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(insight.timestamp, 'PPp')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="col-span-2">
          {selectedInsight ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedInsight.title || selectedInsight.summary || 'AI Insight'}</h3>
                <div className="text-gray-500 dark:text-gray-400 mt-2 whitespace-pre-line">
                  {selectedInsight.details || selectedInsight.description || 'No details available'}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Confidence Score</h4>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                      <div
                        className={`h-2.5 rounded-full ${
                          selectedInsight.confidence > 0.8
                            ? "bg-green-500"
                            : selectedInsight.confidence > 0.6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${selectedInsight.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {(selectedInsight.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Related Parameters</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInsight.relatedParameters.map((param) => (
                    <span
                      key={param}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </div>
              
              {selectedInsight.recommendations && selectedInsight.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    {selectedInsight.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs mr-2">
                          {index + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Generated on {formatDate(selectedInsight.timestamp, 'PPP')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FiStar className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Select an insight</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose an insight from the left panel to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
