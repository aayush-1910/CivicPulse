import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const customPinIcon = L.divIcon({
  className: 'custom-leaflet-pin',
  html: `
    <div style="transform: translate(-50%, -100%);">
      <div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
        <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

interface Props {
  latitude: number;
  longitude: number;
  address?: string;
}

export const LocationViewMap: React.FC<Props> = ({ latitude, longitude, address }) => {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner h-56 w-full relative">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customPinIcon}>
          {address && <Popup>{address}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
};
