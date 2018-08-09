// Initialize Firebase
var config = {
    apiKey: "AIzaSyC-yOp6S2I-N7HFArV5R8zerzL7WPUrFmY",
    authDomain: "my-project-63915.firebaseapp.com",
    databaseURL: "https://my-project-63915.firebaseio.com",
    projectId: "my-project-63915",
    storageBucket: "my-project-63915.appspot.com",
    messagingSenderId: "85086645475"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#sButton").on("click", function (event) {
    var nameInput = $("#name-input").val().trim();
    var destinationInput = $("#destination-input").val().trim();
    var firstTimeInput = $("#first-time-input").val().trim();
    var frequencyInput = $("#frequency-input").val().trim();

    database.ref().push({
        name: nameInput,
        destination: destinationInput,
        firstTime: firstTimeInput,
        frequency: frequencyInput,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
});

database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {
    var tFrequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTime;

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
 
    var newTableRow = $("<tr>");
    newTableRow.html(
        "<td>" + childSnapshot.val().name +
        "<td>" + childSnapshot.val().destination +
        "<td>" + childSnapshot.val().frequency +
        "<td>" + moment(nextTrain).format("hh:mm A") +
        "<td>" + tMinutesTillTrain
    );

    $("tbody").append(newTableRow);
});

