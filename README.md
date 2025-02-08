# Gym Progress Tracker

## Overview
The Gym Progress Tracker is a simple web app designed to help users log their workouts and calculate daily calorie needs. It includes:

- **Exercise Log:** Add, edit, filter, and delete workouts.
- **Calories Calculator:** Estimate daily calorie intake based on user data.
- **Dark Mode:** Toggle dark mode from the home page, applied across all pages.

## How to Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/gym-progress-tracker.git
   cd gym-progress-tracker
2. **Open index.html in a browser – No backend required.**
3. **Ensure Font Awesome & Bootstrap are working – If icons don’t show, check CDN links in index.html.**
4. **Test Features – Navigate between pages, log exercises, use the calculator, and toggle dark mode.**

## Project Structure
**│── index.html**          # Home Page with Navigation & Dark Mode Toggle

**│── log.html**             # Exercise Log Page

**│── calories.html**        # Calories Calculator Page

**│── styles/** # CSS directory

   **│   ├── styles.css**      # Main stylesheet

   **│   ├── log-styles.css**   # Log Page styles

   **│   ├── calories-styles.css** # Calculator styles

**│── scripts/** # JavaScript directory

   **│   ├── script.js**        # General scripts (Dark Mode)

   **│   ├── logScript.js**     # Exercise logging functionalities

   **│   ├── caloriesScript.js** # Calories calculator functionalities

**│── README.md**            # Project Documentation

## Future Improvements
1.**Progress Charts:** Add visual graphs to track workout progress.

2.**User Accounts:** Save logs under individual profiles.

3.**Meal Planning:** Allow users to create and track meal plans based on their fitness goals.

4.**Workout Tutorials:** Integrate video or text-based workout tutorials for exercises.

## Summary
A lightweight, browser-based app for tracking workouts and calorie intake. Built with HTML, CSS, and JavaScript. Just open it in a browser and start logging.
