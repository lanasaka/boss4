import React, { useState } from 'react';
import { Card, CardBody, Form, FormGroup, Input, Button } from 'reactstrap';
import './ApplicationDetails.css'; // Import the CSS for styling

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      // Here you can add the logic to send the message to a backend server or an API
    }
  };

  return (
    <Card className="chat-card">
      <CardBody className="chat-card-body">
        <div className="chat-box">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
        </div>
        <Form inline onSubmit={e => e.preventDefault()} className="chat-form">
          <FormGroup className="chat-input-group">
            <Input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Type a message"
              className="chat-input"
            />
          </FormGroup>
          <Button onClick={handleSendMessage} color="primary" className="chat-send-button">
            Send
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ChatComponent;
