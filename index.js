const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

//use middleware
app.use(cors())
app.use(express.json())


//mongodb connected
const uri = "mongodb+srv://dbuser1:nzU47y0PGsrfvtWs@minhaz.5djsj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const collection = client.db("foodExpress").collection("user");

    //get data:show data
    app.get('/user', async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    //post data:server received data
    app.post('/user', async (req, res) => {
      const newUser = req.body;
      console.log('adding new user', newUser);
      const result = await collection.insertOne(newUser)
      res.send(result)
    });

    //delate data
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await collection.deleteOne(query);
      res.send(result)
    });

    //single user data
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await collection.findOne(query)
      res.send(result);
    })
  }
  finally {
    // await client.close()
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('node server is running')
})

app.listen(port, () => {
  console.log('server success running', port);
})