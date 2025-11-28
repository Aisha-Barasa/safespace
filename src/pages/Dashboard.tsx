import { BarChart3, TrendingUp, Users, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import SafetyRating from "@/components/SafetyRating";

const Dashboard = () => {
  // Mock data
  const stats = {
    totalReports: 127,
    resolvedReports: 98,
    avgResponseTime: "2.3 hours",
    activeMembers: 1840,
  };

  const reportTypes = [
    { type: "Cyberbullying", count: 45, percentage: 35 },
    { type: "Harassment", count: 38, percentage: 30 },
    { type: "Unsafe Behavior", count: 32, percentage: 25 },
    { type: "Other", count: 12, percentage: 10 },
  ];

  const recentActions = [
    { action: "Safety training completed", community: "Lincoln High School", time: "2 hours ago" },
    { action: "Report resolved", community: "Tech Community Hub", time: "5 hours ago" },
    { action: "New moderator added", community: "University Forum", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Community Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Transparent, tamper-proof community safety metrics
          </p>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-protect" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-protect">{stats.resolvedReports}</div>
              <p className="text-xs text-muted-foreground">{((stats.resolvedReports / stats.totalReports) * 100).toFixed(0)}% resolution rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMembers}</div>
              <p className="text-xs text-muted-foreground">Community size</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-1">
            <SafetyRating score={87} trend="up" size="md" />
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Report Distribution</CardTitle>
              <CardDescription>Types of incidents reported in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportTypes.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm text-muted-foreground">{item.count} reports</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-trust" />
                Recent Actions
              </CardTitle>
              <CardDescription>Latest community safety activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActions.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-protect mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.community}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-support" />
                Safety Initiatives
              </CardTitle>
              <CardDescription>Active programs improving community safety</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Safety Training Completion</span>
                    <span className="text-sm text-muted-foreground">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Moderators</span>
                    <span className="text-sm text-muted-foreground">12/15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Member Participation</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
