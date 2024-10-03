const express=require('express');
const router=express.Router();
const{stocks,priceHistory}=require('./stockSimulator');


//get all stock prices
router.get('/',(req,res)=>{
    res.json(stocks);
});


//get all stock price history
router.get('/history',(req,res)=>{
    res.json(priceHistory);
});


//get stock price history for a specific stock
router.get('/history/:symbol',(req,res)=>{
    const symbol=req.params.symbol.toUpperCase();
    if(priceHistory[symbol]){
        res.json({symbol,history:priceHistory[symbol]});
    }else{
        res.status(404).json({error:'Stock not found'});
    }
});

//get stock price for a specific stock
router.get('/:symbol',(req,res)=>{
    const symbol=req.params.symbol.toUpperCase();
    if(stocks[symbol]){
        res.json({symbol,price:stocks[symbol]});
    }else{
        res.status(404).json({error:'Stock not found'});
    }
});


module.exports=router;