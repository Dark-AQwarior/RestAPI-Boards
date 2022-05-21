import express from 'express';
import Board  from '../board.js';
import cors from 'cors';
import { compareSync, hashSync } from 'bcrypt';
import User from '../register.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import '../passport.js';
import axios from 'axios';
import sequelize from '../db/boards.js';
import sqlite3 from '../node_modules/sqlite3/lib/sqlite3.js';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(passport.initialize());

const db = new sqlite3.Database('boards.sqlite3',sqlite3.OPEN_READWRITE);

router.post('/register', async (req,res) => {
    const user = new User({
        email: req.body.email,
        password: hashSync(req.body.password, 10)
    })

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

router.post('/login', (req,res) => {
    console.log(req.body.email);
    User.findOne({where: {email: req.body.email}}).then(user => {

        if(!user){
            return res.status(401).send({
                success: false,
                message: "Could not find the user."
            })
        }
        
        if(!compareSync(req.body.password, user.password)){
            return res.status(401).send({
                success: false,
                message: "Incorrect Password."
            })
        }

        const payload = {
            email: user.email,
            id: user.id
        }
        const token = jwt.sign(payload, "Key", { expiresIn: "7d"});

        return res.status(200).send({
            success: true,
            message: "Logged in Successfully.",
            token: "Bearer " + token
        })
    })
})

router.post('/', passport.authenticate('jwt', {session: false}), async (req,res) => {
    const board = new Board({
        state: 1,
        title: req.body.title
    })

    await board.save().then(board => {
        res.send({
                id: board.id,
                state: board.state,
                title: board.title
        })
    })
    res.statusCode = 201;
});

router.put('/:id', passport.authenticate('jwt', {session: false}), async (req,res) => {
    const {id} = req.params;
    const {state} = req.body;

    const board = await Board.findOne({where: {id: id}});

    if(state<4) {
        board.state = state;
        res.statusCode = 200;
        res.send(board);
    }
    else{
        res.statusCode = 400;
        res.send(null);
    }
    await board.save();
});

function verifyToken(req, res, next){
    // Get Auth header value
    const bearerHeader = req.headers['authorization'];
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

export default router;