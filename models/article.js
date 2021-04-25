const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema({
    title :{
        type: String,
        // required: true
    },
    pathToFile: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        // required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

articleSchema.pre("validate", function(next){
    if (this.title){
        this.wijnen.slug = slugify(this.title + " " + this.creator, { lower: true, strict: true})
    }
    next()
});

module.exports = mongoose.model("Article", articleSchema);