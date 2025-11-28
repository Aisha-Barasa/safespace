import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { z } from "zod";

const communitySchema = z.object({
  name: z.string().min(3, "Community name must be at least 3 characters").max(100),
  type: z.enum(["school", "university", "organization", "group", "other"]),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  website_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

const CommunityRegister = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1e3a5f");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to register a community");
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = communitySchema.parse({
        name,
        type,
        description: description || undefined,
        website_url: websiteUrl || undefined,
        contact_email: contactEmail || undefined,
        primary_color: primaryColor,
      });

      const { data, error } = await supabase
        .from("communities")
        .insert([
          {
            name: validatedData.name,
            type: validatedData.type,
            description: validatedData.description,
            website_url: validatedData.website_url,
            contact_email: validatedData.contact_email,
            primary_color: validatedData.primary_color,
            admin_user_id: user.id,
            secondary_color: "#2d9cdb",
          },
        ])
        .select()
        .single();

      if (error) {
        toast.error("Failed to register community: " + error.message);
        return;
      }

      toast.success("Community registered successfully!");
      navigate(`/community/${data.id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-protect mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Register Your Community
            </h1>
            <p className="text-lg text-muted-foreground">
              Join SafeSpace and build a safer digital environment
            </p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Community Information</CardTitle>
              <CardDescription>
                Provide details about your school, organization, or group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Community Name *</Label>
                  <Input
                    id="name"
                    placeholder="Lincoln High School"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Community Type *</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your community..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length}/500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Brand Primary Color
                  </Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#1e3a5f"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This color will be used for your community dashboard branding
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register Community"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CommunityRegister;
