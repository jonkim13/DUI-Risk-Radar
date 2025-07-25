// src/components/ReportFeature.js

import React, { useState, useEffect, useRef } from 'react';
import ReportButton from './ReportButton';
import { toast } from 'react-toastify';
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';  // Import Firestore functions
import { db } from '../firebase';  // Import Firestore instance from Firebase config

const ReportFeature = () => {
  const [isRecording, setIsRecording] = useState(false);  // State to manage recording status
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem('reports');
    return savedReports ? JSON.parse(savedReports) : [];
  });
  const [userLocation, setUserLocation] = useState(null);  // State to store user's location

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Save reports to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  // Function to get the user's current location using the Geolocation API
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            resolve({ latitude, longitude });  // Resolve with location data
          },
          (error) => {
            console.error('Error getting location:', error);
            toast.error('Unable to retrieve your location.');
            reject('Location unavailable');  // Reject with an error
          }
        );
      } else {
        toast.error('Geolocation is not supported by your browser.');
        reject('Geolocation not supported');
      }
    });
  };

  // Function to handle the report recording and saving process
  const handleReport = async () => {
    if (isRecording) {
      // Stop Recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Processing your report...');

      try {
        // Ensure we have the user's location before sending the report
        const location = await getUserLocation();  // Wait for location retrieval
        const { latitude, longitude } = location || { latitude: 'Location unavailable', longitude: '' };

        // Send the transcription and location to Firebase
        await sendReportToFirebase(null, latitude, longitude);  // Temporarily passing null for transcription

      } catch (error) {
        console.error('Location error:', error);
        toast.error('Failed to retrieve location.');
      }

    } else {
      // Start Recording
      getUserLocation();  // Start fetching the location asynchronously
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Your browser does not support audio recording.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);  // Store audio chunks
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          try {
            // Send audioBlob to the backend for transcription
            const formData = new FormData();
            formData.append('audio', audioBlob, 'report.webm');
        
            const response = await axios.post('http://localhost:5001/transcribe', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
        
            const transcription = response.data.transcription;
        
            // Create a new report object with the transcription and timestamp
            const newReport = {
              id: Date.now(),
              description: transcription,
              timestamp: new Date().toISOString(),
            };
        
            // Update the local state with the new report
            setReports((prevReports) => [...prevReports, newReport]);
        
            // Ensure we have the user's location before sending the report
            const location = await getUserLocation();  // Wait for location retrieval
            const { latitude, longitude } = location || { latitude: 'Location unavailable', longitude: '' };
        
            // Send the transcription and location to Firebase
            await sendReportToFirebase(transcription, latitude, longitude);
        
          } catch (error) {
            console.error('Transcription error:', error.response?.data || error.message);
            toast.error(`Transcription failed: ${error.response?.data?.error || error.message}`);
          }
        };

        mediaRecorderRef.current.start();  // Start recording
        setIsRecording(true);
        toast.info('Recording started. Click the Report button again to stop.');

      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Unable to access your microphone.');
      }
    }
  };

  // Function to send report data to Firebase
  const sendReportToFirebase = async (transcription, latitude, longitude) => {
    try {
      await addDoc(collection(db, 'reports'), {
        description: transcription || 'Transcription unavailable',  // Save the transcribed text or fallback
        timestamp: new Date().toISOString(),  // Save the current timestamp
        location: latitude && longitude ? `${latitude}, ${longitude}` : 'Location unavailable',  // Save the location
      });

      toast.success('Report submitted and saved to Firebase!');
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      toast.error('Failed to save report to Firebase.');
    }
  };

  // Function to clear all reports from local storage and state
  const clearReports = () => {
    const confirmClear = window.confirm('Are you sure you want to clear all reports?');
    if (confirmClear) {
      setReports([]);
      toast.info('All reports have been cleared.');
    }
  };

  return (
    <>
      {/* Button to handle starting and stopping the recording */}
      <ReportButton onReport={handleReport} isRecording={isRecording} />
      {isRecording && (
        <div style={recordingStyle}>
          <p>Recording... Click the Report button again to stop.</p>
        </div>
      )}
      {/* Display Reports */}
      <div style={reportsContainerStyle}>
        <h2>Recent Reports</h2>
        {reports.length === 0 ? (
          <p>No reports yet.</p>
        ) : (
          <ul style={reportsListStyle}>
            {reports.map((report) => (
              <li key={report.id} style={reportItemStyle}>
                <div style={reportCardStyle}>
                  <strong>{new Date(report.timestamp).toLocaleString()}</strong>
                  <p>{report.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {reports.length > 0 && (
          <button onClick={clearReports} style={clearButtonStyle}>
            Clear All Reports
          </button>
        )}
      </div>
    </>
  );
};

// Inline styles for simplicity
const recordingStyle = {
  position: 'fixed',
  bottom: '150px', // Adjusted to move it above the button
  right: '20px', // Keep it aligned to the right
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: '#fff',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  zIndex: 2000, // Ensure it's behind the button but above most other elements
};

const reportsContainerStyle = {
  position: 'fixed', // Use fixed positioning to ensure it's always in the same place
  bottom: '20px', // Position it 20px from the bottom
  left: '20px', // Position it 20px from the left
  width: '300px', // Fixed width for the report container
  maxHeight: '70vh', // Adjust the max-height to 70% of the viewport height
  backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent background
  padding: '20px', // Padding for content inside the report
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Add shadow for visual effect
  borderRadius: '8px', // Rounded corners
  zIndex: 3000, // Ensure it's on top of other elements, including the map
  overflowY: 'auto', // Add scrolling if content exceeds the max height
};

const reportsListStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const reportItemStyle = {
  marginBottom: '10px',
};

const reportCardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const clearButtonStyle = {
  marginTop: '10px',
  padding: '8px 16px',
  fontSize: '14px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

export default ReportFeature;
