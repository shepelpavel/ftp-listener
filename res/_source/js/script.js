const {
    remote,
    ipcRenderer
} = require('electron')
const Vue = require('./../_assets/module/vue/vue.min.js')
const FindInPage = require('electron-find').FindInPage;

let findInPage = new FindInPage(remote.getCurrentWebContents(), {
    boxBgColor: '#333',
    boxShadowColor: 'transparent',
    inputColor: '#aaa',
    inputBgColor: '#222',
    inputFocusColor: '#555',
    textColor: '#aaa',
    textHoverBgColor: '#555',
    caseSelectedColor: '#555'
});

var app = new Vue({
    el: '#app',
    data: {
        list: []
    },
    methods: {
        getList: function () {
            ipcRenderer.send('getList')
        },
        copySite: function (event) {
            event.target.select()
            document.execCommand('copy')
            copy.active = 'active'
            window.getSelection().removeAllRanges()
            setTimeout(() => {
                copy.active = ''
            }, 2000);
        }
    },
    mounted: function () {
        this.getList()
    },
})

var copy = new Vue({
    el: '#copy',
    data: {
        active: ''
    }
})

ipcRenderer.on('sites_list', (event, resp) => {
    app.list = resp
})

ipcRenderer.on('on-find', (e, args) => {
    findInPage.openFindWindow()
})