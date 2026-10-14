const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('posDesktop', {
  isDesktop: true,
  getDatabaseMode: () => ipcRenderer.invoke('posdb:get-mode'),
  setDatabaseMode: (mode) => ipcRenderer.invoke('posdb:set-mode', mode),
  loadState: () => ipcRenderer.invoke('posdb:load-state'),
  saveState: (state) => ipcRenderer.invoke('posdb:save-state', state),
  listDocuments: (filter) => ipcRenderer.invoke('posdb:list-documents', filter || {}),
  saveDocument: (document) => ipcRenderer.invoke('posdb:save-document', document),
  getDocument: (id) => ipcRenderer.invoke('posdb:get-document', id),
  deleteDocument: (id) => ipcRenderer.invoke('posdb:delete-document', id),
  chooseDatabaseMode: () => ipcRenderer.invoke('posdb:show-mode-picker')
});
