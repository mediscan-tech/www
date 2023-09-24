"use client";

import React, { useState, useEffect } from 'react';

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

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
            console.log(hData.data)
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
          <p>Your latitude: {location.latitude}</p>
          <p>Your longitude: {location.longitude}</p>
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

export default LocationComponent;