require('dotenv').config()
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
}
main().then(() => {
    console.log("Connected to MongoDB")
})
.catch((err) => {
    console.error(err)
});

app.get("/",(req,res) =>{
    res.send("hi! i am root");
})
app.get("/testListing",(req,res) =>{
    let listing = new Listing({
        title: "Test Listing",
        description: "This is a test listing",
        price: 100,
        location: "Test Location",
        country: "Test Country",
        images: ""
    });
    listing.save();
    console.log("sample listing stored");
    res.send("Listing created");
});
app.get("/listing",async (req,res) =>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});