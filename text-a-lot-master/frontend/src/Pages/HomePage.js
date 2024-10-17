// HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
//import Chatbot from "../components/miscellaneous/Chatbot";
import { ChatIcon } from "@chakra-ui/icons";

const HomePage = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userInformation = JSON.parse(localStorage.getItem("userInformation"));
        if (userInformation) navigate("/chats");
    }, [navigate]);

    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                margin="3.2rem 0 1rem 0"
                p={3}
                borderRadius="lg"
                borderColor="black"
                borderWidth="1px"
                w="100%"
                bg="blue.700"
            >
                <Text color="white" fontSize="4xl" fontFamily="Work sans" fontWeight="bold">
                    chat-application
                </Text>
            </Box>
            <Box bg="blue.50" w="100%" p={4} borderRadius="lg" borderColor="black" borderWidth="1px">
                <Tabs isFitted variant="soft-rounded" colorScheme="cyan">
                    <TabList mb="1em">
                        <Tab fontWeight="bold">Login</Tab>
                        <Tab fontWeight="bold">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

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
        </Container>
    );
};

export default HomePage;
