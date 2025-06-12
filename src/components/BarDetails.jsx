import { FaBullseye, FaTable, FaGamepad, FaChessBoard } from 'react-icons/fa'
import { motion } from 'framer-motion'

const gameIcons = {
  Dardos: <FaBullseye className="inline-block mr-1 text-primary text-lg" />,
  Futbolín: <FaTable className="inline-block mr-1 text-primary text-lg" />,
  Billar: <FaGamepad className="inline-block mr-1 text-primary text-lg" />,
  Recreativas: <FaGamepad className="inline-block mr-1 text-primary text-lg" />,
  'Juegos de mesa': <FaChessBoard className="inline-block mr-1 text-primary text-lg" />,
}

function BarDetails({ bar, searchQuery }) {
  const highlightText = (text, query) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      {bar.image && (
        <img
          src={bar.image}
          alt={bar.name}
          className="w-full h-48 object-cover rounded-t-xl mb-4"
        />
      )}
      <h2
        className="text-2xl font-bold text-text mb-2"
        dangerouslySetInnerHTML={{ __html: highlightText(bar.name, searchQuery) }}
      />
      <div className="flex items-center space-x-4 mb-4">
        <p className="text-text">⭐ {bar.rating}/5</p>
        <p
          className="text-text flex items-center"
          dangerouslySetInnerHTML={{
            __html: `<span class="inline-flex items-center"><svg class="mr-1 text-primary" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8zm0 2a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6zm0 2a1 1 0 0 1 1 1v3h2a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/></svg>${highlightText(
              bar.location,
              searchQuery
            )}${bar.distance ? ` (~${bar.distance.toFixed(1)} km)` : ''}</span>`,
          }}
        />
      </div>
      <p className="text-text mb-4">
        <strong>Juegos:</strong>{' '}
        {bar.games.map((game) => (
          <span
            key={game}
            className="inline-flex items-center mr-2"
            dangerouslySetInnerHTML={{ __html: `${gameIcons[game]} ${highlightText(game, searchQuery)}` }}
          />
        ))}
      </p>
      <div className="mb-4">
        <h3 className="font-semibold text-text">📅 Eventos</h3>
        {bar.events.length > 0 ? (
          <ul className="list-disc pl-5 text-text">
            {bar.events.map((event, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: highlightText(event, searchQuery) }} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay eventos programados.</p>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-text">💬 Reseñas</h3>
        {bar.reviews.length > 0 ? (
          bar.reviews.map((review, idx) => (
            <div key={idx} className="border-t pt-2 mt-2 text-text">
              <p>
                <strong>{review.user}</strong>: {review.text} (⭐ {review.rating})
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay reseñas aún.</p>
        )}
      </div>
    </motion.div>
  )
}

export default BarDetails