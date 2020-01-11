import express from 'express'
import DBConnection from "./DB"
import slashRouter from '../routers/slashCommand'
import intractiveRouter from '../routers/intractiveResponse';
const bodyParser = require("body-parser")
const app = express()


DBConnection().then(() => console.log("connected succssfully to dbs")).catch(err => console.log(err))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())

app.get("/",(req,res,next)=> {
    return res.json({
        msg:"hello hweh"
    })
})


// app.use("/BotApi/test",(req,res,next)=> {
//     return res.json({
//         msg:"hello //"
//     })
// })
app.use("/BotApi",slashRouter)

app.use("/BotApi",intractiveRouter)

export default app