const fetchStockData=async()=>{
    const url='http://localhost:3001/stocks/history';
    try{
        const response=await fetch(url);
        if(!response.ok){
            throw new Error('Error! Status '+response.status);
        }
        return await response.json();
    }
    catch(err){
        console.error('Error! '+err);
    }
};

module.exports={fetchStockData};