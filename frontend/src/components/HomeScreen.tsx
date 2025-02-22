import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizService } from '../services/api'

interface HomeScreenProps {
  onSubmit: (topic: string, useWebSearch: boolean) => void
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionResult {
  transcript: string;
  [key: number]: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

const MAX_RECORDING_DURATION = 30000; // 30 seconds in milliseconds

const HomeScreen = ({ onSubmit }: HomeScreenProps) => {
  const [topic, setTopic] = useState('')
  const [useWebSearch, setUseWebSearch] = useState(false)
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const navigate = useNavigate()

  // Add new state and refs for audio recording
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Add new state for processing
  const [isProcessing, setIsProcessing] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => {
      setIsOnline(false)
      setUseWebSearch(false) // Disable web search when offline
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const results = Array.from(event.results) as SpeechRecognitionResult[]
          const lastResult = results[results.length - 1]
          if (lastResult) {
            const transcript = lastResult.transcript
            setTopic(transcript)
          }
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          // Restart if we're still supposed to be listening
          if (isListening && recognitionRef.current) {
            recognitionRef.current.start()
          }
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [isListening])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      console.log('HomeScreen: Submitting with useWebSearch:', useWebSearch)
      onSubmit(topic.trim(), useWebSearch)
    }
  }

  // Add logging when web search is toggled
  const handleWebSearchToggle = () => {
    if (isOnline) {
      const newValue = !useWebSearch
      console.log('HomeScreen: Toggling web search to:', newValue)
      setUseWebSearch(newValue)
    }
  }

  const startRecording = async () => {
    try {
      console.log("Starting audio recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'  // Specify codec
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Request data every 1 second instead of waiting until stop
      mediaRecorder.ondataavailable = (event) => {
        console.log("Audio data available:", event.data.size, "bytes");
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("Recording stopped, processing audio...");
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        console.log("Audio blob size:", audioBlob.size, "bytes");

        try {
          setIsProcessing(true); // Show loading state
          console.log("Sending audio to backend...");
          const text = await quizService.transcribeAudio(audioBlob);
          console.log("Received transcription:", text);
          setTopic(prev => prev ? `${prev} ${text}` : text);
        } catch (error) {
          console.error('Error transcribing audio:', error);
        } finally {
          setIsProcessing(false); // Hide loading state
          setIsRecording(false);
          setIsListening(false);
        }
      };

      // Start recording and request data every 1000ms
      mediaRecorder.start(1000);
      setIsRecording(true);
      setIsListening(true);

      // Set timeout to stop recording after MAX_RECORDING_DURATION
      recordingTimeoutRef.current = setTimeout(() => {
        console.log("Recording timeout reached");
        stopRecording();
      }, MAX_RECORDING_DURATION);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleListening = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Update the microphone button JSX
  const microphoneButton = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleListening();
      }}
      className={`px-3 py-2 mt-1 rounded-xl transition-colors flex items-center gap-2 ${
        isRecording 
          ? 'bg-red-600 text-white hover:bg-red-700' 
          : 'bg-[#2d2d2d] text-gray-300 hover:bg-[#353535]'
      }`}
    >
      <div className={`relative ${isRecording ? 'animate-pulse' : ''}`}>
        {isProcessing ? (
          // Loading spinner
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isRecording ? (
          // Stop recording icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <rect x="6" y="6" width="8" height="8" />
          </svg>
        ) : (
          // Microphone icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );

  // Organize suggestions into rows
  const topicSuggestions = [
    // First row - 5 suggestions
    ['JavaScript', 'Python', 'Machine Learning', 'Data Science', 'Web Development'],
    // Second row - 4 suggestions
    ['World History', 'Chemistry', 'Physics', 'Biology'],
    // Third row - 3 suggestions
    ['Literature', 'Philosophy', 'Psychology']
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] flex flex-col">
      {/* Header */}
      <div className="absolute top-0 right-0 p-4 flex items-center">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <h1 className="text-4xl font-bold text-center text-white mb-12">
            What topic would you like to learn about?
          </h1>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g. 'Python programming basics')"
                className="w-full p-4 pb-14 rounded-2xl border border-gray-700 bg-[#1a1a1a] text-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
              />
              <div className="absolute bottom-2 left-0 right-0 px-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => isOnline && handleWebSearchToggle()}
                  disabled={!isOnline}
                  className={`px-3 py-2 mt-1 ml-1 rounded-xl transition-colors flex items-center gap-2 ${
                    !isOnline 
                      ? 'bg-[#2d2d2d] text-gray-500 cursor-not-allowed'
                      : useWebSearch 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-[#2d2d2d] text-gray-300 hover:bg-[#353535]'
                  }`}
                >
                  {isOnline ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  ) : (
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-gray-500 rotate-45 transform origin-center" />
                      </div>
                    </div>
                  )}
                  <span>Search</span>
                </button>
                <div className="flex gap-2">
                  {microphoneButton}
                  <button
                    type="submit"
                    disabled={!topic.trim()}
                    className="px-3 py-2 mt-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-[#2d2d2d] disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Quick topic suggestions */}
          <div className="mt-8 space-y-4">
            {topicSuggestions.map((row, rowIndex) => (
              <div 
                key={`row-${rowIndex}`} 
                className="flex flex-wrap gap-2 justify-center"
              >
                {row.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => onSubmit(suggestion, useWebSearch)}
                    className="px-4 py-2 bg-[#2d2d2d] text-gray-300 rounded-xl hover:bg-[#353535] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
