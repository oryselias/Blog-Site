const mongoose= require('mongoose');

const BlogSchema = new mongoose.Schema({
    title:
    {
        type: String,
        //required : true
    }, 
    category:{
        type: String,
        //required : true
    },
    content: {
        type: String,
        //required : true
    },
    // photo:{
    //     type: Buffer,
    //     required : true
    // },
    // date:{
    //     type: Date,
    //     required : true
    // },
    // author:{
    //     type:String,
    //     required : true
    // }

},  {collection: 'blogs'}) ;

const Blog = mongoose.model('BlogSchema', BlogSchema);
module.exports = Blog;