const multer = require('multer');
const Storage = require('../lib/Storage');
const path = require('path');
const Logger = require('../bootstrap/logger');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

class FileController {
    /**
     * Store a newly uploaded file.
     */
    async store(req, res) {
        if (!req.file) {
            // You would typically handle this with proper validation
            return res.status(400).send('No file uploaded.');
        }

        try {
            // Create a unique filename to avoid overwrites
            const originalName = path.parse(req.file.originalname).name;
            const extension = path.parse(req.file.originalname).ext;
            const fileName = `${originalName}-${Date.now()}${extension}`;

            // Use the Storage helper to save the file to the 'public' disk
            await Storage.disk('public').put(fileName, req.file.buffer);

            // Get the public URL of the file
            const fileUrl = Storage.disk('public').url(fileName);

            Logger.info(`File uploaded successfully: ${fileUrl}`);

            // For now, just redirect back or send a success response
            // In a real app, you might pass the URL to a view or return JSON
            return res.redirect('back');

        } catch (error) {
            console.error('Error saving file:', error);
            return res.status(500).send('Error saving file.');
        }
    }
}

module.exports = {
    // We export an instance of the controller
    controller: new FileController(),
    // We also export the multer middleware instance to attach to the route
    uploadMiddleware: upload.single('file'), // 'file' is the name of the form field
};
