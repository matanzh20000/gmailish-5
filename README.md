---

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
