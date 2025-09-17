const fs = require('fs');
const path = require('path');
const appConfig = require('../config/app');

// Load all translations into memory on startup
const translations = {};
const langDir = path.join(__dirname, '..', 'lang');

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

module.exports = (req, res, next) => {
    // For now, we'''ll just use the default locale.
    // In a real app, you'''d detect this from the request (e.g., URL, cookie, header).
    const locale = config.app.locale;
    const fallbackLocale = appConfig.fallback_locale;

    /**
     * Translation helper function.
     * @param {string} key - The key to translate (e.g., 'messages.greeting').
     * @returns {string} - The translated string or the key itself.
     */
    res.locals.__ = (key) => {
        const keys = key.split('.');
        const file = keys.shift();
        const accessKey = keys.join('.');

        // Get translation from current locale
        let translation = translations[locale]?.[file]?.[accessKey];

        // If not found, try fallback locale
        if (!translation) {
            translation = translations[fallbackLocale]?.[file]?.[accessKey];
        }

        // Return the translation or the original key
        return translation || key;
    };

    next();
};
;
