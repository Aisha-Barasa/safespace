import { useEffect, useState } from "react";
import { BarChart, TrendingUp, Shield, AlertCircle, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface Statistics {
  totalReports: number;
  reportsThisMonth: number;
  reportsLastMonth: number;
  incidentBreakdown: { type: string; count: number }[];
  recentTrend: { date: string; count: number }[];
}

const Transparency = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch total reports (publicly accessible)
        const { count: totalCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true });

        // Fetch reports from this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: thisMonthCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString());

        // Fetch reports from last month
        const startOfLastMonth = new Date();
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
        startOfLastMonth.setDate(1);
        startOfLastMonth.setHours(0, 0, 0, 0);

        const { count: lastMonthCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfLastMonth.toISOString())
          .lt('created_at', startOfMonth.toISOString());

        // Fetch incident type breakdown
        const { data: reports } = await supabase
          .from('reports')
          .select('incident_type, created_at');

        const incidentBreakdown = reports?.reduce((acc: { type: string; count: number }[], report) => {
          const existing = acc.find(item => item.type === report.incident_type);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ type: report.incident_type, count: 1 });
          }
          return acc;
        }, []) || [];

        // Calculate last 7 days trend
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          date.setHours(0, 0, 0, 0);
          return date;
        });

        const recentTrend = last7Days.map(date => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          
          const count = reports?.filter(report => {
            const reportDate = new Date(report.created_at);
            return reportDate >= date && reportDate < nextDay;
          }).length || 0;

          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count,
          };
        });

        setStats({
          totalReports: totalCount || 0,
          reportsThisMonth: thisMonthCount || 0,
          reportsLastMonth: lastMonthCount || 0,
          incidentBreakdown,
          recentTrend,
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getTrendPercentage = () => {
    if (!stats || stats.reportsLastMonth === 0) return null;
    const change = ((stats.reportsThisMonth - stats.reportsLastMonth) / stats.reportsLastMonth) * 100;
    return change.toFixed(1);
  };

  const formatIncidentType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const maxCount = Math.max(...(stats?.incidentBreakdown.map(i => i.count) || [1]));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-protect mb-4">
              <BarChart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Transparency Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Public statistics and trends from our anonymous reporting system. All data is anonymized to protect reporter privacy.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading statistics...</p>
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="shadow-soft border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-trust" />
                      <div>
                        <p className="text-3xl font-bold text-foreground">{stats?.totalReports || 0}</p>
                        <p className="text-xs text-muted-foreground">All time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-protect" />
                      <div>
                        <p className="text-3xl font-bold text-foreground">{stats?.reportsThisMonth || 0}</p>
                        {getTrendPercentage() && (
                          <p className="text-xs text-muted-foreground">
                            {getTrendPercentage()}% vs last month
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Community Safety</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-support" />
                      <div>
                        <p className="text-3xl font-bold text-foreground">Protected</p>
                        <p className="text-xs text-muted-foreground">Zero identity logs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Incident Type Breakdown */}
              <Card className="shadow-medium mb-12">
                <CardHeader>
                  <CardTitle>Report Types</CardTitle>
                  <CardDescription>
                    Breakdown of incidents by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {stats?.incidentBreakdown.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No reports submitted yet</p>
                    ) : (
                      stats?.incidentBreakdown.map((incident) => (
                        <div key={incident.type} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {formatIncidentType(incident.type)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {incident.count} report{incident.count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <Progress 
                            value={(incident.count / maxCount) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 7-Day Trend */}
              <Card className="shadow-medium mb-12">
                <CardHeader>
                  <CardTitle>7-Day Trend</CardTitle>
                  <CardDescription>
                    Recent reporting activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentTrend.map((day) => (
                      <div key={day.date} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground w-20">
                          {day.date}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={day.count > 0 ? (day.count / Math.max(...stats.recentTrend.map(d => d.count))) * 100 : 0} 
                              className="h-8"
                            />
                            <span className="text-sm font-medium text-foreground w-8">
                              {day.count}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-protect/20 shadow-soft">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-protect mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">End-to-End Encrypted</h3>
                        <p className="text-sm text-muted-foreground">
                          All reports are encrypted on the reporter's device before transmission. 
                          We cannot read the contents of any report.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-trust/20 shadow-soft">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-trust mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Zero Identity Logs</h3>
                        <p className="text-sm text-muted-foreground">
                          No IP addresses, device identifiers, or personal information is collected. 
                          Reporter anonymity is guaranteed by design.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transparency;