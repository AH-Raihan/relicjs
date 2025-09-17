const fs = require('fs');
const path = require('path');
const config = require('../bootstrap/config'); // Use the central config

// Load all translations into memory on startup
const translations = {};
const langDir = path.join(__dirname, '..', 'lang');

if (fs.existsSync(langDir)) {
    fs.readdirSync(langDir).forEach(locale => {
        const localeDir = path.join(langDir, locale);
        if (fs.statSync(localeDir).isDirectory()) {
            translations[locale] = {};
            fs.readdirSync(localeDir).forEach(file => {
                if (file.endsWith('.json')) {
                    const filePath = path.join(localeDir, file);
                    const fileBase = path.basename(file, '.json');
                    translations[locale][fileBase] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                }
            });
        }
    });
}


module.exports = (req, res, next) => {
    // --- Localization Helper ---
    const locale = config.app.locale;
    const fallbackLocale = config.app.fallback_locale;

    res.locals.__ = (key) => {
        const keys = key.split('.');
        const file = keys.shift();
        const accessKey = keys.join('.');

        let translation = translations[locale]?.[file]?.[accessKey];
        if (!translation) {
            translation = translations[fallbackLocale]?.[file]?.[accessKey];
        }
        return translation || key;
    };

    // --- Config Helper ---
    // Make the global config() function available in views
    res.locals.config = global.config;

    // --- Asset URL Helper ---
    res.locals.asset = (filePath) => {
        const assetUrl = global.config('app.asset_url');
        // Remove leading slashes from path to prevent URL malformation
        const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        return `${assetUrl}/${cleanPath}`;
    };

    next();
};
