const express = require("express")
const app = express()
const port = 5000
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()
 
app.use(bodyParser.json())
app.use(cors());

app.use("/users", require("./routes/users.js"))
app.use("/notes", require("./routes/notes.js"))

app.get("/", (req, res) => {
    res.send("The App has started running")
})

app.listen(port)
