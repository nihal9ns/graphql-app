const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Allow CORS
app.use(cors());

// MongoDB Connection
mongoose
.connect('mongodb://localhost/gql-ninja')
.then(() => console.log('MongoDB Connected!!!'))
.catch(err => console.log(err));

app.use('/graphql', graphqlHTTP({
	schema
}));

app.listen(port, () => {
	console.log(`Server is running on port ${port}!`);
})