import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatContext from "../../Context/chat-context";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text, Button, Tooltip } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Input, Spinner } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import io from "socket.io-client";
import chatbotIcon from "../../download.png";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = useContext(ChatContext);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const socket = io("http://localhost:5000");

  useEffect(() => {
    socket.emit("setup", user);

    socket.on("message received", (newMessage) => {
      if (!chats.find((chat) => chat._id === newMessage.chat._id)) {
        setNotification((prev) => {
          if (!prev.some(notif => notif._id === newMessage._id)) {
            const audio = new Audio('/path-to-your-sound-file.mp3');
            audio.play().catch((error) => console.error("Audio playback failed:", error));
            return [newMessage, ...prev];
          }
          return prev;
        });
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [user, chats]);

  const logoutHandler = () => {
    localStorage.removeItem("userInformation");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChatCreateChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((chat) => chat._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

      setNotification([]);
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <React.Fragment>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px"
        borderWidth="1px"
        borderColor="#add8e6"
        bg="#f0f8ff"
        color="#333"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" bg='skyblue' onClick={onOpen} color="black"
            _hover={{ background: "#f0f8ff", color: "black" }}
            _active={{ background: "#00BFFF", color: "black" }}
          >
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4} fontWeight="bold">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="3xl" fontFamily="Work sans bold" fontWeight='bold' color="#007FFF">
ConnectNow        </Text>

        <Box display="flex" alignItems="center">
          <a href="https://t.me/TSDCReadTimeChatBot" target="_blank" rel="noopener noreferrer">
            <img
              src={chatbotIcon}
              alt="Chatbot Icon"
              className="chatbot-icon"
              style={{ width: '70px', height: '60px', marginRight: '20px', cursor: 'pointer' }}
            />
          </a>

          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
            </MenuButton>

            <MenuList pl={2} onMouseEnter={() => setNotification([])}>
              {!notification.length && "No New Messages"}
              {notification.slice(0, 5).map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="skyblue" rightIcon={<ChevronDownIcon />}
              _hover={{ background: "#87CEFA", color: "black" }}
              _active={{ background: "#00BFFF", color: "black" }}
            >
              <Avatar size="sm" cursor="pointer" name={user.name} borderColor="black" borderWidth="2px" bg="skyblue" color="black" />
            </MenuButton>
            <MenuList bg="#f0f8ff" borderColor="black" borderWidth="2px">
              <ProfileModal user={user}>
                <MenuItem fontWeight="bold" color="#333" _hover={{ background: "#87CEFA" }}>
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem fontWeight="bold" color="#333" onClick={logoutHandler} _hover={{ background: "#87CEFA" }}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChatCreateChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
};

export default SideDrawer;
