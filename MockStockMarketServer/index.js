const express = require('express');
const app = express();
const PORT = 3001; // Port for Mock API server [stock market]

const apiRouter = require('./apiRouter'); //Using a router for cleaner code
const {startSimulation} = require('./stockSimulator'); //Importing the stock simulator

//Start the stock price simulation
startSimulation();

//Routing
app.use('/stocks',apiRouter);

//Run server
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});