const db = require('../configs/database.config');

const postSchema = new db.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const Post = db.model('Post', postSchema);

module.exports = Post;