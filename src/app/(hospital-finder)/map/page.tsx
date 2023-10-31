"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from '@/components/pin';
import { Skeleton } from "@/components/ui/skeleton";
import ControlPanel from '@/components/controlPanel';
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from 'react-map-gl';

export default function MapDisplayPage() {
  const [location, setLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  const [hData, setHData] = useState(null);
  const [startLatitude, setStartLatitude] = useState(null);
  const [startLongitude, setStartLongitude] = useState(null);
  const key = "pk.eyJ1IjoiZGV2ZWxpdGUiLCJhIjoiY2xucjJqMzN2MG8wOTJrbzE3MTlqMzlyNyJ9.jmFookpSLQ1vKGoMeLRX6g"; // Okay to reveal as it is restricted to only our domain

  useEffect(() => {
    // Check device
    const userAgent = window.navigator.userAgent;
    const mobile = /mobile/i.test(userAgent);
    setIsMobile(mobile);

    // Grab location
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

          setError(null);

          if (response.ok) {
            const hData = await response.json();
            setHData(hData);
            if (hData && hData.data) {
              const startLat = hData.data.formattedData.startLatitude;
              const startLng = hData.data.formattedData.startLongitude;
              setStartLatitude(startLat);
              setStartLongitude(startLng);
            } else {
              setError(JSON.stringify({ msg: 'hData is null or undefined.' }));
            }
            setLocation({ latitude, longitude });
          } else if (!response.ok) {
            const errorData = await response.json();
            setError(errorData);
          }
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError(JSON.stringify({ msg: err }));
        }
      );
    } else {
      setError(JSON.stringify({ msg: 'Geolocation is not available in your browser.' }));
    }
  }, []);

  const [popupInfo, setPopupInfo] = useState(null);

  const markers = useMemo(() => {
    if (hData && hData.data) {
      return hData.data.formattedData.results.map((result, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={result.hospital_longitude}
          latitude={result.hospital_latitude}
          anchor="bottom"
          onClick={(e) => {
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
    <div className="map-display-container">
      <div className="map-container">
        {location ? (
          <>
            <div id="map" className="map" style={{ border: '5px solid #FFF', borderRadius: '10px' }}>
              {error && <div className='errorClass' style={{ color: 'red' }}>{error.msg} {JSON.stringify(error.data)}</div>}
              <Map
                mapboxAccessToken={key}
                initialViewState={{
                  longitude: startLongitude,
                  latitude: startLatitude,
                  zoom: isMobile ? 8 : 10, // Adjust zoom level for mobile
                }}
                style={{
                  width: isMobile ? '100%' : '1200px', // Make the map width responsive
                  height: isMobile ? '300px' : '900px', // Adjust map height for mobile
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                doubleClickZoom={true}
              >
                <FullscreenControl position="top-right"/>
                <NavigationControl position="top-right"/>
                <ScaleControl position="bottom-left" unit="imperial"/>
                
                <Marker longitude={startLongitude} latitude={startLatitude} anchor="bottom">
                  <Image src="./my-location.svg" alt="Current Location" width="24" height="24" />
                </Marker>
                {markers}
                {popupInfo && (
                  <Popup
                    anchor="top"
                    longitude={Number(popupInfo.hospital_longitude)}
                    latitude={Number(popupInfo.hospital_latitude)}
                    onClose={() => setPopupInfo(null)}
                  >
                    <style>
                      {`
                      .mapboxgl-popup-content {
                        background-color: #141414;
                        color: white;
                      }
                    `}
                    </style>
                    <div>
                      {popupInfo.facility_name}
                      <br />
                      Phone #: {popupInfo.telephone_number}
                      <br />
                      Average Wait Time: <strong>{popupInfo.score}</strong> minutes
                    </div>
                  </Popup>
                )}
              </Map>
            </div>
          </>
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
          <Skeleton /> // TODO: SKELE HERE
        )}
      </div>
      
      <div className="data-container">
        {hData && hData.data && hData.data.formattedData && hData.data.formattedData.results ? (
          <DataTable columns={columns} data={hData.data.formattedData.results} />
        ) : (
          <p>No data available</p> //TODO: SKELE HERE
        )}
      </div>

    </div>
  );
}