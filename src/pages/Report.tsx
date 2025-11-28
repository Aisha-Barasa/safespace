import { useState } from "react";
import { Shield, Lock, FileCheck, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

// Encryption utility using Web Crypto API
const encryptData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Generate a random encryption key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );
  
  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the data
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  // Convert to base64 for storage
  const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
  const ivArray = Array.from(iv);
  
  // Combine IV and encrypted data
  const combined = {
    iv: btoa(String.fromCharCode(...ivArray)),
    data: btoa(String.fromCharCode(...encryptedArray)),
  };
  
  return JSON.stringify(combined);
};

const Report = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportHash, setReportHash] = useState<string | null>(null);
  const [incidentType, setIncidentType] = useState("");
  const [community, setCommunity] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [evidence, setEvidence] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Encrypt sensitive data client-side
      const encryptedDescription = await encryptData(description);
      const encryptedEvidence = evidence ? await encryptData(evidence) : undefined;
      
      // Submit to edge function
      const { data, error } = await supabase.functions.invoke('submit-report', {
        body: {
          incidentType,
          communityName: community || undefined,
          encryptedDescription,
          encryptedEvidence,
          incidentDate: date || undefined,
        },
      });
      
      if (error) throw error;
      
      setReportHash(data.reportHash);
      
      toast.success("Report submitted securely", {
        description: "Your anonymous report has been encrypted and verified.",
      });
      
      // Clear form
      setIncidentType("");
      setCommunity("");
      setDescription("");
      setDate("");
      setEvidence("");
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reportHash) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-protect mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Report Submitted Successfully
              </h1>
              <p className="text-lg text-muted-foreground">
                Your report has been encrypted and timestamped
              </p>
            </div>

            <Card className="shadow-medium mb-6">
              <CardHeader>
                <CardTitle>Verification Hash</CardTitle>
                <CardDescription>
                  This hash serves as tamper-proof proof-of-report. Save it for your records.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                    {reportHash}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(reportHash)}
                    variant="outline"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Verification Hash
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 mb-8">
              <Card className="border-protect/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-protect mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">End-to-End Encrypted</p>
                      <p className="text-sm text-muted-foreground">
                        Your report was encrypted on your device before transmission
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-trust/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-trust mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Zero Identity Logs</p>
                      <p className="text-sm text-muted-foreground">
                        No identifying information was collected or stored
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => setReportHash(null)}
              className="w-full"
            >
              Submit Another Report
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-protect mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Submit Anonymous Report
            </h1>
            <p className="text-lg text-muted-foreground">
              Your identity is protected. All reports are end-to-end encrypted and blockchain-verified.
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            <Card className="border-protect/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-protect mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">End-to-End Encrypted</p>
                    <p className="text-sm text-muted-foreground">Your report is encrypted before leaving your device</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-trust/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-trust mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Blockchain Timestamped</p>
                    <p className="text-sm text-muted-foreground">Tamper-proof proof-of-report with verifiable timestamp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>
                Provide as much detail as you're comfortable sharing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="incidentType">Incident Type</Label>
                  <Select value={incidentType} onValueChange={setIncidentType} required>
                    <SelectTrigger id="incidentType">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cyberbullying">Cyberbullying</SelectItem>
                      <SelectItem value="sextortion">Sextortion</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="unsafe-behavior">Unsafe Digital Behavior</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="community">Community (Optional)</Label>
                  <Input
                    id="community"
                    placeholder="School, group, or organization name"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened..."
                    rows={6}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date of Incident (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence Links (Optional)</Label>
                  <Textarea
                    id="evidence"
                    placeholder="URLs, screenshots, or other evidence (no personal info)"
                    rows={3}
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Encrypting and Submitting..." : "Submit Anonymous Report"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you confirm this report is made in good faith. False reports undermine community trust.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Report;