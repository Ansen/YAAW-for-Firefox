import Vue from 'vue/dist/vue.esm.js'

Vue.config.productionTip = false

const vm = new Vue({
  data() {
    return {
      isContextMenus: true,
      isAutoRename: true,
      isEnableNotice: true,
      isInterception: false,
      isSync: false,
      fileSize: 0,
      downloadPath: '',
      rpcLists: [{
        name: 'ARIA2 RPC',
        path: 'http://localhost:6800/jsonrpc'
      }],
      whitelist: '',
      blocklist: '',
      saved: false,
      version: browser.runtime.getManifest().version,
      title: browser.i18n.getMessage('title'),
      contextMenu: browser.i18n.getMessage('contextMenu'),
      contextMenuDesc: browser.i18n.getMessage('contextMenuDesc'),
      autoRename: browser.i18n.getMessage('autoRename'),
      autoRenameDesc: browser.i18n.getMessage('autoRenameDesc'),
      enableNotice: browser.i18n.getMessage('enableNotice'),
      enableNoticeDesc: browser.i18n.getMessage('enableNoticeDesc'),
      syncConfig: browser.i18n.getMessage('syncConfig'),
      syncConfigDesc: browser.i18n.getMessage('syncConfigDesc'),
      interception: browser.i18n.getMessage('interception'),
      interceptionDesc: browser.i18n.getMessage('interceptionDesc'),
      fileSizeStr: browser.i18n.getMessage('fileSizeStr'),
      unit: browser.i18n.getMessage('unit'),
      downloadPathStr: browser.i18n.getMessage('downloadPathStr'),
      downloadPathDesc: browser.i18n.getMessage('downloadPathDesc'),
      addRPC: browser.i18n.getMessage('addRPC'),
      removeRPC: browser.i18n.getMessage('removeRPC'),
      whitelistStr: browser.i18n.getMessage('whitelistStr'),
      blocklistStr: browser.i18n.getMessage('blocklistStr'),
      save: browser.i18n.getMessage('save'),
      saveSuccess: browser.i18n.getMessage('saveSuccess'),
      reset: browser.i18n.getMessage('reset')
    }
  },
  mounted() {
    browser.storage.sync.get(null, (items) => {
      for (const key in items) {
        this[key] = items[key]
        browser.storage.local.set({ key: items[key] }, () => {
          console.log('browser first local set: %s, %s', key, items[key])
        })
      }
    })
    browser.storage.local.get(null, (items) => {
      for (const key in items) {
        if (key === 'rpcLists') {
          this[key] = JSON.parse(items[key])
        } else {
          this[key] = items[key]
        }
      }
    })
  },
  methods: {
    addRPCForm() {
      this.rpcLists.push({
        name: '',
        path: ''
      })
    },
    removeRPCByIndex(index) {
      this.rpcLists.splice(index, 1)
    },
    saveConfig() {
      const configData = {
        isContextMenus: this.isContextMenus,
        isAutoRename: this.isAutoRename,
        isEnableNotice: this.isEnableNotice,
        isInterception: this.isInterception,
        isSync: this.isSync,
        fileSize: this.fileSize,
        downloadPath: this.downloadPath,
        rpcLists: JSON.stringify(this.rpcLists),
        whitelist: this.whitelist,
        blocklist: this.blocklist
      }
      browser.storage.local.set({ ...configData }).then(() => {
        console.log('browser local set:', configData)
      })
      if (configData.isSync === true) {
        browser.storage.sync.set({ ...configData }).then(() => {
          console.log('browser sync set: ', configData)
        })
      }
      this.showSavedInfo()
    },
    clear() {
      const confirmMessage = browser.i18n.getMessage('resetConfirm')
      if (window.confirm(confirmMessage)) {
        browser.storage.sync.clear()
        browser.storage.local.clear()
        location.reload()
      }
    },
    showSavedInfo() {
      this.saved = true
      setTimeout(() => {
        this.saved = false
      }, 3000)
    }
  }
})

vm.$mount('#app')
