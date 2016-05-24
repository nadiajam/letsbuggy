var ref = new Firebase("https://project-6451685085117135161.firebaseio.com/");


function writeUserData(userId, name, email, phone) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    phone: phone
  });
}

function isUserInGroup(userId) {
    ref.once('value', function(snap) {
    var result = snap.val() === null? return true : return false;
    });
}