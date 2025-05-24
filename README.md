# Chatio

Chatio is a real-time chat application built using Node.js, Express, and Socket.IO. This project is purely for fun and practical learning of WebSocket concepts. Inspired by Omegle, it serves as a foundation to explore real-time communication, with future plans to include features like audit logs and live video transmission using WebRTC. In Future planning to scale this via Spring WebSocket with more concepts . 

## Features

- User login with unique usernames
- Real-time messaging with timestamps
- Online user list with live updates
- Notifications for users joining and leaving
- Responsive and modern UI styled with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

git clone https://github.com/akashee13dev/chatIO.git
cd chatIO

2. Install dependencies:

npm install

This will install:

- express
- socket.io
- (Tailwind CSS is loaded via CDN in the frontend)

3. Start the server:

npm start

4. Open your browser and go to:

http://localhost:8000

## Usage

- Enter a unique username to join the chat.
- Send and receive messages in real-time.
- View the list of online users updating live as users connect or disconnect.
- Logout to disconnect from the chat.

## Project Structure

- server.js — Backend server using Express and Socket.IO
- public/ — Static frontend files including HTML, CSS, and JavaScript
