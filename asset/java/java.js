
$(function() {
    console.log('running');
  });
  
  $( document ).ready(function() {
    // Initialize Firebase
   
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyAWBZxPkh_ihGOljWkwL1lZoXaRabcnw6A",
        authDomain: "trane-98779.firebaseapp.com",
        databaseURL: "https://trane-98779.firebaseio.com",
        projectId: "trane-98779",
        storageBucket: "trane-98779.appspot.com",
        messagingSenderId: "984133729658"
      };
      firebase.initializeApp(config);
  
  
    //initial values
    var trainName = "";
    var destination = "";
    var platform = "";
    var frequency = "";
    var lineStart = "";
  
    //submit button logic
    $("#submit-train").on("click", function(event){
      event.preventDefault();
      //populate variables
      trainName = $("#nameInput").val().trim();
      destination = $("#destinationInput").val().trim();
      platform = $("#platformInput").val().trim();
      frequency = $("#freqInput").val().trim();
      lineStart = $("#startInput").val();
  
      //push train object to database
      var newTrain = {
        name: trainName,
        destination: destination,
        platform: platform,
        frequency: frequency,
        lineStart: lineStart
      };
  
      database.ref("Trains").push(newTrain);
    });
  
    database.ref("Trains").on("child_added", function(childSnapshot) {
      trainName = (childSnapshot.val().name);
      destination = (childSnapshot.val().destination);
      platform = (childSnapshot.val().platform);
      frequency = (childSnapshot.val().frequency);
      lineStart = (childSnapshot.val().lineStart);
  
    // determine next train
    var lineConverted = moment(lineStart, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(lineConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var untilNext = frequency - tRemainder;
    var nextTrain = moment().add(untilNext, "minutes");
    var nextTrainDisp = moment(nextTrain).format("hh:mm a");
  
    // clear input fields
    $("#nameInput").val('');
    $("#destinationInput").val('');
    $("#platformInput").val('');
    $("#freqInput").val('');
    $("#startInput").val('');
  
    // full list of items to the table
    $("#current-trains").append("<tr>" +
      "<td>" + (childSnapshot.val().name) + "</td>" + 
      "<td>" + (childSnapshot.val().destination) + "</td>" + 
      "<td>" + (childSnapshot.val().platform) + "</td>" +
      "<td>" + (childSnapshot.val().frequency) + "</td>" +
      "<td>" + nextTrainDisp + "</td>" + 
      "<td>" + untilNext + "</td></tr>");
  
    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  
    // Express Time
    var traneStart = "1830/09/01 11:00";
    var traneFormat = "YYYY/MM/DD HH:mm";
    var traneConverted = moment(traneStart, traneFormat);
    var diff = moment().diff(moment(traneConverted), "minutes");
    var traneRemainder = diff % 525952.34;
    var tUntilNext = 525952.34 - traneRemainder;
    var nextTrains = moment().add(tUntilNext, "minutes");
    var nextDisp = moment(nextTrains).format("hh:mm a MMM DD, YYYY");
    console.log("Next train departs at: " + nextDisp);
    $("#Time").html(Math.round(tUntilNext));
  })