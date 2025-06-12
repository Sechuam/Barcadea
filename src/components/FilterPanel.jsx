import { motion } from 'framer-motion'

const games = ['Dardos', 'Futbolín', 'Billar', 'Recreativas', 'Juegos de mesa']

function FilterPanel({ filters, setFilters }) {
  const handleGameChange = (game) => {
    setFilters((prev) => ({
      ...prev,
      games: prev.games.includes(game)
        ? prev.games.filter((g) => g !== game)
        : [...prev.games, game],
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <h2 className="text-xl font-bold text-text mb-4">🎲 Filtrar por juegos</h2>
      <div className="space-y-2">
        {games.map((game) => (
          <motion.label
            key={game}
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="checkbox"
              checked={filters.games.includes(game)}
              onChange={() => handleGameChange(game)}
              className="h-4 w-4 text-primary focus:ring-accent rounded"
            />
            <span className="text-text">{game}</span>
          </motion.label>
        ))}
      </div>
    </motion.div>
  )
}

export default FilterPanel