// Import all the modules required
import express from 'express';
import Board  from '../board.js';
import { compareSync, hashSync } from 'bcrypt';
import User from '../register.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import '../passport.js';
import axios from 'axios';
import sqlite3 from '../node_modules/sqlite3/lib/sqlite3.js';

// Declaring the routes for the api requests
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true})); // Parses incoming requests with urlencoded payloads and is based on body-parser.
router.use(passport.initialize()); // Passport is an authentication middleware for Node that authenticates requests. passport.initialize() initialises the authentication module.

const db = new sqlite3.Database('boards.sqlite3',sqlite3.OPEN_READWRITE); // Opening the database file (using sqlite3) for both read and write operations.

// Array of number of comments
let articleCommentNum = []
let articlesComDuplicate = []

// Simple get API
router.get('/', (req,res) => {
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end("\n Hello! This is a RestAPI Project using NodeJS, Express, and sqlite3. \n I have used passport library and jwt tokens for login and authentication modules of the project. \n Axios is used for the integration of external API. \n \n \n  Author: \n  Pavithra Agraharam.")
})

// Data-Holder to hold the value responded by AXIOS library through get request.
const responseMSG = (pageNumber) => {
    try {
      return axios.get(`https://jsonmock.hackerrank.com/api/articles?page=${pageNumber}`);
    } catch (error) {
      console.error(error)
    }
}

// POST request to the articles URL to get back the top number of articles based on comments.
router.post('/articles/:pageNumber', (req,res) => {
    var pageNumber = req.params.pageNumber;
    topArticles(pageNumber); // function which logs the top articles based on the page number in the parameter.
    res.send(null);
})

// POST request to register the user, to later login. Used for authentication.
router.post('/register', async (req,res) => {
    // Initializing a new user in the user table inside database.
    const user = new User({
        email: req.body.email,
        password: hashSync(req.body.password, 10)
    })
    // Saving/Updating the table in the database to register the user.
    await user.save().then(user => {
        res.send({
            success: true,
            message: 'User created Successfully',
            user: {
                id: user.id,
                email: user.email
            }
        })
    })
})

//POST request to login the user, who was registered earlier through the /register route.
router.post('/login', (req,res) => {
    // Finding the user in the database, if the user exists or not.
    User.findOne({where: {email: req.body.email}}).then(user => {
        // If user does not exists.
        if(!user){
            return res.status(401).send({
                success: false,
                message: "Could not find the user."
            })
        }
        // If the passsword provided is incorrect.
        if(!compareSync(req.body.password, user.password)){
            return res.status(401).send({
                success: false,
                message: "Incorrect Password."
            })
        }
        // Initializing payload for JWT token.
        const payload = {
            email: user.email,
            id: user.id
        }
        // Initializing a JWT token with payload, security key and an expiry time-period.
        const token = jwt.sign(payload, "Key", { expiresIn: "7d"});
        // User credentials are correct and user logged in successfully.
        return res.status(200).send({
            success: true,
            message: "Logged in Successfully.",
            token: "Bearer " + token // Seperating the JWT token from the bearer included earlier.
        })
    })
})

//POST request with passport and jwt authentication to enter details into boards database table.
router.post('/', passport.authenticate('jwt', {session: false}), async (req,res) => {
    // Initializing a new board to insrt into the boards table
    const board = new Board({
        state: 1,
        title: req.body.title
    })
    // Updating the boards table with the details from request body.
    await board.save().then(board => {
        res.send({
                id: board.id,
                state: board.state,
                title: board.title
        })
    })
    res.statusCode = 201;
});

//PUT request with passport and jwt authentication to change the details of boards database table.
router.put('/:id', passport.authenticate('jwt', {session: false}), async (req,res) => {
    const {id} = req.params; // Initializing the id to search, from the request URL parameters.
    const {state} = req.body; // Initializing the state to update in the boards databse table.
    // Finding the particular id in the table for which the state has to be updated.
    const board = await Board.findOne({where: {id: id}});
    // If the stage value is 1, 2 or 3, the response code is 200, with the updated item as the response body.
    if(state<4) {
        board.state = state;
        res.statusCode = 200;
        res.send(board);
    }
    //If the stage value passed is not 1,2, or 3, return the status code 400 with no requirement on the response body.
    else{
        res.statusCode = 400;
        res.send(null);
    }
    // Saving/Updating the changes into the database file.
    await board.save();
});

// Verify Token function which helps us to verify the JWT inside the headers of the request/response cycle. 
// If the JWT token is verified successfully, the user is granted access to proceed further with the website, else information is provided that token is invalid.
function verifyToken(req, res, next){
    // Get Auth header value
    const bearerHeader = req.headers['authorization'];
    // Splitting the JWT token for the correct value of the JWT token.
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }  else{
        res.statusCode = 403;
        res.send('Invalid or No JWT Token Provided for Authentication.')
    }
}

// Top Articles function takes an integer as input, and console logs a list of articles sorted based on the descending order of the comment_count in the API URL.
function topArticles(numOfTitles){
    responseMSG(numOfTitles).then(response => {
        // Pushing all the number of comments into the array -> articleCommentNum, for further use.
        var num = response.data.per_page, temp = 0, x;
        for(var i = 0; num > 0; i++,num--){
            articleCommentNum.push(response.data.data[i].num_comments);
            articlesComDuplicate.push(response.data.data[i].num_comments);
        }
        // Logic to print the top articles sorted based on the descending order of the comment_count in the API URL.
        while(numOfTitles > 0){
            var max = 0, num = response.data.per_page;
            for(var i = 0; num > 0; i++,num--){
                if(max < articleCommentNum[i]){
                    max = articleCommentNum[i];
                }
            }
            var dup = hasAllUniqueChars(articlesComDuplicate);
            const index = articlesComDuplicate.indexOf(max);
            if(response.data.data[index].title != null){
                if(index == dup && temp == 0){
                    dup = hasAllUniqueChars2(articlesComDuplicate);
                    if(temp == 0){
                        if(response.data.data[index].title < response.data.data[dup].title){
                            console.log(response.data.data[index].title);
                            if (index > -1) {
                                articleCommentNum.splice(index, 1); 
                            }
                            x = 2;
                        } 
                        else{
                            console.log(response.data.data[dup].title); 
                            if (dup > -1) {
                                articleCommentNum.splice(dup, 1); 
                            }
                            x = 3;
                        }
                        temp = 1;
                    }
                }else{
                    if(temp == 1){
                        dup = hasAllUniqueChars2(articlesComDuplicate);
                        if(x == 2){
                            console.log(response.data.data[dup].title); 
                            if (dup > -1) {
                                articleCommentNum.splice(dup, 1); 
                            }
                        }
                        if(x == 3){
                            console.log(response.data.data[index].title);
                            if (index > -1) {
                                articleCommentNum.splice(index, 1); 
                            }
                        }
                    } else{  
                        console.log(response.data.data[index].title);
                    }
                }
            }else{
                if(response.data.data[index].story_title != null){
                    console.log(response.data.data[index].story_title);
                } 
            }
            // Removing the maximum number from array to find the next maximum number for the next article.
            articleCommentNum = removeFromArray(articleCommentNum, max);
            numOfTitles--;
        }
    })
}

function hasAllUniqueChars( s ){ 
    for(let c=0; c<s.length; c++){
        for(let d=c+1; d<s.length; d++){
            if((s[c]==s[d])){
                    return c;
            }
        }
    }
    return true;
}

function hasAllUniqueChars2( s ){ 
    for(let c=0; c<s.length; c++){
        for(let d=c+1; d<s.length; d++){
            if((s[c]==s[d])){
                    return d;
            }
        }
    }
    return true;
}

function removeFromArray(array, index){
    const index1 = array.indexOf(index);
    if (index1 > -1) {
        array.splice(index1, 1); 
    }
    return array;
}
export default router;