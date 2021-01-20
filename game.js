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