import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function MapComponent({ bars, selectedBar, setSelectedBar, userLocation }) {
  const mapRef = useRef(null)
  const markersRef = useRef([])

  // Íconos personalizados para juegos
  const gameIcons = {
    Dardos: L.divIcon({
      html: '🎯',
      className: 'text-2xl',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
    Futbolín: L.divIcon({
      html: '⚽',
      className: 'text-2xl',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
    Billar: L.divIcon({
      html: '🎱',
      className: 'text-2xl',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
    Recreativas: L.divIcon({
      html: '🕹️',
      className: 'text-2xl',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
    'Juegos de mesa': L.divIcon({
      html: '♟️',
      className: 'text-2xl',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    }),
  }

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([37.39, -5.99], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current)
    }

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Añadir marcadores para bares
    bars.forEach((bar) => {
      const icon = gameIcons[bar.games[0]] || L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
      const marker = L.marker([bar.lat, bar.lng], { icon })
        .addTo(mapRef.current)
        .bindPopup(
          `<b>${bar.name}</b><br>${bar.location}<br>${bar.games.join(', ')}<br>⭐ ${bar.rating}`
        )
      marker.on('click', () => setSelectedBar(bar))
      markersRef.current.push(marker)
    })

    // Añadir marcador de ubicación del usuario
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          html: '<div class="user-location bg-blue-500 w-4 h-4 rounded-full"></div>',
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      })
        .addTo(mapRef.current)
        .bindPopup('Tu ubicación')
    }

    // Centrar el mapa en la ubicación del usuario o en Sevilla
    if (userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 13)
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
    }
  }, [bars, userLocation, setSelectedBar])

  return <div id="map" className="rounded-xl shadow-md"></div>
}

export default MapComponent