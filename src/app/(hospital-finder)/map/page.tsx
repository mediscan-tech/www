"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl
  } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapDisplayPage() {
  const [location, setLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  const [hData, setHData] = useState(null);
  const [startLatitude, setStartLatitude] = useState(null);
  const [startLongitude, setStartLongitude] = useState(null);
  const key = "pk.eyJ1IjoiZGV2ZWxpdGUiLCJhIjoiY2xucXdobnBiMHhwbTJrbXJ5dTJrNDdjOCJ9.XA-EL1LHn_Fq0K6limdpqQ" //Okay to reveal as it is restricted to our domain

  useEffect(() => {
    //Check device
    const userAgent = window.navigator.userAgent;
    const mobile = /mobile/i.test(userAgent);
    setIsMobile(mobile);

    //Grab location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const requestData = {
            latitude: latitude,
            longitude: longitude,
          };
          
          // Find nearest zipcodes and get back hospital data
          const response = await fetch('/api/map/getHospitalData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (response.ok) {
            const hData = await response.json();
            setHData(hData)
            console.log(hData)
            if (hData && hData.data) {
              const startLat = hData.data.formattedData.startLatitude;
              const startLng = hData.data.formattedData.startLongitude;
      
              setStartLatitude(startLat);
              setStartLongitude(startLng);
            } else {
              console.error("hData is null or undefined.");
            }

            setLocation({ latitude, longitude });
            setError(null);
          } else {
            setError(new Error('Failed to fetch ZIP code from the server.'));
          }

          setLocation({ latitude, longitude });
          setError(null);
        },
        (err) => {
          setError(err);
        }
      );
    } else {
      setError(new Error('Geolocation is not available in your browser.'));
    }
  }, []);

  return (
    <div>
      {location ? (
        <div>
          <Map
                mapboxAccessToken = {key}
                initialViewState = {{
                    longitude: startLongitude,
                    latitude: startLatitude,
                    zoom: 14
                }}
                style = {{width: 1200, height: 900}}
                mapStyle = "mapbox://styles/mapbox/streets-v9"
            />
        </div>
      ) : error && !isMobile ? (
        <div>
          <p>Error: {error.message}</p>
          <p>
            To retry, please refresh the page and grant location access when
            prompted.
          </p>
        </div>
      ) : error && isMobile ? (
        <div>
          <p>Error: {error.message}</p>
          <p>
            Enable location access: Visit Settings &gt; Find Your Browser &gt; Location, Enable while using app, and refresh our page for full functionality.
          </p>
        </div>
      ) : (
        <p>Fetching your location...</p>
      )}
    </div>
  );
};