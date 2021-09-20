const express = require("express");
const app = express();
const cors = require ('cors');
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const bcryptjs =require("bcryptjs");
//const url = "mongodb://localhost:27017";
const url = "mongodb+srv://kavya:admin123@cluster0.6imyk.mongodb.net?retryWrites=true&w=majority";
 
app.use(cors({
    origin : "*"
}))


app.use(express.json());


app.get("/products", async function(req,res){
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("equipment_hiring")
        let data = await db.collection("products").find().toArray();
        client.close();
        res.json(data);
    } catch (error) {
        console.error();
        res.status(500).json({
            message : "something went wrong"
        })
    }
})
app.post("/createProducts", async function (req,res) {
   
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("equipment_hiring")
        let data = await db.collection("products").insertMany(mydata.products)
       await client.close();
    res.json({
        message:"added to products"
    })
    } catch (error) {
        console.error();
        res.status(500).json({
            message : "something went wrong"
        })
        
    }
})
// app.post("admin-update-products/:id", async function (req,res) {
//     try {
//         let client = await mongoClient.connect(url)
//         let db = client.db("db-name")
//         let data = await db.collection("collection-name").findOneAndUpdate({_id : mongodb.ObjectId(req.params.id)},{$set : req.body})
//        await  client.close();
//     res.json({
//         message:"products updated"
//     })
//     } catch (error) {
//         res.status(500).json({
//             message : "something went wrong"
//         })
        
//     }
// }

// )
app.post("/register",async function(req,res){
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("equipment_hiring")
        let salt =bcryptjs.genSaltSync(10);
        let hash = bcryptjs.hashSync(req.body.password,salt);
        req.body.password=hash;
        let data = await db.collection("users").insertOne(req.body)
       await client.close();
    res.json({
        message:"user registered"
        
    })
    } catch (error) {
        console.error();
        res.status(500).json({
            message : "something went wrong"
        })
        
    }
    
}

)
app.post("/signin",async function(req,res){
    try {
        let client = await mongoClient.connect(url)
        let db = client.db("equipment_hiring")
        let user = await db.collection("users").findOne({username:req.body.username})
        if(user){
        let matchPassword = bcryptjs.compareSync(req.body.password,user.password)
        if(matchPassword){
            res.json({
                message :("Logged in as",user.username)
            })
        }else{
            res.status(404).json({
                message : "Password Incorrect"
            })
        }
        }else{
            res.status(404).json({
                message : "User Not found ! Please register"
            })
        }
       await client.close();
    res.json({
        message:"user registered"
        
    })
    } catch (error) {
        console.error();
        res.status(500).json({
            message : "something went wrong"
        })
        
    }
    
}

)

app.listen(process.env.PORT || 5000, function(){
    console.log("this app is listening in port 5000");
})