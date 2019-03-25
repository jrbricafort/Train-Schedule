// Firebase
var config = {
    apiKey: "AIzaSyAL8wZwy_GMeMP0s8fthqGIWIgf8T5EAxU",
    authDomain: "train-schedule-de3cc.firebaseapp.com",
    databaseURL: "https://train-schedule-de3cc.firebaseio.com",
    projectId: "train-schedule-de3cc",
    storageBucket: "train-schedule-de3cc.appspot.com",
    messagingSenderId: "882194303045"
};
firebase.initializeApp(config);

var database = firebase.database();

// Runs function when clicking submit button
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#trainName-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstArrival = $("#firstArrival-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstArrival: firstArrival,
        frequency: frequency,
    };

    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.minutesAway);
    console.log(newTrain.frequency);

    alert("Train and Schedule successfully added");

    // Clears all of the text-boxes
    $("#trainName-input").val("");
    $("#destination-input").val("");
    $("#firstArrival-input").val("");
    $("#frequency-input").val("");
});

// Makes code run every second to ensure accuracy
setInterval(() => {
    $("#train-table > tbody").empty()
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        var trainData = childSnapshot.val();

        // Store everything in a variable.
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstArrival = childSnapshot.val().firstArrival;
        var frequency = childSnapshot.val().frequency;

        var convertedTime = moment(firstArrival, "HH:mm");
        var difference = moment().diff(moment(convertedTime), "minutes");
        var timeRemaining = difference % frequency;
        var minutesAway = frequency - timeRemaining;
        var nextArrival = moment().add(minutesAway, "minutes");
        nextArrival = moment(nextArrival).format("hh:mm a");


        // Console logs to make sure data entered is accurate
        console.log(trainName);
        console.log(destination);
        console.log(firstArrival);
        console.log(frequency);

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextArrival),
            $("<td>").text(minutesAway),
        );

        // Adds row of data to the table
        $("#train-table > tbody").append(newRow);
    });
}, 1000)