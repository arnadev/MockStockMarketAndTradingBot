//Define initial stock prices
let stocks = {
    "AAPL": 220,
    "GOOGL": 170,
    "TSLA": 240,
    "AMZN": 180,
    "MSFT": 420,
    "NVDA": 120,
    "META": 580,
    "NFLX": 700,
};

//Create an object to store price history for each stock
let priceHistory = {};

//Function to initialize price history with initial stock prices
const initializeStocks = () => {
    Object.keys(stocks).forEach(symbol => {
        priceHistory[symbol] = [stocks[symbol]];
    });
};
  
// Initialize lastChanges for each stock [to create illusion of movementum in stock prices] - first order dependancy for simplicity
const lastChanges = {};

// Function to update stock prices
const updateStockPrices = () => {
    Object.keys(stocks).forEach(stock => {
        let changePercentage;
        
        //Determine the current last price change direction, set to 0 if it doesn't exist
        const lastChange = lastChanges[stock] || 0;
        
        //Adjust likelihood of price change based on last change
        if (lastChange > 0) {
            //Higher likelihood of a positive price change if last was positive
            changePercentage = (Math.random() * 4-1); // -1% to 3%
        } else if (lastChange < 0) {
            //Higher likelihood of a negative price change if last was negative
            changePercentage = (-Math.random() * 4+1); // -3 to 1%
        } else {
            //Neutral scenario; random price change
            changePercentage = (Math.random() * 2 - 1); // -1% to +1%
        }

        //Update the stock price
        stocks[stock] = parseFloat((stocks[stock] + changePercentage*stocks[stock]/100).toFixed(2)); // Update price
        priceHistory[stock].push(stocks[stock]); // Add new price to history

        //Store the last price change percentage
        lastChanges[stock] = parseFloat(changePercentage);

        //Keep only the last 100 prices in history
        if (priceHistory[stock].length > 100) {
            priceHistory[stock].shift();
        }
    });
};

//Function to start the stock price simulation
const startSimulation = () => {
    initializeStocks();
    setInterval(updateStockPrices, 1000);
};
  

module.exports = { stocks, priceHistory, startSimulation};