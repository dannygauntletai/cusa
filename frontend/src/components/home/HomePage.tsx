import SearchInput from './SearchInput'

function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            What would you like to learn?
          </h1>
          <SearchInput />
        </div>
      </main>
    </div>
  )
}

export default HomePage 