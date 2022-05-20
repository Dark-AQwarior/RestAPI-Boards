import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Board  from '../board.js';

const router = express.Router();
router.use(express.json());

let boards = [];
var id = 0;

router.get('/', (req,res) => {
    res.send(boards);
});

router.post('/', async (req,res) => {
    const board = req.body;
    boards.push({ id:  id+1, state: 1, ...board});
    res.send(boards[id]);
    res.statusCode = 201;
    await Board.create(boards[id]);
    id++;
});

router.put('/:id', async (req,res) => {
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

export default router;