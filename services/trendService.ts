import realm from "./realm";
import { analyzeTrend } from "../utils/trendAnalysis";

export function updateTrends(testId: string, newValue: number, previousValue: number) {
  realm.write(() => {
    const trend = analyzeTrend(newValue, previousValue);

    const testResult = realm.objects("TestResults").filtered(`test_id == "${testId}"`)[0];
    if (testResult) {
      testResult.trend = trend;
    }
    console.log(`Trend güncellendi: ${trend}`);
  });
}
