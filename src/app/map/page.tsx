"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "@/components/pin";
// import { Skeleton } from "@/components/ui/skeleton";
// import { DataTable } from "@/components/table/data-table";
// import { columns } from "@/components/table/columns";
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
import ParticleSwarmLoaderBigMap from "@/components/ui/particle-swarm-loader-big-for-map";

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
          <div className="absolute z-10 h-screen items-center space-y-2 p-4 pt-[96px]">
            <CardSkeleton className="flex justify-between border border-bg-extralight bg-bg-light px-4 py-2">
              <button
                onClick={() => setHospial(hospital <= 0 ? 0 : hospital - 1)}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <strong className="flex items-center justify-center text-text-light">
                Hospital Wait Times
              </strong>
              <button
                onClick={() =>
                  setHospial(
                    hData.data.formattedData.results[hospital + 1] == null
                      ? hospital
                      : hospital + 1
                  )
                }
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </CardSkeleton>
            {hData &&
              hData.data &&
              hData.data.formattedData &&
              hData.data.formattedData.results ? (
              <CardSkeleton className="flex w-96 items-center border border-bg-extralight bg-bg-light/90 p-4">
                <div className="mr-4 flex aspect-square h-16 flex-col items-center justify-center rounded-full border border-primary bg-primary/10 font-mont">
                  <p className=" flex h-4 translate-y-2.5 items-center justify-center text-3xl text-text-light">
                    {hData.data.formattedData.results[hospital].score !=
                      "Not Available"
                      ? hData.data.formattedData.results[hospital].score
                      : "-"}
                  </p>
                  <p className=" flex h-5 translate-y-2.5 items-center justify-center text-xs text-text-light">
                    min.
                  </p>
                </div>
                <div>
                  <strong className="text-lg text-text-light">
                    {hData.data.formattedData.results[hospital].facility_name}
                  </strong>
                  <p className="text-sm text-text ">
                    {
                      hData.data.formattedData.results[hospital]
                        .formattedAddress
                    }
                  </p>
                  <a target="_blank" href={hData.data.formattedData.results[hospital].directions} className="px-12 w-fit flex items-center justify-center border border-primary/80 bg-primary/10 rounded-lg py-1 text-xs mt-2">Get Directions</a>
                </div>
              </CardSkeleton>
            ) : (
              <div></div>
            )}
          </div>
          <div id="map" className="map h-screen w-screen">
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
            height: "calc(100vh - 40px)", // Adjust this if you have a header or footer
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ textAlign: "center" }}>Error {error.message}</p>
          <p style={{ textAlign: "center" }}>
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
            height: "calc(100vh - 100px)", // Adjust this if you have a header or footer
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ textAlign: "center" }}>Error {error.message}</p>
          <p style={{ textAlign: "center" }}>
            Enable location access: Visit Settings &gt; Find Your Browser &gt;
            Location, Enable while using app, and refresh our page for full
            functionality.
          </p>
        </div>
      ) : (
        <div>
          {/* <Skeleton className="relative w-full h-full">
            <div className="animate-stripes absolute left-0 top-0 h-full w-full bg-gradient-to-r from-[#e6e8e6] via-[#f0f2f0] to-[#e6e8e6]"></div>
          </Skeleton> */}
          <ParticleSwarmLoaderBigMap />
        </div>
      )}
    </div>
  );
}
