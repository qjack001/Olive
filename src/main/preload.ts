import { contextBridge, ipcRenderer } from "electron";

export const electronApi = {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: Function) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },
};

contextBridge.exposeInMainWorld("menu", electronApi);
