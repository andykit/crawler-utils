const os = require('os');
const path = require('path');

let _appName = null;

module.exports = {
    initAppName: function(appName) {
        if (_appName) return;
        _appName = appName;
    },

    getHomeDir: function() {
        return os.homedir();
    },

    getTmpDir: function() {
        return os.tmpdir();
    },

    getDownloadDir: function() {
        return path.join(os.homedir(), 'Downloads');
    },

    getAppDataDir: function(appName = '') {
        if (!appName) {
            appName = _appName || '';
        }
        let home;
        switch (process.platform) {
            case 'win64':
            case 'win32':
                let appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
                return path.join(appData, appName);
            case 'darwin':
                home = process.env.HOME || os.homedir();
                return path.join(home, 'Library', 'Application Support', appName);
            case 'linux':
                home = process.env.HOME || os.homedir();
                return path.join(home, '.config', appName);
        }
        throw new Error("Couldn't find the AppData dir");
    }
};