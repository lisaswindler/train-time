var firebaseConfig = {
    apiKey: "AIzaSyBTAcmimR_OROyeKgCbuouoXm_gxVUJtNc",
    authDomain: "lisa-project-7e982.firebaseapp.com",
    databaseURL: "https://lisa-project-7e982.firebaseio.com",
    projectId: "lisa-project-7e982",
    storageBucket: "lisa-project-7e982.appspot.com",
    messagingSenderId: "1085149494361",
    appId: "1:1085149494361:web:dabd8a7890b61c7e24c548"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

var trainDest;
var trainFreq;
var minutesAway;
var firstTrain;
var arrivalTime;

database.ref("/trains").on("child_added", function(childSnapshot) {
// database.ref("/trains").on("value", function(childSnapshot) {
        snap = childSnapshot.val();
    // If firebase has a train stored
    if (childSnapshot.child("trainDest").exists()) {

        // Get the values from firebase
        trainDest = snap.trainDest;
        trainFreq = snap.trainFreq;
        firstTrain = snap.firstTrain;
        arrivalTime = snap.arrivalTime;
        minutesAway = snap.minutesAway;

        // Moment.js conversions
        var diffTimes = moment.duration(moment().diff(moment(firstTrain, "HH:mm")), 'milliseconds').asMinutes();
        var minutesAway = snap.trainFreq - (Math.floor(diffTimes) % trainFreq);
        var arrivalTime = moment().add(minutesAway, 'minutes').format('HH:mm');
     
        // Change the HTML to reflect the stored values
        $('#train-table').append(
        '<tr><td>' + trainDest + 
        '</td><td>' + trainFreq + 
        '</td><td>' + arrivalTime + 
        '</td><td>' + minutesAway + 
        '</td></tr>'
        );
    }
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#submit").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
    
    // Get the input values
    var trainDest = $("#train-destination").val().trim();
    var trainFreq = Number($("#train-frequency").val().trim());
    var firstTrain = $("#first-train").val().trim();
    var diffTimes = moment.duration(moment().diff(moment(firstTrain, "HH:mm")), 'milliseconds').asMinutes();
    var minutesAway = trainFreq - (Math.floor(diffTimes) % trainFreq);
    var arrivalTime = moment().add(minutesAway, 'minutes').format('HH:mm');
        
    // Save the new train in Firebase
    database.ref().child('/trains').push ({
    trainDest: trainDest,
    trainFreq: trainFreq,
    firstTrain: firstTrain,
    arrivalTime: arrivalTime,
    minutesAway: minutesAway
    });

});
