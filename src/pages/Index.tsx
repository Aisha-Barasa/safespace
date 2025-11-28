import { Shield, Lock, Users, TrendingUp, CheckCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import SafetyRating from "@/components/SafetyRating";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 pt-32 pb-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-trust mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Building Safer Digital Communities
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              A secure, anonymous platform for reporting abuse and measuring community safety. 
              Protected by encryption. Verified by blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button size="lg" onClick={() => navigate("/report")}>
                Submit Anonymous Report
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/community/register")}>
                Register Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Pillars of Safety
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering individuals, communities, and transparency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-trust flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Anonymous Reporting</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">End-to-end encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Zero identity logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Blockchain timestamping</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-protect flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Safety Ratings</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Track response times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Measure training completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Build community trust</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-support/90 flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Transparent Dashboard</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Real-time metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Tamper-proof data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-protect mt-1 flex-shrink-0" />
                    <span className="text-sm">Public accountability</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rating Example Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Digital Safety Score
              </h2>
              <p className="text-lg text-muted-foreground">
                Communities earn ratings based on their commitment to safety
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <SafetyRating score={87} trend="up" label="Example Community" size="lg" />
              
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-4">Rating Factors</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-protect/20 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-protect" />
                      </div>
                      <span className="text-sm text-muted-foreground">Report response time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-protect/20 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-protect" />
                      </div>
                      <span className="text-sm text-muted-foreground">Safety training completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-protect/20 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-protect" />
                      </div>
                      <span className="text-sm text-muted-foreground">Active moderation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-protect/20 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-protect" />
                      </div>
                      <span className="text-sm text-muted-foreground">Member protection policies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-protect/20 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-protect" />
                      </div>
                      <span className="text-sm text-muted-foreground">Community participation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Movement for Safer Digital Spaces
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're reporting an incident or building a safer community, every action counts.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/report")}>
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
