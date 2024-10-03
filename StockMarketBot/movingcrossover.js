const {fetchStockData} = require('./fetchStockData');
const fs = require('fs');

//Set periods for moving averages [here it is arbitrary]
const SHORT_PERIOD = 5;
const LONG_PERIOD = 20;


let currentPositions = {}; //Tracks current stock positions
let totalProfitLoss = {};  //Tracks total profit/loss for each stock
let intervalID = null;     //To store the interval reference - used to stop trading

async function calculateMovingAverage(prices, period) { //Function to calculate moving average
    const subset = prices.slice(-period);
    const sum = subset.reduce((acc, price) => acc + price, 0);
    return sum / subset.length;
}

function logTrade(stock, action, price, profitOrLoss = null) { //Function to log trades
    const logEntry = `${new Date().toISOString()} | Stock: ${stock} | Action: ${action} | Price: ${price}`;
    const profitEntry = profitOrLoss ? ` | P/L: ${profitOrLoss}` : '';
    const finalLog = logEntry + profitEntry + '\n';

    fs.appendFileSync('./log.txt', finalLog); //Append trade log to log.txt
    console.log(finalLog);

    //Update total profit/loss for the stock
    if (profitOrLoss !== null) {
        if (!totalProfitLoss[stock]) totalProfitLoss[stock] = 0;
        totalProfitLoss[stock] += profitOrLoss;
    }
}

async function movingCrossoverStrategy() { //Function to implement moving average crossover strategy

    const stockPrices = await fetchStockData(); //Fetch stock data (Stock Price History of all stocks)
    for (const stock in stockPrices) {
        const prices = stockPrices[stock]; //Get price history for a stock

        //Ensure there is enough history to calculate the moving averages [in this case 20s worth of data]
        if (prices.length >= LONG_PERIOD) {
            const shortMA = await calculateMovingAverage(prices, SHORT_PERIOD);
            const longMA = await calculateMovingAverage(prices, LONG_PERIOD);

            //If we are holding no stock, check for a buy signal
            if (shortMA > longMA && !currentPositions[stock]) {
                const buyPrice = prices.slice(-1)[0]; //Buy at the latest price
                currentPositions[stock] = buyPrice; //Store the price we bought at
                logTrade(stock, 'BUY', buyPrice);
            }
            //If we are holding stock, check for a sell signal
            else if (shortMA < longMA && currentPositions[stock]) {
                const sellPrice = prices.slice(-1)[0];
                const profitOrLoss = sellPrice - currentPositions[stock];
                logTrade(stock, 'SELL', sellPrice, profitOrLoss);
                delete currentPositions[stock]; //Reset position after selling
            }
        }
    }
}

//Start trading- setInterval to run the strategy every second
function startTradingMovingCrossOver() {
    fs.writeFileSync('./log.txt', ''); //Clear the log file before starting
    intervalID = setInterval(movingCrossoverStrategy, 1000);
}

//Stop trading and print final profit/loss
async function endTradingMovingCrossover() {
    clearInterval(intervalID); //Stop the interval
    const stockPrices = await fetchStockData();

    for (const stock in stockPrices){ //Sell all stocks we are holding before ending
        const prices = stockPrices[stock];
        if(currentPositions[stock]){
            const sellPrice = prices.slice(-1)[0];
            const profitOrLoss = sellPrice - currentPositions[stock];
            logTrade(stock, 'SELL', sellPrice, profitOrLoss);
            delete currentPositions[stock];
        }
    }

    //Print final profit/loss summary
    console.log("\nFinal Profit/Loss Summary:");
    fs.appendFileSync('./log.txt', "\nFinal Profit/Loss Summary:\n");

    //Calculate and print total profit/loss for each stock and Net profit/loss
    let netProfitLoss=0;
    for (const stock in totalProfitLoss) {
        const profitLoss = totalProfitLoss[stock];
        netProfitLoss+=profitLoss;
        const summary = `Stock: ${stock} | Total P/L: ${profitLoss.toFixed(2)}`;
        console.log(summary);
        fs.appendFileSync('./log.txt', summary + '\n');
    }
    console.log(`Net Profit/Loss: ${netProfitLoss.toFixed(2)}`);
    fs.appendFileSync('./log.txt', `Net Profit/Loss: ${netProfitLoss.toFixed(2)}\n`);
    console.log("\nTrading session ended.");
    fs.appendFileSync('./log.txt', "Trading session ended.\n");
}

module.exports = {
    startTradingMovingCrossOver,
    endTradingMovingCrossover,
};
