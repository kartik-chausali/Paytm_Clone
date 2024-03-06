const express= require('express')
const router = express.Router();
const {User, Accounts} = require('../db');
const { authMidlleware } = require('../middleware');
const { default: mongoose } = require('mongoose');

router.get('/balance', authMidlleware, async(req, res)=>{

    const result = await Accounts.findOne({
        userID: req.userID
    })
    res.json({
        balance: result.balance
    })
})

router.post('/transfer', authMidlleware, async(req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    const {to, amount} = req.body;
    
    const currentUser = User.findOne({userID: req.userID}).session(session);
    if(!currentUser || currentUser.balance< amount){
       await session.abortTransaction();
        res.status(400).json({mssg:"Insufficient balance"});
    }

    const toUser = User.findOne({userID:to}).session(session);
    if(!toUser){
        await session.abortTransaction();
        res.status(400).json({mssg:"Invalid account"});
    }


    await Accounts.updateOne({userID:req.userID}, {$inc: { balance: -amount}}).session(session)
    await Accounts.updateOne({userID:to}, {$inc: {balance: amount}}).session(session)

    await session.commitTransaction();
    res.json({
        mssg:"transaction successfull"
    })

})
module.exports = router;