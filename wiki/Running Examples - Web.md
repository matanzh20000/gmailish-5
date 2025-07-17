<details>
<summary><strong>🔐 Sign-In Light Mode</strong></summary>

**Demonstrates a successful login in light theme.**  
Valid credentials allow access to the inbox, with user preferences and theme restored from the last session. The interface is optimized for clarity and usability.

</details>

<img width="1437" height="807" alt="image" src="https://github.com/user-attachments/assets/13a8b5dc-d5fc-42df-887c-38138505a9b0" />

---

<details>
<summary><strong>🌑 Sign-In Dark Mode</strong></summary>

**Demonstrates a successful login using dark mode.**  
The interface appears in low-light mode based on saved preferences. It highlights theme persistence and secure session initialization.

</details>

<img width="1431" height="767" alt="image" src="https://github.com/user-attachments/assets/7e001c25-2847-4808-bab6-78908761e160" />

---


<details>
<summary><strong>❌ Invalid Credentials</strong></summary>

**Shows login failure handling when incorrect credentials are entered.**  
The system provides immediate feedback, prevents login, and displays an error message without crashing or leaking any sensitive information.

</details>

<img width="1433" height="801" alt="image" src="https://github.com/user-attachments/assets/d13cef66-0542-4a69-bffc-4126262187f2" />



<img width="1437" height="806" alt="image" src="https://github.com/user-attachments/assets/6cbfe7cf-be8d-4956-bedc-0bfad4f56b4a" />

---


<details>
<summary><strong>✅ Sign-Up Success</strong></summary>

**Demonstrates successful account creation and onboarding.**  
New users can register with a name, password, and optional profile image. Upon success, the system redirects to the inbox and stores user information securely.

</details>

<img width="1439" height="806" alt="image" src="https://github.com/user-attachments/assets/db2ef5fd-5603-4a1f-9212-507b567065ad" />

---



<details>
<summary><strong>📝 Inbox Compose</strong></summary>

**Shows the email composition interface within the inbox.**  
Users can write new emails with support for `To`, `Cc`, and `Bcc` fields. The UI mirrors Gmail’s behavior, allowing dynamic toggling of recipient fields and saving unfinished drafts automatically.

</details>

<img src="https://github.com/user-attachments/assets/8551d9a9-3a29-4e73-8544-1a623f4bab9e" alt="Compose Example" width="100%"/>

---




<details>
<summary><strong>🌙 Dark Mode</strong></summary>

**Demonstrates the application in dark theme mode.**  
automatically adjusts background and text colors, and preserves user preferences across sessions.

</details>

<img width="1439" height="808" alt="image" src="https://github.com/user-attachments/assets/d018956c-b5ba-4cf8-9d64-d1e60be9eb92" />

---
<details>
<summary><strong>🌞 Light Mode</strong></summary>

**Displays the application in standard light theme.**  
Optimized for daytime usage, this mode offers maximum readability with bright backgrounds and high contrast for a clean and familiar email experience.

</details>

<img width="1437" height="804" alt="image" src="https://github.com/user-attachments/assets/5eb1dbfa-d964-42f1-87ea-c1fc4dd02234" />

---


<details>
<summary><strong>🛡️ Spam Label</strong></summary>

**Illustrates the automatic spam detection system.**  
Mails flagged by the C++ Bloom filter server are auto-labeled as "Spam". Users can review these suspicious emails in the dedicated spam folder.

</details>
<img width="1434" height="806" alt="image" src="https://github.com/user-attachments/assets/813820ae-8477-4a1a-a5cb-85cd1d43985f" />

---


<details>
<summary><strong>📤 Draft To Sent</strong></summary>

**Demonstrates sending a saved draft email.**  
Users can return to previously saved drafts, make final edits, and send them seamlessly. The sent mail is moved to the "Sent" folder while preserving its content.

</details>

<img width="1439" height="812" alt="image" src="https://github.com/user-attachments/assets/2862a26e-49a3-4a2c-a300-2ae14ea967aa" />

---


<details>
<summary><strong>🚫 Blacklisted Mail Appears At Spam Label</strong></summary>

**Shows how emails with blacklisted URLs are handled.**  
If an outgoing email contains a blacklisted link, it's intercepted by the C++ server and automatically redirected to the spam folder, keeping inboxes clean and safe.

</details>

<img width="1438" height="809" alt="image" src="https://github.com/user-attachments/assets/de4528db-429e-43aa-9c0f-cb66e3df867c" />

---
<details>
<summary><strong>📨 Mail View</strong></summary>

**Displays the full content of a selected email.**  
Users can view sender, recipients, subject, timestamp, and body of the email in a clean, responsive layout. Links and formatting are preserved.

</details>


<img width="1436" height="808" alt="image" src="https://github.com/user-attachments/assets/2f86c8d5-87e2-47fa-96da-c748df3f4314" />

---

<details>
<summary><strong>🔗 Sending Mail With URL</strong></summary>

**Demonstrates how the system validates emails before sending.**  
URLs included in emails are checked via the C++ server using a TCP call. Based on the result, the system decides whether to allow the send or mark the email as spam.

</details>

<img width="1437" height="807" alt="image" src="https://github.com/user-attachments/assets/4d0570e8-fe45-4a3f-9e72-627fad543a2b" />

---

<details>
<summary><strong>✏️ Labels</strong></summary>

**Shows editing functionality for existing labels.**  
Users can rename labels or delete them entirely. Changes reflect instantly across all emails associated with those labels and are synced with the backend.

</details>

<img width="1438" height="807" alt="image" src="https://github.com/user-attachments/assets/c12e0938-d6f9-44c4-a492-9762ddc88c53" />

<img src="https://github.com/user-attachments/assets/c8a1e959-b076-47d6-90a9-3100a6a87ffa" alt="Label Example" width="100%"/>

---

<details>
<summary><strong>🔍 Searching For A Mail</strong></summary>

**Demonstrates keyword-based email search functionality.**  
Users can search their mailboxes using subject or content keywords. Search results update in real time.

</details>

<img width="1438" height="810" alt="image" src="https://github.com/user-attachments/assets/283465cf-88bb-407a-a32a-2b289b374f15" />

---

<details>
<summary><strong>🛠️ Editing Mails</strong></summary>

**Allows users to edit draft messages.**  
Drafts can be modified before sending, preserving any previous content. The system ensures the latest changes are saved and do not overwrite active sessions elsewhere.


</details>

<img width="1438" height="807" alt="image" src="https://github.com/user-attachments/assets/4d258213-d232-4a07-bd3c-22d25794a0d8" />

---

<details>
<summary><strong>🚪 Logout</strong></summary>

**Displays the logout process.**  
Users can securely log out of their Gmailish account, clearing their local session token and returning to the login screen.

</details>

<img width="1436" height="803" alt="image" src="https://github.com/user-attachments/assets/42ebf693-e0fd-417f-94f6-bbe19cf0ebea" />

---

















