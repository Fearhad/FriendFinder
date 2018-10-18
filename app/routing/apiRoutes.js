// ===============================================================================
// LOAD DATA
// We are linking our routes to a "data" source.
// This data source holds an array of information on friends.
// ===============================================================================

var friendsData = require("../data/friends");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
    // API GET Request
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
    // ---------------------------------------------------------------------------

    app.get("/api/friends", function(req, res) {
        res.json(friendsData);
      });
    

      // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the friendsData array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body-parser middleware
    var bestMatch;
    var userIndex;
    
    for (var i = 0; i <= friendsData.length - 1; i++) {
      if (friendsData[i].name === req.body.name) {
        userIndex = i;
        continue;
      } else {
        var userScore = friendsData[i].scores;
        var difference = 0;
        for (var j = 0; j <= userScore.length - 1; j++) {
          difference = difference + Math.abs(req.body.scores[j] - userScore[j]);
        }
        if (!(bestMatch == null)) {
          if (bestMatch.diff > difference) {
            bestMatch = {index: i, diff: difference};
          } else if (bestMatch.diff === difference && Math.floor(Math.random() * 2) === 0) {
            bestMatch = {index: i, diff: difference};
          } 
        } else {
          bestMatch = {index: i, diff: difference};
        }
      }
    }
    
    res.json(friendsData[bestMatch.index]);

    if (userIndex == null) {
      friendsData.push(req.body);
    } else {
      friendsData[userIndex].photo = req.body.photo;
      friendsData[userIndex].scores = req.body.scores;
    }   
    res.end();

  });
}
