const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/registrationForm",{
    
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection sucessfull")
}).catch(()=>{
    console.log(" no connection sucessfull")
})