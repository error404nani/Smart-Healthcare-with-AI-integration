'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'

// Fix for default marker icons in Leaflet
const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
const customIcon = L.divIcon({
  html: iconHTML,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
})

interface Facility {
  _id?: string
  name: string
  address: string
  lat: number
  lng: number
  type: string
}

interface MapProps {
  facilities: Facility[]
  onMapClick?: (lat: number, lng: number) => void
  center?: [number, number]
  zoom?: number
}

function LocationMarker({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null)
  
  useMapEvents({
    click(e) {
      if (onMapClick) {
        setPosition(e.latlng)
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>New Location Selected</Popup>
    </Marker>
  )
}

export default function AdminMap({ facilities, onMapClick, center = [40.7128, -74.0060], zoom = 13 }: MapProps) {
  useEffect(() => {
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/'
  }, [])

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border z-0 relative shadow-inner">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {facilities
          .filter((f) => f?.lat !== undefined && f?.lng !== undefined)
          .map((fac) => (
          <Marker 
            key={fac._id?.toString()} 
            position={[fac.lat, fac.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-sm mb-1">{fac.name}</h3>
                <p className="text-xs text-muted-foreground mb-1">{fac.address}</p>
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">
                  {fac.type}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationMarker onMapClick={onMapClick} />
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border shadow-sm text-[10px] font-medium text-muted-foreground pointer-events-none">
        Click anywhere on the map to set coordinates for a new facility
      </div>
    </div>
  )
}
