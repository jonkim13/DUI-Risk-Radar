import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import coordinates from '../coordinates.json'; // Adjust the path as necessary

const RouteComponent = ({ userLocation, setDirections }) => {
  const [origin, setOrigin] = useState(
    userLocation ? `${userLocation.lat},${userLocation.lng}` : ''
  );
  const [destination, setDestination] = useState('');
  const [error, setError] = useState(null);
  const [highRiskZones, setHighRiskZones] = useState([]);

  useEffect(() => {
    // Transform the coordinates data into an array of points
    let data = [];

    Object.keys(coordinates).forEach((cityKey) => {
      const cityCoordinates = coordinates[cityKey]; // Array of coordinate pairs

      cityCoordinates.forEach((coordinatePair) => {
        coordinatePair.forEach((point) => {
          // Each point is [latitude, longitude]
          const [latitude, longitude] = point;
          data.push({
            lat: latitude,
            lng: longitude,
          });
        });
      });
    });

    // Cluster the points
    const clusters = clusterPoints(data, 0.01); // Adjust threshold as needed
    setHighRiskZones(clusters);
  }, []);

  // Function to cluster points
  const clusterPoints = (points, threshold) => {
    const clusters = [];
    const visited = new Set();

    points.forEach((point, index) => {
      if (visited.has(index)) return;

      const cluster = [point];
      visited.add(index);

      for (let i = index + 1; i < points.length; i++) {
        if (visited.has(i)) continue;
        const otherPoint = points[i];
        const distance = getDistance(point, otherPoint);
        if (distance <= threshold) {
          cluster.push(otherPoint);
          visited.add(i);
        }
      }

      clusters.push({
        id: clusters.length,
        points: cluster,
        lat: cluster.reduce((sum, p) => sum + p.lat, 0) / cluster.length,
        lng: cluster.reduce((sum, p) => sum + p.lng, 0) / cluster.length,
      });
    });

    console.log('Clusters:', clusters);
    return clusters;
  };

  // Function to calculate approximate distance between two points
  const getDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.lat - point2.lat, 2) + Math.pow(point1.lng - point2.lng, 2)
    );
  };

  // Function to count how many high-risk zones the route passes through
  const countHighRiskZones = (route, clusters) => {
    const proximityThreshold = 0.01; // Adjust as needed
    const zonesEncountered = new Set();

    route.overview_path.forEach((point) => {
      clusters.forEach((cluster) => {
        const distance = getDistance(
          { lat: point.lat(), lng: point.lng() },
          { lat: cluster.lat, lng: cluster.lng }
        );
        if (distance <= proximityThreshold) {
          zonesEncountered.add(cluster.id);
        }
      });
    });

    return zonesEncountered.size;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!origin || !destination) {
      alert('Please enter both origin and destination.');
      return;
    }

    const DirectionsServiceOptions = {
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      provideRouteAlternatives: true,
    };

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(DirectionsServiceOptions, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        console.log('Received directions:', result);

        const route = result.routes[0]; // Just use the first route for simplicity
        const highRiskCount = countHighRiskZones(route, highRiskZones);

        // Display a Toastify notification with the high-risk zones count
        if (highRiskCount > 0) {
          toast.warn(`You will encounter ${highRiskCount} high-risk zones on this route!`);
        } else {
          toast.success('No high-risk zones on this route.');
        }

        setDirections(result); // Pass the directions to render on the map
      } else {
        console.error('Directions request failed:', result);
        setError('Failed to get directions.');
      }
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter current location"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
  
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );  
};

export default RouteComponent;
