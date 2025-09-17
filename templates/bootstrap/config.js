const fs = require('fs-extra');
const path = require('path');

let loadedConfig = null; // Will store the loaded config

// Use a simple flag to avoid console logs during tests or other requires
const shouldLog = !process.env.JEST_WORKER_ID;

const loadConfig = () => {
    if (loadedConfig) {
        return loadedConfig; // Return cached config if already loaded
    }

    let config = {};
    const cachePath = path.join(__dirname, 'cache', 'config.json');

    try {
        if (process.env.NODE_ENV === 'production' && fs.existsSync(cachePath)) {
            if (shouldLog) console.log('Loading configuration from cache...');
            config = fs.readJsonSync(cachePath);
        } else {
            const configDir = path.join(__dirname, '..', 'config');
            const files = fs.readdirSync(configDir);
            for (const file of files) {
                if (file.endsWith('.js')) {
                    const configKey = path.basename(file, '.js');
                    // IMPORTANT: Use a fresh require to avoid module caching issues
                    // when config files might change in development.
                    delete require.cache[require.resolve(path.join(configDir, file))];
                    const loadedModule = require(path.join(configDir, file));
                    config[configKey] = loadedModule;
                }
            }
        }
    } catch (error) {
        console.error('FATAL: Could not load configuration.', error);
        process.exit(1);
    }

    loadedConfig = config; // Cache the loaded config
    return loadedConfig;
};

/**
 * Gets a configuration value using dot notation.
 * @param {string} key - The configuration key (e.g., 'app.port').
 * @param {*} defaultValue - The default value to return if the key is not found.
 * @returns {*}
 */
global.config = (key, defaultValue = null) => {
    const currentConfig = loadConfig(); // Ensure config is loaded

    // If no key is provided, return the entire config object.
    if (!key) {
        return currentConfig;
    }

    const keys = key.split('.');
    let current = currentConfig;

    for (const k of keys) {
        if (current === undefined || typeof current !== 'object' || current === null || !(k in current)) {
            return defaultValue;
        }
        current = current[k];
    }

    return current !== undefined ? current : defaultValue;
};

module.exports = loadConfig(); // Export the result of loading the config