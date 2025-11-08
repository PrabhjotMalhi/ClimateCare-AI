import RiskLegend from '../RiskLegend';

export default function RiskLegendExample() {
  return (
    <div className="p-4 space-y-4">
      <RiskLegend />
      <RiskLegend colorblindMode={true} />
    </div>
  );
}
