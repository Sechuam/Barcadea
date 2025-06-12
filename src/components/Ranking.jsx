function Ranking({ bars }) {
    const sortedBars = [...bars].sort((a, b) => (a.distance && b.distance ? a.distance - b.distance : b.rating - a.rating))
  
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-text mb-4">🏆 Los bares más jugones</h2>
        <ol className="space-y-2 text-text">
          {sortedBars.map((bar) => (
            <li key={bar.id} className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>
                {bar.name} ({bar.location})
              </span>
              <span className="flex items-center">
                ⭐ {bar.rating}
                {bar.distance ? ` (~${bar.distance.toFixed(1)} km)` : ''}
              </span>
            </li>
          ))}
        </ol>
      </div>
    )
  }
  
  export default Ranking