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
  const [polling, setPolling] = useState(false); // Initialize polling state

  const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(ChatContext);
  const toast = useToast();
  
  const fetchChats = async (showError = true) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data, 'fetching all users chats in my chats');
      
    } catch (error) {
      console.error("Error fetching chats:", error.message);
      if (showError) {
        toast({
          title: "Error Occurred!",
          description: "Failed to load the chats.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  // Fetch chats initially and whenever fetchAgain changes
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInformation"))); 
    fetchChats(false); // Prevent toast on initial load
  }, [fetchAgain]);

  // Start polling for chats when the component mounts or when selectedChat changes
  useEffect(() => {
    setPolling(true); // Start polling when component is mounted
    const interval = setInterval(() => {
      fetchChats(); // Fetch chats every 5 seconds
    }, 6000);

    return () => {
      clearInterval(interval); // Cleanup the interval on component unmount
      setPolling(false); // Stop polling on unmount
    };
  }, []);

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
