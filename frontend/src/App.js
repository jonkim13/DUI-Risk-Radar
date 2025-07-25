import coordinates from './coordinates.json'; 
import React, { useState, useEffect } from 'react';
import './App.css';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import HeatMap from './components/HeatMap'; // HeatMap component
import ReportFeature from './components/ReportFeature'; // Report feature component
import RouteComponent from './components/RouteComponent'; // Route component
import DataUploader from './components/DataUploader'; // Data uploader component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define your map container style
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Set the default center of the map (El Paso coordinates)
const defaultCenter = {
  lat: 31.7619, // El Paso latitude
  lng: -106.4850, // El Paso longitude
};

function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasIssues, setHasIssues] = useState(true);
  const [userLocation, setUserLocation] = useState(null);  // State to store user's location
  const [directions, setDirections] = useState(null);  // State to store the directions result
  const [highRiskZones, setHighRiskZones] = useState([]);  // State for high-risk zones

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setHasIssues(false);
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error obtaining location:', error);
          toast.error('Unable to access your location.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  // Load high-risk zones from coordinates.json
  useEffect(() => {
    const convertCoordinates = (array) => array.map(([lat, lng]) => ({ lat, lng }));
    
    // Combine the high-risk zones from different cities
    const combinedHighRiskZones = [
      ...convertCoordinates(coordinates.elPasoCoordinates),
      ...convertCoordinates(coordinates.lasVegasCoordinates),
      ...convertCoordinates(coordinates.phoenixCoordinates)
    ];

    setHighRiskZones(combinedHighRiskZones); // Set the high-risk zones
  }, []);

  // Get user's location when the component mounts
  useEffect(() => {
    getCurrentLocation(); // Call the function to get user's location
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>DUI Risk Heatmap</h1>
      </header>

      <div className="content">
        <div className="report">
          <ReportFeature /> {/* Integrate ReportFeature component */}
        </div>

        {/* Inputs for Route Calculation */}
        <div className="route-section">
          <RouteComponent 
            userLocation={userLocation} 
            setDirections={setDirections} 
            highRiskZones={highRiskZones}  // Pass the high-risk zones to RouteComponent
          />
        </div>

        {/* Map Section */}
        <div className="map">
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={['visualization', 'places']} // Include 'visualization' library for HeatMap
          >
            <GoogleMap
              mapContainerStyle={containerStyle}  // Map container style
              center={userLocation || defaultCenter}  // Center the map on user location if available
              zoom={userLocation ? 14 : 9}  // Adjust zoom based on whether user location is available
            >
              {directions && (
                <>
                  {console.log("Rendering Directions:", directions)}  // Add this to debug
                  <DirectionsRenderer directions={directions} />
                </>
              )}

              {/* HeatMap Component */}
              <HeatMap />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
