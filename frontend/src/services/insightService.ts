import { DashboardInsights, GuideType } from '../types';
import { MOCK_SAP_DASHBOARD_INSIGHTS, MOCK_DASHBOARD_INSIGHTS } from './mockData';
import { feedbackService } from './feedbackService';

export const insightService = {
  async getInsights(guideType: GuideType = 'sap_fundamentals_course'): Promise<DashboardInsights> {
    const isSap = guideType === 'sap_fundamentals_course';
    const fallback = JSON.parse(
      JSON.stringify(isSap ? MOCK_SAP_DASHBOARD_INSIGHTS : MOCK_DASHBOARD_INSIGHTS)
    ) as DashboardInsights;

    const allFeedback = feedbackService.getAllFeedback(guideType);

    if (allFeedback.length > 0) {
      const totalRatings = allFeedback.reduce((sum, f) => sum + f.rating, 0);
      const avgRating = Number((totalRatings / allFeedback.length).toFixed(1));
      fallback.kpis.averageRating = avgRating;
      fallback.kpis.totalFeedback = allFeedback.length;
    }

    return fallback;
  },

  async getSapInsights(): Promise<DashboardInsights> {
    return this.getInsights('sap_fundamentals_course');
  },

  async getPurchaseOrderInsights(): Promise<DashboardInsights> {
    return this.getInsights('purchase_order');
  },
};
