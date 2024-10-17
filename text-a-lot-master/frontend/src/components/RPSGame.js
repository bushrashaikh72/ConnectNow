import React, { useState } from 'react';
import axios from 'axios';

const RPSGame = () => {
    const [userChoice, setUserChoice] = useState('');
    const [botChoice, setBotChoice] = useState('');
    const [result, setResult] = useState('');

    const handleChoice = async (choice) => {
        setUserChoice(choice);
        try {
            const response = await axios.post('/api/game/play', { userChoice: choice });
            setBotChoice(response.data.botChoice);
            setResult(response.data.result);
        } catch (error) {
            console.error('Error playing game:', error);
        }
    };

    return (
        <div className="game-container">
            <h1>Rock-Paper-Scissors</h1>
            <div className="choices">
                <button onClick={() => handleChoice('rock')}>Rock</button>
                <button onClick={() => handleChoice('paper')}>Paper</button>
                <button onClick={() => handleChoice('scissors')}>Scissors</button>
            </div>
            {userChoice && <p>Your Choice: {userChoice}</p>}
            {botChoice && <p>Bot's Choice: {botChoice}</p>}
            {result && <p>Result: {result}</p>}
        </div>
    );
};

export default RPSGame;
