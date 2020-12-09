// creating a route that the front-end can request data from
const { animals } = require("./data/animals");

const express = require("express");
const app = express();

// break out the filter function (from the app.get() callback) into its own function
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  // return the filtered results:
  return filteredResults;
}

// adds the route:
// get() method requires two arguments (request & response) - info on Request - https://expressjs.com/en/api.html#req. The first is a string that describes the route the client will have to fetch from (req, short for request). The second is a callback function that will execute every time that route is accessed with a GET request (res, short for response).
app.get("/api/animals", (req, res) => {
  // using the send() method from the res parameter (short for response) to send the string Hello! to our client. *** res has additional methods, other than .send() - https://expressjs.com/en/api.html#res
  let results = animals;
  // calls the filterByQuery() in the app.get() callback
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.listen(3001, () => {
  console.log(`API server now on port 3001!`);
});
