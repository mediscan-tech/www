"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from '@/components/pin';
import ControlPanel from '@/components/controlPanel';
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl
  } from 'react-map-gl';

export default function MapDisplayPage() {
  const [location, setLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  const [hData, setHData] = useState(null);
  const [startLatitude, setStartLatitude] = useState(null);
  const [startLongitude, setStartLongitude] = useState(null);
  const key = "pk.eyJ1IjoiZGV2ZWxpdGUiLCJhIjoiY2xucXc5bzk4MHZyNDJqbXI1aHo5eW9yYiJ9.YCgBgtStC9HbxWK02W3QaA" //Okay to reveal as it is restricted to only our domain

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

  const [popupInfo, setPopupInfo] = useState(null)

  const markers = useMemo(() => { //TODO: maybe draw a 15m radius (slightly)
    if (hData && hData.data) {
      return hData.data.formattedData.results.map((result, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={ result.hospital_longitude }
          latitude={ result.hospital_latitude }
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(result);
          }}
        >
          <Pin />
        </Marker>
      ));
    }
    return [];
  }, [hData]);

  return (
    <div>
      {location ? (
        <div>
          <Map
            mapboxAccessToken = {key}
            initialViewState = {{
              longitude: startLongitude,
              latitude: startLatitude,
              zoom: 10
            }}
            style = {{width: 1200, height: 900}}
            mapStyle = "mapbox://styles/mapbox/streets-v9"
            doubleClickZoom ={true}
            >
            <Marker longitude={startLongitude} latitude={startLatitude} anchor="bottom">
              <Image src="./my-location.svg" alt="Current Location" width="24" height="24"/>
            </Marker>
            {/* <GeolocateControl position="top-left"/> */}
            <FullscreenControl position="top-left"/>
            <NavigationControl position="top-left"/>
            <ScaleControl position="bottom-left" unit="imperial"/>
          
            { markers }

            {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.hospital_longitude)}
              latitude={Number(popupInfo.hospital_latitude)}
              onClose={() => setPopupInfo(null)}
            >
            <div>
              {popupInfo.facility_name}
              <br/>
              Phone #: {popupInfo.telephone_number}
              <br/>
              Average Wait Time: <strong>{popupInfo.score}</strong> minutes
            </div>

          </Popup>
          )}
          </Map>
          <ControlPanel/>
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
      ) : ( // Before location is found this is rendered
        <div>Skeleton</div> //TODO: SKELETON HERE
      )}
    </div> 
  );
};

export function renderToDom(container) {
  createRoot(container).render(<MapDisplayPage/>);
}