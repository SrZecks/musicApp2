// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
const streamifier = require("streamifier");
const hash = require("random-hash");
const nodemailer = require("nodemailer");
const md5 = require("md5");
const stringfy = require('json-stringify-safe')

// Mongo Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.on('error', err => handleError(err));

// Schemas
const User = require("../models/user").User;

// Router instance
const router = express.Router();

// Middlewares
router.use(fileUpload());

// GET
router.get("/", (req, res, next) => {
    User.find({}, function (err, docs) {
        if (err) return next(err)
        res.json(docs)
    })
});

router.get("/find/:hash", (req, res, next) => {
    User.find({ userHash: req.params.hash }, function (err, docs) {
        if (err) return next(err)
        res.json(docs)
    })
});

router.get("/signIn", async (req, res, next) => {
    try {
        let { email, password } = req.query;

        let user = await findEmail(email);

        if (user == null) user = await findUserName(email);
        console.log(user)
        if (user == null) return res.status(404).send("Email or User not found")

        if (md5(password) == user.password) { res.json(user) }
        else { res.sendStatus(403) }

    } catch (error) {
        res.status(500).send(error)
    }
});

router.get("/check", (req, res, next) => {
    let { userName = false, email = false } = req.query
    console.log(req)

    if (!userName) {
        User.findOne({ email: email }, (err, docs) => {
            if (err) return next(err);
            console.log(docs)
            if (docs != null) res.json(docs)
            else res.sendStatus(200)
        })
    } else {
        User.findOne({ userName: userName }, (err, docs) => {
            if (err) return next(err);
            console.log(docs)
            if (docs != null) res.json(docs)
            else res.sendStatus(200)
        })
    }
});

// POST
router.post("/pswdEmail", (req, res, next) => {
    let { email } = req.body

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'soundhubverify@gmail.com',
            pass: process.env.PSWD_RESET
        }
    });

    var mailOptions = {
        from: 'soundhubverify@gmail.com',
        to: email,
        subject: 'Password Recover',
        html: `<div> Click <a href='https://www.pornhub.com/'>Here</a> to change your password </div>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) return next(err);
        res.status(200).send('Email sent: ' + info.response);
    });
});

router.post("/signUp", async (req, res, next) => {
    let { firstName, lastName, userName, password, email } = req.body
    let tumbId = await uploadFile(req.files.tumb)

    let user = new User({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        userHash: "#" + hash.generateHash({ length: 6 }),
        tumbId: tumbId,
        password: md5(password),
        email: email,
    })

    user.save(function (err, doc) {
        if (err) return next(err);
        res.json(doc)
    });
});

router.post("/signUpG", async (req, res, next) => {
    let { IW, IU, dV, zu, jL } = req.body

    let user = new User({
        firstName: IW,
        lastName: IU,
        userName: dV,
        userHash: "#" + hash.generateHash({ length: 6 }),
        password: md5(dV),
        email: zu,
        googleTumb: jL,
        isGoogleAccount: true,
        validated: true
    })

    user.save(function (err, doc) {
        if (err) return next(err);
        res.json(doc)
    });
});

// DELETE
router.delete("/:userId", (req, res, next) => {
    let id = new mongoose.mongo.ObjectID(req.params.userId)
    console.log(id)
    let gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        chunkSizeBytes: 8192, //1024
        bucketName: 'users'
    });

    User.findOneAndDelete({ _id: id }, function (err, docs) {
        if (err) return next(err)
        if (docs == null) return res.status(404).send("File Not Found")
        console.log(docs.tumbId);

        let file_id = new mongoose.mongo.ObjectID(docs.tumbId)

        gridfsbucket.delete(file_id, function (err, result) {
            if (err) res.status(404).send("File not Found")
            console.log(result)
            res.status(200).send("File Deleted")
        });
    });
})

function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};
function findEmail(email, next) {
    return new Promise(function (resolve, reject) {
        User.findOne({ email: email }, (err, docs) => {
            if (err) resolve(next(err));
            resolve(docs)
        })
    });
}
function findUserName(userName, next) {
    return new Promise(function (resolve, reject) {
        User.findOne({ userName: userName }, (err, docs) => {
            if (err) resolve(next(err));
            resolve(docs)
        })
    });
}
async function uploadFile(form) {
    return new Promise(function (resolve, reject) {
        let { name, data, size, md5 } = form

        let gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: size, //1024
            bucketName: 'users'
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