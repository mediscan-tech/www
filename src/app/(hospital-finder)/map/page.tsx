"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import Pin from '@/components/pin';
import { Skeleton } from "@/components/ui/skeleton";
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
  const key = "pk.eyJ1IjoiZGV2ZWxpdGUyIiwiYSI6ImNtMXU2Z3QzbjA5bDAyam9xY3o4M2xsZmwifQ.uwe5Mp4i2RyNnaa832At9A"; // Okay to reveal as it is restricted to only our domain

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

  if (error) { //The mobile menu button blends into background when there is an error
    const svgElement = document.getElementById('mobile-menu');
    if (svgElement) {
      // Update the className
      svgElement.setAttribute('class', 'w-6 h-6 fill-current text-[#FFF]');
    }
  }

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
                  width: isMobile ? '100%' : '1000px', // Make the map width responsive
                  height: isMobile ? '300px' : '800px', //Adjust map height for mobile
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                doubleClickZoom={true}
              >
                <FullscreenControl position="bottom-right"/>
                <NavigationControl position="bottom-right"/>
                <ScaleControl position="bottom-left" unit="imperial"/>
                
                <Marker longitude={startLongitude} latitude={startLatitude} anchor="bottom">
                  <Image src={"/images/my-location.png"} alt="Current Location" width="24" height="24" />
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
                      Phone #: <a style={{ outline: 'none', userSelect: 'none' }} href={`tel:${popupInfo.telephone_number}`}><u>{popupInfo.telephone_number}</u></a>
                      <br />
                      Average Wait Time: <u><strong>{popupInfo.score}</strong></u> minutes
                    </div>
                  </Popup>
                )}
              </Map>
            </div>
          </>
        ) : error && !isMobile ? ( //not on mobile
          <div style={{
            marginTop: '40px',
            marginLeft: '30px',
            marginRight: '30px',
          }}>
            <p>Error {error.message}</p>
            <p>
              To retry, please refresh the page and grant location access when
              prompted.
            </p>
          </div>
        ) : error && isMobile ? ( //on mobile
          <div style={{
            marginTop: '100px',
            marginLeft: '30px',
            marginRight: '30px',
          }}>
            <p>Error {error.message}</p>
            <p>
              Enable location access: Visit Settings &gt; Find Your Browser &gt; Location, Enable while using app, and refresh our page for full functionality.
            </p>
          </div>
        ) : (
          <div
            style={{
              width: isMobile ? '100%' : '1000px',
              height: isMobile ? '300px' : '800px',
              border: '5px solid #FFF',
              borderRadius: '10px',
            }}
          >
            <Skeleton className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#e6e8e6] via-[#f0f2f0] to-[#e6e8e6] animate-stripes"></div>
            </Skeleton>
          </div>
        )}
      </div>
        
      {/* Data Table */}
      <div className="data-container">
        {!error ? (
          hData && hData.data && hData.data.formattedData && hData.data.formattedData.results ? (
            <DataTable columns={columns} data={hData.data.formattedData.results} />
          ) : (
            <div>
              {/* Skeleton UI for loading data */}
              <div className="flex items-center py-6">
                <Skeleton className="w-3/4 h-8 mx-auto" />
              </div>
              <div className="border rounded-md">
                <div className="p-6 skeleton-table">
                  {/* Table Header Skeleton */}
                  <div className="flex skeleton-table-row">
                    <Skeleton className="w-1/4 h-10" />
                    <Skeleton className="w-1/4 h-10" />
                    <Skeleton className="w-1/4 h-10" />
                    <Skeleton className="w-1/4 h-10" />
                  </div>

                  {/* Table Body Skeleton with four columns in each row */}
                  {[...Array(6)].map((_, rowIndex) => (
                    <div className="flex skeleton-table-row" key={rowIndex}>
                      <div className="w-1/4 h-10">
                        <Skeleton className="w-full h-8 mb-4" />
                      </div>
                      <div className="w-1/4 h-10">
                        <Skeleton className="w-full h-8 mb-4" />
                      </div>
                      <div className="w-1/4 h-10">
                        <Skeleton className="w-full h-8 mb-4 " />
                      </div>
                      <div className="w-1/4 h-10">
                        <Skeleton className="w-full h-8 mb-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Controls Skeleton with increased padding */}
              <div className="flex items-center justify-end py-6 space-x-2">
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-16 h-8" />
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}