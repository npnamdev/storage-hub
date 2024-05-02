const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel');

// Route: GET all transactions, sorted from newest to oldest
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Route: GET a specific transaction by ID
router.get('/:id', getTransaction, (req, res) => {
    res.json(res.transaction);
});

// Route: Create a new transaction
router.post('/', async (req, res) => {
    const transaction = new Transaction({
        name: req.body.name,
        amount: req.body.amount,
        type: req.body.type
    });

    try {
        const newTransaction = await transaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route: Update a transaction
router.patch('/:id', getTransaction, async (req, res) => {
    if (req.body.name != null) {
        res.transaction.name = req.body.name;
    }
    if (req.body.amount != null) {
        res.transaction.amount = req.body.amount;
    }
    if (req.body.type != null) {
        res.transaction.type = req.body.type;
    }
    try {
        const updatedTransaction = await res.transaction.save();
        res.json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route: Delete a transaction
router.delete('/:id', getTransaction, async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (deletedTransaction) {
            res.json({ message: 'Deleted transaction' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Middleware function to get a transaction by ID
async function getTransaction(req, res, next) {
    let transaction;
    try {
        transaction = await Transaction.findById(req.params.id);
        if (transaction == null) {
            return res.status(404).json({ message: 'Cannot find transaction' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.transaction = transaction;
    next();
}

module.exports = router;
