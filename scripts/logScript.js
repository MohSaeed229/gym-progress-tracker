/* ---------- Exercise Popup ---------- */
//  Select Elements
const addExerciseBtn = document.querySelector("#add-exercise-btn"); // + Add Exercise button
const exercisePopup = document.querySelector("#exercise-popup"); // The popup container
const closePopupBtn = document.querySelector("#close-popup"); //  Close button inside the popup
const overlay = document.querySelector("#overlay"); // The dimmed background overlay

//  Function to Show Popup
const showPopup = () => {
    exercisePopup.classList.add("show"); // Make the popup visible
    overlay.classList.add("active"); // Show overlay
};

//  Function to Hide Popup
const hidePopup = () => {
    exercisePopup.classList.remove("show"); // Hide popup
    overlay.classList.remove("active"); // Hide overlay
};

// Popup Event Listeners
addExerciseBtn.addEventListener("click", showPopup); // Open popup when + Add Exercise is clicked
closePopupBtn.addEventListener("click", hidePopup); // Close popup when  is clicked
overlay.addEventListener("click", hidePopup); // Close popup when clicking outside

//  Close Popup on ESC Key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hidePopup(); // Hide popup when ESC is pressed
    }
});

/*---------- Exercise Logging ----------*/

//  Select Elements
const logForm = document.querySelector("#log-form"); // Form
const exerciseList = document.querySelector("#exercise-list"); // Logged Exercises List


//  Function to Add Exercise
const addExercise = (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    //  Get Form Values
    const date = document.querySelector("#date").value;
    const muscle = document.querySelector("#muscle-trained").value;
    const exerciseName = document.querySelector("#exercise").value;
    const weights = document.querySelector("#weights").value;
    const sets = document.querySelector("#sets").value;
    const reps = document.querySelector("#reps").value;
    const notes = document.querySelector("#notes").value.trim();

    //  Create Exercise Entry
    const exerciseItem = document.createElement("li");
    exerciseItem.classList.add("list-group-item");

    //  Exercise Content (with conditional notes display)
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

    //  Add Exercise to the List
    exerciseList.appendChild(exerciseItem);

    //  Clear the Form
    logForm.reset();

    //  Close the Popup
    exercisePopup.classList.remove("show");
    overlay.classList.remove("active");
};

//  Add Event Listener to the Form Submission
logForm.addEventListener("submit", addExercise);

/* ---------- Exercise Editing ---------- */
