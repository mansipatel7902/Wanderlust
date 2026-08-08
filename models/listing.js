const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true  
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true 
    },
    location: {
        type: String,
        required: true  
    },
    country: {
        type: String,
        required: true  
    },
    images: {
        type: String,
        default: "https://tse2.mm.bing.net/th/id/OIP.Kug03Hkb54NM-7rqhBg50AAAAA?r=0&w=450&h=384&rs=1&pid=ImgDetMain&o=7&rm=3",
        set: (v) => v ===""?"https://tse2.mm.bing.net/th/id/OIP.Kug03Hkb54NM-7rqhBg50AAAAA?r=0&w=450&h=384&rs=1&pid=ImgDetMain&o=7&rm=3":v,
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
