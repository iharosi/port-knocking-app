// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer } from 'electron';

window.electronTheme = {
  onThemeChanged: (callback) => ipcRenderer.on('theme-changed', callback),
  removeThemeListener: () => ipcRenderer.removeAllListeners('theme-changed'),
};
