import React, {useContext} from 'react';

import { Box } from "@chakra-ui/layout";
//import "./styles.css";
import SingleChat from "./SingleChat";
import ChatContext from '../Context/chat-context';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {

  const { selectedChat } = useContext(ChatContext);

  // Poll for new messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(); // Poll for new messages
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
