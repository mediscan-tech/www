import { useState, useMemo } from 'react';
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

export const MapComponent = ({ mapData }) => {
    const key = "pk.eyJ1IjoiZGV2ZWxpdGUiLCJhIjoiY2xucXJpMmw0MHlzbDJtbzI5Y3p3Yng1YiJ9.KGXznc48abtjQETNCrKdmw"
    let startLatitude = mapData.data.formattedData.startLatitude;
    let startLongitude = mapData.data.formattedData.startLongitude;
    const [popupInfo, setPopupInfo] = useState(null);


    return (
        <>
            <Map
                mapboxAccessToken = {key}
                initialViewState = {{
                    longitude: startLongitude,
                    latitude: startLatitude,
                    zoom: 14
                }}
                style = {{width: 600, height: 600}}
                mapStyle = "mapbox://styles/mapbox/streets-v9"
            />
        </>
    );
};