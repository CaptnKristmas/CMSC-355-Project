import { initCalendar } from "./calendar.js";
import { initViewSelect } from "./view-select.js";

initCalendar();
initViewSelect();

// ✅ Create Event Button Functionality
document.addEventListener("DOMContentLoaded", () => {
    const createEventButton = document.querySelector('.button--primary.button--lg');
    const logoutButton = document.getElementById('logout-button');

    if (createEventButton) {
        createEventButton.addEventListener('click', () => {
            // Create a simple form popup
            const formContainer = document.createElement('div');
            formContainer.style.position = 'fixed';
            formContainer.style.top = '50%';
            formContainer.style.left = '50%';
            formContainer.style.transform = 'translate(-50%, -50%)';
            formContainer.style.backgroundColor = 'white';
            formContainer.style.padding = '20px';
            formContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            formContainer.style.zIndex = '9999';
            formContainer.style.borderRadius = '8px';

            formContainer.innerHTML = `
                <h3>Create New Event</h3>
                <label>Title:</label><br>
                <input type="text" id="event-title" required><br><br>
                <label>Month (1-12):</label><br>
                <input type="number" id="event-month" min="1" max="12" required><br><br>
                <label>Day (1-31):</label><br>
                <input type="number" id="event-day" min="1" max="31" required><br><br>
                <label>Time (optional):</label><br>
                <input type="text" id="event-time" placeholder="e.g., 2:00 PM"><br><br>
                <button id="save-event">Save</button>
                <button id="cancel-event" style="margin-left: 10px;">Cancel</button>
            `;

            document.body.appendChild(formContainer);

            document.getElementById('cancel-event').addEventListener('click', () => {
                document.body.removeChild(formContainer);
            });

            document.getElementById('save-event').addEventListener('click', () => {
                const title = document.getElementById('event-title').value.trim();
                const month = parseInt(document.getElementById('event-month').value.trim());
                const day = parseInt(document.getElementById('event-day').value.trim());
                const time = document.getElementById('event-time').value.trim();

                if (!title || isNaN(month) || isNaN(day)) {
                    alert('Please fill all required fields.');
                    return;
                }

                const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed
                if (month !== currentMonth) {
                    alert('This simple calendar only supports events for the current month!');
                    return;
                }

                // Find the matching day
                const dayButtons = document.querySelectorAll('.month-calendar__day-label');
                let found = false;

                dayButtons.forEach((btn) => {
                    if (parseInt(btn.textContent) === day) {
                        const eventListWrapper = btn.parentElement.querySelector('.event-list');
                        if (eventListWrapper) {
                            const li = document.createElement('li');
                            li.className = 'event-list__item';
                            li.innerHTML = `
                                <button class="event event--filled">
                                    <span class="event__color"></span>
                                    <span class="event__title">${title}${time ? ` at ${time}` : ''}</span>
                                </button>
                            `;
                            eventListWrapper.appendChild(li);
                            found = true;
                        }
                    }
                });

                if (!found) {
                    alert('Day not found on the calendar.');
                }

                // Remove form after saving
                document.body.removeChild(formContainer);
            });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // stop the '#' from jumping to top
            sessionStorage.clear();
            window.location.href = "/login.html";
        });
    }
});

