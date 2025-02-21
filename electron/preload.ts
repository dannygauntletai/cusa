import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    invoke: (channel: string, data: any) => {
      const validChannels = ['generate-quiz']
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data)
      }
      throw new Error(`Invalid IPC channel: ${channel}`)
    }
  }
) 