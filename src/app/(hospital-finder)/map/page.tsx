"use client";

import React, { useState, useEffect } from 'react';

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [zipCode, setZip] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const requestData = {
            latitude: latitude,
            longitude: longitude,
          };

          const response = await fetch('/api/map/getZipCode', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (response.ok) {
            const data = await response.json();
            setZip(data.zipCode);
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
          <p>Your ZIP code: {zipCode}</p>
        </div>
      ) : error ? (
        <div>
          <p>Error: {error.message}</p>
          <p>
            To retry, please refresh the page and grant location access when
            prompted.
          </p>
        </div>
      ) : (
        <p>Fetching your location...</p>
      )}
    </div>
  );
};

export default LocationComponent;