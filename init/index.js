require("dotenv").config();
const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const MONGODB_URL = process.env.MONGODB_URL;

async function main() {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");

    const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata);
    console.log("Database initialized with data");
    }
    initDB();
}

 
main().then(() =>{
    console.log("Connected to MongoDB");
}).catch((err) =>{
    console.error(err);
});
