const express = require('express')
const router = express.Router();
const zod = require('zod')
const {User, Accounts} = require('../db');
const bcrypt= require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken')
const {JWT_SECRET }= require('../config')
const {authMidlleware} = require('../middleware')


const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post('/signup', async (req, res)=>{
    const {success} = signupBody.safeParse(req.body);
    
    if(!success){
       return  res.status(411).json({mssg: "Invalid inputs try again"})
    }
    const existingUser = await User.findOne({username: req.body.username})
    if(existingUser){
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }
    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, salt),
    })

    const userID = user._id;
    //create new account and give default balance
    await Accounts.create({
       userID: userID,
        balance: 1 + Math.random()*1000
    })
    const token = jwt.sign({
        userID
    }, JWT_SECRET)

    res.json({
        mssg:"User created successfully",
        token:token
    })
    let amount = Math.floor(Math.random()*1000 + 1)
})

    const signinBody = zod.object({
        username: zod.string().email(),
        password:zod.string(),
    })

router.post('/signin', async (req, res)=>{
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        res.status(400).json({mssg:"invalid user credentials"});
    }
    const userDoc = await User.findOne({username: req.body.username});

    if(userDoc){
      const result = bcrypt.compareSync(req.body.password, userDoc.password);
      if(result){
        const token= jwt.sign({
            user_id: userDoc._id
        }, JWT_SECRET)

        res.status(200).json({
            mssg:"logged in successfully",
            token:token
        })
      }else{
        res.status(411).json({mmsg:"invalid password"})
      }
    }else{
        res.status(411).json({mssg:"user email doesn't not exists , please signup "})
    }
})

const updateBody = zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

router.put('/update', authMidlleware , async(req, res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({mssg:"invalid inputs"});
    }
    const userID = req.userID;
    const result = await User.findOneAndUpdate(userID, req.body);
    if(result)res.status(200).json({mssg:"updated info successfully"});
    else res.status(200).json({mssg:"error while updating information"});
})

module.exports = router;