import { useState } from 'react'
import QuizHistory from './QuizHistory'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { quizService } from '../services/api'

interface ProfileDashboardProps {
  onBack: () => void
}

const ProfileDashboard = ({ onBack }: ProfileDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history')
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const navigate = useNavigate()

  const handleClearHistory = async () => {
    try {
      await quizService.clearHistory()
      setShowConfirmClear(false)
      window.location.reload() // Refresh to show empty history
    } catch (error) {
      console.error('Failed to clear history:', error)
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
                    <select className="w-full p-2 rounded-lg bg-[#404040] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="mistral">Mistral</option>
                      <option value="llama">Llama</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-white font-medium mb-4">App Preferences</h3>
                  <div className="bg-[#353535] rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-300">
                        Launch at Startup
                      </label>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-300">
                        Enable Desktop Notifications
                      </label>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-white font-medium mb-4">Storage</h3>
                  <div className="bg-[#353535] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-300">Local Storage Used</span>
                      <span className="text-sm text-gray-300">24.5 MB</span>
                    </div>
                    <button className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors border border-red-400/20 rounded-lg hover:bg-red-400/10">
                      Clear Local Data
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg text-white font-medium mb-4">About</h3>
                  <div className="bg-[#353535] rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-4">Version 1.0.0</p>
                    <button className="w-full px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors border border-blue-400/20 rounded-lg hover:bg-blue-400/10">
                      Check for Updates
                    </button>
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