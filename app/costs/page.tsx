"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CostDashboard } from "@/components/costs/cost-dashboard";
import { useAppStore } from "@/lib/store/store";

export default function CostsPage() {
  // Use Zustand store to load mock data if not already loaded
  const loadMockData = useAppStore((state) => state.loadMockData);
  const materialCosts = useAppStore((state) => state.materialCosts);
  
  // Load mock data if not already loaded
  useEffect(() => {
    if (materialCosts.length === 0) {
      loadMockData();
    }
  }, [loadMockData, materialCosts.length]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cost Management</h1>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add New Cost
            </button>
          </div>
        </div>

        <CostDashboard />
      </div>
    </DashboardLayout>
  );
}
