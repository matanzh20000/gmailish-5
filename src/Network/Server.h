#pragma once 
#include <string>
#include <netinet/in.h>
#include "../cli/App.h"

// Define buffer size for client communication
#define BUFFER_SIZE 1024

class Server {
public:
    // Constructor
    Server();

    // Function to handle client communication
    void handleClient(int client_socket, App &app);

    // Function to start the TCP server and accept client connections
    int runTCPServer(int port, App &app);
};
