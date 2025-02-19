import SearchInput from '../components/SearchInput'
import Layout from '@/components/layout/Layout'

function HomePage() {
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        <div className="w-full max-w-3xl text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            What would you like to learn?
          </h1>
          <SearchInput />
        </div>
      </main>
    </Layout>
  )
}

export default HomePage 