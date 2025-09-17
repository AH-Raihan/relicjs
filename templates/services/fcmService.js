const admin = require('firebase-admin');
const crypto = require('crypto');

const base64Apps = {};

async function sendFCMWithBase64(tokens, title, body, customData) {
    const keyJson = JSON.parse(Buffer.from(base64Key, 'base64').toString('utf8'));

    const hashKey = crypto.createHash('md5').update(base64Key).digest('hex');

    if (!base64Apps[hashKey]) {
        const app = admin.initializeApp({
            credential: admin.credential.cert(keyJson),
        }, hashKey);
        base64Apps[hashKey] = app;
    }

    const message = {
        notification: { title, body },
        data: customData,
        tokens: Array.isArray(tokens) ? tokens : [tokens], // accept string or array
    };

    // Use sendMulticast for multiple tokens
    const response = await base64Apps[hashKey].messaging().sendMulticast(message);

    return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
    };
}

module.exports = { sendFCMWithBase64 };
