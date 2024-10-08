const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'movielens';
let db, moviesCollection;

// Middleware for serving static files (HTML, CSS, JS)
app.use(express.static('public'));

// Middleware for parsing JSON bodies (for POST requests)
app.use(express.json());

// Connect to MongoDB
async function connectToMongoDB() {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    moviesCollection = db.collection('movies');
}

// Route to get all movies
app.get('/movies', async (req, res) => {
    const movies = await moviesCollection.find({}).toArray();
    res.json(movies);
});

// Route to add a new movie
app.post('/add-movie', async (req, res) => {
    const newMovie = req.body;
    await moviesCollection.insertOne(newMovie);
    res.json({ message: 'Movie added successfully!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    connectToMongoDB();
});
