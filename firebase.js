// be able to write a new user 
// be able to check if user is in group
// be able to count the number of people in a group
// be able to retrieve the users in a specific group
// listen for new users
'use strict';

var ref;
var usersRef;
var groupRef;
var timeChosen = "";
var dateChosen = "";
var airportChosen = "";
var usernameChosen = "";
var emailChosen = "";
var groupChosen = "";
var phoneChosen = "";

window.onload = function() {
  ref = new Firebase("https://project-6451685085117135161.firebaseio.com/");
  usersRef = ref.child("users");
  groupRef = ref.child("groups");
  initializeGroups();
  timeChosen = "";
  dateChosen = "";
  airportChosen = "";
  usernameChosen = "";
  emailChosen = "";
  phoneChosen = "";
  groupChosen = "";
}

function initializeGroups() {
  var date_array = [7,8,9,10,11,12,13]
  var group_ids = []
  for (var airports=0; airports< 2; airports++)  
    for(var dates = 0; dates < 7; dates++)
      for(var times =1; times < 25; times++ )
      {
        if(airports === 0)
          var airport_name = "Ohare"
        else
          var airport_name = "Midway"
        var date = date_array[dates]
        var input = {airport: airport_name, date: date, time: times}
        //members child is to be inputted when updategroup is called for the first time
        groupRef.push(input)
      }
        // group_ids.push(groupRef.push(input).key()) //keep track of all the groups to access later
  return true;
	/*
		set the group_id's for each location,date,time combination -- most likely using nested for loops for each date-times for ohare and midway
		define :
			group_id {
				'airport': 'Ohare',
				'date': '6-07-16',
				'time' : '4:30',
				'members': {}
			}
	*/
}


// all parameters are given when function is called, most importantly the userGroup_Id is provided based on a match
// with the group_id that represents the button pressed
function writeNewUser(username, userEmail, userPhone, group_id) {
  console.log("creating user!")
	input = {name: username, email: userEmail, phone: userPhone, [group_id]: true}
  console.log("user looks like this:" + input)
  var user_id = usersRef.push(input).key();

  console.log("user id has been pushed! the user_id is: " + user_id + " now lets go update groups!")
	ref.updateGroup(user_id,group_id)
}

function updateGroup(userId, userGroup_Id) {
	groupRef.child(userGroup_Id).child('members').update({
		[userId]:true
	});
	// ENSURE THAT UPDATE DOES NOT REPLACE THE EXISTING MEMBERS AND ONLY APPENDS ONE MORE ITEM TO THE END
}

function getGroupMembers(group_id) {
	var members_list = []
	groupRef.child(group_id).child('members').once("value", function(snapshot) { 
    snapshot.forEach(function(childSnapshot) {
		  members_list.push(childrenSnapshot.key())
	 });
  });
}


function airport(airport_id) {
  airportChosen = airport_id;
  console.log(airportChosen);
}

function date(date_id) {
  dateChosen = date_id;
  console.log(dateChosen);
}

function time(time_id) {
  timeChosen = time_id;
  console.log(timeChosen);
}

function updateName(name_id) {
  usernameChosen = document.getElementById("username").value;
  console.log(usernameChosen);
}

function updateEmail(email_id) {
  emailChosen = document.getElementById("useremail").value;
  console.log(emailChosen);
}

// function updatePhone(phone_id) {
//   phoneChosen = phone_id;
// }

function findGroup() {
  groupRef.once("value",function(snap) {
    snap.forEach(function(snapshot) {
      var data = snapshot.val();
      if (data.airport === airportChosen) {
        if (data.date === dateChosen) {
          if(data.time === timeChosen) {
            console.log("snapshot/group_id is ");
            console.log(snapshot.key());
            groupChosen = snapshot.key();
            return;
          }
        }
      }
    });
  });
  // return false;
}

function finishUser() {
  updateName();
  updateEmail();
  findGroup();
  console.log(groupChosen);
  console.log(usernameChosen);
  console.log(emailChosen);
  if (groupChosen !== false && usernameChosen !== null && emailChosen !== null && emailChosen.includes("northwestern.edu") === true) {
    console.log("did it pass?")
    writeNewUser(usernameChosen, emailChosen, phoneChosen, groupChosen)
    document.getElementById("finish").innerHTML = "That's it! We'll be in touch !";
  }
  else {
    //ERROR CHECKING
    if (usernameChosen === null) {
      document.getElementById("name_input").innerHTML = "Full Name REQUIRED";
    }
    if (emailChosen === null) {
      document.getElementById("email_input").innerHTML = "NU Email REQUIRED";
    }
    if (emailChosen.includes("northwestern.edu") === false) {
      document.getElementById("email_input").innerHTML = "Invalid NU Email";
    }
    if(groupChosen === false) {
      if(airportChosen === null) {
        document.getElementById("button_problem").innerHTML = "Make sure to choose your airport!";
      }
      if(dateChosen === null) {
        document.getElementById("button_problem").innerHTML = "Make sure to choose your date!";
      }
      if(timeChosen === null) {
        document.getElementById("button_problem").innerHTML = "Make sure to choose your time!";
      }
    }
    return false;
  }
  return true;
}


