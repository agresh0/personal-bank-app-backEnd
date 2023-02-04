// connection between server and db
// import mongoose
const mongoose = require('mongoose')

// 2. define connection string
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('MONgoDb connected succcessfuly');
})

// 3.create a model
const Account = mongoose.model('Account',{
    acno : Number,
    password : String,
    username : String,
    balance : Number,
    transaction : []

})

// 4.export model
module.exports={
    Account
}
