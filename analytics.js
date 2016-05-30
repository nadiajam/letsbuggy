var analytics = new Firebase('https://project-6451685085117135161.firebaseio.com/');

var activeUsers = analytics.child('activeVisitors');

activeVisitors.push({
    path: window.location.pathname,
    arrivedAt: Firebase.ServerValue.TIMESTAMP, 
    userAgent: navigator.userAgent
});

var totalVisitors = analytics.child('totalVisitors');

totalVisitors.transaction(function (currentData) {
    return currentData + 1;
});