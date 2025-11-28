import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Users, Shield, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import SafetyRating from "@/components/SafetyRating";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CommunityDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id) return;

      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Failed to load community");
        navigate("/");
        return;
      }

      setCommunity(data);
      setIsAdmin(session?.user?.id === data.admin_user_id);
      setLoading(false);
    };

    fetchCommunity();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return null;
  }

  // Mock data for demonstration
  const stats = {
    totalReports: 87,
    resolvedReports: 72,
    avgResponseTime: "1.8 hours",
    activeMembers: community.member_count || 0,
  };

  const reportTypes = [
    { type: "Cyberbullying", count: 32, percentage: 37 },
    { type: "Harassment", count: 28, percentage: 32 },
    { type: "Unsafe Behavior", count: 20, percentage: 23 },
    { type: "Other", count: 7, percentage: 8 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Custom branded header */}
        <div 
          className="rounded-lg p-8 mb-8 shadow-medium"
          style={{
            background: `linear-gradient(135deg, ${community.primary_color} 0%, ${community.secondary_color} 100%)`,
          }}
        >
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
              <p className="text-white/90 capitalize">{community.type} • Digital Safety Dashboard</p>
            </div>
            {isAdmin && (
              <Button variant="secondary" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            )}
          </div>
        </div>

        {community.description && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{community.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card style={{ borderTopColor: community.primary_color, borderTopWidth: 3 }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card style={{ borderTopColor: community.primary_color, borderTopWidth: 3 }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-protect" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-protect">{stats.resolvedReports}</div>
              <p className="text-xs text-muted-foreground">{((stats.resolvedReports / stats.totalReports) * 100).toFixed(0)}% resolution rate</p>
            </CardContent>
          </Card>

          <Card style={{ borderTopColor: community.primary_color, borderTopWidth: 3 }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>

          <Card style={{ borderTopColor: community.primary_color, borderTopWidth: 3 }}>
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
            <SafetyRating score={community.safety_score || 85} trend="up" label={`${community.name} Safety Score`} size="md" />
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: community.primary_color }} />
              Safety Initiatives
            </CardTitle>
            <CardDescription>Active programs improving community safety</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Safety Training Completion</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Moderators</span>
                  <span className="text-sm text-muted-foreground">15/20</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Participation</span>
                  <span className="text-sm text-muted-foreground">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CommunityDashboard;
