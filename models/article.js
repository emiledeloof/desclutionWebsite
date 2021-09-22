const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true
    },
    pathToFile: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    discordTag: {
        type: String
    },
    pathToImg: {
        type: String
    }, 
    name: {
        type: String,
        required: true
    }
})

articleSchema.pre("validate", function(next){
    if (this.title){
        this.slug = slugify(this.title + " " + this.creator, { lower: true, strict: true})
    }
    next()
});

module.exports = mongoose.model("Article", articleSchema);