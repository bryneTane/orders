const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const {default: PQueue} = require('p-queue');
// Create a new express app instance
const app = express();


//use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const queue = new PQueue({concurrency: 1});

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime 
// as if it were an environment variable
const port = process.env.HOOK_PORT;

app.get("/", function (req, res) {
  res.send("Hello World!");
});

function sendElt(body){
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    
    fetch(`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/orders`, requestOptions)
    .then((data) => resolve("elt " + body.id + " succesfully added"))
    .catch((err) => reject(err));
  });
}

app.post('/ticket', (req, res) => {
    // if(next) sendElt(queue[0]).
    console.log("BONJOUR §§§§§§§§§");
    (async () => {
      try{
        let a;
        await queue.add(() => a = sendElt(req.body));
        res.status(200).end();
      }catch(err){console.log(err)};
  })();
})

//App listening to the port defined in .env file
app.listen(port, function () {
  console.log(`App is listening on port ${port}`);
});
