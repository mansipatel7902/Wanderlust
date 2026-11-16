require('dotenv').config()
const listingSchema = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
}
main().then(() => {
    console.log("Connected to MongoDB")
})
.catch((err) => {
    console.error(err)
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
//schema validation middleware
const validateListing = (req, res, next) => {
        const { error } = listingSchema.validate(req.body);


    if (error) {
        throw new ExpressError(400, error.details.map((el) => el.message).join(","));
    } else {
        next();
    }
};
app.get("/",(req,res) =>{
    res.send("hi! i am root");
})
app.get("/testListing",wrapAsync(async(req,res) =>{
    let listing = new Listing({
        title: "Test Listing",
        description: "This is a test listing",
        price: 100,
        location: "Test Location",
        country: "Test Country",
        image: { url: "" }
    });
    await listing.save();
    console.log("sample listing stored");
    res.send("Listing created");
}));
//index route to show all listings
app.get("/listings",wrapAsync(async (req,res) =>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}));
//create route to create a new listing
app.get("/listings/new",async(req,res) =>{
    res.render("listings/new.ejs");
});
//show route to show a single listing
app.get("/listings/:id", wrapAsync(async (req,res) =>{
    const {id}=req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    res.render("listings/show.ejs",{listing});
}));
// POST route to create a new listing
app.post("/listings",validateListing,wrapAsync(async (req, res) => {
        await new Listing(req.body.listing).save();

        req.flash("success", "New Listing Created Successfully!");
        res.redirect("/listings");
}));
//edit route to edit a listing
app.get("/listings/:id/edit",wrapAsync(async (req,res) =>{
    const {id}=req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }
    res.render("listings/edit.ejs",{listing});
}))
//update route to update a listing
app.put("/listings/:id",validateListing,wrapAsync(async (req,res) =>{
    let {id}=req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing,{ runValidators: true });
    if (!updatedListing) {
        throw new ExpressError(404, "Listing Not Found");
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);

}));
//delete route for delete listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} =req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    if (!deletedlisting) {
        throw new ExpressError(404, "Listing Not Found");
    }
    req.flash("success", "Listing Deleted Successfully!");
    console.log(deletedlisting);
    res.redirect("/listings");
}));
// Custom Error Handling Middleware
app.use((err, req, res, next) => {
    let{statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { err });
});
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});