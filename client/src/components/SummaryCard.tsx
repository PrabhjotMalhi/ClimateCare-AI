import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
}

export default function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue 
}: SummaryCardProps) {
  const getTrendColor = () => {
    if (!trend) return "";
    return trend === "up" ? "text-destructive" : trend === "down" ? "text-green-600" : "text-muted-foreground";
  };

  return (
    <Card className="p-6 hover-elevate cursor-pointer" data-testid={`card-summary-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold" data-testid={`text-value-${title.toLowerCase().replace(/\s/g, '-')}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <p className={`text-xs font-medium ${getTrendColor()}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-md">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
