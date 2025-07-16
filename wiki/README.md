
## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Network](#network)
* [How to Run](#how-to-run)
* [Running with Docker](#running-with-docker)
* [Persistence](#persistence)
* [Android Client](#android-client)
* [Notes](#notes)
* [Security & Configuration](#security--configuration)
* [Run Demo](#run-demo)

---

## Overview

Meet Gmailish - Our Full-Stack project is a Gmail-like mail system application, designed with modular architecture and clean design :)

It includes:

* A **Node.js/Express** server for user and mail operations.
* A **C++ TCP server** for blacklist URL validation using a Bloom Filter.
* A **React** frontend styled with Bootstrap.
* An **Android** app client built with Java using Room, MVVM, and Repository pattern.
* A GTest-based test suite for C++ components.

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

   * Built with React.js and styled using Bootstrap.
   * Responsive, user-friendly interface mimicking Gmail.
   * Sign in / Sign up with profile picture.
   * Compose mail with `To`, `Cc`, and `Bcc` fields using toggles.
   * Draft saving, dark/light mode, label management, mail search.

4. **Android App Client**

   * Fully functional mobile client connecting to the same backend API.
   * Built in **Java** using **MVVM architecture**, **Room database**, and the **Repository pattern**.
   * Supports:
     * Sign up/sign in with JWT tokens.
     * Mail list retrieval and display.
     * Compose and send email.
     * Draft saving and offline support via Room.
     * Dark/light theme and responsive mobile UI.

Our project structure supports full-stack and cross-platform development by keeping frontend (React and Android), backend (Node), and core server (C++) logic logically organized and accessible within one repository. This facilitates Dockerization and helps developers seamlessly switch between components.

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
* Fast testing with false positives.
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

### Android Client

* Built with Java, Room, LiveData, and ViewModel.
* Implements MVVM and Repository pattern for clean architecture.
* Sign up supports uploading a profile picture (or uses default).
* Works seamlessly with the backend via HTTP API calls.
* JWT-based auth, secure login/logout.
* Compose, read, and send emails.
* Store drafts offline using Room.
* Dark/light mode toggle.

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
4. **Create a folder named `data` inside `src`.**
5. Delete all containers/images related to the project:

   ```bash
   docker container prune
   docker image prune -a
   ```

6. Build the containers:

   ```bash
   docker-compose build
   ```

7. Start the containers:

   ```bash
   docker-compose up
   ```

8. Open Gmailish in your browser:

   ```
   http://localhost:3000/
   ```

---

## Persistence

### Files

To confirm that a URL is blacklisted:

1. Open Docker Desktop.
2. Navigate to `containers/src/cpp_server/files/app/data/urls.txt` and open in an editor.

* `bits.txt`: Bloom Filter bit array
* `urls.txt`: Explicitly blacklisted URLs
* `seeds.txt`: Hash function seeds

### Behavior

* Upon URL addition/deletion or `Init`, the updated Bloom state is saved automatically.

---

## Android Client

### Tech Stack

* **Language**: Java
* **Architecture**: MVVM
* **Persistence**: Room Database
* **Data Layer**: Repository pattern
* **Networking**: Retrofit or native HTTP libraries

### Features

* JWT-based login/registration.
* Fetch emails, view details, compose, and send.
* Store drafts offline using Room.
* Dark/light mode support.
* Works in sync with Node.js server and C++ blacklist checker.

### Setup

1. Open the Android project in Android Studio.
2. Ensure emulator/device is set up.
3. Set the backend IP to your local machine or Docker alias (e.g., `10.0.2.2` for emulator).
4. Run the app.

---

## Notes

* If no profile image is uploaded on registration, a default one is used.
* On registration, enter your **name** (e.g., `alice`) and **not** an email format like `alice@gmailish.com`.

---

## Security & Configuration

* JWT tokens are used for secure authentication.
* `.env` file contains the secret key for token generation (do not expose publicly).
* Android stores tokens securely using `SharedPreferences`.

---

## Run Demo

Try it on `http://localhost:3000`
enjoy! :)
