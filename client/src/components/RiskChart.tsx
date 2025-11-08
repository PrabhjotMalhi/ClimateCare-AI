import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RiskChartData {
  labels: string[];
  hsi: number[];
  csi: number[];
  aqri: number[];
}

interface RiskChartProps {
  data: RiskChartData;
  title?: string;
}

export default function RiskChart({ data, title = "7-Day Risk Forecast" }: RiskChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Heat Stress Index",
        data: data.hsi,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Cold Stress Index",
        data: data.csi,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Air Quality Risk",
        data: data.aqri,
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 16 / 9,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Risk Score (0-100)",
        },
      },
    },
  };

  return (
    <Card className="p-6" data-testid="card-risk-chart">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-full">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}
