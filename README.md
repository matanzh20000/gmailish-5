# Bloom Filter CLI Application

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Network](#network)
- [How to Run](#how-to-run)
  - [Running with Docker](#running-with-docker)
  - [Configurations](#Configurations)
  - [How to run the tests](#how-to-run-the-tests)
- [Persistence](#persistence)
- [RESTful API](#RESTful-API)
- [SOLID Principles](#SOLID-Principles)
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

  We implemented a simple custom protocol:
  Commands are https requests, server processes each and handles it correctly.

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

4. **Create network for container communication - ONLY ONCE**
   ```bash
   docker network create server-network
   
5. **Build server image**
   ```bash
   docker build -f Dockerfile_server -t server-app .

6. **Run container**
   ```bash
   docker run -d --name server-container --network server-network -p 5555:5555 -v "$(pwd)/data:/app/data" -e SERVER_PORT=5555 -e BLOOM_SIZE=8 -e SEEDS="1 2 4" server-app

7. **OPEN A SEPERATE TERMINAL WINDOW concurrent to the one running the server and navigate to /src folder**

8. **Build express.js server image**
   ```bash
   docker build -f Dockerfile_express -t express-server .

9. **Run container**
   ```bash
   docker run -d --name express-container --network server-network -p 8080:8080 express-server

***IMPORTANT NOTE: Before running a new CPP Server/Express Server, all previous containers must be deleted so they don't use the port.***

### Configurations:

1. If the user wants to change the enviroment variables, like the SERVER_PORT, just change the port number:
   ```bash
   -e SERVER_PORT= <your input>
   -e BLOOM_SIZE= <your input>
2. If the user chooses to use the "docker run" command without enviroment variables, there are initialized default values in the designated Dockerfile.
3. To run the app from scratch after running it before, manually delete te text files that persist between runs BEFORE closing the server container :
   - go to docker desktop
   - open the server-container, and open files
   - search for the app/data directory, and then remove all files.
4. To remove all previous containers, run the next command in the terminal:
   ```bash
   docker rm -f $(docker ps -aq)

## How to run the tests

### Running on Docker
1. **Clone repository to local machine**
2. **Open Docker Desktop**
3. **navigate to /gmailish-3 folder in terminal**
4. **Build container**
   ```bash
   docker build -t tests-app .
5. **Run image**
   ```bash
   docker run tests-app
  
## Persistence

### Files:
- **bits.txt**: Stores Bloom Filter bit array.
- **urls.txt**: Stores blacklisted URLs.
- **seeds.txt**: Stores hash function seeds.

### Loading:
- On startup, the app checks for these files and restores previous state automatically if they exist.

### Saving:
- After running `Init`, `DeleteURL` `AddURL`, the app automatically saves the updated filter and blacklist.

### Custom Path:
- Use the `DATA_PATH` environment variable to specify a custom directory for saving these files.

---
## RESTful API:

### Users endpoint

- **POST /api/users**
  - Description: Creates a new user.
  - Required Fields (in request body in JSON format):
    ```bash
    {
      "name": "string",
      "username" : "string",
      "password" : "string",
      "email": "string" (must contain @ and end in .com)
    }
    
  - **Returns**:
    - `201 Created` on success
    - `400 Bad Request` if required fields are missing or invalid.

 - **GET /api/users/:id**
   - Description: Retrieves user information by ID.
   - URL Parameter:
     - `:id` — Numeric ID of the user (e.g., `1`)

 - **Returns**:
     - `200 OK` with user data if found.
     - `404 Not Found` if user does not exist.

### Tokens endpoint

- **POST /api/tokens**
  - Description: for a given username and password, validates existence of that user.
  - Required Fields (in request body in JSON format):
    ```bash
    {
      "username" : "string",
      "password" : "string"
    }
    
  - **Returns**:
    - `200 OK` with user id if found.
    - `404 Not Found` if user does not exist.
    - `400 Bad Request` if the request is invalid.

### Mails endpoint

- **POST /api/mails**
  - Description: Creates a new mail to send from one user (who is signed in) to many. Moreover, if the mail contains URLs in the
    body or subject of the mail, it will be checked with the C++ server for blacklisted URLs. If none of the URLs
    are blacklisted, the mail will be successfully sent. The sender and recipiet must be email addresses,
    for they are unique. The mail will both appear at recipient's and sender's.
  - Required Fields (in request body in JSON format):
    ```bash
    {
     "to" : ["User1", "User2", ...],
     "from" : "X-user",
     "subject": "string",
     "body": "string"
    }
    
  - **Returns**:
    - `201 Created` for a valid mail and fields in request body.
    - `400 Bad Request` in case of blacklisted URLs or invalid request body.

- **GET /api/mails**
  - Description: Returns 50 most recent mails for a specific user (user must be logged in), in descending order, from most recent to
    least recent.
  - Required Fields:
    - Add Header => `"X-user : user"`
  - **Returns**:
    - `200 OK` 50 most recent mails for X-user, as described.
    - `400 Bad Request` if the header is invalid.

- **GET /api/mails/:id**
   - Description: Retrieves mail information by ID.
   - URL Parameter:
     - `:id` — Numeric ID of the user (e.g., `1`)
   - **Returns**:
     - `200 OK` with mail data if found.
     - `404 Not Found` if mail does not exist.

- **PATCH /api/mails/:id**
   - Description: Make changes to recipient array, body or subject of the mail.
   - URL Parameter:
     - `:id` — Numeric ID of the user (e.g., `1`)
     - `Request body` (in JSON format)
       ```bash
          {
             "subject": "change",
             "body": "hi"
          }

   - **Returns**:
     - `204 No Content`if mail is found and changed successfully.
     - `404 Not Found` if mail does not exist.
     - `400 Bad Request` for invalid changes of request body.
 
- **DELETE /api/mails/:id**
   - Description: Delete a mail by id.
   - URL Parameter:
     - `:id` — Numeric ID of the user (e.g., `1`)

   - **Returns**:
     - `204 No Content`if mail is found and deleted successfully.
     - `404 Not Found` if mail does not exist.
    
- **GET /api/mails/search/:query**
   - Description: Get all mails that contain the query in their subject or body.
   - URL Parameter:
     - `:query` — A string (e.g "hello")

   - **Returns**:
     - `200 Ok` with mail information for all mails that comply with the query.
     - `400 Bad Request` for invalid query parameters.
      
### Lables endpoint

- **POST /api/labels**
  - Description: Create a new label.
  - Required Fields (in request body in JSON format):
    ```bash
    {
     "name" : "string"
    }
  - **Returns**:
    - `201 Created` with labels information.
    - `400 Bad Request` for invalid request body.
   
- **GET /api/labels**
  - Description: Get all labels.
  - **Returns**:
    - `200 OK` with labels information.
   
- **GET /api/labels/:id**
  - Description: Get the label by its id.
  - URL Parameter:
    - `:id` — Numeric ID of the user (e.g., `1`)
  - **Returns**:
    - `200 OK` with mail data if found.
    - `404 Not Found` if mail does not exist.

- **PATCH /api/labels/:id**
   - Description: Make changes to label name.
   - URL Parameter:
     - `:id` — Numeric ID of the user (e.g., `1`)
   - Required Fields (in request body in JSON format):
     ```bash
     {
      "name" : "string"
     }
   - **Returns**:
     - `204 No Content`if label is found is changed successfully.
     - `404 Not Found` if label does not exist.
     - `400 Bad Request` for invalid changes of request body.
 
- **DELETE /api/labels/:id**
   - Description: Delete a label by id.
   - URL Parameter:
     - `:id` — Numeric ID of the user (e.g., `1`)

   - **Returns**:
     - `204 No Content`if label is found and deleted successfully.
     - `404 Not Found` if label does not exist.
 
### Blacklist endpoint

- **POST /api/blacklist**
  - Description: Add a URL to the Blacklist on the C++ server, by opening a socket on the express.js server. The URL
    is validated to be in a correct format.
  - Required Fields (in request body in JSON format):
    ```bash
    {
      "url" : "valid url string"
    }
  - **Returns**:
    - `201 Created` for a valid URL.
    - `400 Bad Request` in case of invalid request body.

  - **DELETE /api/blacklist/:id**
   - Description: Delete a URL from blacklist by id - url address.
   - URL Parameter:
     - `:id` — Numeric ID of the user (e.g., `1`)

   - **Returns**:
     - `204 No Content`if URL is found and deleted successfully.
     - `404 Not Found` if URL does not exist.

---
## SOLID Principles
We were asked to point out how the SOLID principles came to fruition in our project. There are a few points we need to address
to ensure our work flow followed those principles:

1. Because we implemented the Open/Close principle carefully, The fact that the command names had to change from the first to the second of the project allowed us to only add
   upon our code, without changing it at all. We used the ICOMMAND interface design pattern and applied enums to every request, so we just had to add the names of the requests
   instead using the default enumeration, which start at 0 and goes on. This is a prime example of Closing our code to changes, but keeping it open to extensions.
2. According to the explaination in section 1, we used the correct approach with the ICOMMAND interface design pattern, so all we needed to do is to assign a number which was not
   taken by any requests so far, and give it the "DELETE" label. No changes, just extension.
3. As we continue expanding upon the ICOMMAND interface design pattern, every request has its own class and specific implementation, which overrides the interface.
   In each and every class, there was room for extension according to SOLID principles. All we had to do is to add a string returning the correct output, according to the conditions
   that were already stated in the first part of the project.
4. In order to process data that is sent through sockets, using TCP communication between a server and a client, we had to include code that support this new functionality.
   Following this change, we had to adjust the main function by adding more conditions to check if there was a port included in the run command, so the program can run with a default
   port of "5555" or with any other port the user inputs. So far we had successfully dodged any changes to or code, through correct implementation of the SOLID principles, but in our app
   file, we just had to remove an while(true) loop, because the app only invokes once per client request, and not perpetually on the CLI. Otherwise, no changes were made in our code,
   only extensions.
---

## Run Demo
- ### Run tests Example
![TESTS1](https://github.com/user-attachments/assets/47a176c9-a836-4684-9582-64fb5342a3f7)
![TESTS2](https://github.com/user-attachments/assets/393d7625-50b8-4ca8-ad9f-3268ccf8883f)

### Demo for part 3
- **User Creation**
![Alice](https://github.com/user-attachments/assets/6feeb55e-9738-4c36-beb4-4f6beb295170)
![Bob](https://github.com/user-attachments/assets/575295a2-d37c-4915-9738-903b2748e5fa)
![Charlie](https://github.com/user-attachments/assets/1614cc97-fd2b-40be-bc02-b95c4a8eb46c)
![InvalidUsername](https://github.com/user-attachments/assets/7f470a05-0e11-433d-8602-82c6fc351f6b)

- **Get User By ID**
![GetAlice](https://github.com/user-attachments/assets/c08f804f-f3e3-44a7-afd5-6a6c15c42a74)
![GetInvalidUser](https://github.com/user-attachments/assets/db1f13c8-8e20-4c52-a89d-c7c707a30594)

- **User Token**
![AliceToken](https://github.com/user-attachments/assets/c93a3e5b-f1d7-49fb-b385-8e256873817d)

- **Mail Endpoint**
![MailWithOkUrl](https://github.com/user-attachments/assets/8fe31b73-cec5-42a3-9109-51673b269480)
![AliceGetsAllMails](https://github.com/user-attachments/assets/9b8f246f-f65c-449c-9ece-e7fd5204ab61)
![MailFound](https://github.com/user-attachments/assets/7debb961-99f1-4bed-88b2-692d986e2c9b)
![MissingXUser](https://github.com/user-attachments/assets/5c360876-8c44-4a3f-a75f-0e48056fe955)
![MailNotFound](https://github.com/user-attachments/assets/8b738d13-a4b0-41c5-9301-5228a5a2f344)

- **URL Blacklisting**
![AddedBlacklist](https://github.com/user-attachments/assets/5241ad7a-c8d6-47da-8fcf-f77a35ec44c9)
![InvalidURL](https://github.com/user-attachments/assets/2c42f12e-992e-4a19-bfbd-4234e4edcf00)

- **Mail Modification**
![SuccessPatch](https://github.com/user-attachments/assets/d2571939-ac8a-4bb6-bfb5-2fb4998d6466)
![PatchedMail](https://github.com/user-attachments/assets/a4b94dec-c76e-4161-abe0-3095ff95070f)
![SuccessDelete](https://github.com/user-attachments/assets/781242cd-88fb-4b31-b037-7551dfc5fc74)
![NoMailAfterDel](https://github.com/user-attachments/assets/241d4065-10d3-4b32-9d93-f1dd43de315a)

- **Query Searching**
![QuerySearch](https://github.com/user-attachments/assets/70d6fa82-3848-4efd-972f-a25d70791b5d)

- **Label Endpoint**
![StarredLabel](https://github.com/user-attachments/assets/22796268-c2da-486d-9461-a9f6c23d86cd)
![GetLabel](https://github.com/user-attachments/assets/7673af7a-776f-4d8c-9697-5d57f75c0027)
![PatchLabel](https://github.com/user-attachments/assets/51837272-a833-4acf-8427-21be560dff19)
![DeleteLabel](https://github.com/user-attachments/assets/8ffa4c71-89b9-4fab-8cba-2dee12196904)

### CURL examples
![curlPostUser](https://github.com/user-attachments/assets/64b53f28-abcf-432c-b394-572054dd0c63)
![curlGetUser](https://github.com/user-attachments/assets/11415a5a-9408-4bc5-a712-faa074b7f500)
![curlSendMail](https://github.com/user-attachments/assets/8ca77596-142f-47c8-bdc5-69d253e0b7d6)
![curlAddBlacklist](https://github.com/user-attachments/assets/b6e5346e-f02c-47d9-947e-180aa843bef5)











