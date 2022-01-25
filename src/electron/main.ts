import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';

function CreateWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            preload: resolve(__dirname, 'preload.js')
        }
    });

    win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
    CreateWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});