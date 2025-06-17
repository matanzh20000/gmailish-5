## Table of Contents

* [Overview](#overview)
* [Project Structure](#project-structure)
* [Features](#features)
* [Network](#network)
* [How to Run](#how-to-run)

  * [Running with Docker](#running-with-docker)
* [Persistence](#persistence)
* [Notes](#notes)

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
