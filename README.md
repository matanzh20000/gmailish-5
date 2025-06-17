![8](https://github.com/user-attachments/assets/b8f80eb1-c7b2-4603-aae7-cf98ef4ef687)## Table of Contents

* [Overview](#overview)
* [Project Structure](#project-structure)
* [Features](#features)
* [Network](#network)
* [How to Run](#how-to-run)
* [Running with Docker](#running-with-docker)
* [Persistence](#persistence)
* [Notes](#notes)
* [Run Demo](#rundemo)

---

## Overview

This project is a Gmail-like mail system designed with modular architecture, clean design, and robust fault tolerance.

It includes:

* A **Node.js/Express** server for user and mail operations.
* A **C++ TCP server** for blacklist URL validation using a Bloom Filter.
* A **React** frontend styled with Bootstrap.
* GTest-based test suite for C++ components.

**Main Components**:

1. **Node.js Express Server** (MVC Architecture)

   * Manages users, mails, and labels.
   * Uses JWT-based authentication.
   * Validates emails for blacklisted URLs via a TCP call to the C++ server.

2. **C++ TCP Server**

   * Responds to `GET\n<URL>\n` format.
   * Returns:

     * `true true`: Found in Bloom filter and explicitly blacklisted.
     * `true false`: Found in Bloom filter but not in explicit blacklist.
     * `false`: Not found at all.

3. **React Web App**

   * Built with React.js and styled using Bootstrap, providing a modern, responsive, and user-friendly interface.
   * Sign in / Sign up with profile picture.
   * Compose mail with `To`, `Cc`, and `Bcc` fields. The compose interface is designed to mimic the real Gmail experience. Users can dynamically add or hide `Cc` and `Bcc` fields using toggle buttons, which improves usability. Each of these fields is validated to ensure recipients exist in the system. Additionally, the compose window supports saving drafts.
   * Mail drafts allow users to save unfinished emails and return to them later. The dark/light mode toggle enhances accessibility and user comfort by allowing interface theme changes. The search bar enables users to find specific mails by keywords. Label functionality supports email organization by allowing users to categorize emails under customizable tags for better filtering and management.


Our project structure supports full-stack development by keeping frontend, backend, and core server logic logically organized and accessible within one repository. It simplifies Dockerization and helps developers switch between components seamlessly.

### Backend (`JSNetwork/`)

* Follows MVC (Model-View-Controller) pattern for Node.js Express server.

### Core C++ Server (`src/`)

```
src/
├── Bloom/                    # Bloom filter core logic, BitArray, and hash functions
├── persistence/              # Save/load from bits.txt, urls.txt, seeds.txt
├── cli/                      # CLI interface logic (optional for command-line operations)
├── Network/                  # TCP server setup, socket handling
├── tests/                    # Unit tests for C++ components (GTest)
├── Dockerfile                # Docker image build instructions
├── docker-compose.yml        # Multi-container setup
└── CMakeLists.txt            # C++ build system
```

---

## Features

### Bloom Filter + C++ Server

* Efficient and space-saving URL validation.
* Fast testing with false-positive.
* TCP-based interface for external querying.

### Node.js Server

* Secure JWT-based login & registration.
* Only registered users can send/receive emails.
* Validates input fields thoroughly.
* Sends content to C++ server for blacklist scanning before allowing send.

### Frontend (React + Bootstrap)

* Fully responsive interface.
* Compose with `To`, `Cc`, `Bcc`.
* Sign up supports uploading a profile picture (or uses default).
* Dark mode / light mode toggle.
* Labels and email categorization.
* Mail search.
* Save emails as draft.
* Logout and login flow.

---

## Network

### Why TCP?

TCP provides reliable, ordered delivery of messages, which is essential for custom text-based protocols like our `GET\n<URL>\n` queries.

### Architecture

* **Server (C++)**:

  * Listens for connections on a TCP port.
  * Parses incoming URL check requests.
  * Maintains Bloom filter and blacklist state.

* **Client (Node.js)**:

  * Sends extracted URLs from email body to C++ server.
  * Decides to allow or reject based on response.

### Supporting Concepts

* **Sockets**: Endpoint for data exchange.
* **IP**: Uses `INADDR_ANY` on server side; connects to `127.0.0.1` or container alias from Node.

---

## How to Run

### Running with Docker

1. Clone this repository.
2. Open Docker Desktop.
3. Navigate to the `src/` folder in terminal.
4. Create a folder named `data` inside `src`.
5. Inside `src`, create a `.env` file with:

   ```env
   SECRET_KEY=SOMEKEY
   ```
6. Delete all containers/images related to the project:

   ```bash
   docker container prune
   docker image prune -a
   ```
7. Build the containers:

   ```bash
   docker-compose build
   ```
8. Start the containers:

   ```bash
   docker-compose up
   ```
9. Open Gmailish in your browser:

   ```
   http://localhost:3000/
   ```

---

## Persistence

### Files

In order to confirm that a url is blacklisted open docker desktop, and navigate to containers/src/cpp_server/files/app/data/urls.txt - Open in editor.
* `bits.txt`: Bloom Filter bit array
* `urls.txt`: Explicitly blacklisted URLs
* `seeds.txt`: Hash function seeds

### Behavior

* Upon URL addition/deletion or `Init`, the updated Bloom state is saved automatically.

---

## Notes

* If no profile image is uploaded on registration, a default one is used.
* On registration, enter your **name** (e.g., `alice`) and **not** an email format like `alice@gmailish.com`.

---

## Security & Configuration

* JWT tokens are used for secure authentication.
* `.env` file contains the secret key for token generation (do not expose publicly).

---

## Run demo:
![1](https://github.com/user-attachments/assets/dcd994ef-0385-464f-b897-489c2a5191cc)
![2](https://github.com/user-attachments/assets/f903ca05-dcd0-4677-b991-c3c656c229f0)
![3](https://github.com/user-attachments/assets/f599f14f-51bc-4c55-89cb-45dfa7f65ee1)
![4](https://github.com/user-attachments/assets/aebc39ba-89b2-43e7-b086-f34a6aa96908)
![5](https://github.com/user-attachments/assets/343d3385-3dcb-4566-8bfd-428029d3f95e)
![7](https://github.com/user-attachments/assets/2d2cbc7a-3953-4ddf-b0e4-f2d4331e2e81)
![8](https://github.com/user-attachments/assets/aa96e0a5-0650-4c67-a95e-7445ee0f179d)
![9](https://github.com/user-attachments/assets/9373b172-5755-4413-814a-f81d8ecd9bb2)
![10](https://github.com/user-attachments/assets/16c6616b-6c24-43c8-a1e0-548f70ebad49)
![11](https://github.com/user-attachments/assets/f7c85406-b4e2-4eea-befe-a0f1adef55cc)
![12](https://github.com/user-attachments/assets/9cdd9c03-b563-4b8b-a78f-ca51df463914)
![13](https://github.com/user-attachments/assets/9ebecd3e-6bc4-4dbf-9d08-07b7c9d28a12)
![14](https://github.com/user-attachments/assets/f03540c3-e17b-48e2-a521-e54258301623)
![15](https://github.com/user-attachments/assets/c4817030-38f4-431b-9eb3-5de9c643f79d)
![16](https://github.com/user-attachments/assets/6aa86a64-db44-4dec-bc10-a974255bff9c)












