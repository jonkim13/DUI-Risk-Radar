# DUI Risk Heatmap

## Description

DUI Risk Heatmap is a web application designed to visualize DUI risk areas using a heatmap overlay on a Google Map. Users can report incidents, and the application tracks and displays high-risk zones based on user-generated data. The app leverages Google Maps API and Firebase for data storage and retrieval.

## Features

- **User-Friendly Map Interactions**
- **Interactive DUI Reporting**
- **Real-Time Heatmap Visualization**
- **High-Risk Zone Identification**

## Technologies Used

- **React**: Frontend framework for building user interfaces.
- **Google Maps API**: For rendering the map and heatmap functionalities.
- **Firebase**: For storing user reports and incident data.
- **Axios**: For handling HTTP requests to the backend for audio transcription.
- **CSS**: For styling the application.

## Clone GitHub

```bash
 https://github.com/ascarola17/DUI.git
```

## Dependencies
Make sure Node.js and npm are installed. You can download and install them from [nodejs.org](https://nodejs.org/).

To set up this project locally, follow these steps:

1. Install dependenies:

   ```bash
     npm install
     npm install axios
     npm install express cors multer axios
     npm install react-toastify
     npm install firebase
     npm install @react-google-maps/api

2. Create your .env file in the root of the project and add your Google API key:

   ```makefile
     REACT_APP_GOOGLE_MAPS_API_KEY = your_google_maps_api_key
   
3. In your first terminal you will CD into the backend and run the command to start the backend

   ```bash
     cd backend
     npm node server.js
   
4. Then you will make a second terminal and CD into the frontend and start the development server with the command:

   ```bash
     cd frontend
     npm start

### Google Maps Platform API & Cloud Speech-to-Text API Help
This is a small tutorial regarding how to use the API key with the Google Vision API.
* Visit [console.cloud.google.com](https://console.cloud.google.com/welcome/ )
* Create a new project by selecting "Select a project".
* Ensure your project is selected before developing.
* At the search bar type in "Google Maps Platform" and click "Enable".
* Do the same for the "Cloud Speech-to-Text" and click "Enable".
* From the Navigation Menu:
  * Hover over the "APIs & Services" tab.
  * Click on "Credentials.
  * Click "+ Create Credentials".
  * Select API key and within the restrictions enable both Google Maps Platform and Cloud Speech-to-Text

## About Us

Sun City Solutions - suncitysolutions2024@gmail.com

[https://github.com/ascarola17/DUI](https://github.com/ascarola17/DUI)

