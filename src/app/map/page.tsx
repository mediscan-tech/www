"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "@/components/pin";
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
} from "react-map-gl";
import CardSkeleton from "@/components/ui/card-skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MapDisplayPage() {
  const [location, setLocation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  const [hData, setHData] = useState(null);
  const [startLatitude, setStartLatitude] = useState(null);
  const [startLongitude, setStartLongitude] = useState(null);
  const key =
    "pk.eyJ1IjoiZGV2ZWxpdGUyIiwiYSI6ImNtMmxrNGRlZjBjeXMyam9qdzBhcmNqZjkifQ.fJisPgZbWfysfoC-WxLcSg"; // Okay to reveal as it is restricted to only our domain

  useEffect(() => {
    // Check device
    const userAgent = window.navigator.userAgent;
    const mobile = /mobile/i.test(userAgent);
    setIsMobile(mobile);

    // Grab location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const requestData = {
            latitude: latitude,
            longitude: longitude,
          };

          // Find nearest zipcodes and get back hospital data
          const response = await fetch("/api/map/getHospitalData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
              setError(JSON.stringify({ msg: "hData is null or undefined." }));
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
      setError(
        JSON.stringify({ msg: "Geolocation is not available in your browser." })
      );
    }
  }, []);

  if (error) {
    //The mobile menu button blends into background when there is an error
    const svgElement = document.getElementById("mobile-menu");
    if (svgElement) {
      // Update the className
      svgElement.setAttribute("class", "w-6 h-6 fill-current text-[#FFF]");
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

  const [hospital, setHospial] = useState(0);

  return (
    <div className="z-10">

      {location ? (
        <>
          {/* <div className="absolute w-screen h-screen bg-gradient-to-r from-bg/80 to-50% to-transparent z-10 pointer-events-none"></div> */}
          <div className="absolute h-screen p-4 pt-[96px] z-10 space-y-2 items-center">
            <CardSkeleton className="py-2 px-4 bg-bg-light border-bg-extralight border flex justify-between">
              <button onClick={() => setHospial(hospital <= 0 ? 0 : hospital - 1)}>
                <ChevronLeft className="h-8 w-8" />
              </button>
              <strong className="text-text-light flex items-center justify-center">Hospital Wait Times</strong>
              <button onClick={() => setHospial((hData.data.formattedData.results[hospital + 1] == null) ? hospital : hospital + 1)}>
                <ChevronRight className="h-8 w-8" />
              </button>
            </CardSkeleton>
            {
              hData && hData.data && hData.data.formattedData && hData.data.formattedData.results ?
                <CardSkeleton className="bg-bg-light/90 border border-bg-extralight w-96 p-4 flex items-center">
                  <div className="h-16 rounded-full aspect-square border border-primary  bg-primary/10 mr-4 flex flex-col items-center justify-center font-mont">
                    <p className=" h-4 flex items-center text-text-light justify-center text-3xl translate-y-2.5">{hData.data.formattedData.results[hospital].score != "Not Available" ? hData.data.formattedData.results[hospital].score : "-"}</p>
                    <p className=" h-5 flex items-center text-text-light justify-center text-xs translate-y-2.5">min.</p>
                  </div>
                  <div>
                    <strong className="text-lg text-text-light">{hData.data.formattedData.results[hospital].facility_name}</strong>
                    <p className="text-sm text-text ">{hData.data.formattedData.results[hospital].formattedAddress}</p>
                  </div>
                </CardSkeleton> : <div></div>
            }

          </div>
          <div
            id="map"
            className="map w-screen h-screen"
          >
            {error && (
              <div className="errorClass" style={{ color: "red" }}>
                {error.msg} {JSON.stringify(error.data)}
              </div>
            )}
            <Map
              mapboxAccessToken={key}
              initialViewState={{
                longitude: startLongitude,
                latitude: startLatitude,
                zoom: 10, // Adjust zoom level for mobile
              }}
              style={{
                width: "100vw", // Make the map width responsive
                height: "100vh", //Adjust map height for mobile
              }}
              mapStyle="mapbox://styles/mapbox/navigation-night-v1"
              doubleClickZoom={true}
            >
              <FullscreenControl position="bottom-right" />
              <NavigationControl position="bottom-right" />
              <ScaleControl position="bottom-left" unit="imperial" />

              <Marker
                longitude={startLongitude}
                latitude={startLatitude}
                anchor="bottom"
              >
                <Image
                  src={"/images/my-location.png"}
                  alt="Current Location"
                  width="24"
                  height="24"
                />
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
                    Phone #:{" "}
                    <a
                      style={{ outline: "none", userSelect: "none" }}
                      href={`tel:${popupInfo.telephone_number}`}
                    >
                      <u>{popupInfo.telephone_number}</u>
                    </a>
                    <br />
                    Average Wait Time:{" "}
                    <u>
                      <strong>{popupInfo.score}</strong>
                    </u>{" "}
                    minutes
                  </div>
                </Popup>
              )}
            </Map>
          </div>
        </>
      ) : error && !isMobile ? ( //not on mobile
        <div
          style={{
            marginTop: "40px",
            marginLeft: "30px",
            marginRight: "30px",
          }}
        >
          <p>Error {error.message}</p>
          <p>
            To retry, please refresh the page and grant location access when
            prompted.
          </p>
        </div>
      ) : error && isMobile ? ( //on mobile
        <div
          style={{
            marginTop: "100px",
            marginLeft: "30px",
            marginRight: "30px",
          }}
        >
          <p>Error {error.message}</p>
          <p>
            Enable location access: Visit Settings &gt; Find Your Browser &gt;
            Location, Enable while using app, and refresh our page for full
            functionality.
          </p>
        </div>
      ) : (
        <div
          style={{
            width: isMobile ? "100%" : "1000px",
            height: isMobile ? "300px" : "800px",
            border: "5px solid #FFF",
            borderRadius: "10px",
          }}
        >
          <Skeleton className="relative h-full w-full">
            <div className="animate-stripes absolute left-0 top-0 h-full w-full bg-gradient-to-r from-[#e6e8e6] via-[#f0f2f0] to-[#e6e8e6]"></div>
          </Skeleton>
        </div>
      )}
    </div>
  );
}
