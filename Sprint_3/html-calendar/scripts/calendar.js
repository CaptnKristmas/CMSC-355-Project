const events = [];

export function initCalendar() {
  const monthCalendarElement = document.querySelector("[data-month-calendar]");
  const weekCalendarElement = document.querySelector("[data-week-calendar]");
  const dayCalendarElement = document.querySelector("[data-day-calendar]");
  const dayList = monthCalendarElement.querySelector(".month-calendar__day-list");

  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (user && user.userType === 'doc') {
    createPatientDropdown();  // Add dropdown for doctor
  } else if (user) {
    // For patients, auto-load their own calendar
    loadPatientCalendar(user.username);
  }

  let now= new Date();
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth();

  const navDate = document.querySelector(".nav__date");
  const prevButton = document.querySelectorAll(".nav__arrows button")[0];
  const nextButton = document.querySelectorAll(".nav__arrows button")[1];
  const navControls = document.querySelector(".nav__controls");

  const createEventButton = document.createElement("button");
  createEventButton.className = "button button--primary desktop-only";
  createEventButton.textContent = "Create Event";
  if (navControls) navControls.appendChild(createEventButton);

  const eventModal = document.createElement("div");
  eventModal.id = "event-modal";
  eventModal.style.display = "none";
  eventModal.innerHTML = `
    <div class="modal-content" style="background: white; padding: 20px; border: 1px solid #ccc; max-width: 400px; margin: 50px auto;">
      <h2>Create Event</h2>
      <form id="event-form">
        <label>Title: <input type="text" id="event-title" required></label><br><br>
        <label>Time: <input type="text" id="event-time" placeholder="e.g., 2:00 PM"></label><br><br>
        <label>Day: <input type="number" id="event-day" min="1" max="31" required></label><br><br>
        <label>Month:
          <select id="event-month">
            ${Array.from({ length: 12 }, (_, i) => `<option value="${i}">${new Date(0, i).toLocaleString("en-US", {month: "long"})}</option>`).join("")}
          </select>
        </label><br><br>
        <label>Year: <input type="number" id="event-year" value="${currentYear}" required></label><br><br>
        <label>Repeat:
          <select id="event-repeat">
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label><br><br>
        <button type="submit">Save</button>
        <button type="button" id="close-modal">Cancel</button>
      </form>
    </div>
  `;
  document.body.appendChild(eventModal);

  const actionModal = document.createElement("div");
  actionModal.id = "event-action-modal";
  actionModal.style.display = "none";
  actionModal.style.position = "fixed";
  actionModal.style.top = "0";
  actionModal.style.left = "0";
  actionModal.style.width = "100%";
  actionModal.style.height = "100%";
  actionModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  actionModal.style.zIndex = "1000";
  actionModal.innerHTML = `
    <div class="modal-content" style="background: white; padding: 20px; max-width: 300px; margin: 100px auto; border-radius: 8px;">
      <h3>Event Options</h3> 
      <p id="event-action-title"></p>
      <button id="mark-complete">Mark as Completed</button>
      <button id="delete-event" style="margin-left:10px";>Delete</button>
      <button id="close-action-modal" style="float:right";>Cancel</button>
    </div>
  `;
  document.body.appendChild(actionModal);
  
  const confirmModal = document.createElement("div");
  confirmModal.id = "confirm-modal";
  confirmModal.style.display = "none";
  confirmModal.style.position = "fixed";
  confirmModal.style.top = "0";
  confirmModal.style.left = "0";
  confirmModal.style.width = "100%";
  confirmModal.style.height = "100%";
  confirmModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  confirmModal.style.zIndex = "1100";
  confirmModal.innerHTML = `
    <div class="modal-content" style="background: white; padding: 20px; max-width: 300px; margin: 120px auto; border-radius: 8px; text-alight:center;">
      <p>Apply to all occurrences?</p>
      <button id="confirm-yes">Yes</button>
      <button id="confirm-no" style="margin-left:10px";>No</button>
      <button id="confirm-cancel" style="margin-left:10px";>Cancel</button>
    </div>
  `;
  document.body.appendChild(confirmModal);

  let selectedEvent = null;
  let selectedDay = null;

  document.getElementById("close-action-modal").onclick = () => {
    actionModal.style.display = "none";
    selectedEvent = null;
  };

  function openConfirm(actionIfAll, actionIfSingle) {
    confirmModal.style.display = "block";

    document.getElementById("confirm-yes").onclick = () => {
      confirmModal.style.display = "none";
      actionIfAll();
      actionModal.style.display = "none";
      renderCalendar();
    };
    document.getElementById("confirm-no").onclick = () => {
      confirmModal.style.display = "none";
      actionIfSingle();
      actionModal.style.display = "none";
      renderCalendar();
    };
    document.getElementById("confirm-cancel").onclick = () => {
      confirmModal.style.display = "none";
    };
  }

  document.getElementById("mark-complete").onclick = () => {
    if (!selectedEvent) return;
    const applySingle = () => {
      const existingOverrideIndex = events.findIndex(e =>
        e.title === selectedEvent.title &&
        e.year === currentYear &&
        e.month === currentMonth &&
        e.day === selectedDay &&
        e.repeat === "none"
      );
    
      if (existingOverrideIndex !== -1) {
        events[existingOverrideIndex].completed = true;
      } else {
        events.push({
          title: selectedEvent.title,
          time: selectedEvent.time,
          day: selectedDay,
          month: currentMonth,
          year: currentYear,
          repeat: "none",
          completed: true
        });
      }
    };

    if (selectedEvent.repeat !== "none") {
      openConfirm(
        () => {
          for (const e of events) {
            if (e.title === selectedEvent.title && e.repeat === selectedEvent.repeat) {
              e.completed = true;
            }
          }
        },
        applySingle
      );
    } else {
      selectedEvent.completed = true;
      actionModal.style.display = "none";
      renderCalendar();
    }
  };

  document.getElementById("delete-event").onclick = () => {
    if (!selectedEvent) return;
    const applySingle = () => {
      // clone a non-recurring version to override this day only
      const instance = { ...selectedEvent, repeat: "none", deleted: true };
      instance.year = currentYear;
      instance.month = currentMonth;
      instance.day = selectedDay;
      events.push(instance);
    };

    if (selectedEvent.repeat !== "none") {
      openConfirm(
        () => {
          for (let i = events.length - 1; i >= 0; i--) {
            if (events[i].title === selectedEvent.title && events[i].repeat === selectedEvent.repeat) {
              events.splice(i, 1);
            }
          }
        },
        applySingle
      );
    } else {
      const index = events.indexOf(selectedEvent);
      if (index !== -1) events.splice(index, 1);
      actionModal.style.display = "none";
      renderCalendar();
    }
  };

  function handleEventClick(eventObj) {
    selectedEvent = eventObj;
    selectedDay = eventObj._renderedDay;
    document.getElementById("event-action-title").textContent = `"${eventObj.title}"`;
    actionModal.style.display = "block";
  }
 
  function renderCalendar() {
    dayList.innerHTML = ""; // Clear existing days

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    if (navDate) {
      const formatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
      navDate.textContent = formatter.format(new Date(currentYear, currentMonth));
    }
  
  //Empty cells before first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("li");
    emptyCell.className = "month-calendar__day";
    dayList.appendChild(emptyCell);
  }

  //Calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("li");
    dayCell.className = "month-calendar__day";
    dayCell.innerHTML = `
      <button class="month-calendar__day-label">${day}</button>
      <div class="month-calendar__event-list-wrapper">
        <ul class="event-list"></ul>
      </div>
    `;
    const eventList = dayCell.querySelector(".event-list");

    for (const e of events) {
      if (e.deleted) continue; // Skip deleted events
    
      const isThisDay =
        (e.year === currentYear && e.month === currentMonth && e.day === day) ||
        (e.repeat === "daily") ||
        (e.repeat === "weekly" && new Date(e.year, e.month, e.day).getDay() === new Date(currentYear, currentMonth, day).getDay()) ||
        (e.repeat === "monthly" && e.day === day);

        if (!isThisDay) continue;

        // 🛠️ FIX: skip showing recurring if overridden
        if (e.repeat !== "none") {
          const overrideExists = events.some(override =>
            override.title === e.title &&
            override.year === currentYear &&
            override.month === currentMonth &&
            override.day === day &&
            override.repeat === "none"
          );
          if (overrideExists) continue;
        }
      
        const finalEvent = e;
      
        const li = document.createElement("li");
        li.className = "event-list__item";
        const button = document.createElement("button");
        button.className = "event event--filled";
      
        if (finalEvent.completed) {
          button.style.backgroundColor = "#c8facc";
          button.style.textDecoration = "line-through";
        }
      
        button.innerHTML = `
          <span class="event__color"></span>
          <span class="event__title">${finalEvent.title}${finalEvent.time ? ` at ${finalEvent.time}` : ""}</span>
        `;
      
        button.addEventListener("click", () => {
          handleEventClick({
            ...finalEvent,
            _renderedDay: day,
            _renderedMonth: currentMonth,
            _renderedYear: currentYear,
          });
        });
      
        li.appendChild(button);
        eventList.appendChild(li);
      }

    dayList.appendChild(dayCell);
  }
}

async function createPatientDropdown() {
  const container = document.createElement('div');
  container.innerHTML = `
      <label for="patient-select">Select a Patient: </label>
      <select id="patient-select">
          <option value="">-- Select a Patient --</option>
      </select>
  `;
  // Insert at the top of the nav bar (adjust selector if needed)
  document.querySelector('.nav').prepend(container);  // ✅ Marked insertion point

  try {
      const res = await fetch('/api/patients');
      const patients = await res.json();
      const select = document.getElementById('patient-select');

      patients.forEach(p => {
          const option = document.createElement('option');
          option.value = p.username;
          option.textContent = `${p.firstname} (${p.username})`;
          select.appendChild(option);
      });

      // Listen for selection change to load patient calendar
      select.addEventListener('change', async (e) => {
          const username = e.target.value;
          if (username) {
              await loadPatientCalendar(username);
          }
      });
  } catch (err) {
      console.error('Error loading patient list:', err);
  }
}

async function loadPatientCalendar(username) {
  try {
      const res = await fetch(`/api/calendar/${username}`);
      const calendarData = await res.json();
      console.log(`Loaded calendar for ${username}:`, calendarData);

      events.length = 0; // Clear existing events
      events.push(...calendarData); // Load new events
      renderCalendar();
  } catch (err) {
      console.error('Error loading calendar:', err);
  }
}

  if (prevButton){
    prevButton.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
  }

  if (nextButton){
    nextButton.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
  }

  document.addEventListener("view-change", (event) => {
    const selectedView = event.detail.view;
    monthCalendarElement.style.display = selectedView === "month" ? "flex" : "none";
    weekCalendarElement.style.display = selectedView === "week" ? "flex" : "none";
    dayCalendarElement.style.display = selectedView === "day" ? "flex" : "none";
  });

  createEventButton.addEventListener("click", () => {
    eventModal.style.display = "block";
  });

  document.getElementById("close-modal").addEventListener("click", () => {
    eventModal.style.display = "none";
  });

  document.getElementById("event-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("event-title").value;
    const time = document.getElementById("event-time").value;
    const day = +document.getElementById("event-day").value;
    const month = +document.getElementById("event-month").value;
    const year = +document.getElementById("event-year").value;
    const repeat = document.getElementById("event-repeat").value;

    events.push({ title, time, day, month, year, repeat, completed: false });

    (async () => {
      const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
      let ownerUsername = user.username;

      const select = document.getElementById('patient-select');
      if (user.userType === 'doc') {
        if (select && select.value) {
            ownerUsername = select.value;
        } else {
            alert('Please select a patient before adding an event.');
            return;  // ⛔ Stop submission if no patient is picked
        }
      }

      try {
          await fetch(`/api/calendar/${ownerUsername}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(events),
          });
          console.log('Calendar saved successfully.');
      } catch (err) {
          console.error('Failed to save calendar:', err);
      }
    })();

    eventModal.style.display = "none";  
    renderCalendar();
  });

  renderCalendar();
}