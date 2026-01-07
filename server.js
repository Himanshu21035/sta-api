const express=require('express');


const app=express();
const PORT=process.env.PORT||3000;

app.get('/health',(req,res)=>{
    res.send("OK status timestamp: "+ Date.now().toString());
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})