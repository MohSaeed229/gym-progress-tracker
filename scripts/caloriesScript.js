document.addEventListener("DOMContentLoaded", function () {
    // ----- Step 1: Select Elements -----
    const ageInput = document.getElementById("age");
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const genderInputs = document.querySelectorAll("input[name='gender']");
    const activityLevelSelect = document.getElementById("activity-level");
    const goalSelect = document.getElementById("goal");
    const calculateBtn = document.getElementById("calculate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const resultDisplay = document.getElementById("calories-result");

    // ----- Step 2: Define Constants for Activity Levels -----
    const activityMultipliers = {
        "1.2": 1.2, 
        "1.375": 1.375, 
        "1.55": 1.55, 
        "1.725": 1.725, 
        "1.9": 1.9
    };
    

    // ----- Step 3: Calculate Calories -----
    function calculateCalories() {
        console.log("Starting calculation...");

        // Get user input values
        const age = parseInt(ageInput.value);
        const height = parseInt(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const selectedGender = document.querySelector("input[name='gender']:checked");
        const activityLevel = activityLevelSelect.value.trim();
        if (!activityMultipliers[activityLevel]) {
            console.log("Invalid activity level detected:", activityLevel);
            alert("Please select a valid activity level.");
            return;
        }
        
        const goal = goalSelect.value;

        console.log("Age:", age, "Height:", height, "Weight:", weight, "Activity Level (from dropdown):", activityLevel, "Goal:", goal);

        // Validate inputs
        if (isNaN(age) || age < 5 || age > 80) {
            alert("Please enter a valid age between 5 and 80.");
            return;
        }
        if (isNaN(height) || height < 100 || height > 250) {
            alert("Please enter a valid height between 100cm and 250cm.");
            return;
        }
        if (isNaN(weight) || weight < 30 || weight > 500) {
            alert("Please enter a valid weight between 30kg and 500kg.");
            return;
        }
        if (!selectedGender) {
            alert("Please select a gender.");
            return;
        }

        //  Fix: Ensure activity level is properly checked
        if (!activityLevel || !activityMultipliers.hasOwnProperty(activityLevel)) {
            console.log("Invalid activity level detected:", activityLevel);
            alert("Please select a valid activity level.");
            return;
        }

        if (!goal) {
            alert("Please select a goal.");
            return;
        }

        // Determine BMR (Basal Metabolic Rate) based on gender
        let bmr;
        if (selectedGender.value === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        console.log("BMR before activity adjustment:", bmr);

        // Adjust BMR based on activity level
        let dailyCalories = bmr * activityMultipliers[activityLevel];

        console.log("Calories before goal adjustment:", dailyCalories);

        // Adjust calories based on goal
        if (goal === "lose-weight") {
            dailyCalories -= 500; // Deficit for weight loss
        } else if (goal === "gain-weight") {
            dailyCalories += 500; // Surplus for muscle gain
        }

        console.log("Final Caloric Intake:", dailyCalories);

        // ----- Step 4: Display Result -----
        if (resultDisplay) { 
            resultDisplay.textContent = `Your daily calorie intake is ${Math.round(dailyCalories)} calories.`;
        }
    }

    // ----- Step 5: Reset Form -----
    function resetForm() {
        console.log("Resetting form...");

        // Clear inputs
        ageInput.value = "";
        heightInput.value = "";
        weightInput.value = "";

        // Unselect gender
        genderInputs.forEach(input => input.checked = false);

        // Reset dropdowns
        activityLevelSelect.selectedIndex = 0;
        goalSelect.selectedIndex = 0;

        // Reset result display
        if (resultDisplay) { 
            resultDisplay.textContent = "Your recommended daily calorie intake will appear here.";
        }
    }

    // ----- Step 6: Add Event Listeners -----
    calculateBtn.addEventListener("click", calculateCalories);
    resetBtn.addEventListener("click", resetForm);
});
