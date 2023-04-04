import {contextBridge, ipcRenderer} from 'electron'
// const os = require('os')

contextBridge.exposeInMainWorld(
    'menu', {
        send: (channel: string, data: any) => {
            ipcRenderer.send(channel, data)
        },
        receive: (channel: string, func: Function) => {
            ipcRenderer.on(channel, (_event, ...args) => func(...args))
        },
    }
)