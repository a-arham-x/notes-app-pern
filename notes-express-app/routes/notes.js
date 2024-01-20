const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator")
const client = require("../db.js")
const fetchUser = require("../middlewares/fetchUser.js")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post("/create", fetchUser, [
    body("title", {error: "Title of maximum length 16 characters is required"}).isLength({min: 1, max: 16}),
    body("content", {error: "Content is required for every note"}).isLength({min: 1})
], async(req, res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }

    const note = await prisma.notes.create({
        data: {
            user: {
                connect: { id: parseInt(req.user.id) }
            },
            time_created: new Date(),
            title: req.body.title,
            content: req.body.content
        }
    })
    
    return res.json({message: "New Note Created", note, success: true})
})        

router.get("/get", fetchUser, async (req, res)=>{

    const notes = await prisma.notes.findMany({
        where: {
            user_id: parseInt(req.user.id)
        }
    })
    return res.json({notes: notes, success: true})
})

router.get("/get/:id", fetchUser, async (req, res)=>{
    const note = await prisma.notes.findFirst({
        where:{
            id: parseInt(req.params.id),
            user_id: req.user.id
        }
    })

    return res.json({note, success: true})
})
 
router.put("/edit", fetchUser, [
    body("note_id", {error: "Specify the note to modify"}).isNumeric(),
    body("title", {error: "Title of maximum length 16 characters is required"}).isLength({max: 16}),
    body("content", {error: "Content is required for every note"})
], async (req, res)=>{
    const errors = validationResult(req);
             
    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }

    const note = await prisma.notes.findUnique({
        where: {
            id: parseInt(req.body.note_id)
        }
    })
  
    await prisma.notes.update({
        where: {
            id: parseInt(req.body.note_id)
        },
        data:{
            title: req.body.title?req.body.title:note.title,
            content: req.body.content?req.body.content:note.content
        }
    })

    return res.json({message: "Updates made successfully", success: true})
})

router.delete("/delete", fetchUser, [
    body("note_id", {error: "Specify the note to delete"}).isLength({min: 1})
], async (req, res)=>{
    const errors = validationResult(req);   
  
    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }
  
    await prisma.notes.delete({
        where:{
            id: req.body.note_id,
            user_id: req.user.id
        }
    })

    return res.json({message: "Note deleted", success: true})
})

module.exports = router;   