const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5500;

// Path to the users.json file
const usersFilePath = path.join(__dirname, "users.json");

// Middleware to parse JSON requests
app.use(express.json());

app.post("/signup", (req, res) => {
    const { firstname, username, email, password } = req.body;

    // Validate the data (basic example)
    if (!firstname || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Read existing users
        const usersData = fs.existsSync(usersFilePath)
            ? JSON.parse(fs.readFileSync(usersFilePath, "utf8"))
            : [];

        // Add the new user
        usersData.push({ firstname, username, email, password });

        // Save to the JSON file
        fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 4), "utf8");

        res.status(200).json({ message: "Signup successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving user: " + error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
