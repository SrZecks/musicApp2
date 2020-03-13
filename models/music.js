const mongoose = require("mongoose");

var musicSchema = new mongoose.Schema({
    userHash: { type: String, index: true },
    playlist: { type: String, required: true },
    name: { type: String, required: true },
    musicId: { type: String, required: true },
    tumbId: { type: String, required: true },
    uploadDate: { type: Date, required: true },
    likes: { type: Number }
})

var Music = mongoose.model('musics', musicSchema)

module.exports = { Music: Music } 