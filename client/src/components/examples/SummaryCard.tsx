import SummaryCard from '../SummaryCard';
import { AlertTriangle, Thermometer, Wind, Users } from 'lucide-react';

export default function SummaryCardExample() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummaryCard 
        title="Highest Risk Area"
        value="Downtown"
        subtitle="Risk Score: 87"
        icon={AlertTriangle}
        trend="up"
        trendValue="+12 from yesterday"
      />
      <SummaryCard 
        title="Current Temperature"
        value="34°C"
        subtitle="Feels like 38°C"
        icon={Thermometer}
        trend="up"
        trendValue="+3°C"
      />
      <SummaryCard 
        title="Air Quality Index"
        value="152"
        subtitle="Unhealthy"
        icon={Wind}
        trend="stable"
        trendValue="No change"
      />
      <SummaryCard 
        title="At-Risk Population"
        value="12,450"
        subtitle="Seniors in high-risk areas"
        icon={Users}
      />
    </div>
  );
}
