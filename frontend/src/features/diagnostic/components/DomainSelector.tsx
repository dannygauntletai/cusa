import { useState } from 'react'
import { Domain } from '@/shared/types/question'
import { GradientText } from '@/components/ui/GradientText'

interface DomainSelectorProps {
  domains: Domain[]
  onSelect: (selectedDomains: string[]) => void
}

export function DomainSelector({ domains, onSelect }: DomainSelectorProps) {
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set())

  const toggleDomain = (domain: string) => {
    const newSelection = new Set(selectedDomains)
    if (newSelection.has(domain)) {
      newSelection.delete(domain)
    } else {
      newSelection.add(domain)
    }
    setSelectedDomains(newSelection)
  }

  const handleContinue = () => {
    if (selectedDomains.size > 0) {
      onSelect(Array.from(selectedDomains))
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">
          <GradientText light>
            Select Learning Domains
          </GradientText>
        </h2>
        <p className="text-lg text-gray-600">
          Choose the areas you'd like to focus on
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map(domain => (
          <button
            key={domain.name}
            onClick={() => toggleDomain(domain.name)}
            className={`
              p-6 text-left rounded-xl transition-all duration-200
              ${selectedDomains.has(domain.name)
                ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                : 'bg-white border border-gray-200 hover:border-blue-300'
              }
            `}
          >
            <h3 className="text-xl font-semibold mb-2">{domain.name}</h3>
            <p className="text-gray-600">{domain.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={selectedDomains.size === 0}
          className={`
            px-8 py-3 rounded-lg text-white font-medium
            transition-all duration-200
            ${selectedDomains.size > 0
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  )
} 