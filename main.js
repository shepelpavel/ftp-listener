const {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain
} = require('electron')
const os = require('os')
const path = require('path')
const fs = require('fs')
const convert = require('xml-js')

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
        if (document.FileZilla3.Servers.Folder) {
            var sites_arr = document.FileZilla3.Servers.Folder
            if (sites_arr.length > 1) {
                for (var i1 = 0; i1 < sites_arr.length; i1++) {
                    var folder_name = sites_arr[i1]._text
                    _result.splice(i1, 0, {
                        folder: folder_name,
                        sites: []
                    })
                    if (sites_arr[i1].Server.length > 1) {
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
                    } else {
                        _result[0].sites.push({
                            name: sites_arr[i1].Server.Name,
                            host: sites_arr[i1].Server.Host,
                            port: sites_arr[i1].Server.Port,
                            login: sites_arr[i1].Server.User,
                            pass: sites_arr[i1].Server.Pass
                        })
                    }
                }
            } else {
                var folder_name = sites_arr._text
                _result.splice(0, 0, {
                    folder: folder_name,
                    sites: []
                })
                if (sites_arr.Server.length > 1) {
                    for (var i2 = 0; i2 < sites_arr.Server.length; i2++) {
                        var site = {
                            name: sites_arr.Server[i2].Name,
                            host: sites_arr.Server[i2].Host,
                            port: sites_arr.Server[i2].Port,
                            login: sites_arr.Server[i2].User,
                            pass: sites_arr.Server[i2].Pass
                        }
                        _result[0].sites.push(site)
                    }
                } else {
                    _result[0].sites.push({
                        name: sites_arr.Server.Name,
                        host: sites_arr.Server.Host,
                        port: sites_arr.Server.Port,
                        login: sites_arr.Server.User,
                        pass: sites_arr.Server.Pass
                    })
                }
            }
        }
        if (document.FileZilla3.Servers.Server) {
            var sites_arr = document.FileZilla3.Servers
            var folder_name = 'No folder'
            _result.splice(0, 0, {
                folder: folder_name,
                sites: []
            })
            if (sites_arr.Server.length > 1) {
                for (var i1 = 0; i1 < sites_arr.Server.length; i1++) {
                    var site = {
                        name: sites_arr.Server[i1].Name,
                        host: sites_arr.Server[i1].Host,
                        port: sites_arr.Server[i1].Port,
                        login: sites_arr.Server[i1].User,
                        pass: sites_arr.Server[i1].Pass
                    }
                    _result[0].sites.push(site)
                }
            } else {
                _result[0].sites.push({
                    name: sites_arr.Server.Name,
                    host: sites_arr.Server.Host,
                    port: sites_arr.Server.Port,
                    login: sites_arr.Server.User,
                    pass: sites_arr.Server.Pass
                })
            }
        }
        event.sender.send('sites_list', _result)
    });
})