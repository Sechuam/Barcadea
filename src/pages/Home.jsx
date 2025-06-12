import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import FilterPanel from '../components/FilterPanel'
import MapComponent from '../components/MapComponent'
import BarDetails from '../components/BarDetails'
import Ranking from '../components/Ranking'
import barsData from '../data/bars.json'
import { FaSearch, FaTimes } from 'react-icons/fa'
import Logo from '../assets/logo.svg'

function Home() {
  const [filters, setFilters] = useState({ games: [] })
  const [selectedBar, setSelectedBar] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error)
        }
      )
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const query = searchQuery.toLowerCase()
    const uniqueSuggestions = new Set()

    barsData.forEach((bar) => {
      if (bar.name.toLowerCase().includes(query)) uniqueSuggestions.add(bar.name)
      if (bar.location.toLowerCase().includes(query)) uniqueSuggestions.add(bar.location)
      bar.games.forEach((game) => {
        if (game.toLowerCase().includes(query)) uniqueSuggestions.add(game)
      })
      bar.events.forEach((event) => {
        if (event.toLowerCase().includes(query)) uniqueSuggestions.add(event)
      })
    })

    setSuggestions([...uniqueSuggestions].slice(0, 5))
    setShowSuggestions(true)
  }, [searchQuery])

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredBars = barsData
    .filter(
      (bar) =>
        (filters.games.length === 0 || bar.games.some((game) => filters.games.includes(game))) &&
        (searchQuery === '' ||
          bar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bar.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bar.games.some((game) => game.toLowerCase().includes(searchQuery.toLowerCase())) ||
          bar.events.some((event) => event.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .map((bar) => {
      if (userLocation) {
        const R = 6371
        const dLat = ((bar.lat - userLocation.lat) * Math.PI) / 180
        const dLng = ((bar.lng - userLocation.lng) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLocation.lat * Math.PI) / 180) *
            Math.cos((bar.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c
        return { ...bar, distance }
      }
      return bar
    })
    .sort((a, b) => (a.distance && b.distance ? a.distance - b.distance : 0))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col"
    >
      {/* Encabezado */}
      <header className="bg-primary text-white py-4 shadow-md header">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src={Logo} alt="BarPlay Logo" className="h-10" />
            <p className="ml-4 text-sm md:text-base">Encuentra tu bar en Sevilla, juega y quédate</p>
          </div>
          <div className="search-container" ref={searchRef}>
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca por nombre, ubicación, juego o evento..."
                  className="search-input"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                {searchQuery && (
                  <FaTimes
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                )}
              </div>
              <button
                onClick={() => setSearchQuery(searchQuery.trim())}
                className="btn rounded-l-none"
              >
                Buscar
              </button>
            </div>
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: showSuggestions ? 1 : 0, y: showSuggestions ? 0 : -10 }}
              transition={{ duration: 0.2 }}
              className="suggestions-list"
              style={{ display: showSuggestions && suggestions.length > 0 ? 'block' : 'none' }}
            >
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestions-list-item"
                >
                  {suggestion}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <motion.main
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-grow container mx-auto p-4"
      >
        <p className="text-center text-text mb-6 font-semibold">
          {filteredBars.length} {filteredBars.length === 1 ? 'bar encontrado' : 'bares encontrados'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <FilterPanel filters={filters} setFilters={setFilters} />
            <Ranking bars={filteredBars} searchQuery={searchQuery} />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-2"
          >
            {filteredBars.length === 0 ? (
              <div className="card text-center text-text">
                <p className="mb-4">
                  {searchQuery
                    ? `No se encontraron bares que coincidan con "${searchQuery}".`
                    : 'No se encontraron bares con los juegos seleccionados.'}
                </p>
                <button
                  onClick={() => {
                    setFilters({ games: [] })
                    setSearchQuery('')
                  }}
                  className="btn"
                >
                  Limpiar filtros y búsqueda
                </button>
              </div>
            ) : (
              <div className="card">
                <MapComponent
                  bars={filteredBars}
                  selectedBar={selectedBar}
                  setSelectedBar={setSelectedBar}
                  userLocation={userLocation}
                />
              </div>
            )}
            {selectedBar && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <BarDetails bar={selectedBar} searchQuery={searchQuery} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="bg-accent text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 BarPlay. Hecho con 🍻 en Sevilla.</p>
        </div>
      </footer>
    </motion.div>
  )
}

export default Home