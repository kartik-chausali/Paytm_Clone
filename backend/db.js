
const mongoose = require('mongoose');
const {Schema} = mongoose;
mongoose.connect("mongodb+srv://tempodummy12:5p4C5MpqH63JMFjF@cluster0.vd5ircb.mongodb.net/");

const userSchema = new Schema({
    username:{
        type:String, 
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String, 
        required:true,
        unique:true,
        minLength:3,
    },
    firstName:{
        type:String,
        trim:true,
    },
    lastName:{
        type:String,
        trim:true,
    }
})

const accountSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance: {
        type:Number,
        required:true
    }

})
const User = mongoose.model('User', userSchema);
const Accounts = mongoose.model('Accounts', accountSchema)
module.exports={
    User,
    Accounts
}