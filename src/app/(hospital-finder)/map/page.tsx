"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from '@/components/pin';
import ControlPanel from '@/components/controlPanel';
import { DataTable } from "@/components/table/data-table"
import { columns } from "@/components/table/columns";
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
  const key = "pk.eyJ1IjoiZGV2ZWxpdGUiLCJhIjoiY2xucjJqMzN2MG8wOTJrbzE3MTlqMzlyNyJ9.jmFookpSLQ1vKGoMeLRX6g" //Okay to reveal as it is restricted to only our domain

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

          setError(null);

          if (response.ok) {
            const hData = await response.json();
            setHData(hData)
            if (hData && hData.data) {
              const startLat = hData.data.formattedData.startLatitude;
              const startLng = hData.data.formattedData.startLongitude;
              setStartLatitude(startLat);
              setStartLongitude(startLng);
            } else {
              setError(JSON.stringify({msg: 'hData is null or undefined.'}))
            }
            setLocation({ latitude, longitude });
          } else if (!response.ok) {
            const errorData = await response.json()
            setError(errorData);
          }
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError(JSON.stringify({msg: err}))
        }
      );
    } else {
      setError(JSON.stringify({msg: 'Geolocation is not available in your browser.'}))
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
          <Pin/>
        </Marker>
      ));
    }
    return [];
  }, [hData]);
  return (
    <div style={{ marginLeft: '0', marginRight: '0', width: '100%', padding: '0' }}>
      {location ? (
        <>
          <div>
            {error && <div className='errorClass' style={{ color: 'red' }}>{error.msg} {JSON.stringify(error.data)}</div>}
            <Map
              mapboxAccessToken = {key}
              initialViewState = {{
                longitude: startLongitude,
                latitude: startLatitude,
                zoom: 10
              }}
              style = {{
                width: 900,
                height: 750,
                border: '5px solid #FFF', // Set the desired border width and color
                borderRadius: '12px', // Optional: Add rounded corners to the border
              }}
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
          
          <div className="container py-10 mx-auto">
            <DataTable columns={columns} data={hData.data.formattedData.results}/>
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
      ) : ( // Before location is found this is rendered
        <div>Skeleton</div> //TODO: SKELETON HERE
      )}
    </div> 
  );
};