// Chatbot.js
import React, { useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hello! I am here to help you with the Rock-Paper-Scissors game or anything else!', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        
        // Mock bot response - replace with actual logic as needed
        const botReply = { text: "I'm ready! Type 'rock', 'paper', or 'scissors' to start.", sender: 'bot' };
        setMessages((prev) => [...prev, newMessage, botReply]);
        
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
