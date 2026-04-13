import { db } from "@/db";
import { doosTable, requestsTable, dooboxTable } from "@/db/schemas";
import { count, eq, and, gte, lt, sql } from "drizzle-orm";
import { type OverviewStats, type ChartDataPoint } from "@doospace/shared";

export class OverviewService {
  async getStats(): Promise<OverviewStats> {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(new Date(todayStart).setDate(todayStart.getDate() - 1));
    const tomorrowStart = new Date(new Date(todayStart).setDate(todayStart.getDate() + 1));

    const [
      totalDoos,
      activeDoos,
      totalRequests,
      successRequests,
      todayRequests,
      yesterdayRequests,
      dooboxStats,
    ] = await Promise.all([
      db.select({ value: count() }).from(doosTable),
      db.select({ value: count() }).from(doosTable).where(eq(doosTable.is_active, true)),
      db.select({ value: count() }).from(requestsTable),
      db.select({ value: count() }).from(requestsTable).where(lt(requestsTable.status, 400)),
      db.select({ value: count() }).from(requestsTable).where(
        and(gte(requestsTable.created_at, todayStart), lt(requestsTable.created_at, tomorrowStart))
      ),
      db.select({ value: count() }).from(requestsTable).where(
        and(gte(requestsTable.created_at, yesterdayStart), lt(requestsTable.created_at, todayStart))
      ),
      db.select({ 
        totalKeys: count(),
        totalBytes: sql<number>`COALESCE(SUM(OCTET_LENGTH(${dooboxTable.value}::TEXT)), 0)`
      }).from(dooboxTable),
    ]);

    const totalCount = totalRequests[0].value;
    const successCount = successRequests[0].value;
    const todayCount = todayRequests[0].value;
    const yesterdayCount = yesterdayRequests[0].value;
    
    // Calculate trend percentage
    let trend = 0;
    if (yesterdayCount > 0) {
      trend = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
    } else if (todayCount > 0) {
      trend = 100;
    }

    const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 100;
    const bytes = Number(dooboxStats[0].totalBytes);

    return {
      doos: {
        total: totalDoos[0].value,
        active: activeDoos[0].value,
        inactive: totalDoos[0].value - activeDoos[0].value,
      },
      requests: {
        total: totalCount,
        today: todayCount,
        yesterday: yesterdayCount,
        trend: Math.round(trend * 10) / 10,
        successRate: Math.round(successRate * 10) / 10,
      },
      doobox: {
        totalKeys: dooboxStats[0].totalKeys,
        totalBytes: bytes,
        formattedSize: this.formatBytes(bytes),
      },
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  async getChartData(): Promise<ChartDataPoint[]> {
    // Get last 7 days of requests
    const days = 7;
    const result: ChartDataPoint[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(new Date(dayStart).setDate(dayStart.getDate() + 1));

      const [dayCount] = await db
        .select({ value: count() })
        .from(requestsTable)
        .where(and(gte(requestsTable.created_at, dayStart), lt(requestsTable.created_at, dayEnd)));

      result.push({
        date: dayStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: dayCount?.value || 0,
      });
    }

    return result;
  }
}

export const overviewService = new OverviewService();
