// src/components/DataUploader.js
import React, { useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure the correct path to firebase.js
import { generateCityIncidents } from '../utils/dataGeneration'; // Import data generation script

const DataUploader = () => {
  // Function to upload incidents to Firebase
  const uploadDataToFirebase = async () => {
    // Define coordinate pairs for El Paso (start and end points)
   const elPasoCoordinates = [
      [[31.7758889, -106.5021667], [31.7756111, -106.5019444]],
      [[31.7760000, -106.5022000], [31.7765000, -106.5023000]],
      [[31.7686944, -106.4894722], [31.7672222, -106.4918611]],
      [[31.7888889, -106.5195000], [31.7805000, -106.5178333]],
      [[31.8336667, -106.5681111], [31.8273333, -106.5615556]],
      [[31.8431944, -106.5442778], [31.8431944, -106.5358056]],
      [[31.8190833, -106.4658611], [31.8128611, -106.4658611]],
      [[31.8831667, -106.5816111], [31.8844167, -106.5743333]]
    ];

    // Define coordinate pairs for Las Vegas (start and end points)
     const lasVegasCoordinates = [
      [[36.218515, -115.327302], [36.218515, -115.063721]],
      [[36.255032, -115.247298], [36.180479, -115.177836]],
      [[36.254032, -115.247298], [36.177976, -115.245437]],
      [[36.158950, -115.348389], [36.158950, -115.115817]],
      [[36.158950, -115.244197], [36.115876, -115.244197]],
      [[36.115876, -115.244197], [36.114874, -115.066822]],
      [[36.057991, -115.181928], [36.130478, -115.180297]],
      [[36.195900, -115.242248], [36.195900, -115.204758]],
      [[36.217805, -115.242248], [36.181084, -115.242506]],
      [[36.216970, -115.234233], [36.175032, -115.233198]],
      [[36.279754, -115.189618], [36.218098, -115.188518]],
      [[36.282414, -115.172017], [36.203009, -115.170367]],
      [[36.177707, -115.161567], [36.276650, -115.165967]],
      [[36.240282, -115.231419], [36.240726, -115.074663]],
      [[36.188805, -115.017461], [36.188361, -115.135166]],
      [[36.167051, -115.027361], [36.165719, -115.094464]],
      [[36.155411, -115.280789], [36.075604, -115.279640]]
    ];

    // Define coordinate pairs for Phoenix (start and end points)
    const phoenixCoordinates = [
      [[33.669768, -112.114297], [33.430462, -112.108515]],
      [[33.667362, -112.225107], [33.671372, -111.972652]],
      [[33.671372, -111.972652], [33.647311, -111.893639]],
      [[33.647311, -111.893639], [33.565454, -111.889785]],
      [[33.439307, -111.891712], [33.510037, -111.889785]],
      [[33.429658, -112.039138], [33.560637, -112.037211]],
      [[33.457799, -112.090208], [33.591946, -112.249197]],
      [[33.466641, -112.219326], [33.667362, -112.222217]],
      [[33.665759, -112.169220], [33.391854, -112.169220]],
      [[33.523694, -112.267505], [33.523694, -112.043956]],
      [[33.668164, -112.067082], [33.464230, -112.065155]],
      [[33.599170, -111.890749], [33.596762, -112.008304]],
      [[33.509233, -112.109479], [33.509233, -112.045883]],
      [[33.479501, -111.976506], [33.478698, -112.305084]]
    ];

    // Generate incidents for El Paso with interpolated coordinates (30 incidents per segment)
    const elPasoIncidents = generateCityIncidents('El Paso', elPasoCoordinates, 30);

    // Generate incidents for Las Vegas with interpolated coordinates (30 incidents per segment)
    const lasVegasIncidents = generateCityIncidents('Las Vegas', lasVegasCoordinates, 30);

    // Generate incidents for Phoenix with interpolated coordinates (30 incidents per segment)
    const phoenixIncidents = generateCityIncidents('Phoenix', phoenixCoordinates, 30);

    // Combine all incidents into one array
    const allIncidents = [...elPasoIncidents, ...lasVegasIncidents, ...phoenixIncidents];

    try {
      // Loop through each incident and upload it to Firestore
      for (const incident of allIncidents) {
        await addDoc(collection(db, "drunkDrivingIncidents"), {
          city: incident.city,
          latitude: incident.latitude,
          longitude: incident.longitude,
          severity: incident.severity,
          date: incident.date
        });
      }
      console.log("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data: ", error);
    }
  };

  // Use useEffect to automatically upload data on component mount
  useEffect(() => {
    uploadDataToFirebase();
  }, []);

  return (
    <div>
    {/* <h2>Uploading Data to Firebase...</h2>*/ } 
    </div>
  );
};

export default DataUploader;
