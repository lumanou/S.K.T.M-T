document.addEventListener('DOMContentLoaded', () => {
    const activityList = document.getElementById('activity-list');
    const stepsInput = document.getElementById('steps');
    const kmsInput = document.getElementById('kms');
    const saveButton = document.getElementById('save');
    const deleteButton = document.getElementById('delete');
    const deleteLastButton = document.getElementById('delete-last');
    const totalStepsEl = document.getElementById('total-steps');
    const totalKmsEl = document.getElementById('total-kms');
    const userNameInput = document.getElementById('user-name');
    const welcomeMessage = document.getElementById('welcome-message');
    const darkModeToggleButton = document.getElementById('dark-mode-btn');
    const matchInput = document.getElementById('match-input');
    const matchList = document.getElementById('match-list');
    const deleteMatchButton = document.getElementById('delete-match');

    loadActivity();
    loadMatches();
    loadUserName();  
    loadDarkMode(); 
    updateDarkModeButtonText();

    document.body.style.overflow = 'auto'; // Enable scrolling


    saveButton.addEventListener('click', () => {
        const steps = stepsInput.value;
        const kms = kmsInput.value;
        if (steps || kms) {
            saveActivity(steps, kms);
            stepsInput.value = '';
            kmsInput.value = '';
        }
    });

    deleteButton.addEventListener('click', () => {
        localStorage.removeItem('activity');
        loadActivity();
    });

    deleteLastButton.addEventListener('click', () => {
        const date = new Date().toLocaleDateString();
        const savedActivity = JSON.parse(localStorage.getItem('activity')) || {};

        if (savedActivity[date] && savedActivity[date].length > 0) {
            savedActivity[date].pop();
            if (savedActivity[date].length === 0) {
                delete savedActivity[date];
            }
            localStorage.setItem('activity', JSON.stringify(savedActivity));
            loadActivity();
        }
    });

    userNameInput.addEventListener('input', () => {
        const userName = userNameInput.value.trim();
        saveUserName(userName);
        welcomeMessage.textContent = `Welcome, ${userName}.`;
    });

    matchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const matchDetails = matchInput.value.trim();
            if (matchDetails) {
                saveMatch(matchDetails);
                matchInput.value = ''; 
            }
        }
    });

    deleteMatchButton.addEventListener('click', () => {
        localStorage.removeItem('matches');
        loadMatches();
    });

    
    darkModeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        updateDarkModeButtonText();
    });

    
    function saveActivity(steps, kms) {
        const date = new Date().toLocaleDateString();
        const savedActivity = JSON.parse(localStorage.getItem('activity')) || {};

        if (!savedActivity[date]) {
            savedActivity[date] = [];
        }
        savedActivity[date].push({ steps, kms });

        localStorage.setItem('activity', JSON.stringify(savedActivity));
        loadActivity();
    }

    function loadActivity() {
        activityList.innerHTML = '';
        const savedActivity = JSON.parse(localStorage.getItem('activity')) || {};
        let totalSteps = 0;
        let totalKms = 0;

        for (const [date, activities] of Object.entries(savedActivity)) {
            const listItem = document.createElement('li');
            listItem.textContent = `Date: ${date}`;

            const activityDetails = activities.map(a => `${a.steps} steps, ${a.kms} km`).join(', ');
            listItem.textContent += ` - ${activityDetails}`;

            activityList.appendChild(listItem);

            for (const activity of activities) {
                totalSteps += parseInt(activity.steps);
                totalKms += parseFloat(activity.kms);
            }
        }

        totalStepsEl.textContent = `Total Steps: ${totalSteps}`;
        totalKmsEl.textContent = `Total Kilometers: ${totalKms.toFixed(2)} km`;
    }

    // Functions for saving tennis match info
    function saveMatch(matchDetails) {
        const savedMatches = JSON.parse(localStorage.getItem('matches')) || [];
        savedMatches.push(matchDetails);

        localStorage.setItem('matches', JSON.stringify(savedMatches));
        loadMatches();
    }

    function loadMatches() {
        matchList.innerHTML = '';
        const savedMatches = JSON.parse(localStorage.getItem('matches')) || [];
    
        savedMatches.forEach((match) => {
            const listItem = document.createElement('li');
            
            
            listItem.classList.remove('match-green', 'match-orange');
            
            
            if (match.includes('Zoki')) {
                listItem.classList.add('match-green');
            } else if (match.includes('Benovic')) {
                listItem.classList.add('match-orange');
            }
    
            listItem.textContent = match;
            matchList.appendChild(listItem);
        });
    }
    

    
    function saveUserName(name) {
        localStorage.setItem('userName', name);
    }

    function loadUserName() {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            userNameInput.value = savedName;
            welcomeMessage.textContent = `Welcome, ${savedName}.`;
        }
    }

    
    function loadDarkMode() {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    function updateDarkModeButtonText() {
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggleButton.textContent = 'Switch Mode';
        } else {
            darkModeToggleButton.textContent = 'Switch Mode';
        }
    }
});
