const mongoose = require("mongoose");
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, "Name must be Unique"],
        required: true,
        minLength: [2, 'Too short name'],
        maxLength: [32, "Too long name"]
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: [true, "sub category must have a parent category"]
    }
},
    {
        timestamps: true
    }
);
module.exports = mongoose.model("subCategory", subCategorySchema)