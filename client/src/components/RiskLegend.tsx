import { Card } from "@/components/ui/card";

interface RiskLegendProps {
  colorblindMode?: boolean;
}

export default function RiskLegend({ colorblindMode = false }: RiskLegendProps) {
  const getRiskGradient = () => {
    if (colorblindMode) {
      return "linear-gradient(to right, #0571b0, #92c5de, #f7f7f7, #f4a582, #ca0020)";
    }
    return "linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #dc2626)";
  };

  const getRiskLabels = () => [
    { value: 0, label: "Low", color: colorblindMode ? "#0571b0" : "#22c55e" },
    { value: 25, label: "Moderate", color: colorblindMode ? "#92c5de" : "#84cc16" },
    { value: 50, label: "Medium", color: colorblindMode ? "#f7f7f7" : "#eab308" },
    { value: 75, label: "High", color: colorblindMode ? "#f4a582" : "#f97316" },
    { value: 100, label: "Extreme", color: colorblindMode ? "#ca0020" : "#dc2626" },
  ];

  return (
    <Card className="p-4 w-64" data-testid="card-risk-legend">
      <h3 className="text-sm font-semibold mb-3">Climate Health Risk</h3>
      <div className="space-y-3">
        <div 
          className="h-3 rounded-md w-full"
          style={{ background: getRiskGradient() }}
          data-testid="gradient-risk-scale"
        />
        <div className="flex justify-between text-xs">
          {getRiskLabels().map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="font-mono text-muted-foreground">{item.value}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
