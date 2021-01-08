const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true
    },
    description: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

articleSchema.pre("validate", function(next){
    if (this.title){
        this.wijnen.slug = slugify(this.title + " " + this.description, { lower: true, strict: true})
    }
    next()
});

module.exports = mongoose.model("Article", articleSchema);