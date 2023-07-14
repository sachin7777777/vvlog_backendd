const storedData = []

const dotenv = require('dotenv')
dotenv.config()

const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const saltNumber = process.env.salt_round
const saltRound = parseFloat(saltNumber)
const secretKey = process.env.secret_key



const signup = (req,res)=>{
 const data = req.body    
 const user = storedData.find((item)=>{
   return item.email=== data.email
 })

 if(user){
    res.send({msg: "user already exist"})
 }else{

const {name,phone,email,password}= data
const salt = bcrypt.genSaltSync(saltRound)
const hashedPassword = bcrypt.hashSync(password,salt)
const token = jwt.sign({user:email},secretKey,{expiresIn:3600})
    const tempObj = {
      _id:new Date().getTime().toString(),
        name : name,
        phone:phone,
        email:email,
        password:hashedPassword,
        token:token
    }
    const options = {
      expires: new Date(
         Date.now()+5*24*60*60
      )
    }
    storedData.push(tempObj)
   

    res.status(200).cookie("tokenName",token,options).send(tempObj)
  
 }

}


const login =(req,res)=>{
   const data = req.body
   // console.log("login storedData",storedData);
   // console.log("login data",data);
   // console.log("reg.body",req.body)
   const {email, password}=data;


   const user = storedData.find((item)=>{
      // console.log("inside user",item.email,email);
      item.email===email
   return item
   })
   // console.log("user login",user);
   if(user){
      const validate = bcrypt.compareSync(data.password,user.password)
      const token = jwt.sign({user:user.email},secretKey,{expiresIn:3600})
      if(validate){
         const userInfo = {
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password ,
            token:token
         }
         // console.log("userInfo in login",userInfo);
         const options = {
            expires: new Date(
               Date.now()+5*24*60*60
            )
          }
         res.status(200).cookie("tokenName",token,options).send(userInfo)
      } else{
         res.send("Invalid Password")
      }
   }
   else{
      res.send("user has not registered")
   }

}

const logout =(req,res)=>{
 
   res.cookie("tokenName",{
      expires:new Date(Date.now())
  })
  res.status(200).json({
      msg:"user LogedOut"
  })

}

const auth = (req,res)=>{
   if(storedData){
  res.send({storedData})
   }else{
      res.send({
         msg:"no users registered"
      })
   }
}



module.exports = {signup, login, logout,auth}