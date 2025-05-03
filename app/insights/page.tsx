"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AIInsights } from "@/components/experiments/ai-insights";
import { useAppStore } from "@/lib/store/store";

export default function InsightsPage() {
  // Use Zustand store to load mock data if not already loaded
  const loadMockData = useAppStore((state) => state.loadMockData);
  const aiInsights = useAppStore((state) => state.aiInsights);
  
  // Load mock data if not already loaded
  useEffect(() => {
    if (aiInsights.length === 0) {
      loadMockData();
    }
  }, [loadMockData, aiInsights.length]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
        </div>

        <AIInsights />
      </div>
    </DashboardLayout>
  );
}
