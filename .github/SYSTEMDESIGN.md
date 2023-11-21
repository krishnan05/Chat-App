# System Design Document: Real-Time Chatting Website

## 1. Introduction

### 1.1 Purpose

This document outlines the design and architecture of a real-time chatting website. The goal is to provide an overview of how the system functions and the technologies used.

### 1.2 Scope

The system allows users to engage in real-time text-based communication in both personal, group chat and chatbot settings.

## 2. System Overview

### 2.1 System Architecture

The system follows a client-server architecture with a WebSocket-based real-time communication layer.

### 2.2 System Components
#### Client-Side Application:

- Developed using React.js
- Utilizes Socket.IO for real-time communication
- Integrated with emoji-picker-react for emoji support
- ChatBot developed using Hugging Face

#### Server:

- Built using Node.js and Express.js
- Uses Socket.IO for handling WebSocket connections
- Interacts with MongoDB for storing user and chat data

#### Database (MongoDB):

Stores user information, chat messages, and group details
Ensures data persistence and retrieval

## 3. Data Design

### 3.1 Database Schema

The MongoDB database includes collections for users, personal chats, and group chats.

### 3.2 Data Flow

- Users send messages via the client-side application.
- The server processes and broadcasts messages using WebSocket connections.
- Messages are stored in MongoDB for persistence.

## 4. Technology Stack

### Frontend:
- React.js
- Socket.IO-client
- emoji-picker-react

### Backend:

- Node.js
- Express.js
- Socket.IO
- MongoDB

## 5.  System Interfaces

### 5.1 User Interfaces

- Personal Chat Interface
- Group Chat Interface
- Emoji Picker
- Chat Bot

### 5.2 API Interfaces

- WebSocket API for real-time communication
- RESTful API for user and chat data
- Hugging Face api for chatbot

## 6. Security

### 6.1 Data Security

- Encryption for data in transit using HTTPS.
- MongoDB security measures for data at rest.

## 7.  Performance Considerations

- Optimized WebSocket communication for low-latency messaging.
- Scalability considerations for handling increased user and chat volumes


## 8. Conclusion

The real-time chatting website provides an efficient and secure platform for users to communicate seamlessly.

### 9. References

- Socket.IO Documentation
- MongoDB Documentation
- React.js Documentation
- Hugging Face chatbot documentation
