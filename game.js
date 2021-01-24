// Global variables
let CorrectModal;
let IncorrectModal;
let ActiveQuiz;
let Difficulty = 1;
let SetToPlay;
let SetName;
let PlayEntireSet = false; 

// Question class
class Question {
    // Constructor
    constructor (query, zoom, formatName, acceptedAnswers) {
        // Set parent variables
        this.Query = query;
        this.Zoom = zoom;
        this.FormatName = formatName;
        this.AcceptedAnswers = acceptedAnswers;
    }
}

// All cities
let Cities = {
    // Scheme: ISO 3166-2 country and subdivison code c and d, and city name n: cd_n
    NO11_Sandnes: new Question("Sandnes,Rogaland,Norway", 14, "Sandnes", ["sandnes"]),
    NO11_Stavanger: new Question("Stavanger,Rogaland,Norway", 14, "Stavanger", ["stavanger"]),
    NO11_Egersund: new Question("Egersund,Rogaland,Norway", 14, "Egersund", ["egersund", "eigersund"]),
    NO11_Haugesund: new Question("Haugesund,Rogaland,Norway", 14, "Haugesund", ["haugesund"]),
    NO46_Bergen: new Question("Torgalmenningen,Bergen,Norway", 12, "Bergen", ["bergen"]),
    NO03_Oslo: new Question("Barcode%20Project,Norway", 13, "Oslo", ["oslo"]),
    NO50_Trondheim: new Question("Trondheim,Norway", 13, "Trondheim", ["trondheim", "trondhjem"]),

};

// City groups
let CityGroups = {
    "norway": {
        FormatName: "Norway",
        Cities: [
            Cities.NO11_Sandnes,
            Cities.NO11_Stavanger,
            Cities.NO11_Egersund,
            Cities.NO11_Haugesund,
            Cities.NO46_Bergen,
            Cities.NO03_Oslo,
            Cities.NO50_Trondheim
        ]
    }
};

// Quiz class
class Quiz {
    // Constructor
    constructor (questions, attempts, isMultipleChoice, questionCount) {
        // Set parent variables
        this.Questions = questions;
        this.IsMultipleChoice = isMultipleChoice;
        questionCount = questionCount ?? questions.length;

        // Check that attempts is in range
        if (attempts > 0) {
            this.Attempts = attempts;
        }
        else {
            throw new Error(`Attempts is out of range (${attempts}), must be greater than 0.`)
        }

        // Check that questioncount is in range
        if (questionCount <= 0) {
            throw new Error(`QuestionCount is out of range (${questionCount}), must be greater than 0.`)
        }
        else if (questionCount > questions.length) {
            throw new Error(`QuestionCount is out of range (${questionCount}), must be less than or equal to the amount of questions.`)
        }
        else {
            this.QuestionCount = questionCount
        }

        // Decide which questions are to be asked
        // Shuffle array and slice
        this.QuestionsToAsk = shuffle(questions).slice(0, questionCount);

        // Start the quiz
        this.StartQuiz();
    }
    
    // Start quiz
    StartQuiz() {
        // Show the correct inputs for the selected input type
        if (this.IsMultipleChoice) {
            document.getElementById("mcinput").style.display = "block";
            document.getElementById("textinput").style.display = "none";
        }
        else {
            document.getElementById("mcinput").style.display = "none";
            document.getElementById("textinput").style.display = "block";
            document.getElementById("attempt").textContent = 1;
            document.getElementById("attempts").textContent = this.Attempts;
        }

        // Toggle attempt counter based on attempt allowance
        if (this.Attempts == 1 || this.IsMultipleChoice) {
            document.getElementById("attemptcounter").style.display = "none";
        }
        else {
            document.getElementById("attemptcounter").style.display = "initial";
        }

        // Save the current time
        this.StartTime = new Date();

        // Initialize variables
        this.Points = 0;
        this.Round = 0;
        this.Attempt = 0;
        this.Log = [];

        // Print counters
        document.getElementById("currentround").textContent = 1;
        document.getElementById("roundcount").textContent = this.QuestionCount;
        document.getElementById("points").textContent = 0;

        // Clean validation
        document.getElementById("cityinput").className = "form-control";
        document.getElementById("noneselectederror").style.display = "none";

        // Deselect all radios
        document.getElementById("radio0").checked = false;
        document.getElementById("radio1").checked = false;
        document.getElementById("radio2").checked = false;
        document.getElementById("radio3").checked = false;

        // Cycle pages
        document.getElementById("options-page").style.display = "none";
        document.getElementById("game-page").style.display = "block";

        // Ask first question
        this.AskQuestion(0);
    }

    // Ask question
    AskQuestion(Index) {
        // Check that index is within bounds
        if (Index < 0) {
            throw new Error(`Index is out of bounds (${Index}), must be greater than or equal to 0.`);
        }
        else if (Index >= this.QuestionCount || Index >= this.QuestionsToAsk.length) {
            throw new Error(`Index is out of bounds (${Index}), must be less than questions to ask.`);
        }

        // Print applicable image
        document.getElementById("questionimage").src = `https://maps.googleapis.com/maps/api/staticmap?center=${this.QuestionsToAsk[Index].Query}&zoom=${this.QuestionsToAsk[Index].Zoom}&size=640x400&scale=2&maptype=satellite&key=AIzaSyCuRDcyNsXWxQuXc6Z5sMyVJohxDC3BXtA`;

        // Check what input method is beeing used
        if (!this.IsMultipleChoice) {
            // Clear input field
            document.getElementById("cityinput").value = "";

            // Focus on input field
            document.getElementById("cityinput").focus();
        }
        else {
            // Create alternatives
            let Alternatives = [this.QuestionsToAsk[Index].FormatName];

            // Randomize array of all questions
            let Randomized = shuffle([...this.Questions]);
            Randomized.splice(Randomized.indexOf(this.QuestionsToAsk[Index]), 1);

            // Apend 3 first elements
            Alternatives.push(Randomized[0].FormatName);
            Alternatives.push(Randomized[1].FormatName);
            Alternatives.push(Randomized[2].FormatName);

            // Randomize order of alternatives
            Alternatives = shuffle(Alternatives);

            // Print alternatives
            document.getElementById("radio0-label").textContent = Alternatives[0];
            document.getElementById("radio1-label").textContent = Alternatives[1];
            document.getElementById("radio2-label").textContent = Alternatives[2];
            document.getElementById("radio3-label").textContent = Alternatives[3];

            // Set values
            document.getElementById("radio0").value = Alternatives[0];
            document.getElementById("radio1").value = Alternatives[1];
            document.getElementById("radio2").value = Alternatives[2];
            document.getElementById("radio3").value = Alternatives[3];

            // Register a keydown event
            document.addEventListener("keydown", EnterEventSubmit);
        }

        // Logging for summary
        this.Log.push({
            StartTime: new Date(),
            Answers: []
        });
    }

    // Submit answer
    SubmitAnswer(Answer) {
        // Check if the answer is blank for multiplechoice
        if (!Answer && this.IsMultipleChoice) {
            // Set the notselectederror to be visible
            document.getElementById("noneselectederror").style.display = "block";

            // Logging for summary
            this.Log[this.Round].Answers.push(Answer);

            // Exit method
            return;
        }

        // Destroy the keydown event
        document.removeEventListener("keydown", EnterEventSubmit);

        // Logging for summary
        this.Log[this.Round].Answers.push(Answer);
        this.Log[this.Round].EndTime = new Date();
        this.Log[this.Round].AttemptsUsed = this.Attempt + 1;

        // Check if answer is right
        if (this.QuestionsToAsk[this.Round].AcceptedAnswers.indexOf(Answer.toLowerCase()) > -1) {
            this.RunCorrectAnswerScenario();
        }
        else {
            this.RunWrongAnswerScenario(Answer);
        }
    }
    
    // Right answer handler
    RunCorrectAnswerScenario() {
        // Update other variables
        document.getElementById("points").textContent = ++this.Points;

        // Update modal data
        document.getElementById("CorrectModalPoints").textContent = this.Points;
        document.getElementById("CorrectModalCorrectAnswer").textContent = this.QuestionsToAsk[this.Round].FormatName;

        // Display attempt info if allowed attempts is greater than 1
        if (this.Attempts == 1 || this.IsMultipleChoice) {
            document.getElementById("CorrectModalAttemptCountInfo").style.display = "none";
        }
        else {
            document.getElementById("CorrectModalAttemptCountInfo").style.display = "initial";
            document.getElementById("CorrectModalAttempt").textContent = this.Attempt + 1;
            document.getElementById("CorrectModalAttempts").textContent = this.Attempts;
        }

        // Rename button if this is last round
        if (this.Round + 1 == this.QuestionCount) {
            document.getElementById("CorrectModalNextQuestionButton").textContent = "View summary";
        }
        else {
            document.getElementById("CorrectModalNextQuestionButton").textContent = "Next round";
        }

        // Display modal
        CorrectModal.show();

        // Add key event listener for enter
        document.addEventListener('keydown', EnterEventNext);
    }

    // Wrong answer handler
    RunWrongAnswerScenario(UserAnswer) {
        // Handle with form error message if attempt is less than allowed attempts
        if (this.Attempt + 1 < this.Attempts) {
            // Make text field invalid
            document.getElementById("cityinput").className = "form-control is-invalid";

            // Increment attempt count and print
            document.getElementById("attempt").textContent = ++this.Attempt + 1;
        }
        // Handle with modal in all other cases
        else {
            // Update modal data
            document.getElementById("IncorrectModalPoints").textContent = this.Points;
            document.getElementById("IncorrectModalCorrectAnswer").textContent = this.QuestionsToAsk[this.Round].FormatName;
            document.getElementById("IncorrectModalUserAnswer").textContent = UserAnswer;

            // Rename button if this is last round
            if (this.Round + 1 == this.QuestionCount) {
                document.getElementById("IncorrectModalNextQuestionButton").textContent = "View summary";
            }
            else {
                document.getElementById("IncorrectModalNextQuestionButton").textContent = "Next round";
            }

            // Display modal
            IncorrectModal.show();

            // Add key event listener for enter
            document.addEventListener('keydown', EnterEventNext);
        }
    }

    // Progress to next question or summary screen
    NextQuestion() {
        // Destroy keydown event
        document.removeEventListener('keydown', EnterEventNext);

        // Check if this round is the last
        if (this.Round + 1 == this.QuestionCount) {
            this.GoToSummary();
        }
        // Else progress to next question
        else {
            // Cleanup
            // Reset attempts
            this.Attempt = 0;
            document.getElementById("attempt").textContent = 1;

            // Clean validation
            document.getElementById("cityinput").className = "form-control";
            document.getElementById("noneselectederror").style.display = "none";

            // Increment round counter
            document.getElementById("currentround").textContent = ++this.Round + 1;

            // Deselect all radios
            document.getElementById("radio0").checked = false;
            document.getElementById("radio1").checked = false;
            document.getElementById("radio2").checked = false;
            document.getElementById("radio3").checked = false;

            // Ask next question
            this.AskQuestion(this.Round);
        }
    }

    // Go to summary
    GoToSummary() {
        // Print info
        document.getElementById("SummaryTime").textContent = FormatDateDifference(new Date(), this.StartTime);
        document.getElementById("SummaryPoints").textContent = this.Points;
        document.getElementById("SummaryPointsPossible").textContent = this.QuestionCount;

        // Print round info
        for (let i = 0; i < this.Log.length; i++) {
            // Attempt count if applicable
            let AttemptCounter = "";
            if (!this.IsMultipleChoice && this.Attempts > 1) {
                AttemptCounter = `<br>Attempts: ${this.Log[i].AttemptsUsed} out of ${this.Attempts}`;
            }
            document.getElementById("SummaryPerRound").innerHTML += `<div class="col-12 col-sm-6 col-lg-4"><h5>Round ${i + 1}</h5><div class="d-flex justify-content-between"><p>Time spent: ${FormatDateDifference(this.Log[i].EndTime, this.Log[i].StartTime)}<br>Your answer: ${FormatArray(this.Log[i].Answers)}<br>Correct answer: ${this.QuestionsToAsk[i].FormatName}${AttemptCounter}</p><img class="img-fluid" src="https://maps.googleapis.com/maps/api/staticmap?center=${this.QuestionsToAsk[i].Query}&zoom=${this.QuestionsToAsk[i].Zoom}&size=150x150&scale=1&maptype=satellite&key=AIzaSyCuRDcyNsXWxQuXc6Z5sMyVJohxDC3BXtA"></div></div>`;
        }

        // Set href of sharer buttons
        let ShareText = `I just played ${SetName} on GAME NAME and got ${this.Points} out of ${this.QuestionCount} point in ${FormatDateDifference(new Date(), this.StartTime)}.`;
        document.getElementById("facebook-sharer").href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${ShareText}`;
        document.getElementById("twitter-sharer").href = `https://twitter.com/compose/tweet?url=${window.location.href}&text=${ShareText}`;

        // Cycle pages
        document.getElementById("game-page").style.display = "none";
        document.getElementById("summary-page").style.display = "block";
    }
}

// NextQuestion on enter
function EnterEventNext(Event) {
    if (Event.code == "Enter") {
        // Hide modals
        CorrectModal.hide();
        IncorrectModal.hide();

        // Progress to next question
        ActiveQuiz.NextQuestion();
    }
}

// Submit multiple choice on enter
function EnterEventSubmit(Event) {
    if (Event.code == "Enter") {
        // Submit answer
        ActiveQuiz.SubmitAnswer(document.getElementById('mcform').elements['mc'].value)
    }
}

// Array shufler
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Calculate difference between 2 date objects and return formatted text
function FormatDateDifference(date0, date1) {
    let TotalSeconds = Math.floor(date0.getTime() / 1000 - date1.getTime() / 1000);
    let Minutes = Math.floor(TotalSeconds / 60);
    let Seconds = TotalSeconds % 60;
    let FormatTime = "";

    // Append minutes if greater than 0
    // Singular form
    if (Minutes == 1) {
        FormatTime += "1 minute"
    }
    // Plural
    else if (Minutes > 1) {
        FormatTime += `${Minutes} minutes`
    }

    // Append seconds if greater than 0
    // Singular
    if (Seconds == 1) {
        // Check if minutes are present in formattime
        if (Minutes > 0) {
            FormatTime += " and ";
        }
        FormatTime += `${Seconds} second`;
    } 
    // Plural
    else if (Seconds > 1) {
        // Check if minutes are present in formattime
        if (Minutes > 0) {
            FormatTime += " and ";
        }
        FormatTime += `${Seconds} seconds`;
    } 

    // Return
    return FormatTime;
}

// Format string array
function FormatArray(Array) {
    let FormatText = "";

    // 1 element
    if(Array.length == 1) {
        FormatText = Array[0];
    }
    // 2 elements
    else if(Array.length == 2) {
        FormatText = `${Array[0]} and ${Array[1]}`;
    }
    // More than 2 elements
    else {
        for (let i = 0; i < Array.length; i++) {
            FormatText += Array[i];

            // Add correct separator
            // If second last element
            if (i == Array.length - 2) {
                FormatText += " and ";
            }
            // If not second last or last
            else if (i < Array.length - 1) {
                FormatText += ", ";
            }
        }
    }

    return FormatText;
}

// Start a quiz
function StartQuiz() {
    // Check that SetToPlay is not null
    if (!SetToPlay) {
        throw new Error("SetToPlay cannot be null");
    }

    // Calculate question count
    let QuestionCount = 10;

    if (PlayEntireSet) {
        QuestionCount = SetToPlay.length;
    }

    // Calculate difficulty settings
    let UseMultipleChoice = !Difficulty;
    let Attempts = 1;
    
    if (Difficulty == 1) {
        Attempts = 3;
    }

    // Create a quiz object
    ActiveQuiz = new Quiz(SetToPlay, Attempts, UseMultipleChoice, QuestionCount);
}

window.onload = function() {
    // Initialize modals
    IncorrectModal = new bootstrap.Modal(document.getElementById("IncorrectModal"), {
        keyboard: false,
        backdrop: "static"
    });
    CorrectModal = new bootstrap.Modal(document.getElementById("CorrectModal"), {
        keyboard: false,
        backdrop: "static"
    });

    // Check if a game ID is provided in query string
    const URLParams = new URLSearchParams(window.location.search);
    const GameID = URLParams.get("game");

    if (GameID && CityGroups[GameID]) {
        // Assign to global variables
        SetToPlay = CityGroups[GameID].Cities;
        SetName = CityGroups[GameID].FormatName;

        // Assign to game description headers
        const Headings = document.querySelectorAll(".header-game-description");
        for (let i = 0; i < Headings.length; i++) {
            Headings[i].textContent = SetName;
        }

        document.getElementById("info-page").style.display = "none";
        document.getElementById("options-page").style.display = "block";
    }

};
