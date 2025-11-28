import { Shield, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface SafetyRatingProps {
  score: number;
  trend?: "up" | "down" | "stable";
  label?: string;
  size?: "sm" | "md" | "lg";
}

const SafetyRating = ({ score, trend = "stable", label, size = "md" }: SafetyRatingProps) => {
  const getRatingColor = (score: number) => {
    if (score >= 80) return "text-protect";
    if (score >= 60) return "text-support";
    return "text-destructive";
  };

  const getRatingLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <Card className="shadow-soft border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className={`w-8 h-8 ${getRatingColor(score)}`} />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{label || "Digital Safety Score"}</p>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${sizeClasses[size]} ${getRatingColor(score)}`}>
                {score}
              </span>
              <span className="text-muted-foreground">/ 100</span>
              {trend === "up" && (
                <TrendingUp className="w-5 h-5 text-protect" />
              )}
            </div>
          </div>
        </div>
        <Progress value={score} className="h-2 mb-2" />
        <p className={`text-sm font-medium ${getRatingColor(score)}`}>
          {getRatingLabel(score)}
        </p>
      </CardContent>
    </Card>
  );
};

export default SafetyRating;
