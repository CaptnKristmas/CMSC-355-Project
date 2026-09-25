# Adhere Medical

A medication scheduling web application developed as a team project for CMSC 355 at Virginia Commonwealth University.

Adhere Medical explores how patients can organize medication routines and how doctors can review patient schedules. The prototype combines a browser interface with a Node.js/Express backend for account handling and calendar storage.

**Status:** Academic prototype with partially integrated features. Use fictional data only; the application is not suitable for real patient information or production use.

## My contributions

**Vladimir Paraschiv — Backend Developer and Project Manager**

- **Backend development:** Built the Node.js/Express backend, including registration and login endpoints, patient-list retrieval, and per-patient calendar storage using local JSON files.
- **Calendar layout:** Corrected calendar CSS issues so the interface displayed properly.
- **Frontend support:** Helped teammates troubleshoot and resolve frontend implementation roadblocks.
- **Project management:** Served as project manager alongside my development responsibilities.

## Features

- **Patient registration and login:** Form validation, duplicate-account checks, and browser session state.
- **Medication catalog:** Browse medication names and descriptions and add custom entries through the interface.
- **Calendar:** Create scheduled events with daily, weekly, or monthly recurrence options. Calendar data is saved through the backend to per-user JSON files.
- **Doctor calendar interface:** Code for selecting a patient and viewing their calendar; the doctor account flow requires further integration.
- **Concerns and profile interfaces:** Prototype pages for entering concerns and editing profile fields; these are not connected to persistent backend storage.
- **Domain models:** JavaScript classes represent doctors, patients, regimens, and adherence records. Earlier Java implementations are retained in the sprint folders.

## Technology

| Layer | Implementation |
| --- | --- |
| Frontend | HTML, CSS, vanilla JavaScript, ES modules |
| Backend | Node.js, Express, body-parser |
| Storage | Local JSON files, browser sessionStorage and localStorage |
| Earlier prototypes | Java |

## Run locally

Prerequisites: Git, Node.js with npm, and a web browser. Use a Node.js version compatible with Express 5.

```bash
git clone https://github.com/Vladimir-Paraschiv/CMSC-355-Project.git
cd CMSC-355-Project
npm install
npm start
```

Run these commands from the repository root because some backend file paths are relative to that directory.

Open **http://localhost:5500/Signup.html** to create a fictional patient account, or **http://localhost:5500/login.html** to sign in. Successful registration or patient login redirects to **http://localhost:5500/home/index.html**.

The signup filename is case-sensitive: use `Signup.html` with a capital `S`. Some existing navigation links use inconsistent paths; use the direct URLs above if needed.

The Express server is required for account and calendar operations. Opening HTML files directly or serving only the frontend does not run the backend.

## Project structure

The repository preserves its course sprint structure. The current application uses files from both `Sprint_1` and `Sprint_3`.

| Location | Purpose |
| --- | --- |
| `package.json` | Dependencies and startup command |
| `Sprint_1/server.js` | Active Express server; account and calendar endpoints |
| `Sprint_1/` | Signup and login pages, validation, and earlier prototypes |
| `Sprint_1/users.json` | Local account storage |
| `Sprint_1/calendars/` | Per-user calendar files |
| `Sprint 2/` | Earlier Java domain models and course artifacts |
| `Sprint_3/` | Main application pages and JavaScript domain models |
| `Sprint_3/html-calendar/` | Calendar scripts and styles |

Express serves `Sprint_1` at `/` and `Sprint_3` at `/home`. Frontend scripts call the backend using the Fetch API. User details are held in browser session storage, while account and calendar records are written to local JSON files.

## Testing

No automated test suite is currently configured. The `npm test` command is a placeholder and exits with an error. Earlier sprint folders contain test demonstration videos.

Suggested manual checks:

1. Register a fictional patient and confirm the dashboard redirect.
2. Sign in with valid credentials, then verify that incorrect credentials are rejected.
3. Attempt registration with a duplicate username or email.
4. Create a calendar event and reload the page to check persistence.
5. Add a concern and inspect its display and removal behavior.

## Known limitations and next steps

- Passwords are stored in plaintext. Backend routes do not enforce authenticated sessions or patient-level authorization, and the static file configuration exposes data files. Authentication and storage need redesign before deployment.
- Profile and concern entries are not persisted by the backend. Custom medication persistence and calendar completion/deletion persistence need further work.
- Doctor registration and login use inconsistent account fields and need integration.
- Some navigation paths and filename capitalization are inconsistent.
- Automated reminders, missed-dose alerts, and adherence reports are future work.
- Further improvements include database-backed storage, automated tests, and consolidation of the active code into a clearer application structure.

## Team

- Haley Roe
- Zachary Bond
- Patrick T
- Garrett Foltyn
- Vladimir Paraschiv

<!-- Add a screenshot of the running application using fictional data. -->
