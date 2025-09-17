const path = require('path');

module.exports = {
    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application. Just store away!
    |
    */
    default: process.env.FILESYSTEM_DISK || 'local',

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been set up for each driver as an example of the required values.
    |
    | Supported Drivers: "local"
    |
    */
    disks: {
        local: {
            driver: 'local',
            root: path.join(__dirname, '..', 'storage', 'app'),
        },

        public: {
            driver: 'local',
            root: path.join(__dirname, '..', 'public', 'storage'),
            url: process.env.APP_URL + '/storage',
            visibility: 'public',
        },
    },
};