import { app, BrowserWindow, ipcMain } from 'electron'
import axios, { AxiosError } from 'axios'
import { IPC_CHANNELS } from '../frontend/src/types/ipc'
import Store from 'electron-store'

// Backend API configuration
const API_BASE_URL = 'http://localhost:8000'
const MAX_RETRIES = 3

// Window state persistence
const store = new Store({
  defaults: {
    windowBounds: { width: 1200, height: 800 }
  }
})

function createWindow() {
  const { width, height } = store.get('windowBounds') as { width: number; height: number }
  
  const win = new BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + '/preload.js'
    }
  })

  // Save window size on close
  win.on('close', () => {
    store.set('windowBounds', win.getBounds())
  })

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile('dist/index.html')
  }

  return win
}

async function handleQuizGeneration(event: Electron.IpcMainInvokeEvent, request: any) {
  let retries = 0

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/quiz/simple`, {
        topic: request.topic,
        question_type: request.questionType,
        num_questions: request.numQuestions,
        difficulty: request.difficulty
      })
      
      return response.data
    } catch (error) {
      retries++
      
      if (error instanceof AxiosError) {
        console.error(`Quiz generation failed (attempt ${retries}):`, error.message)
        
        // If we've exhausted retries or it's a 4xx error (client error), don't retry
        if (retries === MAX_RETRIES || (error.response && error.response.status < 500)) {
          throw new Error(error.response?.data?.detail || 'Failed to generate quiz questions')
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * retries))
        continue
      }
      
      throw error
    }
  }
}

// Register IPC handlers when app is ready
app.whenReady().then(() => {
  const mainWindow = createWindow()
  
  ipcMain.handle(IPC_CHANNELS.GENERATE_QUIZ, handleQuizGeneration)
  
  // Toggle DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.control && input.key.toLowerCase() === 'i') {
        mainWindow.webContents.toggleDevTools()
        event.preventDefault()
      }
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
}) 