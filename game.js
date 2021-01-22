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

    // Check answer method
    CheckAnswer(Answer) {
        // Lowercase entire answer
        Answer = Answer.toLowerCase()

        // Return true if Answer is accepted in the AcceptedAnswer array
        if (this.AcceptedAnswers.indexOf(Answer) > -1) {
            return true;
        }
        else {
            return false;
        }
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
    Norway: [
        Cities.NO11_Sandnes,
        Cities.NO11_Stavanger,
        Cities.NO11_Egersund,
        Cities.NO11_Haugesund,
        Cities.NO46_Bergen,
        Cities.NO03_Oslo,
        Cities.NO50_Trondheim
    ]
};

// Quiz class
class Quiz {
    // Constructor
    constructor (questions, attempts, isMultipleChoice, questionCount) {
        // Set parent variables
        this.Questions = questions;
        this.IsMultipleChoice = isMultipleChoice;

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
        else if (questionCount > questions.lenght) {
            throw new Error(`QuestionCount is out of range (${questionCount}), must be less than or equal to the amount of questions.`)
        }
        else {
            this.QuestionCount = questionCount
        }

        // Decide which questions are to be asked
        if (questionCount == questions.lenght) {
            // Copy questions array if going to ask all questions
            this.QuestionsToAsk = [...questions];
        }
        else {
            // Shuffle array and slice
            this.QuestionsToAsk = shuffle(questions).slice(0, questionCount);
        }

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

        // Print counters
        document.getElementById("currentround").textContent = 1;
        document.getElementById("roundcount").textContent = this.QuestionCount;
        document.getElementById("points").textContent = 0;

        // Clean validation
        document.getElementById("cityinput").className = "form-control";

        // Deselect all radios
        document.getElementById("radio0").checked = false;
        document.getElementById("radio1").checked = false;
        document.getElementById("radio2").checked = false;
        document.getElementById("radio3").checked = false;

        // Ask first question
        this.AskQuestion(0);
    }

    // Ask question
    AskQuestion(Index) {
        // Check that index is within bounds
        if (Index < 0) {
            throw new Error(`Index is out of bounds (${Index}), must be greater than or equal to 0.`);
        }
        else if (Index >= this.QuestionCount || Index >= this.QuestionsToAsk.lenght) {
            throw new Error(`Index is out of bounds (${Index}), must be less than questions to ask.`);
        }

        // Print applicable image
        document.getElementById("questionimage").src = `https://maps.googleapis.com/maps/api/staticmap?center=${this.QuestionsToAsk[Index].Query}&zoom=${this.QuestionsToAsk[Index].Zoom}&size=640x400&scale=2&maptype=satellite&key=AIzaSyCuRDcyNsXWxQuXc6Z5sMyVJohxDC3BXtA`;

        // Check what input method is beeing used
        if (!this.IsMultipleChoice) {
            // Clear input field
            document.getElementById("cityinput").value = "";
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
        }
    }

    // Submit answer
    SubmitAnswer(Answer) {
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
        let Modal = new bootstrap.Modal(document.getElementById("CorrectModal"), {
            keyboard: false,
            backdrop: "static"
        });
        Modal.show();
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
            let Modal = new bootstrap.Modal(document.getElementById("IncorrectModal"), {
                keyboard: false,
                backdrop: "static"
            });
            Modal.show();
            }
    }

    // Progress to next question or summary screen
    NextQuestion() {
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
        // Calculate time spent
        let TotalSeconds = Math.floor(new Date().getTime() / 1000 - this.StartTime.getTime() / 1000);
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

        // Print info
        document.getElementById("SummaryTime").textContent = FormatTime;
        document.getElementById("SummaryPoints").textContent = this.Points;
        document.getElementById("SummaryPointsPossible").textContent = this.QuestionCount;

        // Cycle pages
        document.getElementById("game-page").style.display = "none";
        document.getElementById("summary-page").style.display = "block";
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

window.onload = function() {
    ActiveQuiz = new Quiz(CityGroups.Norway, 1, false, 7);
};
