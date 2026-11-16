const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

// Joi validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(","));
    }

    next();
};

module.exports = { validateListing };