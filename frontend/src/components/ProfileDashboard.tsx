import { useState } from 'react'
import QuizHistory from './QuizHistory'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { quizService, settingsService } from '../services/api'

interface ProfileDashboardProps {
  onBack: () => void
}

interface ModelOption {
  value: string
  name: string
  params: string
  description: string
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    value: 'mistral',
    name: 'Mistral',
    params: '7B',
    description: 'Fast and efficient general-purpose model'
  },
  {
    value: 'llama2',
    name: 'Llama 2',
    params: '13B',
    description: 'Meta\'s powerful general-purpose model'
  },
  {
    value: 'codellama',
    name: 'Code Llama',
    params: '34B',
    description: 'Specialized for code understanding and generation'
  },
  {
    value: 'neural-chat',
    name: 'Neural Chat',
    params: '7B',
    description: 'Optimized for conversational tasks'
  }
]

const ProfileDashboard = ({ onBack }: ProfileDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history')
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const navigate = useNavigate()
  const [currentModel, setCurrentModel] = useState(localStorage.getItem('aiModel') || 'mistral')
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleClearHistory = async () => {
    try {
      await quizService.clearHistory()
      setShowConfirmClear(false)
      window.location.reload() // Refresh to show empty history
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }

  const handleModelChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = event.target.value
    try {
      await settingsService.updateModel(newModel)
      setCurrentModel(newModel)
      localStorage.setItem('aiModel', newModel)
      setUpdateError(null)
    } catch (error) {
      console.error('Failed to update model:', error)
      setUpdateError('Failed to update model. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] p-6">
      {/* macOS-style title bar */}

      <div className="max-w-4xl mx-auto mt-12">
        {/* Sidebar Navigation */}
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-left rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-[#353535]'
              }`}
            >
              Quiz History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-left rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-[#353535]'
              }`}
            >
              Settings
            </button>
            <button
              onClick={onBack}
              className="mt-auto px-4 py-2 text-left text-gray-300 hover:bg-[#353535] rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Content Area */}
          <div className="col-span-3">
            {activeTab === 'history' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Quiz History</h2>
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
                <div className="bg-[#2d2d2d] rounded-xl">
                  <QuizHistory />
                </div>
              </>
            )}
            {activeTab === 'settings' && (
              <div className="bg-[#2d2d2d] rounded-xl p-6 space-y-8">
                <div>
                  <h3 className="text-lg text-white font-medium mb-4">AI Model</h3>
                  <div className="bg-[#353535] rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Default Model
                    </label>
                    <select 
                      value={currentModel}
                      onChange={handleModelChange}
                      className="w-full p-2 rounded-lg bg-[#404040] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {MODEL_OPTIONS.map(model => (
                        <option key={model.value} value={model.value}>
                          {model.name} ({model.params} params) - {model.description}
                        </option>
                      ))}
                    </select>
                    {updateError && (
                      <p className="mt-2 text-sm text-red-400">{updateError}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg text-white font-medium mb-4">About</h3>
                  <div className="bg-[#353535] rounded-lg p-4">
                    <p className="text-sm text-gray-400">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <Modal onClose={() => setShowConfirmClear(false)}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Clear Quiz History</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to clear all quiz history? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-[#353535]"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear History
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ProfileDashboard 