import { useState } from 'react'
import SearchInput from '@/features/home/components/SearchInput'
import Layout from '@/components/layout/Layout'
import { GradientText } from '@/components/ui/GradientText'

const examplePrompts = [
  {
    title: "History 📚",
    prompt: "Tell me about World War II"
  },
  {
    title: "Science 🔬",
    prompt: "Explain quantum physics"
  },
  {
    title: "Math 📐",
    prompt: "Teach me calculus"
  },
  {
    title: "Literature 📖",
    prompt: "Analyze Shakespeare"
  },
  {
    title: "Geography 🌍",
    prompt: "Describe tectonic plates"
  },
  {
    title: "Technology 💻",
    prompt: "Explain blockchain"
  },
  {
    title: "Art 🎨",
    prompt: "Renaissance period"
  },
  {
    title: "Music 🎵",
    prompt: "Classical composers"
  },
  {
    title: "Biology 🧬",
    prompt: "Human anatomy"
  }
]

function HomePage() {
  const [query, setQuery] = useState('')

  return (
    <Layout>
      <main className="min-h-screen p-8 sm:p-12 flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl w-full space-y-12">
            {/* CUSA Header */}
            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h1 className="text-3xl tracking-tight">
                  <GradientText>CUSA</GradientText>
                </h1>
              </div>
            </div>

            <div className="text-center space-y-6">
              <h2 className="text-4xl sm:text-5xl tracking-tight">
                <GradientText light>
                  Master new skills anywhere.
                </GradientText>
              </h2>
              <SearchInput query={query} setQuery={setQuery} />
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl tracking-tight text-center">
                <GradientText light>Example Topics</GradientText>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {examplePrompts.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(item.prompt)}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left shadow-sm"
                  >
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <span className="text-gradient">{item.title.split(' ')[0]}</span>
                      <span className="text-2xl">{item.title.split(' ')[1]}</span>
                    </h4>
                    <p className="text-sm text-gray-600">{item.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default HomePage 