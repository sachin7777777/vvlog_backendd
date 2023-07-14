const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require('cors')

app.use(cors({
    origin:"*"
}))

dotenv.config()

const route = require('./routes/routes')

app.use(route)
app.use(express.json())


const data = require('./server_store/store')
app.get('/',(req,res)=>{
    res.send(data)
})
app.use('/user',route)

const port = process.env.PORT || 4040
app.listen(port, ()=>{
    console.log(`running successfully on ${port}`);
})