// Chatbot.js
import React, { useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hi! Let’s play Rock-Paper-Scissors!', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        // Mock bot response
        const botMessage = { text: "I’m ready! Type 'rock', 'paper', or 'scissors' to start.", sender: 'bot' };
        setMessages((prev) => [...prev, userMessage, botMessage]);

        setInput('');
    };

    return (
        <div style={{ maxWidth: '300px' }}>
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', borderBottom: '1px solid gray' }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                        <span>{message.text}</span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '80%', padding: '5px' }}
            />
            <button onClick={handleSend} style={{ width: '20%', padding: '5px' }}>Send</button>
        </div>
    );
};

export default Chatbot;
