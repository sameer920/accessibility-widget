require('dotenv').config();
const path = require('path');
const express = require('express');
const dirname = path.dirname;
const fileURLToPath = require('url').fileURLToPath;
const app = express();
const port = process.env.PORT || 3001;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, '.', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});