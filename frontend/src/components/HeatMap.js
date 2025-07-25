// src/components/HeatMap.js
import React, { useEffect, useState } from 'react';
import { HeatmapLayer } from '@react-google-maps/api';
import coordinates from '../coordinates.json'; // Adjust the path as necessary

const HeatMap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps API is not loaded');
      return;
    }

    // Transform the coordinates data into an array of points
    let data = [];

    Object.keys(coordinates).forEach((cityKey) => {
      const cityCoordinates = coordinates[cityKey]; // Array of coordinate pairs

      cityCoordinates.forEach((coordinatePair) => {
        coordinatePair.forEach((point) => {
          // Each point is [latitude, longitude]
          const [latitude, longitude] = point;
          data.push({
            latitude,
            longitude,
            weight: 1, // You can adjust the weight as needed
          });
        });
      });
    });

    // Now `data` is an array of points with latitude and longitude
    console.log('Transformed data for heatmap:', data);

    const locations = data
      .filter((point) => point.latitude && point.longitude)
      .map((point) => {
        const location = new window.google.maps.LatLng(point.latitude, point.longitude);
        return {
          location,
          weight: point.weight || 1,
        };
      });

    setHeatmapData(locations);
  }, []);

  // Custom gradient for high-risk zones
  const gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(255, 0, 255, 1)',
    'rgba(255, 0, 127, 1)',
    'rgba(255, 0, 0, 1)',
  ];

  return (
    <>
      {heatmapData.length > 0 && (
        <HeatmapLayer
          data={heatmapData}
          options={{
            radius: 30,
            opacity: 0.8,
            gradient: gradient,
          }}
        />
      )}
    </>
  );
};

export default HeatMap;
