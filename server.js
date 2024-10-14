const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017/movielens'; // Update this if your MongoDB URL is different

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public folder

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db();
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(error => console.error(error));

// Get movies with search parameters
app.get('/movies', (req, res) => {
    const { title, actor, genre } = req.query;  // Get search parameters from query string

    let query = {};

    // If title is provided, search by title (case-insensitive)
    if (title) {
        query.title = { $regex: title, $options: 'i' }; // 'i' for case-insensitive matching
    }

    // If actor is provided, search by actor (case-insensitive)
    if (actor) {
        query.actors = { $regex: actor, $options: 'i' }; // Assuming actors is an array of names
    }

    // If genre is provided, search by genre (case-insensitive)
    if (genre) {
        query.genre = { $regex: genre, $options: 'i' }; // Assuming genre is a string
    }

    // Fetch filtered movies from the database
    db.collection('movies').find(query).toArray()
        .then(results => res.json(results))
        .catch(error => res.status(500).send(error));
});

// Add a movie
app.post('/add-movie', (req, res) => {
    const movie = req.body;
    db.collection('movies').insertOne(movie)
        .then(result => res.json(result))
        .catch(error => res.status(500).send(error));
});
