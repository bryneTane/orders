import dotenv from "dotenv";
import app from './app';

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime 
// as if it were an environment variable
const port = process.env.SERVER_PORT;

//App listening to the port defined in .env file
app.listen(port, function () {
  console.log(`App is listening on port ${port}`);
});
