import RiskChart from '../RiskChart';

export default function RiskChartExample() {
  const mockData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    hsi: [65, 72, 78, 85, 82, 75, 68],
    csi: [15, 12, 10, 8, 10, 15, 20],
    aqri: [45, 52, 58, 65, 70, 68, 55],
  };

  return (
    <div className="p-4">
      <RiskChart data={mockData} />
    </div>
  );
}
