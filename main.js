const { app, BrowserWindow, ipcMain, globalShortcut, screen } = require('electron');

let mainWindow;
let tmpSize; 


function createWindow() {

    const displays = screen.getAllDisplays();
    const externalDisplay = displays.find((display) => {
        return display.bounds.x === 0 || display.bounds.y === 0;
    });

    const aspectRatio = 400 / 550;
    const maxHeight = externalDisplay.workAreaSize.height;
    const maxWidth = Math.round(maxHeight * aspectRatio);



    mainWindow = new BrowserWindow({
        width: 400,
        height: 550,
        minWidth: 400,
        maxHeight: maxHeight,
        minHeight: 550,
        aspectRatio: 400 / 550,
        maxWidth: maxWidth,
        icon: 'icon/icon.png',
        backgroundColor: 'rgb(70, 70, 70)',
        resizable: true,
        frame: false,
        x: 100,
        y: 100,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
    });

    tmpSize = [mainWindow.getBounds().width, mainWindow.getBounds().height];

    globalShortcut.register('f5', function () {
        console.log('Refresh')
        mainWindow.reload()
    })

    mainWindow.loadFile("index.html");

    // keep aspect ratio
    mainWindow.on('resize', () => {
        let width = mainWindow.getBounds().width;
        let height = mainWindow.getBounds().height;
        let size = [width, height];
        if (Math.abs(size[0] - tmpSize[0]) > 2 || Math.abs(size[1] - tmpSize[1]) > 2) {
            height = Math.round(width / aspectRatio);
            mainWindow.setSize(width, height);
            tmpSize = [width, height];
        }
    })


    // make win open with max height and width
    //mainWindow.maximize();

    // devtools
    //mainWindow.webContents.openDevTools();


    return mainWindow;
}


app.whenReady().then(() => {
    mainWindow = createWindow();

    //devtools
    mainWindow.webContents.openDevTools({ mode: 'detach' });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    globalShortcut.register('ctrl+e', () => {
        console.log("Exiting ...");
        app.exit()
    })
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on('close-app', () => {
    app.quit();
})

ipcMain.on('minimize-app', () => {
    mainWindow.minimize();
});

ipcMain.on('maximize-app', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
    else
        mainWindow.maximize();
});






