import React, { useState } from 'react';
import { Button, Input, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

const StyledMessageBox = styled(Paper)(({ theme, owner }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  backgroundColor: owner ? theme.palette.primary.light : theme.palette.grey[200],
  marginLeft: owner ? 'auto' : '',
  marginRight: owner ? '' : 'auto',
  maxWidth: '80%',
}));

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const newMessages = [...messages, { text: inputValue, owner: true }];
    setMessages(newMessages);
    setInputValue('');

    try {
      // Send message to the backend API
      const response = await axios.post('/api/chat', { message: inputValue });
      if (response.status === 200) {
        setMessages([...newMessages, { text: response.data.response, owner: false }]);
      } else {
        console.error('Error sending message');
      }
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          height: '400px',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((message, index) => (
          <StyledMessageBox key={index} owner={message.owner}>
            <Typography variant="body1">{message.text}</Typography>
          </StyledMessageBox>
        ))}
      </Box>
      <Box mt={2} display="flex">
        <Input
          fullWidth
          value={inputValue}
          onChange={handleChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage} variant="contained" sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
