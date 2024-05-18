const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Stripe = require('stripe');
const app = express();
app.use(cors());
app.use(express.json({limit:"10mb"}));
const PORT = process.env.PORT || 8080

mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("connected to database"))
.catch((err)=>console.log(err));
const userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{
        type: String,
        unique: true,
    },
    password:String,
    confirmPassword:String,
    image:String
})
const userModel = mongoose.model("user",userSchema);


app.get("/",(req,res)=>{
    res.send("Server is running");
})

app.post("/signup", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;

    try {
        const result = await userModel.findOne({ email: email });

        if (result) {
            res.send({ message: "Email id is already registered",alert:false });
        } else {
            const data = new userModel(req.body);
            await data.save();
            res.send({ message: "Successfully signed up" ,alert:true});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//api login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await userModel.findOne({ email: email });
  
      if (user) {
        // Perform password verification here (compare the provided password with the hashed password)
  
        // For demonstration purposes, let's assume password verification is successful
        const dataSend = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
        };
  
        console.log(dataSend);
        res.json({
          message: "Login is successful",
          alert: true,
          data: dataSend,
        });
      } else {
        res.json({
          message: "Email is not available, please sign up",
          alert: false,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        message: "Internal Server Error",
        alert: false,
      })
    }
  });
  
  const schemaProduct = mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String,
  });
  const productModel = mongoose.model("product",schemaProduct)
   
  app.post("/uploadProduct",async(req,res)=>{
    console.log(req.body)
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "Upload successfully"})
})

app.get("/product",async(req,res)=>{
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})
 

// console.log(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
app.post("/checkout-payment",async(req,res)=>{
  console.log(req.body);
  try{
  const params = {
    submit_type : 'pay',
    mode : "payment",
    payment_method_types : ['card'],
    billing_address_collection : "required",
    shipping_options : [{shipping_rate : "shr_1ONikDSAlnOj71hPlPSGJUfE"}],
    line_items : req.body.map((item)=>{
      return{
        price_data : {
          currency : "inr",
          product_data : {
            name : item.name,
            
          },
          unit_amount : item.price * 100,
        },
        adjustable_quantity : {
          enabled : true,
          minimum : 1,
        },
        quantity : item.qty
      }
    }),
    success_url : `${process.env.FRONTEND_URL}/success`,
    cancel_url :  `${process.env.FRONTEND_URL}/cancel`
  }

  const session = await stripe.checkout.sessions.create(params)
  
  res.status(200).json(session.id);
}catch(err){
  res.status(err.statusCode || 500).json(err.message)
}
})






app.listen(PORT,()=>console.log("Server is running at port:" + PORT));




