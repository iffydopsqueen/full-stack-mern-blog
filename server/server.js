import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

// Schemas 
import User from "./Schema/User.js";

const app = express();
let PORT = 5000;

// Email & Password pattern to follow 
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// Now the server accepts JSON data from frontend
app.use(express.json());

// Connect to database 
mongoose.connect(process.env.DB_CONNECTION, {
    autoIndex: true
});

// these are the only object data to get/return on the frontend on a request
const formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_TOKEN);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

// Using 'async' so this operation waits to do the checking 
// if the username split off from the email is the same
// or already exists 
const generateUsername = async (email) => {
    // use the first part of the email as a username
    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result);

    // add 3 unique strings to the username if it's not unique
    isUsernameNotUnique ? username += nanoid().substring(0, 3) : "";

    return username;
}

app.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;

    // validate form data from the frontend
    if(fullname.length < 3) {
        return res.status(403).json({ "error": "Full name must be at least 3 letters long" });
    }
    if(!email.length) {
        return res.status(403).json({ "error": "Enter an email" });
    }
    if(!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email format is invalid" });
    }
    if(!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with a number, 1 lowercase and 1 uppercase letters" });
    }

    // hash the password
    bcrypt.hash(password, 10, async (err, hashed_password) => {

        // use the first part of the email as a username
        let username = await generateUsername(email);  // 'await' - so JS waits for its response 

        // User Object
        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        }); 

        // save to DB
        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u));
        }).catch(err => {
            if(err.code == 11000) {
                return res.status(500).json({ "error": "Email already exists" });
            }
            return res.status(500).json({ "error": err.message });
        })

        console.log(hashed_password);
    });

    // return res.status(200).json({ "status": "OK" })
});

app.post("/signin", (req, res) => {
    
    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email })
    .then((user) => {
        if(!user) {
            return res.status(403).json({ "error": "Email not found" });
        }

        // check if the password from sign-up is the same during sign-in
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if(err) {
                return res.status(403).json({ "error": "An error occurred during login, please try again" });
            }

            if(!result) {
                return res.status(403).json({ "error": "Incorrect password" });
            } else {
                return res.status(200).json(formatDatatoSend(user));
            }
        });
    }).catch(err => {
        console.log(err.message);
        return res.status(500).json({ "error": err.message });
    })
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});