// Using jQuery

console.log('test');

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCg6jonem7P175vQSqdO07qddu--tnaoGk",
  authDomain: "jsrestart-d6110.firebaseapp.com",
  databaseURL: "https://jsrestart-d6110.firebaseio.com",
  projectId: "jsrestart-d6110",
  storageBucket: "",
  messagingSenderId: "966762215174",
  appId: "1:966762215174:web:5d4bb7b09aa9b3a4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Submit reservation form

var resData = {};

$('#makeRessie').on('submit', function(event) {
	event.preventDefault();

	resData.name = $('#name').val();
	resData.numParty = $('#numParty').val();
    // Add date and time 08/21
    resData.date = $('#ressieDate').val();
    resData.time = $('#ressieTime').val();

		console.log(resData);
        document.getElementById("ressieConfirm").innerHTML = "<p>Thank you, " + resData.name + "!</p>";

	firebase.database().ref('reserve').push(resData);	
})

// Lookup reservation

$("#lookupRessie").on("submit", function(evt) {
	evt.preventDefault();

	var lookupName = $("#resName").val();
		
		console.log("lookup name: " + lookupName);

	firebase.database().ref('reserve').orderByChild('name').equalTo(lookupName).on('value', function(snapshot) {
     	if (snapshot.exists() === true) {
     		snapshot.forEach(function(childSnapshot) {
			  	resData = childSnapshot.val();
			  	var myName = resData.name;
			  	var myNumParty = resData.numParty;
                var myDate = resData.date;
                var myTime = resData.time;

			  	console.log(myName + " " + myNumParty + ", " + myDate + " " + myTime);
			  	console.log(childSnapshot.key);
			  	console.log("-----");

			  	// Display matching ressies on HTML page. Add cancel button.
			  	const li = document.createElement('li');
			  	document.getElementById('ressieList').appendChild(li);
			  	li.innerHTML = "Hello, " + myName + ". We look forward to seeing your party of " + myNumParty + 
			  	" at " + myTime + " on " + myDate + ". <button id = " + childSnapshot.key + " type=\"button\">Cancel reservation</button><br /><br />";

			  	// Cancel button function
			  	document.getElementById(childSnapshot.key).addEventListener("click", function(rmEvt) {
			  		// rmEvt.preventDefault();
			  		childSnapshot.ref.remove();
			  		console.log("Removed child: " + childSnapshot.key);

			  		// Display confirmation
			  		document.getElementById('ressieList').innerHTML = "Thank you, " + myName + ". Your reservation for " + myNumParty + " has been canceled."

			  	});
			});

     	} else {
     		console.log("Name does not exist.");
     	}
	});
});

// Clear form fields

document.getElementById("resetForms").addEventListener("click", function() {
	document.getElementById("lookupRessie").reset();
	document.getElementById("makeRessie").reset();
	
	// Clear confirmation messages
	const listNode = document.getElementById("ressieList");
	while (listNode.firstChild) {
    	listNode.removeChild(listNode.firstChild);
	}

    const confirmNode = document.getElementById("ressieConfirm");
    while (confirmNode.firstChild) {
        confirmNode.removeChild(confirmNode.firstChild);
    }
	console.log("page reset");
});

// jQuery datepicker code

$("#ressieDate").datepicker(
    { minDate: 0, maxDate: "+1M + 14D" }
);



// Show reservations on html page

// Get elements from DOM
const preObject = document.getElementById('reserve');

// Create database references to sync data from db to web app
const dbRefObject = firebase.database().ref().child('reserve');
const dbRefList = dbRefObject.child('reserve');


// Sync object changes in real time
dbRefObject.on('value', snap => {
	preObject.innerText = JSON.stringify(snap.val(), null, 3);
});

// Sync list changes
dbRefList.on('child_added', snap => {
	const li = document.createElement('li');
	li.innerText = snap.val();
	li.id = snap.key;
	ulList.appendChild(li);
});

dbRefList.on('child_changed', snap => {
	const liChanged = document.getElementById(snap.key);
	liChanged.innerText = snap.val();
});

dbRefList.on('child_removed', snap => {
	const liToRemove = document.getElementById(snap.key);
	liToRemove.remove();
});
