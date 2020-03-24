// Dependencies
const express = require('express');
const fileUpload = require("express-fileupload");
const streamifier = require("streamifier");
const path = require("path");
const fs = require("fs");
const mongoose = require('mongoose');

// Mongo Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.on('error', err => handleError(err));

// Schemas 
const Music = require("../models/music").Music;

// Router instance
const router = express.Router();

// Middlewares
router.use(fileUpload());

// Routes

router.get("/", function (req, res, next) {
    Music.find({}, function (err, docs) {
        if (err) return next(err)
        res.json(docs)
    })
});

router.get("/listen/:id", function (req, res, next) {
    let filesColl = mongoose.connection.db.collection('musics.files')

    let file_id = new mongoose.mongo.ObjectID(req.params.id)

    filesColl.find(file_id).toArray(function (err, docs) {
        if (err) return next(err)

        let file = docs[0].filename

        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');

        let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: 2,
            bucketName: 'musics'
        });

        let downloadStream = bucket.openDownloadStreamByName(file);

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('error', () => {
            res.sendStatus(404);
        });

        downloadStream.on('end', () => {
            res.end();
        });
    });
});

router.get("/tumb/:id", function (req, res, next) {
    let filesColl = mongoose.connection.db.collection('musics.files')

    let file_id = new mongoose.mongo.ObjectID(req.params.id)

    filesColl.find(file_id).toArray(function (err, docs) {
        if (err) return next(err)

        let file = docs[0].filename

        res.set('content-type', 'image/jpeg');
        res.set('accept-ranges', 'bytes');

        let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: 2,
            bucketName: 'musics'
        });

        let downloadStream = bucket.openDownloadStreamByName(file);

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('error', () => {
            res.sendStatus(404);
        });

        downloadStream.on('end', () => {
            res.end();
        });
    });    
});

router.get("/download", function (req, res, next) {
    let { userHash, name } = req.body

    let filesColl = mongoose.connection.db.collection('musics.files')

    var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        chunkSizeBytes: 8000,
        bucketName: 'musics'
    });

    Music.findOne({ userHash: userHash, name: name }, function (err, docs) {
        if (err) return next(err)
        console.log(docs);

        let file_id = new mongoose.mongo.ObjectID(docs.file_id)

        filesColl.find(file_id).toArray(function (err, docs) {
            if (err) return next(err)

            let file = docs[0].filename

            gridfsbucket.openDownloadStreamByName(file).
                pipe(fs.createWriteStream('./' + file)).
                on('error', function (error) {
                    console.log("error" + error);
                    res.status(404).json({
                        msg: error.message
                    });
                }).
                on('finish', function () {
                    console.log('done!');
                    res.download(file)
                });
            res.on('finish', () => {
                fs.unlinkSync(file)
            })
        })
    });
});

router.post("/upload", async function (req, res, next) {
    let { userHash, playlist } = req.body;
    let { name, data, size, md5 } = req.files.musicForm

    let musicid = await uploadFile(req.files.musicForm)
    let tumbid = await uploadFile(req.files.tumbForm)

    let music = new Music({
        userHash: userHash,
        playlist: playlist,
        name: path.parse(name).name,
        music_id: musicid,
        tumb_id: tumbid,
        uploadDate: new Date(),
        likes: 0
    })

    music.save(function (err, doc) {
        if (err) return next(err);
        res.json(doc)
    });
});

router.delete("/delete", function (req, res, next) {
    let id = new mongoose.mongo.ObjectID(req.body.id)

    let gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        chunkSizeBytes: 8192, //1024
        bucketName: 'musics'
    });

    Music.findOneAndDelete({ _id: id }, function (err, docs) {
        if (err) return next(err)
        if (docs == null) return res.status(404).send("File Not Found")

        console.log(docs);
        let file_id = new mongoose.mongo.ObjectID(docs.file_id)

        gridfsbucket.delete(file_id, function (err, result) {
            if (err) res.status(404).send("File not Found")
            console.log(result)
            res.status(200).send("File Deleted")
        });
    });
});

async function uploadFile(form) {
    return new Promise(function (resolve, reject) {
        let { name, data, size, md5 } = form

        let gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: size, //1024
            bucketName: 'musics'
        });

        let uploadStream = gridfsbucket.openUploadStream(name)
        let uploadId = uploadStream.id

        streamifier.createReadStream(data).
            pipe(uploadStream).
            on('error', function (error) {
                assert.ifError(error);
            }).
            on('finish', function () {
                console.log("Done!");
                resolve(uploadId)
            })

    });
}

module.exports = router;