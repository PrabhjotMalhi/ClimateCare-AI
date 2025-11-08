import type { AirQualityData } from "@shared/schema";
import { weatherCache } from "./weatherService";
import axios from "axios";

interface OpenAQMeasurement {
  parameter: string;
  value: number;
  lastUpdated: string;
  unit: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  location?: string;
}

interface OpenAQLocation {
  id: number;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  measurements?: OpenAQMeasurement[];
}

interface OpenAQResponse {
  results: OpenAQLocation[];
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function fetchAirQualityData(
  lat: number,
  lon: number,
  radius: number = 50000,
  dayIndex?: number // dayIndex parameter kept for API compatibility but not used in caching
): Promise<AirQualityData> {
  // Air quality is current/recent measurements, not forecast, so don't cache per day
  // Round coordinates to reduce cache keys (same location = same cache)
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLon = Math.round(lon * 100) / 100;
  const cacheKey = `airquality_${roundedLat}_${roundedLon}`;
  const cached = weatherCache.get<AirQualityData>(cacheKey);
  
  if (cached) {
    console.log(`[AirQuality Cache] Hit for ${cacheKey}`);
    return cached;
  }

  console.log(`[AirQuality API] Fetching for lat=${lat}, lon=${lon}`);
  
  const params = new URLSearchParams({
    limit: '100',
    page: '1',
    offset: '0',
    sort: 'desc',
    coordinates: `${lat},${lon}`,
    radius: radius.toString(),
    order_by: 'lastUpdated',
  });

  const url = `https://api.openaq.org/v2/locations?${params}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(`[AirQuality API] OpenAQ Error ${response.status}: ${errorText}, trying fallbacks...`);
      
      // Try WAQI fallback
      const waqiResult = await tryWAQI(lat, lon);
      if (waqiResult) {
        weatherCache.set(cacheKey, waqiResult);
        return waqiResult;
      }

      // Try OpenMeteo fallback
      const openMeteoResult = await tryOpenMeteo(lat, lon);
      if (openMeteoResult) {
        weatherCache.set(cacheKey, openMeteoResult);
        return openMeteoResult;
      }

      return getFallbackAirQuality();
    }
    
    const data: OpenAQResponse = await response.json();
    
    console.log(`[AirQuality API] Received response with ${data?.results?.length || 0} stations`);
    
    if (!data || !data.results || data.results.length === 0) {
      console.warn('[AirQuality API] No stations found in OpenAQ response, trying fallbacks...');
      
      // Try WAQI fallback
      const waqiResult = await tryWAQI(lat, lon);
      if (waqiResult) {
        weatherCache.set(cacheKey, waqiResult);
        return waqiResult;
      }

      // Try OpenMeteo fallback
      const openMeteoResult = await tryOpenMeteo(lat, lon);
      if (openMeteoResult) {
        weatherCache.set(cacheKey, openMeteoResult);
        return openMeteoResult;
      }

      return getFallbackAirQuality();
    }

    let nearestStation = data.results[0];
    console.log(`[AirQuality API] Found nearest station: ${nearestStation.name} (ID: ${nearestStation.id})`);
    let minDistance = calculateDistance(
      lat,
      lon,
      nearestStation.coordinates.latitude,
      nearestStation.coordinates.longitude
    );

    for (const station of data.results) {
      const distance = calculateDistance(
        lat,
        lon,
        station.coordinates.latitude,
        station.coordinates.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }

    // Try to get measurements from the location data first
    let pm25: number | null = null;
    let pm10: number | null = null;
    let no2: number | null = null;

    // Check if measurements are already in the location data
    if (nearestStation.measurements && nearestStation.measurements.length > 0) {
      for (const measurement of nearestStation.measurements) {
        if (measurement.parameter === 'pm25' && pm25 === null) {
          pm25 = measurement.value;
        } else if (measurement.parameter === 'pm10' && pm10 === null) {
          pm10 = measurement.value;
        } else if (measurement.parameter === 'no2' && no2 === null) {
          no2 = measurement.value;
        }
      }
    }

    // If we don't have all measurements, try the measurements endpoint
    if ((!pm25 && !pm10 && !no2) || (!pm25 || !pm10 || !no2)) {
      const params2 = new URLSearchParams({
        limit: '100',
        page: '1',
        offset: '0',
        sort: 'desc',
        location_id: nearestStation.id.toString(),
        order_by: 'datetime',
      });

      const measurementsUrl = `https://api.openaq.org/v2/measurements?${params2}`;
      
      try {
        const measurementsResponse = await fetch(measurementsUrl, {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (measurementsResponse.ok) {
          const measurementsData: { results: OpenAQMeasurement[] } = await measurementsResponse.json();
          
          if (measurementsData.results && measurementsData.results.length > 0) {
            for (const measurement of measurementsData.results) {
              if (measurement.parameter === 'pm25' && pm25 === null) {
                pm25 = measurement.value;
              } else if (measurement.parameter === 'pm10' && pm10 === null) {
                pm10 = measurement.value;
              } else if (measurement.parameter === 'no2' && no2 === null) {
                no2 = measurement.value;
              }
            }
          } else {
            console.warn(`[AirQuality API] No measurements found for station ${nearestStation.name}`);
          }
        } else {
          const errorText = await measurementsResponse.text().catch(() => 'Unknown error');
          console.warn(`[AirQuality API] Measurements endpoint error ${measurementsResponse.status}: ${errorText}`);
        }
      } catch (measurementsError) {
        console.warn(`[AirQuality API] Error fetching measurements:`, measurementsError);
      }
    }

    const result: AirQualityData = {
      pm25,
      pm10,
      no2,
      station: nearestStation.name,
      distance: minDistance,
    };

    // If we got some data from OpenAQ, use it
    if (pm25 || pm10 || no2) {
      console.log(`[AirQuality API] OpenAQ success - PM2.5: ${pm25 ?? 'N/A'}, PM10: ${pm10 ?? 'N/A'}, NO2: ${no2 ?? 'N/A'}`);
      weatherCache.set(cacheKey, result);
      return result;
    }

    // If OpenAQ didn't provide enough data, try fallbacks
    console.warn('[AirQuality API] OpenAQ provided insufficient data, trying fallbacks...');
    
    // Try WAQI fallback
    const waqiResult = await tryWAQI(lat, lon);
    if (waqiResult) {
      weatherCache.set(cacheKey, waqiResult);
      return waqiResult;
    }

    // Try OpenMeteo fallback
    const openMeteoResult = await tryOpenMeteo(lat, lon);
    if (openMeteoResult) {
      weatherCache.set(cacheKey, openMeteoResult);
      return openMeteoResult;
    }

    // Return what we have from OpenAQ (even if null)
    weatherCache.set(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error('[AirQuality API] OpenAQ Error:', error);
    if (error instanceof Error) {
      console.error('[AirQuality API] Error message:', error.message);
    }
    
    // Try fallbacks on error
    console.log('[AirQuality API] Trying fallbacks after error...');
    
    // Try WAQI fallback
    const waqiResult = await tryWAQI(lat, lon);
    if (waqiResult) {
      weatherCache.set(cacheKey, waqiResult);
      return waqiResult;
    }

    // Try OpenMeteo fallback
    const openMeteoResult = await tryOpenMeteo(lat, lon);
    if (openMeteoResult) {
      weatherCache.set(cacheKey, openMeteoResult);
      return openMeteoResult;
    }

    return getFallbackAirQuality();
  }
}

/**
 * Convert AQI to estimated pollutant values
 * These are rough estimates based on typical AQI composition
 */
function aqiToPollutants(aqi: number): { pm25: number; pm10: number; no2: number } {
  // Rough conversion formulas based on EPA AQI breakpoints
  // PM2.5 is typically the primary driver of AQI
  let pm25 = 0;
  let pm10 = 0;
  let no2 = 0;

  if (aqi <= 50) {
    // Good
    pm25 = aqi * 0.5; // 0-12.0 μg/m³
    pm10 = aqi * 0.54; // 0-54 μg/m³
    no2 = aqi * 0.5; // 0-53 ppb
  } else if (aqi <= 100) {
    // Moderate
    pm25 = 12.1 + (aqi - 51) * 0.77; // 12.1-35.4 μg/m³
    pm10 = 55 + (aqi - 51) * 0.9; // 55-154 μg/m³
    no2 = 54 + (aqi - 51) * 0.92; // 54-100 ppb
  } else if (aqi <= 150) {
    // Unhealthy for Sensitive Groups
    pm25 = 35.5 + (aqi - 101) * 0.29; // 35.5-55.4 μg/m³
    pm10 = 155 + (aqi - 101) * 0.9; // 155-254 μg/m³
    no2 = 101 + (aqi - 101) * 0.98; // 101-360 ppb
  } else if (aqi <= 200) {
    // Unhealthy
    pm25 = 55.5 + (aqi - 151) * 0.29; // 55.5-150.4 μg/m³
    pm10 = 255 + (aqi - 151) * 0.9; // 255-354 μg/m³
    no2 = 361 + (aqi - 151) * 2.78; // 361-649 ppb
  } else if (aqi <= 300) {
    // Very Unhealthy
    pm25 = 150.5 + (aqi - 201) * 0.5; // 150.5-250.4 μg/m³
    pm10 = 355 + (aqi - 201) * 0.9; // 355-424 μg/m³
    no2 = 650 + (aqi - 201) * 3.03; // 650-1249 ppb
  } else {
    // Hazardous
    pm25 = 250.5 + (aqi - 301) * 1.25; // 250.5+ μg/m³
    pm10 = 425 + (aqi - 301) * 0.38; // 425+ μg/m³
    no2 = 1250 + (aqi - 301) * 1.26; // 1250+ ppb
  }

  return {
    pm25: Math.round(pm25 * 10) / 10,
    pm10: Math.round(pm10 * 10) / 10,
    no2: Math.round(no2 * 10) / 10,
  };
}

/**
 * Try WAQI API as fallback
 */
async function tryWAQI(lat: number, lon: number): Promise<AirQualityData | null> {
  try {
    const waqiToken = '18b99d82f7e91ec5fc5e5c29d0297dbea24a7061';
    const waqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${waqiToken}`;
    
    console.log('[AirQuality API] Trying WAQI as fallback...');
    const response = await axios.get(waqiUrl, { timeout: 5000 });
    
    const waqiAqi = response.data?.data?.aqi;
    if (typeof waqiAqi === 'number' && waqiAqi > 0) {
      const pollutants = aqiToPollutants(waqiAqi);
      console.log(`[AirQuality API] WAQI success - AQI: ${waqiAqi}, converted to pollutants`);
      
      return {
        pm25: pollutants.pm25,
        pm10: pollutants.pm10,
        no2: pollutants.no2,
        station: response.data?.data?.city?.name || 'WAQI Station',
        distance: null,
      };
    }
  } catch (error) {
    console.warn('[AirQuality API] WAQI failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  return null;
}

/**
 * Try OpenMeteo API as fallback
 */
async function tryOpenMeteo(lat: number, lon: number): Promise<AirQualityData | null> {
  try {
    console.log('[AirQuality API] Trying OpenMeteo as fallback...');
    const response = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'us_aqi,pm10,pm2_5,nitrogen_dioxide',
      },
      timeout: 5000,
    });

    const current = response.data?.current;
    if (current) {
      // Try to get actual pollutant values first
      let pm25 = current.pm2_5 ?? null;
      let pm10 = current.pm10 ?? null;
      let no2 = current.nitrogen_dioxide ?? null;

      // If we have AQI but missing pollutants, convert AQI
      if (current.us_aqi && (!pm25 || !pm10 || !no2)) {
        const pollutants = aqiToPollutants(Math.round(current.us_aqi));
        pm25 = pm25 ?? pollutants.pm25;
        pm10 = pm10 ?? pollutants.pm10;
        no2 = no2 ?? pollutants.no2;
      }

      if (pm25 || pm10 || no2) {
        console.log(`[AirQuality API] OpenMeteo success - PM2.5: ${pm25 ?? 'N/A'}, PM10: ${pm10 ?? 'N/A'}, NO2: ${no2 ?? 'N/A'}`);
        return {
          pm25,
          pm10,
          no2,
          station: 'OpenMeteo Station',
          distance: null,
        };
      }
    }
  } catch (error) {
    console.warn('[AirQuality API] OpenMeteo failed:', error instanceof Error ? error.message : 'Unknown error');
  }
  return null;
}

function getFallbackAirQuality(): AirQualityData {
  return {
    pm25: null,
    pm10: null,
    no2: null,
    station: null,
    distance: null,
  };
}
