const express = require('express');
const app = express();
const PORT = 3000; // Port for Bot trader server
const fs=require('fs');
const {startTradingMovingCrossOver,endTradingMovingCrossover}=require('./movingcrossover'); //Functions to start and end trading 

//Start trading with the moving average crossover strategy
startTradingMovingCrossOver();

setTimeout(() => {
    endTradingMovingCrossover();
}, 60000); //Stop trading after 60 seconds

app.get('/', (req, res) => { //Route to get the trade log
    const data=fs.readFileSync('./log.txt', 'utf8');
    res.send(data);
});


//Start the server
app.listen(PORT, () => {
    console.log(`Bot server running on http://localhost:${PORT}`);
});