const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const stripe = require("stripe")(process.env.PAYMENT_SECRET);
const jwt = require("jsonwebtoken")
const port = process.env.PORT || 5000



//middleware
app.use(cors())
app.use(express.json())

// verify token
const verifyJWT = (req,res,next)=>{
  const authorization = req.headers.authorization
  if(!authorization){
    return res.status(400).send({message: "Invalid authorization"})
  }

  const token = authorization?.split(' ')[1]
  jwt.verify(token, process.env.ASSESS_SECRET, (err, decoded)=>{
    if(err){
      return res.status(401).send({message: "forbidden access"})
    }
    req.decoded = decoded
    next()
  })
}



// mongodb connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@shop.gxezenb.mongodb.net/?retryWrites=true&w=majority&appName=shop`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a database and collections

    const database = client.db("shop");
    const usersCollection = database.collection("users")
    const classesCollection = database.collection("classes")
    const cartCollection = database.collection("cart")
    const paymentCollection = database.collection("payments")
    const enrolledCollection = database.collection("enrolled")
    const appliedCollection = database.collection("applied")


    // routes for users/////////////////////////////////////////
    
    app.post('/api/set-token', async(req,res)=>{
      const user = req.body
      const token = jwt.sign(user, process.env.ASSESS_SECRET, {
        expiresIn:'24h'
      })
      res.send({token})
    })


    // middleware for admin and instructor
    const verifyAdmin = async (req,res, next)=>{
      const email = req.decoded.email
      const query = {email:email}
      const user = await usersCollection.findOne(query)
      if(user.role === 'admin'){
        next()
      }else{
        return res.status(401).send({message: "Unauthorized access"})
      }
    }

    const verifyInstructor = async(req,res, next)=>{
      const email = req.decoded.email
      const query = { email: email}
      const user = await usersCollection.findOne(query)
      if(user.role === 'instructor'){
        next()
      }else{
        return res.status(401).send({message:"Unauthorized access"})
      }
    }



    app.post('/new-user', async(req,res)=>{
      const newUser = req.body
      const result = await usersCollection.insertOne(newUser)
      res.send(result)
    })

    app.get('/users', async(req,res)=>{
      const result = await usersCollection.find({}).toArray()
      res.send(result)
    })


    app.get("/users/:id", async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/user/:email',verifyJWT, async(req,res)=>{
      const email = req.params.email
      const query = {email: email}
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    app.delete('/delete-user/:id',verifyJWT,verifyAdmin, async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    app.put('/update-user/:id',verifyJWT,verifyAdmin, async(req,res)=>{
      const id = req.params.id
      const updatedUser = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateDoc = {
        $set:{
          name: updatedUser.name,
          email : updatedUser.email,
          role : updatedUser.option,
          address : updatedUser.address,
          about : updatedUser.about,
          photoUrl : updatedUser.photoUrl,
          skills : updatedUser.skills ? updatedUser.skills : null
        }
      }

      const result = await usersCollection.updateOne(filter,updateDoc, options)
      res.send(result)

    })



    // classes routes here///////////////////////////////////////
    app.post('/new-class',verifyJWT,verifyInstructor, async (req,res)=>{
        const newClass = req.body;
        // newClass.availableSeats = parseInt(newClass.availableSeats)
        const result = await classesCollection.insertOne(newClass)
        res.send(result)
    })

    app.get('/classes', async(req,res)=>{
        const query = {status:"approved"}
        const result = await classesCollection.find().toArray();
        res.send(result)
    })



    // get classes by instruction email/////////////////////////////////
    app.get('/classes/:email',verifyJWT,verifyInstructor, async(req,res)=>{
        const email = req.params.email;
        const query = {insEmail:email};
        const result = await classesCollection.find(query).toArray()
        res.send(result)
    })


    // manage classes
    app.get('/classes-manage', async(req,res)=>{
        const result = await classesCollection.find().toArray()
        res.send(result)
    })


    // update classes status and reason
    app.patch('/change-status/:id',verifyJWT,verifyAdmin,async(req,res)=>{
        const id = req.params.id
        const status = req.body.status
        const reason = req.body.reason
        const filter = {_id: new ObjectId(id)}
        const options = {upsert:true}
        const updateDoc = {
            $set:{
                status: status,
                reason: reason,
            }
        }
        const result = await classesCollection.updateOne(filter, updateDoc, options)
        res.send(result)
    })

    
    // get approved classes
    app.get('/approved-classes', async(req,res)=>{
      const query = {status:'approved'}
      const result = await classesCollection.find(query).toArray()
      res.send(result)
    })


    // get single class details
    app.get('/class/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await classesCollection.findOne(query)
      res.send(result)
    })


    // update class details (all data)
    app.put('/update-class/:id',verifyJWT,verifyInstructor, async (req,res)=>{
      const id = req.params.id
      const updateClass = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateDoc = {
        $set: {
          name:updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status: 'pending',
        }
      }
      const result = await classesCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })


    // Cart Routes 
    app.post('/add-to-cart',verifyJWT, async(req,res)=>{
      const newCartItem = req.body
      const result = await cartCollection.insertOne(newCartItem)
      res.send(result)
    })


    // get Cart Item by id
    app.get('/cart_item/:id',verifyJWT, async(req,res)=>{
      const id = req.params.id
      const email = req.body.email
      const query = {
        classId : id,
        userEmail : email,
      }
      const projection = {classId:1}
      const result = await cartCollection.findOne(query, {projection: projection})
      res.send(result)
    })


    // cart info by user email
    app.get('/cart/:email',verifyJWT, async(req,res)=>{
      const email = req.params.email
      const query = {userEmail:email}
      const projection = {classId:1}
      const carts = await cartCollection.find(query, {projection:projection})
      const classId = carts.map((cart)=>new ObjectId(cart.classId))
      const query2 = {_id:{$in:classId}}
      const result = await classesCollection.find(query2).toArray()
      res.send(result)
    })


    // delete cart item
    app.delete('/delete-cart-item/:id',verifyJWT, async(req,res)=>{
      const id = req.params.id
      const query = {classId:id}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    
    // Payment routes
    app.post('/create-payment-intent', async(req,res)=>{
      const {price} = req.body;
      const amount = parseInt(price)*100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount:amount,
        currency:"usd",
        payment_menthod_types : ["card"]
      });
      res.send({
        clientSecret : paymentIntent.client_secret
      })
    })


    // post payment info to db
    app.post('/payment-info', verifyJWT, async(req,res)=>{
      const paymentInfo = req.body
      const classesId = paymentInfo.classesId
      const userEmail = paymentInfo.userEmail
      const singleClassId = req.query.classId
      let query;
      if(singleClassId){
        query = { classId : singleClassId, userEmail : userEmail};
      }else{
        query = { classId : {$in : classesId}}
      }

      const classesQuery = { _id : {$in : classesId.map(id => new ObjectId(id))}}
      const classes = await classesCollection.find(classesQuery).toArray()
      const newEnrolledData = {
        userEmail : userEmail,
        classId : singleClassId.map(id => new ObjectId(id)),
        transactionId : paymentInfo.transactionId
      }

      const updatedDoc = {
        $set: {
          totalEnrolled : classes.reduce((total, current)=>total + current.totalEnrolled, 0) + 1 || 0,
          availableSeats: classes.reduce((total, current)=>total + current.availableSeats, 0) - 1 || 0,
        }
      }

      const updatedResult = await classesCollection.updateMany(classesQuery, updatedDoc, {upsert : true})
      const enrolledResult = await enrollmedCollection.insertOne(newEnrolledData)
      const deletedResult = await cartCollection.deleteMany(query)
      const paymentResult = await paymentCollection.insertOne(paymentInfo)

      res.send({paymentResult, deletedResult, enrolledResult, updatedResult})
    })


    // get payment history
    app.get('/payment-history/:email', async(req,res)=>{
      const email = req.params.email
      const query = { userEmail: email }
      const result = await paymentCollection.find(query).sort({date: -1}).toArray()
      res.send(result)
    })


    // payment history lenght
    app.get('/payment-history-lenght/:email', async(req,res)=>{
      const email = req.params.email
      const query = { userEmail: email }
      const total = await paymentCollection.countDocuments(query)
      res.send(total)
    })


    // Enrollment routes
    app.get("/popular_classes", async(req,res)=>{
      const result = await classesCollection.find().sort({totalEnrolled: -1}).limit(5).toArray()
      res.send(result)
    })

    app.get('/popular-instructors', async(req,res)=>{
      const pipeline = [
        {
          $group :{
            _id: "$insEmail",
            totalEnrolled:{$sum:"@totalEnrolled"}
          }
        },
        {
          $lookup:{
            from:"users",
            localField:"_id",
            foreignField:"email",
            as:"instructor"
          }
        },
        {
          $match : {
            "instructor.role":"instructor"
          }
        },
        {
          $project:{
            _id:0,
            instructor:{
              $arrayElemAt:["$instructor",0]
            },
            totalEnrolled:1
          }
        },
        {
          $sort:{
            totalEnrolled: -1
          }
        },
        {
          $limit: 6
        }
      ]

      const result = await classesCollection.aggregate(pipeline).toArray()
      res.send(result)
    })


    // admin status
    app.get('/admin-stats',verifyJWT,verifyAdmin, async(req,res)=>{
      const approvedClasses = ((await classesCollection.find({status:'approved'})).toArray()).length
      const pendingClasses = ((await classesCollection.find({status:'approved'})).toArray()).length
      const instructor = ((await usersCollection.find({role:'instructor'})).toArray()).length
      const totalClasses = (await classesCollection.find().toArray()).length
      const totalEnrolled = (await enrolledCollection.find().toArray()).length

      const result = {
        approvedClasses,
        pendingClasses,
        instructor,
        totalClasses,
        totalEnrolled
      }

      res.send(result)
    })


    // get all instructor
    app.get('/instructors', async(req,res)=>{
      const result = await usersCollection.find({role:'instructor'}).toArray()
      res.send(result)
    })

    app.get('/enrolled-classes/:email',verifyJWT, async(req,res)=>{
      const email = req.body.email
      const query = {userEmail:email}
      const pipeline = [
        {
          $match:query
        },
        {
          $lookup:{
            from: "classes",
            localField : "classesId",
            foreignField : "_id",
            as : 'classes'
          }
        },
        {
          $unwind: "$classes"
        },
        {
          $lookup:{
            from: "users",
            localField : "classes.insEmail",
            foreignField : "email",
            as : 'instructor'
          }
        },
        {
          $project:{
            _id:0,
            instructor:{
              $arrayElemAt:["$instructor",0]
            },
            classes:1
          }
        }
      ]

      const result = await enrolledCollection.aggregate(pipeline).toArray()
      res.send(result)
    })


    // applied for instructors
    app.post('/ass-instructor', async(req,res)=>{
      const data = req.body
      const result = await appliedCollection.insertOne(data)
      res.send(result)
    })

    app.get('/applied-instructors/:email', async(req,res)=>{
      const email = req.params.email
      const result = await appliedCollection.findOne({email})
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('hi 2024')
})
app.listen(port,()=>{
    console.log(`example app listening ${port}`)
})