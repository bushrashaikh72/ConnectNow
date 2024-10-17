// HomePage.js
import React, { useState } from 'react';
import RPSGame from './components/RPSGame';
import Chatbot from './components/Chatbot'; // Import the chatbot component
import { Box, IconButton } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

const HomePage = () => {
    const [showGame, setShowGame] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false); // Toggle for chatbot visibility

    return (
        <div>
            <h1>Welcome to the Chatbot Application</h1>
            <button onClick={() => setShowGame(!showGame)}>
                {showGame ? 'Close Game' : 'Play Rock-Paper-Scissors'}
            </button>
            {showGame && <RPSGame />}

            {/* Chatbot Toggle Icon */}
            <Box position="fixed" bottom="20px" left="20px">
                <IconButton
                    icon={<ChatIcon />}
                    colorScheme="blue"
                    borderRadius="50%"
                    size="lg"
                    onClick={() => setShowChatbot(!showChatbot)}
                    aria-label="Chatbot"
                />
            </Box>

            {/* Chatbot Component */}
            {showChatbot && (
                <Box position="fixed" bottom="80px" left="20px" bg="white" p={4} boxShadow="lg" borderRadius="md">
                    <Chatbot />
                </Box>
            )}
        </div>
    );
};

export default HomePage;
