const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {body, validationResult} = require("express-validator")
const client = require("../db.js")
const fetchUser = require("../middlewares/fetchUser.js")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post("/signup", [
    body("name", {error: "No name provided for the account"}).isLength({min: 1}),
    body("username", {error: `Username must be atleats 8 characters long and maximum 16 characters long`}).isLength({min: 8, max: 16}),
    body("password", {error: `Password must be atleats 8 characters long and maximum 16 characters long`}).isLength({min: 8, max: 16}),
    body("cpassword", {error: `You have to confirm your password before making an account`}).isLength({min: 8, max: 16})
], async (req, res)=>{

    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }

    if (req.body.password!=req.body.cpassword){
        return res.json({message: "Please confirm your password correctly", success: false})
    }

    const userNameInUse = await prisma.users.findFirst({
        where: {
            username: req.body.username
        }
    })

    if (userNameInUse){
        return res.json({message: "Username you provided is already in use", success: false})
    }
  
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = await prisma.users.create({
        data: {
            username: req.body.username,
            password: hashedPassword,
            name: req.body.name,
            time_created: new Date()
        }
    })

    const id = {user:{id: user.id}}
    const token = jwt.sign(id, process.env.JWT_SECRET);
    return res.json({token, message: "Account Created Successfully", success: true}); 
})
   
router.post("/login", [
    body("username", {error: "Username must be provided to login"}).isLength({min: 8, max: 16}),
    body("password", {error: "Password must be provided to login"}).isLength({min: 8, max: 16})
], async (req, res)=>{
    const errors = validationResult(req);
  
    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }
  
    const user = await prisma.users.findFirst({
        where: {
            username: req.body.username
        }
    })
    if (!user){
        return res.json({message: "No account found with the provided username", success: false})
    }

    const passwordIsCorrect = await bcrypt.compare(req.body.password, user.password);
    
    if (!passwordIsCorrect){
        return res.json({message: "The Password provided is not correct", success: false})
    }     

    const id = {user:{id: user.id}}
    const token = jwt.sign(id, process.env.JWT_SECRET);
    return res.json({token, success: true}); 
})

router.get("/info", fetchUser, async (req, res)=>{

    const user = await prisma.users.findUnique({
        where: {
            id: parseInt(req.user.id)
        },
        select: {
            id: true,
            username: true,
            name: true,
            time_created: true
        }
    })

    if (!user){ 
        return res.json({message: "No user found to continue the operation", success: false})
    }

    return res.json({user, success: true})
})
  
router.put("/updateusername", fetchUser, [
    body("username", {error: `Username must be atleats 8 characters long and maximum 16 characters long`}).isLength({min: 8, max: 16})
], async (req, res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }

    await prisma.users.update({
        where: {
            id: req.user.id
        },
        data: {
            username: req.body.username
        }
    })

    return res.json({message: "Your username has been updated", success: true})

})

router.put("/updatename", fetchUser, [
    body("name", {error: "No new name provided for the account"}).isLength({min: 1}),
], async (req, res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    } 

    await prisma.users.update({
        where: {
            id: req.user.id
        },
        data: {
            name: req.body.name
        }
    })

    return res.json({message: "Your Account Name has been updated", success: true})
})

router.put("/updatepassword", fetchUser, [
    body("oldpassword", {error: "You need to provide your old password"}).isLength({min: 8, max: 16}),
    body("coldpassword", {error: "Confirm your password to carry on"}).isLength({min: 8, max: 16}),
    body("newpassword", {error: "Enter a new password with length 8 to 16 characters"}).isLength({min: 8, max: 16})
], async(req, res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    } 

    if (req.body.oldpassword != req.body.coldpassword){
        return res.json({message: "You need to confirm your old password correctly", success: false})
    }

    const user = await prisma.users.findUnique({
        where: {
            id: req.user.id
        },
        select: {
            password: true
        }
    })

    const passwordIsCorrect = await bcrypt.compare(req.body.oldpassword, user.password);

    if (!passwordIsCorrect){
        return res.json({message: "Incorrect Password Entered", success: false})
    }

    const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);

    await prisma.users.update({
        where: {
            id: req.user.id
        },
        data: {
            password: hashedPassword
        }
    })

    return res.json({message: "Your password has been updated", success: true})
})

router.delete("/delete", fetchUser, [
    body("username", {error: "Provide your username for account deletion"}).isLength({min: 8, max: 16}),
    body("password", {error: "Provide your password to delete account"}).isLength({min: 8, max: 16}),
    body("cpassword", {error: "Confirm password to delete account"}).isLength({min: 8, max: 16})
], async (req, res)=>{
    const errors = validationResult(req);
  
    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    } 

    if (req.body.oldpassword != req.body.coldpassword){
        return res.json({message: "You need to confirm your old password correctly", success: false})
    }  

    const user = await prisma.users.findUnique({
        where: {
            id: req.user.id
        },
        select: {
            username: true,
            password: true
        }
    })

    const passwordIsCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!passwordIsCorrect){
        return res.json({message: "Incorrect Password Entered", success: false})
    }

    if (req.body.username != user.username){
        return res.json({message: "You need to provide your correct username", success: false})
    }

    await prisma.notes.deleteMany({
        where: {
            user_id: req.user.id
        }
    })
    await prisma.users.delete({
        where: {
            id: req.user.id
        }
    })

    return res.json({message: "Your account has been deleted...Sorry to see you go", success: true})
})

module.exports = router;