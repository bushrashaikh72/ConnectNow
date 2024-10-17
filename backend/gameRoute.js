const express = require('express');
const router = express.Router();

// Function to handle the bot's choice and determine the game result
const playGame = (userChoice) => {
    const choices = ['rock', 'paper', 'scissors'];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    if (userChoice === botChoice) {
        result = 'It\'s a tie!';
    } else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
    ) {
        result = 'You win!';
    } else {
        result = 'You lose!';
    }

    return { botChoice, result };
};

// Route for handling game play
router.post('/play', (req, res) => {
    const { userChoice } = req.body;
    const { botChoice, result } = playGame(userChoice);

    res.json({ botChoice, result });
});

module.exports = router;
