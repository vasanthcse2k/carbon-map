import React, { useRef, useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { fetchRegionData, getAllRegions } from '../api/carbonApi';
import 'ol/ol.css';

const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0
};

const containerStyles = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden'
};

// Function to map forecast to color
const getIntensityColor = (forecast) => {
  if (forecast <= 50) return '#00ff00';      // Very Low - Green
  if (forecast <= 100) return '#88ff00';     // Low - Light Green
  if (forecast <= 200) return '#ffff00';     // Moderate - Yellow
  if (forecast <= 300) return '#ff8800';     // High - Orange
  return '#ff0000';                          // Very High - Red
};

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const vectorLayerRef = useRef(new VectorLayer({ source: new VectorSource() }));
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regions] = useState(getAllRegions());

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayerRef.current
      ],
      view: new View({
        center: fromLonLat([-2.0, 54.0]), // Default center
        zoom: 6
      })
    });

    return () => {
      if (map.current) {
        map.current.setTarget(null);
        map.current = null;
      }
    };
  }, []);

  const handleRegionChange = async (event) => {
    const regionId = event.target.value;
    setSelectedRegion(regionId);

    if (regionId) {
      const data = await fetchRegionData(regionId);
      console.log(data,"Region Data");
      if (data) {
        // Get the color based on the forecast value
        const regionColor = getIntensityColor(data.forecast);

        // Update vector layer with new region GeoJSON
        vectorLayerRef.current.setSource(
          new VectorSource({
            url: `/geojson/uk-regions/${regionId}.geojson`,
            format: new GeoJSON()
          })
        );

        // Update map style with region-specific color and 10% opacity
        vectorLayerRef.current.setStyle(
          new Style({
            fill: new Fill({
              color: regionColor
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 2
            })
          })
        );

        // Animate map view to the selected region
        map.current.getView().animate({
          center: data.coordinates,
          zoom: 10,
          duration: 1000
        });
      }
    }
  };

  return (
    <Box sx={containerStyles}>
      <FormControl
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 200,
          backgroundColor: 'transparent',
          zIndex: 1000
        }}
      >
        <InputLabel>Select Region</InputLabel>
        <Select value={selectedRegion} onChange={handleRegionChange}>
          <MenuItem value="">
            <em>Select a region</em>
          </MenuItem>
          {regions.map((region) => (
            <MenuItem key={region.id} value={region.id}>
              {region.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div ref={mapContainer} style={mapStyles} />
    </Box>
  );
};

export default MapComponent;
