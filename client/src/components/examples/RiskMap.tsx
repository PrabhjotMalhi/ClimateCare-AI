import RiskMap from '../RiskMap';
import type { NeighborhoodsGeoJSON } from '@shared/schema';

export default function RiskMapExample() {
  const mockNeighborhoods: NeighborhoodsGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-79.39, 43.65],
            [-79.38, 43.65],
            [-79.38, 43.66],
            [-79.39, 43.66],
            [-79.39, 43.65]
          ]]
        },
        properties: {
          name: "Downtown",
          population: 15000,
          seniorPercent: 18,
          vulnerabilityScore: 75,
          riskData: {
            hsi: 85,
            csi: 15,
            aqri: 72,
            riskScore: 87,
            raw: {
              weather: { temperature: 34, humidity: 65, windSpeed: 12, uvIndex: 9, windChill: 30, precipitation: 0 },
              airQuality: { pm25: 45, pm10: 68, no2: 42, station: "Downtown Station", distance: 0.5 }
            },
            confidence: 95,
            date: new Date().toISOString()
          }
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-79.38, 43.65],
            [-79.37, 43.65],
            [-79.37, 43.66],
            [-79.38, 43.66],
            [-79.38, 43.65]
          ]]
        },
        properties: {
          name: "Riverside",
          population: 12000,
          seniorPercent: 22,
          vulnerabilityScore: 68,
          riskData: {
            hsi: 65,
            csi: 20,
            aqri: 55,
            riskScore: 62,
            raw: {
              weather: { temperature: 30, humidity: 60, windSpeed: 15, uvIndex: 7, windChill: 28, precipitation: 0 },
              airQuality: { pm25: 35, pm10: 52, no2: 38, station: "East Station", distance: 1.2 }
            },
            confidence: 88,
            date: new Date().toISOString()
          }
        }
      }
    ]
  };

  return (
    <div className="h-[600px] w-full">
      <RiskMap 
        neighborhoods={mockNeighborhoods} 
        onNeighborhoodClick={(name) => console.log('Clicked:', name)}
      />
    </div>
  );
}
