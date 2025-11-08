import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, X } from "lucide-react";
import { format } from "date-fns";
import type { Alert } from "@shared/schema";

interface AlertPanelProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
}

export default function AlertPanel({ alerts, onDismiss }: AlertPanelProps) {
  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "extreme": return "destructive";
      case "high": return "default";
      case "moderate": return "secondary";
      case "low": return "outline";
    }
  };

  const getTypeIcon = (type: Alert["type"]) => {
    return type === "heat" ? "🔥" : type === "cold" ? "❄️" : "💨";
  };

  return (
    <Card className="p-6" data-testid="card-alert-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Active Alerts</h3>
        </div>
        <Badge variant="secondary" data-testid="badge-alert-count">
          {alerts.length}
        </Badge>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active alerts
            </p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border rounded-md space-y-2 hover-elevate"
                data-testid={`alert-item-${alert.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(alert.type)}</span>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  {onDismiss && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDismiss(alert.id)}
                      data-testid={`button-dismiss-${alert.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="text-sm font-medium">{alert.message}</p>
                
                <div className="flex flex-wrap gap-1">
                  {alert.neighborhoods.map((neighborhood, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {neighborhood}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground font-mono">
                  {format(new Date(alert.timestamp), "MMM d, h:mm a")}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
