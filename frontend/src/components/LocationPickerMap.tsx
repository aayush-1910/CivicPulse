import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Custom SVG marker icon to prevent Vite asset path issues
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
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<{
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}> = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position} icon={customPinIcon} />;
};

export const LocationPickerMap: React.FC<Props> = ({ latitude, longitude, onChange }) => {
  const defaultPos: [number, number] = [12.9716, 77.5946]; // Default center
  const currentPos: [number, number] | null = latitude !== undefined && longitude !== undefined ? [latitude, longitude] : null;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-300 shadow-inner h-64 w-full relative">
      <MapContainer
        center={currentPos || defaultPos}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={currentPos}
          setPosition={(pos) => onChange(pos[0], pos[1])}
        />
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-20 bg-white/95 px-2.5 py-1 rounded text-[11px] font-medium text-slate-700 shadow-xs pointer-events-none">
        {currentPos ? `Selected: ${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : 'Click the map to choose a location'}
      </div>
    </div>
  );
};
