// be able to write a new user 
// be able to check if user is in group
// be able to count the number of people in a group
// be able to retrieve the users in a specific group
// listen for new users

var ref = new Firebase("https://project-6451685085117135161.firebaseio.com/");
var usersRef = ref.child("users");
var groupRef = ref.child("groups")

function initializeGroups() {
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
function writeNewUser(username, userEmail, userPhone, userGroup_Id) {
	var user_id = firebase.database().ref().child('users').push().key;

	usersRef.child(user_id).set({
		name: username,
		email: userEmail,
		phone: userPhone,
		userGroup_Id: true
	});
	ref.updateGroup(user_id,userGroup_Id)
}

function updateGroup(userId, userGroup_Id) {
	groupRef.child(userGroup_Id).child('members').update({
		userId:true
	});
	// ENSURE THAT UPDATE DOES NOT REPLACE THE EXISTING MEMBERS AND ONLY APPENDS ONE MORE ITEM TO THE END
}

function getGroupMembers(group_id) {
	var members = []
	groupRef.child(group_id).child('members').forEach(function(childSnapshot) {
		members.append(childrenSnapshot.key())
	});
}




'use strict';

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var signInButton = document.getElementById('sign-in-button');
var splashPage = document.getElementById('page-splash');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var recentPostsSection = document.getElementById('recent-posts-list');
var userPostsSection = document.getElementById('user-posts-list');
var topUserPostsSection = document.getElementById('top-user-posts-list');
var recentMenuButton = document.getElementById('menu-recent');
var myPostsMenuButton = document.getElementById('menu-my-posts');
var myTopPostsMenuButton = document.getElementById('menu-my-top-posts');




function writeUserData(userId, name, email, phone, group_id) {
  firebase.database().ref('users/' + userId).push({
    'username': name,
    'email': email,
    'phone': phone,
    'group': {
    	group_id: true
    }
  });
  ref.updateGroups(group_id, userId);
}

function updateGroups()
  firebase.database().ref('groups/' + group_id + '/members').a({
    userId:
  });

/**
 * Saves a new post to the Firebase DB.
 */
// [START write_fan_out]
function writeNewUser(uid, username, title, body) {
  // A post entry.
  var postData = {
    author: username,
    uid: uid,
    body: body,
    title: title,
    starCount: 0
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
// [END write_fan_out]

function isUserInGroup(userId) {
    ref.once('value', function(snap) {
    var result = snap.val() === null? return true : return false;
    });
}


/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  // [START my_top_posts_query]
  var myUserId = firebase.auth().currentUser.uid;
  var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
  // [END my_top_posts_query]
  // [START recent_posts_query]
  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  // [END recent_posts_query]
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.key, data.val().title, data.val().body, data.val().author),
          containerElement.firstChild);
    });
  };

  fetchPosts(topUserPostsRef, topUserPostsSection);
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);
}

/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, name, email) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email
  });
}
// [END basic_write]

// Bindings on load.
window.addEventListener('load', function() {
  // Bind Sign in button.
  signInButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      splashPage.style.display = 'none';
      writeUserData(user.uid, user.displayName, user.email);
      startDatabaseQueries();
    } else {
      splashPage.style.display = 'block';
    }
  });

  // Saves message on form submit.
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    if (messageInput.value && titleInput.value) {
      var postText = messageInput.value;
      messageInput.value = '';
      // [START single_value_read]
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        var username = snapshot.val().username;
        // [START_EXCLUDE]
        writeNewPost(firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName,
            titleInput.value, postText).then(function() {
              myPostsMenuButton.click();
            });
        // [END_EXCLUDE]
      });
      // [END single_value_read]
    }
  };

  // Bind menu buttons.
  recentMenuButton.onclick = function() {
    recentPostsSection.style.display = 'block';
    userPostsSection.style.display = 'none';
    topUserPostsSection.style.display = 'none';
    addPost.style.display = 'none';
    recentMenuButton.classList.add('is-active');
    myPostsMenuButton.classList.remove('is-active');
    myTopPostsMenuButton.classList.remove('is-active');
  };
  myPostsMenuButton.onclick = function() {
    recentPostsSection.style.display = 'none';
    userPostsSection.style.display = 'block';
    topUserPostsSection.style.display = 'none';
    addPost.style.display = 'none';
    recentMenuButton.classList.remove('is-active');
    myPostsMenuButton.classList.add('is-active');
    myTopPostsMenuButton.classList.remove('is-active');
  };
  myTopPostsMenuButton.onclick = function() {
    recentPostsSection.style.display = 'none';
    userPostsSection.style.display = 'none';
    topUserPostsSection.style.display = 'block';
    addPost.style.display = 'none';
    recentMenuButton.classList.remove('is-active');
    myPostsMenuButton.classList.remove('is-active');
    myTopPostsMenuButton.classList.add('is-active');
  };
  addButton.onclick = function() {
    recentPostsSection.style.display = 'none';
    userPostsSection.style.display = 'none';
    topUserPostsSection.style.display = 'none';
    addPost.style.display = 'block';
    recentMenuButton.classList.remove('is-active');
    myPostsMenuButton.classList.remove('is-active');
    myTopPostsMenuButton.classList.remove('is-active');
    messageInput.value = '';
    titleInput.value = '';
  };
  recentMenuButton.onclick();
}, false);