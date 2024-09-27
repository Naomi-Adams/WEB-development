const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Expense Management API!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let expenses = [];


app.post('/expense', (req, res) => {
    const { username, amount, description } = req.body;
    expenses.push({ username, amount, description, date: new Date() });
    res.status(201).send('Expense added successfully');
});


app.get('/expenses', (req, res) => {
    const { username } = req.query;
    const userExpenses = expenses.filter(expense => expense.username === username);
    res.json(userExpenses);
});


app.get('/expenses/total', (req, res) => {
    const { username } = req.query;
    const userExpenses = expenses.filter(expense => expense.username === username);
    const total = userExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    res.json({ total });
});


const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.username = decoded.username;
        next();
    });
};


app.post('/expense', authenticate, (req, res) => {
    const { amount, description } = req.body;
    expenses.push({ username: req.username, amount, description, date: new Date() });
    res.status(201).send('Expense added successfully');
});

app.get('/expenses', authenticate, (req, res) => {
    const userExpenses = expenses.filter(expense => expense.username === req.username);
    res.json(userExpenses);
});
