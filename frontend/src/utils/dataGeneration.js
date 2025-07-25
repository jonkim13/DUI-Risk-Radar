// src/utils/dataGeneration.js

// Helper function for linear interpolation between two points
const interpolate = (start, end, numPoints) => {
  const stepLat = (end[0] - start[0]) / (numPoints - 1);
  const stepLng = (end[1] - start[1]) / (numPoints - 1);

  return Array.from({ length: numPoints }, (_, i) => ({
    lat: parseFloat((start[0] + i * stepLat).toFixed(6)), // Ensures numerical precision
    lng: parseFloat((start[1] + i * stepLng).toFixed(6)),
  }));
};

// Function to generate incidents along multiple road segments
export const generateCityIncidents = (city, coordinatePairs, numIncidentsPerSegment) => {
  const incidents = [];

  coordinatePairs.forEach(([start, end]) => {
    // Validate that start and end are arrays with two numerical elements
    if (
      !Array.isArray(start) ||
      !Array.isArray(end) ||
      start.length !== 2 ||
      end.length !== 2 ||
      isNaN(start[0]) ||
      isNaN(start[1]) ||
      isNaN(end[0]) ||
      isNaN(end[1])
    ) {
      console.error(`Invalid coordinate pair: [${start}], [${end}]`);
      return; // Skip invalid coordinate pairs
    }

    // Generate interpolated coordinates between each start and end point
    const coordinates = interpolate(start, end, numIncidentsPerSegment);

    // Create an incident for each interpolated point
    coordinates.forEach((coord) => {
      // Add minimal random offset to simulate real-world data
      const offsetLat = (Math.random() - 0.5) * 0.0001; // Smaller offset
      const offsetLng = (Math.random() - 0.5) * 0.0001;

      const incidentLatitude = parseFloat((coord.lat + offsetLat).toFixed(6));
      const incidentLongitude = parseFloat((coord.lng + offsetLng).toFixed(6));

      // Validate that the final coordinates are numbers
      if (isNaN(incidentLatitude) || isNaN(incidentLongitude)) {
        console.error(`Generated invalid coordinates: lat=${incidentLatitude}, lng=${incidentLongitude}`);
        return; // Skip this incident
      }

      incidents.push({
        city: city,
        latitude: incidentLatitude,
        longitude: incidentLongitude,
        severity: Math.floor(Math.random() * 5) + 1, // Random severity between 1 and 5
        date: new Date().toISOString().slice(0, 10), // Today's date in YYYY-MM-DD format
      });
    });
  });

  return incidents;
};
