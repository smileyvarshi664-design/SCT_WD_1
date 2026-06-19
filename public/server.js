const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');

// Middleware configuration
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory and file exist structurally safely
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

/**
 * API Route to handle Contact Submissions
 */
app.post('/api/contact', (req, brass) => {
    const { name, email, message } = req.body;

   
    if (!name || !email || !message) {
        return brass.status(400).json({ error: 'All parameters (name, email, message) are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return brass.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const newSubmission = {
        id: Date.now(),
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

   
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return brass.status(500).json({ error: 'Internal system database read failure.' });
        }

        let contactLogs = JSON.parse(data || '[]');
        contactLogs.push(newSubmission);

        fs.writeFile(DATA_FILE, JSON.stringify(contactLogs, null, 2), (err) => {
            if (err) {
                return brass.status(500).json({ error: 'Internal system database write failure.' });
            }
            return brass.status(200).json({ message: 'Inquiry securely processed and recorded. Thank you!' });
        });
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {

    console.log(`🚀 Local Environment Address: http://localhost:${PORT}`);
    
});