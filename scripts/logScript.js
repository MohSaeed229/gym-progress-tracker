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

    // If editing, update the existing exercise
    if (editingExercise) {
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

        // Reattach event listeners for edit and delete buttons
        attachExerciseListeners(editingExercise);
        editingExercise.classList.remove("editing"); // Remove highlight
        editingExercise = null; // Reset editing mode

    } else {
        // Create New Exercise Entry
        const exerciseItem = document.createElement("li");
        exerciseItem.classList.add("list-group-item");

        // Set HTML for New Exercise
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

        // Add New Exercise to List
        exerciseList.appendChild(exerciseItem);
        attachExerciseListeners(exerciseItem);
    }

    // Clear Form & Close Popup
    logForm.reset();
    hidePopup();
};

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
const deleteExercise = (exerciseItem) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
        exerciseItem.remove();
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


/* ---------- Muscle Filtering ---------- */
document.addEventListener("DOMContentLoaded", function () {
    const applyFiltersBtn = document.getElementById("apply-filters");
    const resetFiltersBtn = document.getElementById("reset-filters");
    const noExercisesMessage = document.getElementById("no-exercises-message");

    const muscleCheckboxes = document.querySelectorAll(".form-check-input");

    // ----- Step 1: Extract Selected Muscles -----
    function getSelectedMuscles() {
        return Array.from(muscleCheckboxes)
            .filter(chk => chk.checked)
            .map(chk => chk.labels[0].innerText.toLowerCase().trim());
    }

    // ----- Step 2: Extract Muscle Data from Exercise -----
    function extractExerciseMuscle(exercise) {
        const muscleElement = Array.from(exercise.querySelectorAll("small")).find(el =>
            el.textContent.includes("Muscle Trained:")
        );

        if (!muscleElement) return null;

        return muscleElement.textContent.split(":")[1].trim().toLowerCase();
    }

    // ----- Step 3: Apply Muscle Filter -----
    applyFiltersBtn.addEventListener("click", function () {
        console.log("Filtering function is running!");

        const selectedMuscles = getSelectedMuscles();
        console.log("Selected Muscles:", selectedMuscles);

        const exercises = document.querySelectorAll("#exercise-list .list-group-item"); // Fetch exercises fresh
        console.log("Exercises:", exercises);

        let hasMatchingExercises = false;

        exercises.forEach(exercise => {
            const muscle = extractExerciseMuscle(exercise);
            console.log("Exercise Muscle:", muscle);

            if (!muscle) return;

            const matchesMuscle = selectedMuscles.length === 0 || selectedMuscles.includes(muscle);

            if (matchesMuscle) {
                exercise.classList.remove("d-none");
                hasMatchingExercises = true;
            } else {
                exercise.classList.add("d-none");
            }
        });

        // Handle "No Exercises Found" Message
        if (hasMatchingExercises) {
            noExercisesMessage.classList.add("d-none");
        } else {
            noExercisesMessage.classList.remove("d-none");
        }
    });

    // ----- Step 5: Reset Filters -----
    resetFiltersBtn.addEventListener("click", function () {
        const exercises = document.querySelectorAll("#exercise-list .list-group-item"); // Fetch fresh
        muscleCheckboxes.forEach(chk => (chk.checked = false));

        exercises.forEach(exercise => exercise.classList.remove("d-none"));
        noExercisesMessage.classList.add("d-none");
    });
});
