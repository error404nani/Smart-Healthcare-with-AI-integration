'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
const customIcon = L.divIcon({
  html: iconHTML,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
})

interface Facility {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  type?: string
}

interface MapProps {
  facilities: Facility[]
  center?: [number, number]
  zoom?: number
}

export default function Map({ facilities, center = [40.7128, -74.0060], zoom = 13 }: MapProps) {
  useEffect(() => {
    // Failsafe for Leaflet CSS loading properly
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/'
  }, [])

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border z-0 relative min-h-[400px]">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '400px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((fac) => (fac.lat && fac.lng &&
          <Marker 
            key={fac.id} 
            position={[fac.lat, fac.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 min-w-[120px]">
                <h3 className="font-bold text-sm mb-1">{fac.name}</h3>
                <p className="text-xs text-muted-foreground mb-1">{fac.address}</p>
                {fac.type && (
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded mt-1">
                    {fac.type}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
