import { useState } from 'react'
import QuizHistory from './QuizHistory'

interface ProfileDashboardProps {
  onBack: () => void
}

const ProfileDashboard = ({ onBack }: ProfileDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history')

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] p-6">
      {/* macOS-style title bar */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-[#1a1a1a] flex items-center justify-between px-4 drag">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c941]" />
        </div>
        <div className="text-gray-400 text-sm">Profile Dashboard</div>
        <div className="w-16" /> {/* Spacer for symmetry */}
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        {/* Sidebar Navigation */}
        <div className="flex gap-6">
          <div className="w-48 flex flex-col space-y-2">
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
          <div className="flex-1">
            {activeTab === 'history' ? (
              <QuizHistory />
            ) : (
              <div className="bg-[#2d2d2d] rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Application Settings</h2>
                <div className="space-y-6">
                  {/* AI Model Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg text-white font-medium">AI Model</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Default Model
                      </label>
                      <select className="w-full p-2 rounded-lg bg-[#353535] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="mistral">Mistral</option>
                        <option value="llama">Llama</option>
                      </select>
                    </div>
                  </div>

                  {/* App Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg text-white font-medium">App Preferences</h3>
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

                  {/* Storage Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg text-white font-medium">Storage</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Local Storage Used</span>
                      <span className="text-sm text-gray-300">24.5 MB</span>
                    </div>
                    <button className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                      Clear Local Data
                    </button>
                  </div>

                  {/* About Section */}
                  <div className="space-y-2 pt-4 border-t border-gray-600">
                    <h3 className="text-lg text-white font-medium">About</h3>
                    <p className="text-sm text-gray-400">Version 1.0.0</p>
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Check for Updates
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDashboard 