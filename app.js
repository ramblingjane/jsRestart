// Using vanilla JavaScript

(function() {

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

	// Get elements from DOM
	


// Submit reservation form
	var resData = {};

	document.getElementById("makeRessie").addEventListener("submit", function(event) {
		event.preventDefault();

		resData.name = document.getElementById('name').value;
		resData.numParty = document.getElementById('numParty').value;

			console.log(resData);

		firebase.database().ref('reserve').push(resData);

	});

	console.log("before query section");


// Lookup reservation

	document.getElementById("lookupRessie").addEventListener("submit", function(evt) {
		evt.preventDefault();

		var lookupName = document.getElementById("resName").value;
		console.log("lookup name: " + lookupName);

		firebase.database().ref('reserve').orderByChild('name').equalTo(lookupName).on('value', function(snapshot) {
	     	if (snapshot.exists() === true) {
	     		snapshot.forEach(function(childSnapshot) {
				  	resData = childSnapshot.val();
				  	var myName = resData.name;
				  	var myNumParty = resData.numParty;

				  	console.log(myName + " " + myNumParty);
				  	console.log(childSnapshot.key);
				  	console.log("-----");

				  	// Display matching ressies on HTML page. Add cancel button.
				  	const li = document.createElement('li');
				  	document.getElementById('ressieList').appendChild(li);
				  	li.innerHTML = "Hello, " + myName + ". We look forward to seeing your party of " + myNumParty + 
				  	" <button id = " + childSnapshot.key + " type=\"button\">Cancel reservation</button><br /><br />";

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


// Remove reservation using form

	// document.getElementById("removeRessie").addEventListener("submit", function(rmEvt) {
	// 	rmEvt.preventDefault();

	// 	var removeName = document.getElementById("removeName").value;
	// 	console.log("remove name: " + removeName);

	// 	firebase.database().ref('reserve').orderByChild('name').equalTo(removeName).on('value', function(snapshot) {
	// 		//console.log('query: ' + snapshot.child('name').val() + " " + snapshot.val().name);
	//      	if (snapshot.exists() === true) {
	//      		snapshot.forEach(function(childSnapshot) {
	// 			  	childSnapshot.ref.remove();			  	
	// 		  		console.log("Removed child: " + childSnapshot.key);
	// 			});

	//      	} else {
	//      		console.log("Name does not exist.");
	//      	}
	// 	});
	// });



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



})();