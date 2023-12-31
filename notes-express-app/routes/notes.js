const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator")
const client = require("../db.js")
const fetchUser = require("../middlewares/fetchUser.js")

router.post("/create", fetchUser, [
    body("title", {error: "Title of maximum length 16 characters is required"}).isLength({min: 1, max: 16}),
    body("content", {error: "Content is required for every note"}).isLength({min: 1})
], async(req, res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }

    const note = await client.query("INSERT INTO notes.notes (user_id, time_created, title, content) VALUES ($1, $2, $3, $4) RETURNING time_created, title, content", [req.user.id, new Date(), req.body.title, req.body.content]);

    return res.json({message: "New Note Created", note: note.rows[0], success: true})
})        

router.get("/get", fetchUser, async (req, res)=>{
    const notes = await client.query("SELECT * FROM notes.notes WHERE user_id = $1", [req.user.id])

    return res.json({notes: notes.rows, success: true})
})

router.get("/get/:id", fetchUser, async (req, res)=>{
    const notes = await client.query("SELECT * FROM notes.notes WHERE user_id = $1 AND note_id=$2", [req.user.id, req.params.id])

    return res.json({note: notes.rows[0], success: true})
})
 
router.put("/edit", fetchUser, [
    body("note_id", {error: "Specify the note to modify"}).isLength({min: 1}),
    body("title", {error: "Title of maximum length 16 characters is required"}).isLength({min: 1, max: 16}),
    body("content", {error: "Content is required for every note"}).isLength({min: 1})
], async (req, res)=>{
    const errors = validationResult(req);
             
    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }
  
    await client.query("UPDATE notes.notes SET title = $1, content = $2 WHERE note_id=$3", [req.body.title, req.body.content, req.body.note_id])

    return res.json({message: "Updates made successfully", success: true})
})

router.delete("/delete", fetchUser, [
    body("note_id", {error: "Specify the note to delete"}).isLength({min: 1})
], async (req, res)=>{
    const errors = validationResult(req);   
  
    if (!errors.isEmpty()){
        return res.json({message: errors.errors[0].msg.error, success: false})
    }
  
    await client.query("DELETE FROM notes.notes WHERE note_id = $1 AND user_id = $2", [req.body.note_id, req.user.id])

    return res.json({message: "Note deleted", success: true})
})

module.exports = router;   