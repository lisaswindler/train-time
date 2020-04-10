var firebaseConfig = {
apiKey: "AIzaSyBTAcmimR_OROyeKgCbuouoXm_gxVUJtNc",
authDomain: "lisa-project-7e982.firebaseapp.com",
databaseURL: "https://lisa-project-7e982.firebaseio.com",
projectId: "lisa-project-7e982",
storageBucket: "lisa-project-7e982.appspot.com",
messagingSenderId: "1085149494361",
appId: "1:1085149494361:web:8af8e9bc545c57dc24c548"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

var trainDest = trainDest;
var trainFreq = trainFreq;

database.ref().on("value", function(snapshot) {

    // If Firebase has a train stored
    if (snapshot.child("trainDest").exists()) {

        trainDest = snapshot.val().trainDest;
        trainFreq = snapshot.val().trainFreq;

        // Change the HTML to reflect the stored values
        $('#train-table').append('<tr><td>' + trainDest + '</td><td>' + trainFreq + '</td></tr>');

    };
});

$("#submit").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
    
// Get the input values
    var trainDest = $("#train-destination").val().trim();
    var trainFreq = Number($("#train-frequency").val().trim());
    var firstTrain = $("#first-train").val().trim();

// Moment.js conversions
    var firstTrainConverted = moment(firstTrain).format("h:mm:ss");
    console.log("Converted Time: " + firstTrainConverted);

    var diffTime = moment.duration(moment().diff(moment(firstTrain, "HH:mm")), 'milliseconds').asMinutes();
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    var minutesAway = trainFreq - (Math.floor(diffTime) % trainFreq);
    console.log(minutesAway);
  
    var nextArrival = diffTime > 0 ? moment().add(minutesAway, 'minutes' ) : moment(firstTrain, "HH:mm") ;
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));
    
    var minTilTrain = Math.ceil(moment.duration(moment(nextArrival).diff(moment()), 'milliseconds').asMinutes());
    console.log("MINUTES TILL TRAIN: " + minTilTrain);

    // Save the new train in Firebase
    database.ref().set({
    trainDest: trainDest,
    trainFreq: trainFreq,
    firstTrain: firstTrain
    });

    $('#train-table').append('<tr><td>' + trainDest + '</td><td>' + trainFreq + '</td></tr>');
});
