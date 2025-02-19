import { useState } from 'react'

function SearchInput() {
  const [query, setQuery] = useState('')

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        placeholder="Ask me anything..."
      />
    </div>
  )
}

export default SearchInput 