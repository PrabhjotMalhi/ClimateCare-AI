import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Info, Bell, Upload, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskMap from "@/components/RiskMap";
import RiskLegend from "@/components/RiskLegend";
import TimeSlider from "@/components/TimeSlider";
import SummaryCard from "@/components/SummaryCard";
import RiskChart from "@/components/RiskChart";
import AlertPanel from "@/components/AlertPanel";
import CommunityForm from "@/components/CommunityForm";
import RiskScoreModal from "@/components/RiskScoreModal";
import SettingsPanel from "@/components/SettingsPanel";
import { AlertTriangle, Thermometer, Wind, Users } from "lucide-react";
import type { NeighborhoodsGeoJSON, Alert } from "@shared/schema";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [colorblindMode, setColorblindMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  // TODO: Replace with real data from API
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
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-79.40, 43.66],
            [-79.39, 43.66],
            [-79.39, 43.67],
            [-79.40, 43.67],
            [-79.40, 43.66]
          ]]
        },
        properties: {
          name: "North Hills",
          population: 18000,
          seniorPercent: 15,
          vulnerabilityScore: 55,
          riskData: {
            hsi: 45,
            csi: 35,
            aqri: 40,
            riskScore: 48,
            raw: {
              weather: { temperature: 28, humidity: 55, windSpeed: 18, uvIndex: 6, windChill: 25, precipitation: 0 },
              airQuality: { pm25: 28, pm10: 42, no2: 30, station: "North Station", distance: 0.8 }
            },
            confidence: 92,
            date: new Date().toISOString()
          }
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-79.37, 43.66],
            [-79.36, 43.66],
            [-79.36, 43.67],
            [-79.37, 43.67],
            [-79.37, 43.66]
          ]]
        },
        properties: {
          name: "East Side",
          population: 20000,
          seniorPercent: 12,
          vulnerabilityScore: 62,
          riskData: {
            hsi: 72,
            csi: 18,
            aqri: 68,
            riskScore: 74,
            raw: {
              weather: { temperature: 32, humidity: 62, windSpeed: 10, uvIndex: 8, windChill: 29, precipitation: 0 },
              airQuality: { pm25: 42, pm10: 60, no2: 45, station: "East Station", distance: 0.3 }
            },
            confidence: 90,
            date: new Date().toISOString()
          }
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-79.40, 43.64],
            [-79.39, 43.64],
            [-79.39, 43.65],
            [-79.40, 43.65],
            [-79.40, 43.64]
          ]]
        },
        properties: {
          name: "Industrial District",
          population: 8000,
          seniorPercent: 8,
          vulnerabilityScore: 80,
          riskData: {
            hsi: 78,
            csi: 12,
            aqri: 85,
            riskScore: 82,
            raw: {
              weather: { temperature: 33, humidity: 58, windSpeed: 8, uvIndex: 8, windChill: 31, precipitation: 0 },
              airQuality: { pm25: 58, pm10: 82, no2: 55, station: "South Station", distance: 1.0 }
            },
            confidence: 85,
            date: new Date().toISOString()
          }
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[
            [-79.38, 43.64],
            [-79.37, 43.64],
            [-79.37, 43.65],
            [-79.38, 43.65],
            [-79.38, 43.64]
          ]]
        },
        properties: {
          name: "Parkside",
          population: 14000,
          seniorPercent: 20,
          vulnerabilityScore: 50,
          riskData: {
            hsi: 38,
            csi: 25,
            aqri: 32,
            riskScore: 35,
            raw: {
              weather: { temperature: 26, humidity: 52, windSpeed: 20, uvIndex: 5, windChill: 23, precipitation: 0 },
              airQuality: { pm25: 22, pm10: 35, no2: 25, station: "Park Station", distance: 0.4 }
            },
            confidence: 94,
            date: new Date().toISOString()
          }
        }
      }
    ]
  };

  // TODO: Replace with real data from API
  const mockAlerts: Alert[] = [
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
  ];

  // TODO: Replace with real data from API
  const mockChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    hsi: [65, 72, 78, 85, 82, 75, 68],
    csi: [15, 12, 10, 8, 10, 15, 20],
    aqri: [45, 52, 58, 65, 70, 68, 55],
  };

  const handleNeighborhoodClick = (name: string) => {
    setSelectedNeighborhood(name);
    console.log('Selected neighborhood:', name);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('GeoJSON file uploaded:', file.name);
      // TODO: Parse and load GeoJSON file
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">ClimateCare AI</h1>
            <p className="text-sm text-muted-foreground">Real-time Climate Health Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setModalOpen(true)}
            data-testid="button-info"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            data-testid="button-notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          <div className="flex-1 relative">
            <RiskMap 
              neighborhoods={mockNeighborhoods}
              colorblindMode={colorblindMode}
              selectedDate={selectedDate}
              onNeighborhoodClick={handleNeighborhoodClick}
            />
            <div className="absolute bottom-4 left-4 z-10">
              <RiskLegend colorblindMode={colorblindMode} />
            </div>
          </div>
          <TimeSlider onDateChange={setSelectedDate} initialDate={selectedDate} />
        </div>

        {/* Side Panel */}
        <div className="w-[450px] border-l overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts" data-testid="tab-alerts">Alerts</TabsTrigger>
              <TabsTrigger value="community" data-testid="tab-community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Summary</h2>
                <label htmlFor="geojson-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload GeoJSON
                    </span>
                  </Button>
                  <input
                    id="geojson-upload"
                    type="file"
                    accept=".geojson,.json"
                    className="hidden"
                    onChange={handleFileUpload}
                    data-testid="input-geojson-upload"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4">
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

              <RiskChart data={mockChartData} title={selectedNeighborhood ? `${selectedNeighborhood} - 7-Day Forecast` : "7-Day Risk Forecast"} />
            </TabsContent>

            <TabsContent value="alerts" className="p-4">
              <AlertPanel 
                alerts={mockAlerts}
                onDismiss={(id) => console.log('Dismiss alert:', id)}
              />
            </TabsContent>

            <TabsContent value="community" className="p-4">
              <CommunityForm onSubmit={(data) => console.log('Community submission:', data)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <RiskScoreModal open={modalOpen} onOpenChange={setModalOpen} />
      <SettingsPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        colorblindMode={colorblindMode}
        onColorblindModeChange={setColorblindMode}
        notifications={notifications}
        onNotificationsChange={setNotifications}
      />
    </div>
  );
}
