import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5500;

const usersFilePath = path.join(__dirname, 'users.json');

if (!fs.existsSync(usersFilePath)) {
    console.log('Users file does not exist, creating a new one.');
    try {
        // Create an empty users.json file with an empty array
        fs.mkdirSync(path.dirname(usersFilePath), { recursive: true });
        fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
    } catch (err) {
        console.error('users file already exists:');
    }
}

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname)));
app.use('/home', express.static(path.join(__dirname, '../Sprint_3')));

// Handle signup requests
app.post('/signup', (req, res) => {
    console.log('POST /signup');

    if (!req.body) {
        return res.status(400).json({ message: "Missing request body." });
    }
    const { userType = 'patient', firstname, username, email, password } = req.body;

    // Perform server-side validation
    if (!firstname || !username || !email || !password) {
        return res.status(400).send({ message: 'All fields are required.' });
    }

    const usersFilePath = path.join(__dirname, 'users.json');
    let usersData = [];

    try {
        const fileContent = fs.readFileSync(usersFilePath, 'utf8');
        console.log(' Raw users.json content:', fileContent); // ✅ debug
        usersData = fileContent ? JSON.parse(fileContent) : [];

        if (!Array.isArray(usersData)) {
            console.warn(' users.json is not an array! Resetting to empty array.');
            usersData = [];
        }
    } catch (err) {
        console.error(' Error reading users file:', err);
        return res.status(500).send({ message: 'Failed to read users data.' });
    }

    console.log(' Current users data:', usersData);

    //Check if the username or email already exists.
    const userExists = usersData.some((user) => user.username === username || user.email === email);
    if (userExists) {
        return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Simulate saving the user to a file (replace with database logic if needed)
    const newUser = { userType, firstname, username, email, password };

    // Store the user in the Map
    usersData.push(newUser);
    
    fs.writeFile('Sprint_1/users.json', JSON.stringify(usersData, null, 2), (writeErr) => {
        if (writeErr) {
            console.error('Error saving user:', writeErr);
            return res.status(500).send({ message: 'Failed to save user.' });
        }

        // NEW: Create the patient's calendar JSON file if they're a patient
        if (userType === 'patient') {
            const calendarDir = path.join(__dirname, 'calendars');
            const calendarFile = path.join(calendarDir, `${username}.json`);

            // Ensure the directory exists
            if (!fs.existsSync(calendarDir)) {
                fs.mkdirSync(calendarDir, { recursive: true });
            }

            // If file doesn't exist, create it with an empty array
            if (!fs.existsSync(calendarFile)) {
                fs.writeFileSync(calendarFile, JSON.stringify([], null, 2));
                console.log(`Created calendar file: ${calendarFile}`);
            }
        }

        res.status(200).send({ 
            message: 'Signup successful!',
            user: ({userType, firstname, username, email})
        });
    });
});


//Serve static files
//app.use(express.static(path.join(__dirname)));

// Handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    let user = null;
        
    try {
        const fileContent = fs.readFileSync('Sprint_1/users.json', 'utf8');
        const usersData = fileContent ? JSON.parse(fileContent) : [];
        user = usersData.find((u) => u.username === username && u.password === password);
    } catch (err) {
        console.error('Error reading users file:', err);
    }

    if (user) {
        const { userType, firstname, email } = user;
        res.status(200).send({ 
            message: 'Login Successful!', 
            user: ({userType, firstname, username, email })
        });
        console.log('Login Successful!');
    } else {
        res.status(401).send({ message: 'Invalid Username or Password.' });
        console.log('Invalid Username or Password.');
    }
});

// Handle doctor login requests
app.post('/doctor-login', (req, res) => {
    const { email, id, password } = req.body;


    let user = null;
    try {
        const fileContent = fs.readFileSync('Sprint_1/users.json', 'utf8');
        const usersData = fileContent ? JSON.parse(fileContent) : [];
        user = usersData.find((u) => u.email === email && u.id === id && u.password === password);
    } catch (err) {
        console.error('Error reading users.json during doctor login:', err);
    }

    if (user) {
        const { userType, firstname } = user;
        res.status(200).send({ 
            message: 'Login Successful! Welcome Doctor.',
            user: ({userType, firstname, email, id})
    });
    console.log('Login Successful! Welcome Doctor.');
        
    } else {
        res.status(401).send({ message: 'Invalid Email or Password.' });
        console.log('Invalid Email or Password.');
    }
});

// NEW: Get the list of patients (for doctor dropdown)
app.get('/api/patients', (req, res) => {
    const usersFilePath = path.join(__dirname, 'users.json');
    let usersData = [];
    try {
        if (fs.existsSync(usersFilePath)) {
            const fileContent = fs.readFileSync('Sprint_1/users.json', 'utf8');
            usersData = fileContent ? JSON.parse(fileContent) : [];
        } 
    } catch (err) {
            console.error('Error reading users file:', err);
    }

    try {
        const fileContent = fs.readFileSync(usersFilePath, 'utf8');
        const usersData = fileContent ? JSON.parse(fileContent) : [];
        const patients = usersData.filter(u => u.userType === 'patient');
        res.json(patients.map(p => ({ username: p.username, firstname: p.firstname })));
    } catch (err) {
        console.error('Error reading users file:', err);
        res.json([]);  // fallback to empty if error
    }
});

// NEW: Get a patient's calendar data
app.get('/api/calendar/:username', (req, res) => {
    const username = req.params.username;
    const filePath = path.join(__dirname, 'calendars', `${username}.json`);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(data));
    } else {
        res.json([]);  // Return empty array if no calendar yet
    }
});

// NEW: Save a patient's calendar data
app.post('/api/calendar/:username', (req, res) => {
    const username = req.params.username;
    const filePath = path.join(__dirname, 'calendars', `${username}.json`);

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.send({ message: 'Calendar saved successfully.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown handler
function shutdown() {
    console.log('\n Gracefully shutting down...');
    server.close(() => {
        console.log(' Server closed.');
        process.exit(0);
    });
}

// Handle Ctrl+C (SIGINT)
process.on('SIGINT', shutdown);

// Handle termination (SIGTERM)
process.on('SIGTERM', shutdown);
