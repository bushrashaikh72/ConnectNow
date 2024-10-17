import React, { useEffect, useState, useContext } from 'react';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import ChatContext from "../Context/chat-context";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(ChatContext);
  const toast = useToast();

  // Function to fetch chats
  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data, 'Fetching all user chats in MyChats');

    } catch (error) {
      console.error("Error fetching chats:", error.message);
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Function to fetch new messages
  const fetchMessages = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.get("/api/messages", config); // Adjust the API endpoint for fetching messages
      console.log(data, 'Polling for new messages');

      // You can update your state here if needed for new messages or chats

    } catch (error) {
      console.error("Error fetching new messages:", error.message);
      toast({
        title: "Error Occurred!",
        description: "Failed to load new messages.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Poll for new messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(); // Poll for new messages
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Fetch chats initially and whenever fetchAgain changes
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInformation"))); 
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
