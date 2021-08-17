const {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain
} = require('electron')
const os = require('os')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const convert = require('xml-js')
const username = os.userInfo().username

var sitemanager = app.getPath('appData') + '\\FileZilla\\sitemanager.xml'
if (os.platform() == 'linux') {
    sitemanager = app.getPath('appData') + '/filezilla/sitemanager.xml'
}

/////////////// function ////////////////////

function createWindow() {
    const win = new BrowserWindow({
        width: 400, // 400/900
        height: 600,
        minWidth: 400,
        minHeight: 600,
        autoHideMenuBar: true,
        icon: __dirname + '/res/icons/icon.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'res/render/preload.js')
        }
    })

    win.loadFile('res/render/index.html')
    win.setMenu(null)
    // win.webContents.openDevTools()
    win.on('focus', () => {
        globalShortcut.register('CommandOrControl+F', () => {
            win.webContents.send('on-find', '')
        })
    })
    win.on('blur', () => {
        globalShortcut.unregister('CommandOrControl+F')
    })
}

/////////////// function ////////////////////


///////////////// app ///////////////////////

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

///////////////// app ///////////////////////

ipcMain.on('getList', (event, options) => {
    var _result = []
    fs.readFile(sitemanager, function (err, data) {
        var document = JSON.parse(convert.xml2json(data, {
            compact: true,
            spaces: 2
        }))
        var sites_arr = document.FileZilla3.Servers.Folder
        for (var i1 = 0; i1 < sites_arr.length; i1++) {
            var folder_name = sites_arr[i1]._text
            _result.splice(i1, 0, {
                folder: folder_name,
                sites: []
            })
            for (var i2 = 0; i2 < sites_arr[i1].Server.length; i2++) {
                var site = {
                    name: sites_arr[i1].Server[i2].Name,
                    host: sites_arr[i1].Server[i2].Host,
                    port: sites_arr[i1].Server[i2].Port,
                    login: sites_arr[i1].Server[i2].User,
                    pass: sites_arr[i1].Server[i2].Pass
                }
                _result[i1].sites.push(site)
            }
        }
        event.sender.send('sites_list', _result)
    });
})