/* ---------- Exercise Popup ---------- */
// Select Elements
const addExerciseBtn = document.querySelector("#add-exercise-btn"); // + Add Exercise button
const exercisePopup = document.querySelector("#exercise-popup"); // The popup container
const closePopupBtn = document.querySelector("#close-popup"); // Close button inside the popup
const overlay = document.querySelector("#overlay"); // The dimmed background overlay
const logForm = document.querySelector("#log-form"); // Form
const exerciseList = document.querySelector("#exercise-list"); // Logged Exercises List
/* ---------- Restrict Future Dates for Adding & Editing ---------- */

// Get the workout date input
const workoutDateInput = document.querySelector("#date");

// Set the max date to today
const today = new Date().toISOString().split("T")[0];
workoutDateInput.setAttribute("max", today);

// Prevent users from selecting a future date manually
workoutDateInput.addEventListener("change", () => {
    if (workoutDateInput.value > today) {
        alert("You cannot select a future date.");
        workoutDateInput.value = today; // Reset to today if a future date is selected
    }
});

// Variable to track the exercise being edited
let editingExercise = null;

// Function to Show Popup
const showPopup = () => {
    exercisePopup.classList.add("show"); // Make the popup visible
    overlay.classList.add("active"); // Show overlay
};

// Function to Hide Popup
const hidePopup = () => {
    exercisePopup.classList.remove("show"); // Hide popup
    overlay.classList.remove("active"); // Hide overlay

    // Reset editing mode when popup closes
    if (editingExercise) {
        editingExercise.classList.remove("editing");
        editingExercise = null;
    }
    logForm.reset();
};

// Popup Event Listeners
addExerciseBtn.addEventListener("click", showPopup); // Open popup when + Add Exercise is clicked
closePopupBtn.addEventListener("click", hidePopup); // Close popup when  is clicked
overlay.addEventListener("click", hidePopup); // Close popup when clicking outside

// Close Popup on ESC Key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hidePopup();
    }
});

/* ---------- Exercise Logging (Adding & Editing) ---------- */

// Function to Add or Edit Exercise
const addOrEditExercise = (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get Form Values
    const date = document.querySelector("#date").value;
    const muscle = document.querySelector("#muscle-trained").value;
    const exerciseName = document.querySelector("#exercise").value;
    const weights = document.querySelector("#weights").value;
    const sets = document.querySelector("#sets").value;
    const reps = document.querySelector("#reps").value;
    const notes = document.querySelector("#notes").value.trim();

    // Create an exercise object
    const exerciseData = {
        id: editingExercise ? editingExercise.getAttribute("data-id") : '_' + Math.random().toString(36).substr(2, 9), // Preserve ID if editing, otherwise generate new one
        name: exerciseName,
        date: date,
        muscle: muscle,
        weight: weights,
        sets: sets,
        reps: reps,
        notes: notes
    };
    

    if (editingExercise) {
        // Update the existing exercise
        editingExercise.innerHTML = `
            <div class="d-flex flex-column">
                <span class="fw-bold">${exerciseName}</span>
                <small>📅 <strong>Date:</strong> ${date}</small>
                <small>💪 <strong>Muscle Trained:</strong> ${muscle}</small>
                <small>🏋️‍♂️ <strong>Weights Used:</strong> ${weights}</small>
                <small>🔢 <strong>Sets:</strong> ${sets} | 🔄 <strong>Reps:</strong> ${reps}</small>
                ${notes ? `<small>📝 <strong>Notes:</strong> ${notes}</small>` : ""}
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-sm btn-edit">Edit</button>
                    <button class="btn btn-sm btn-delete">Delete</button>
                </div>
            </div>
        `;

        // Update LocalStorage
        updateExerciseInLocalStorage(exerciseData);

        // Reattach event listeners
        attachExerciseListeners(editingExercise);
        editingExercise.classList.remove("editing");
        editingExercise = null;
    } else {
        // Create a new exercise entry
        const exerciseItem = document.createElement("li");
        exerciseItem.classList.add("list-group-item");

        exerciseItem.innerHTML = `
            <div class="d-flex flex-column">
                <span class="fw-bold">${exerciseName}</span>
                <small>📅 <strong>Date:</strong> ${date}</small>
                <small>💪 <strong>Muscle Trained:</strong> ${muscle}</small>
                <small>🏋️‍♂️ <strong>Weights Used:</strong> ${weights}</small>
                <small>🔢 <strong>Sets:</strong> ${sets} | 🔄 <strong>Reps:</strong> ${reps}</small>
                ${notes ? `<small>📝 <strong>Notes:</strong> ${notes}</small>` : ""}
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-sm btn-edit">Edit</button>
                    <button class="btn btn-sm btn-delete">Delete</button>
                </div>
            </div>
        `;

        // Add new exercise to the list
        exerciseList.appendChild(exerciseItem);
        attachExerciseListeners(exerciseItem);

        // Save to LocalStorage and ensure sorting
        saveExerciseToLocalStorage(exerciseData);
        loadExercisesFromLocalStorage(); // Refresh UI to reflect sorted order

    }

    // Clear Form & Close Popup
    logForm.reset();
    hidePopup();
};

// Function to Save Exercise to LocalStorage
const saveExerciseToLocalStorage = (exercise) => {
    let exercises = JSON.parse(localStorage.getItem("exercises")) || [];

    // Ensure date is stored in correct format
    exercise.date = new Date(exercise.date).toISOString().split("T")[0];

    // Add the new exercise
    exercises.push(exercise);

    // 🔥 Sort before saving (Oldest First)
    exercises.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Save updated list to LocalStorage
    localStorage.setItem("exercises", JSON.stringify(exercises));
};


// Function to Update an Edited Exercise in LocalStorage
const updateExerciseInLocalStorage = (updatedExercise) => {
    let exercises = JSON.parse(localStorage.getItem("exercises")) || [];

    // Find and update ONLY the selected exercise using ID
    exercises = exercises.map(exercise =>
        exercise.id === updatedExercise.id ? { ...exercise, ...updatedExercise } : exercise
    );

    // 🔥 Ensure sorting after update (Oldest → Newest)
    exercises.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Save back to LocalStorage
    localStorage.setItem("exercises", JSON.stringify(exercises));

    // Reload UI to reflect correct order
    loadExercisesFromLocalStorage();
};


// Function to Load Exercises from LocalStorage on Page Load
const loadExercisesFromLocalStorage = () => {
    let exercises = JSON.parse(localStorage.getItem("exercises")) || [];

    // 🔥 Sort exercises by date (Oldest First)
    exercises.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Clear UI before displaying sorted exercises
    exerciseList.innerHTML = "";
    exercises.forEach(exercise => displayExercise(exercise));
};


// Function to Display an Exercise in the UI
const displayExercise = (exerciseData) => {
    const exerciseItem = document.createElement("li");
    exerciseItem.classList.add("list-group-item");
    exerciseItem.setAttribute("data-id", exerciseData.id);


    exerciseItem.innerHTML = `
        <div class="d-flex flex-column">
            <span class="fw-bold">${exerciseData.name}</span>
            <small>📅 <strong>Date:</strong> ${exerciseData.date}</small>
            <small>💪 <strong>Muscle Trained:</strong> ${exerciseData.muscle}</small>
            <small>🏋️‍♂️ <strong>Weights Used:</strong> ${exerciseData.weight}</small>
            <small>🔢 <strong>Sets:</strong> ${exerciseData.sets} | 🔄 <strong>Reps:</strong> ${exerciseData.reps}</small>
            ${exerciseData.notes ? `<small>📝 <strong>Notes:</strong> ${exerciseData.notes}</small>` : ""}
            <div class="d-flex gap-2 mt-2">
                <button class="btn btn-sm btn-edit">Edit</button>
                <button class="btn btn-sm btn-delete">Delete</button>
            </div>
        </div>
    `;

    // Append to exercise list
    exerciseList.appendChild(exerciseItem);
    attachExerciseListeners(exerciseItem);
};

// Load Exercises When Page Loads
document.addEventListener("DOMContentLoaded", loadExercisesFromLocalStorage);

// Attach event listeners to edit and delete buttons dynamically
const attachExerciseListeners = (exerciseItem) => {
    exerciseItem.querySelector(".btn-edit").addEventListener("click", () => editExercise(exerciseItem));
    exerciseItem.querySelector(".btn-delete").addEventListener("click", () => deleteExercise(exerciseItem));
};

// Edit Exercise Function
const editExercise = (exerciseItem) => {
    // Populate form with existing data
    const details = exerciseItem.querySelectorAll("small");
    document.querySelector("#date").value = details[0].innerText.replace("📅 Date: ", "");
    document.querySelector("#muscle-trained").value = details[1].innerText.replace("💪 Muscle Trained: ", "");
    document.querySelector("#exercise").value = exerciseItem.querySelector("span").innerText;
    document.querySelector("#weights").value = details[2].innerText.replace("🏋️‍♂️ Weights Used: ", "");
    document.querySelector("#sets").value = details[3].innerText.replace("🔢 Sets: ", "").split("|")[0].trim();
    document.querySelector("#reps").value = details[3].innerText.replace("🔢 Sets: ", "").split("| 🔄 Reps: ")[1];
    document.querySelector("#notes").value = details.length > 4 ? details[4].innerText.replace("📝 Notes: ", "") : "";

    // Set editing mode
    editingExercise = exerciseItem;
    editingExercise.classList.add("editing"); // Highlight the selected exercise
    showPopup();
};

/* ---------- Exercise Deleting ---------- */

// Delete Exercise Function
// Delete Exercise Function (Removes from LocalStorage)
const deleteExercise = (exerciseItem) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
        let exerciseName = exerciseItem.querySelector(".fw-bold").innerText;
        let exerciseDate = exerciseItem.querySelector("small").innerText.split(": ")[1];

        // Remove from LocalStorage
        let exercises = JSON.parse(localStorage.getItem("exercises")) || [];
        exercises = exercises.filter(exercise => !(exercise.name === exerciseName && exercise.date === exerciseDate));
        localStorage.setItem("exercises", JSON.stringify(exercises));

        // Remove from UI
        exerciseItem.remove();
        localStorage.setItem("exercises", JSON.stringify(exercises));
loadExercisesFromLocalStorage(); // Reload to maintain correct order

    }
};


// Attach submit event to form
logForm.addEventListener("submit", addOrEditExercise);

/* ---------- Exercise Filtering Functionalities ---------- */
/* ---------- Exercise Selection Display ---------- */

document.addEventListener("DOMContentLoaded", function () {
    // Elements for Muscle Filter
    const muscleFilterBtn = document.getElementById("muscle-filter-btn");
    const muscleCheckboxes = document.querySelectorAll(".form-check-input");
    const clearMuscleSelectionBtn = document.getElementById("clear-muscle-selection");

    // Elements for Time Interval Filter
    const timeFilterBtn = document.getElementById("time-filter-btn");
    const timeOptions = document.querySelectorAll(".time-option");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const dateRangeContainer = document.getElementById("date-range");
    const dateRangeEndContainer = document.getElementById("date-range-end");
    const clearDateSelectionBtn = document.getElementById("clear-date-selection");

    let selectedMuscles = [];
    let selectedTimeInterval = "";

    // ----- Handle Muscle Selection -----
    function updateMuscleButtonText() {
        selectedMuscles = Array.from(muscleCheckboxes)
            .filter(chk => chk.checked)
            .map(chk => chk.labels[0].innerText);

        muscleFilterBtn.textContent = selectedMuscles.length > 0 
            ? selectedMuscles.join(", ") 
            : "Select Muscles";
    }

    muscleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateMuscleButtonText);
    });

    // Clear Muscle Selection
    clearMuscleSelectionBtn.addEventListener("click", function () {
        muscleCheckboxes.forEach(chk => chk.checked = false);
        updateMuscleButtonText();
    });

    // ----- Handle Time Interval Selection -----
    timeOptions.forEach(option => {
        option.addEventListener("click", function (e) {
            e.preventDefault();
            selectedTimeInterval = this.getAttribute("data-value");

            // Update button text
            if (selectedTimeInterval === "custom") {
                dateRangeContainer.classList.remove("d-none");
                dateRangeEndContainer.classList.remove("d-none");
                timeFilterBtn.textContent = "Custom Date: Select Range";
            } else {
                dateRangeContainer.classList.add("d-none");
                dateRangeEndContainer.classList.add("d-none");
                timeFilterBtn.textContent = this.textContent;
            }
        });
    });
// Prevent selecting an end date before the start date
startDateInput.addEventListener("change", function () {
    if (startDateInput.value) {
        endDateInput.setAttribute("min", startDateInput.value);
    }
});

    // Update Time Interval Button with Custom Dates
    function updateCustomDateText() {
        if (startDateInput.value && endDateInput.value) {
            timeFilterBtn.textContent = `Custom Date: ${startDateInput.value} - ${endDateInput.value}`;
        }
    }

    startDateInput.addEventListener("change", updateCustomDateText);
    endDateInput.addEventListener("change", updateCustomDateText);

    // Clear Date Selection
    clearDateSelectionBtn.addEventListener("click", function () {
        selectedTimeInterval = "";
        timeFilterBtn.textContent = "Select Time Interval";
        dateRangeContainer.classList.add("d-none");
        dateRangeEndContainer.classList.add("d-none");
        startDateInput.value = "";
        endDateInput.value = "";
    });
});
// Prevent dropdown from closing when clicking inside
document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('click', (event) => {
        event.stopPropagation(); // Stops the dropdown from closing
    });
});

// Clear checkboxes without closing the dropdown
document.getElementById("clear-muscle-selection").addEventListener("click", () => {
    document.querySelectorAll(".dropdown-menu .form-check-input").forEach(checkbox => {
        checkbox.checked = false; // Uncheck all
    });
});

/* ---------- Exercise Filtering ---------- */


/* ---------- Muscle & Date Filtering ---------- */
document.addEventListener("DOMContentLoaded", function () {
    const applyFiltersBtn = document.getElementById("apply-filters");
    const resetFiltersBtn = document.getElementById("reset-filters");
    const noExercisesMessage = document.getElementById("no-exercises-message");

    // Muscle Filter Elements
    const muscleCheckboxes = document.querySelectorAll(".form-check-input");

    // Date Filter Elements
    const timeFilterBtn = document.getElementById("time-filter-btn");
    const timeOptions = document.querySelectorAll(".time-option");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    // ----- Step 1: Extract Selected Muscles -----
    function getSelectedMuscles() {
        return Array.from(muscleCheckboxes)
            .filter(chk => chk.checked)
            .map(chk => chk.labels[0].innerText.toLowerCase().trim());
    }

    // ----- Step 2: Extract Selected Date Range -----
    function getSelectedDateRange() {
        let startDate = null, endDate = null;
        const selectedInterval = timeFilterBtn.getAttribute("data-selected");

        if (selectedInterval === "7") {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        } else if (selectedInterval === "14") {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 14);
        } else if (selectedInterval === "30") {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        } else if (selectedInterval === "custom") {
            if (startDateInput.value) startDate = new Date(startDateInput.value);
            if (endDateInput.value) endDate = new Date(endDateInput.value);
        }

        return { startDate, endDate };
    }

    // ----- Step 3: Extract Exercise Data -----
    function extractExerciseDetails(exercise) {
        const muscleElement = Array.from(exercise.querySelectorAll("small")).find(el =>
            el.textContent.includes("Muscle Trained:")
        );
        const dateElement = Array.from(exercise.querySelectorAll("small")).find(el =>
            el.textContent.includes("Date:")
        );

        return {
            muscle: muscleElement ? muscleElement.textContent.split(":")[1].trim().toLowerCase() : null,
            date: dateElement ? new Date(dateElement.textContent.split(":")[1].trim()) : null,
        };
    }

    // ----- Step 4: Apply Filters -----
    applyFiltersBtn.addEventListener("click", function () {
        console.log("Filtering function is running!");
    
        const selectedMuscles = getSelectedMuscles();
        console.log("Selected Muscles:", selectedMuscles);
    
        const { startDate, endDate } = getSelectedDateRange();
        console.log(`Selected Date Range: ${startDate} to ${endDate}`);
    
        const exercises = Array.from(document.querySelectorAll("#exercise-list .list-group-item"));
        let filteredExercises = [];
    
        exercises.forEach(exercise => {
            const { muscle, date } = extractExerciseDetails(exercise);
            console.log(`Exercise Muscle: ${muscle}, Exercise Date: ${date}`);
    
            // Check if muscle matches (if muscles are selected)
            const matchesMuscle = selectedMuscles.length === 0 || selectedMuscles.includes(muscle);
    
            // Check if date matches (if a date filter is applied)
            const matchesDate = (!startDate && !endDate) || (date && (!startDate || date >= startDate) && (!endDate || date <= endDate));
    
            // Add to filtered list if it matches both conditions
            if (matchesMuscle && matchesDate) {
                filteredExercises.push(exercise);
            }
        });
    
        // 🔥 Ensure sorting before displaying filtered exercises (Oldest → Newest)
        filteredExercises.sort((a, b) => {
            const dateA = new Date(extractExerciseDetails(a).date);
            const dateB = new Date(extractExerciseDetails(b).date);
            return dateA - dateB; // Sorts from Oldest to Newest
        });
    
        // Clear UI before displaying sorted, filtered results
        exerciseList.innerHTML = "";
        filteredExercises.forEach(exercise => exerciseList.appendChild(exercise));
    
        // ✅ Show "No exercises found" only if no exercises match the filter
        if (filteredExercises.length === 0) {
            noExercisesMessage.classList.remove("d-none");
        } else {
            noExercisesMessage.classList.add("d-none");
        }
    });
    
    
    

// ----- Step 5: Reset Filters -----
resetFiltersBtn.addEventListener("click", function () {
    console.log("Resetting filters...");

    // Uncheck all muscle checkboxes
    muscleCheckboxes.forEach(chk => (chk.checked = false));

    // Reset muscle filter display text
    const muscleFilterBtn = document.getElementById("muscle-filter-btn");
    if (muscleFilterBtn) {
        muscleFilterBtn.textContent = "Select Muscles";
    }

    // Reset time interval
    timeFilterBtn.textContent = "Select Time Interval";
    timeFilterBtn.removeAttribute("data-selected");

    // Clear date inputs
    startDateInput.value = "";
    endDateInput.value = "";

    // Hide the custom date fields
    startDateInput.parentElement.classList.add("d-none");
    endDateInput.parentElement.classList.add("d-none");

    // 🔥 Reload ALL exercises in the correct order (Oldest → Newest)
    loadExercisesFromLocalStorage();

    // ✅ Hide "No Exercises Found" message after reset
    noExercisesMessage.classList.add("d-none");
});

    
    

    // ----- Step 6: Handle Time Interval Selection -----
    timeOptions.forEach(option => {
        option.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedInterval = this.getAttribute("data-value");
            timeFilterBtn.setAttribute("data-selected", selectedInterval);

            if (selectedInterval === "custom") {
                startDateInput.parentElement.classList.remove("d-none");
                endDateInput.parentElement.classList.remove("d-none");
                timeFilterBtn.textContent = "Custom Date: Select Range";
            } else {
                startDateInput.parentElement.classList.add("d-none");
                endDateInput.parentElement.classList.add("d-none");
                timeFilterBtn.textContent = this.textContent;
            }
        });
    });
});

