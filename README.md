# Bloom Filter CLI Application

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Network](#network)
- [How to Run](#how-to-run)
  - [Running with Docker](#running-with-docker)
- [Persistence](#persistence)
- [Run Demo](#Run-Demo)

---

## Overview
This project is a Gmail-like mail system designed with a modular architecture, emphasizing clean design, extensibility, and fault tolerance. It includes:
  - A Node.js/Express-based server that handles user and mail operations (create, update, send, etc.).
  - A C++ TCP server responsible for URL blacklist validation in email bodies, acting as a content filter.
  - A GTest test suite to validate C++ server logic and simulate real client-server interaction.

**Main Components**:
1. **Node.js Express Server (MVC Architecture)**

    **Responsibilities**:
   - User creation and validation.
   - Mail creation, patching and deletion.
   - Checks if a mail body contains a blacklisted URL by sending it to the C++ server.
   - Label creation and management.

 **URL Validation Flow**:
  1. Extract URLs from the mail body.
  2. Open a TCP socket to the C++ URL filter server.
  3. Send: GET\n<URL>\n
  4. If response is "true true", reject mail.

2. **C++ TCP Server**

   **Responsibilities**:
   - Listens on a port for TCP connections.
   - Parses incoming messages like: GET\n<URL>\n.
   - In case of URL validation, Responds with:
      1. "true true": URL is in the Bloom Filter and blacklisted.
      2. "true false": In Bloom Filter, but not explicitly blacklisted.
      3. "false": Not found at all.

 **Implementation**:
  1. Uses a Bloom Filter for space-efficient storage of URLs.
  2. Supports multiple hash functions, loaded from seeds.
  3. Persists:

  - bits.txt: Bloom bit array.
  - urls.txt: Explicit blacklist.
  - seeds.txt: Hash seeds.

---

## Project Structure
- **src/**: Contains core application logic.
  - **Bloom/**: Bloom Filter implementation including BitArray and HashFunctions.
  - **persistence/**: Handles saving/loading data from files.
  - **cli/**: Command-line interface commands and app flow.
  - **Network/**: TCP server logic and functionality.
  - **JSNetwork**: MVC Architecture of HTTP server.
- **tests/**: GoogleTest-based unit tests for various modules.
- **Dockerfile**: For containerized builds and execution.
- **CMakeLists.txt**: Build configuration for CMake.

---

## Features
- **Bloom Filter Implementation**:
  - Supports multiple hash functions.
  - Efficient URL addition and lookup.
  - False positive-aware checks (`mightContain`) and strict blacklist checks.
  
- **Persistence**:
  - Saves filter bit array, hash functions invokes and blacklisted URLs to files.
  
- **API and HTTP requests**
  - Demonstrate a real web server, with Gmail-like functionality
  - respond to many HTTP request for users, mails and more.
---

## Network

 Network protocols define rules for data exchange between devices. Common types include:
 - **TCP (Transmission Control Protocol)**
  Reliable, connection-oriented. Guarantees delivery and order of data. Used for web, email, file transfer.
 - **UDP (User Datagram Protocol)**
  Fast, connectionless. No guarantee of delivery or order. Used for video streaming, gaming, VoIP.
  
 We chose **TCP** for our project due to its key advantages:
 - Reliable data transmission
 - Ensures full command messages are delivered
 - Handles packet ordering and retransmission automatically
 - Simple to implement custom text-based protocols over it

Our project uses a client-server model over TCP:
- **Server (C++):**
  - Listens on a TCP port using socket, bind, listen, and accept.
  - For each client connection, reads commands, processes them, and returns responses.
  - Delegates command logic to the App class and maintains state via AppState.
- **Client (Node js):**
  - Connects to the server
  - Sends user-typed commands over TCP
  - Receives and handles server’s response

  **Supporting Concepts**
  - **Sockets**
      - A socket is an endpoint for sending or receiving data between machines.
      - We use TCP/IP sockets: SOCK_STREAM for TCP, AF_INET for IPv4.
      - The server creates a socket to listen for connections, the client creates one to connect.
  - **IP Adresses**
      - An IP address identifies a device on a network.
      - Our server listens on INADDR_ANY (0.0.0.0) to accept connections from any address.
      - The client connects to 127.0.0.1 (localhost) or a configured container name (like server-container in Docker).


---

## How to Run

### Running with Docker

1. **Clone repository to local machine**

2. **Open Docker Desktop**

3. **IMPORTANT: Navigate to /src folder in terminal**

4. **Create a folder named 'data'**

5. **Create .env file with the following content:**
   ```bash
   SECRET_KEY=SOMEKEY
6. **Verify that all docker conatiners and images related to the project are deleted**

8. **Build the images**
   ```bash
   docker-compose build

9. **Run container**
   ```bash
   docker-compose up

10. **Open Gmailish at:**
   ```bash
   http://localhost:3000/



  
## Persistence

### Files:
- **bits.txt**: Stores Bloom Filter bit array.
- **urls.txt**: Stores blacklisted URLs.
- **seeds.txt**: Stores hash function seeds.


### Saving:
- After running `Init`, `DeleteURL` `AddURL`, the app automatically saves the updated filter and blacklist.


