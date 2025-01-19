import axios from "axios";
import { fromLonLat } from 'ol/proj';

const API_BASE = "https://api.carbonintensity.org.uk/regional";

const regions = {
    1: { name: 'North Scotland', center: [-4.2026, 57.4739] },
    2: { name: 'South Scotland', center: [-3.4433, 55.9533] },
    3: { name: 'North West England', center: [-2.7779, 54.7023] },
    4: { name: 'North East England', center: [-1.6761, 54.9783] },
    5: { name: 'Yorkshire', center: [-1.5411, 53.9591] },
    6: { name: 'North Wales', center: [-3.7837, 52.8637] },
    7: { name: 'South Wales', center: [-3.7837, 51.7837] },
    8: { name: 'West Midlands', center: [-2.1900, 52.4862] },
    9: { name: 'East Midlands', center: [-1.1581, 52.8637] },
    10: { name: 'East England', center: [0.1927, 52.1874] },
    11: { name: 'South West England', center: [-3.9999, 50.7772] },
    12: { name: 'South England', center: [-1.1499, 51.1499] },
    13: { name: 'London', center: [-0.1276, 51.5074] },
    14: { name: 'South East England', center: [-0.5596, 51.1781] }
};

const getIntensityColor = (forecast) => {
    if (forecast <= 50) return '#00ff00';      // Very Low - Green
    if (forecast <= 100) return '#88ff00';     // Low - Light Green
    if (forecast <= 200) return '#ffff00';     // Moderate - Yellow
    if (forecast <= 300) return '#ff8800';     // High - Orange
    return '#ff0000';                          // Very High - Red
};

export const fetchRegionData = async (regionId) => {
  try {
      const response = await axios.get(`${API_BASE}/regionid/${regionId}`);
      const regionData = response.data.data[0];
      const intensityData = regionData.data[0];
      
      return {
          id: regionId,
          name: regions[regionId].name,
          coordinates: fromLonLat(regions[regionId].center),
          intensity: {
              forecast: intensityData.intensity.forecast,
              index: intensityData.intensity.index,
              color: getIntensityColor(intensityData.intensity.forecast)
          },
          generationMix: intensityData.generationmix
      };
  } catch (error) {
      console.error("Error fetching region data:", error);
      return null;
  }
};



export const getAllRegions = () => {
    return Object.entries(regions).map(([id, data]) => ({
        id: parseInt(id),
        name: data.name
    }));
};
