import { useState } from 'react';
import AlertPanel from '../AlertPanel';
import type { Alert } from '@shared/schema';

export default function AlertPanelExample() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'heat',
      severity: 'extreme',
      neighborhoods: ['Downtown', 'Riverside'],
      message: 'Extreme heat warning: Temperature expected to reach 42°C. Heat Stress Index at 95.',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'air_quality',
      severity: 'high',
      neighborhoods: ['Industrial District', 'East Side'],
      message: 'Poor air quality alert: PM2.5 levels at 175 μg/m³. Air Quality Risk Index at 88.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'cold',
      severity: 'moderate',
      neighborhoods: ['North Hills'],
      message: 'Wind chill advisory: Feels like -15°C with strong winds. Cold Stress Index at 65.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    console.log('Dismissed alert:', id);
  };

  return (
    <div className="p-4">
      <AlertPanel alerts={alerts} onDismiss={handleDismiss} />
    </div>
  );
}
