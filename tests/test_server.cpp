#include <gtest/gtest.h>
#include <thread>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>

#define BUFFER_SIZE 1024


// Helper function to simulate a client connecting to the server
std::string simulateClient(int port, const std::string& message) {
    int client_socket = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in server_addr{};
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(port);

    if (connect(client_socket, (sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        return "Connection failed";
    }

    send(client_socket, message.c_str(), message.size(), 0);

    char buffer[BUFFER_SIZE];
    std::memset(buffer, 0, BUFFER_SIZE);
    recv(client_socket, buffer, BUFFER_SIZE - 1, 0);

    close(client_socket);
    return std::string(buffer);
}

// Test Case: GET Command
TEST(ServerTest, GetCommandTest) {
    std::thread serverThread([]() {
        system("./bin/server 5556 8 3 1 2");
    });

    sleep(1);
    
    // Initialize the server (required for other commands to work)
    simulateClient(5556, "100 3");
    
    // Send GET command
    std::string response = simulateClient(5556, "GET www.example.com\n");
    EXPECT_EQ(response, "200 Ok\n\nfalse\n");
    std::cout << response << std::endl;

    system("pkill -f './bin/server 5556'");
    serverThread.detach();
}

// Test Case: POST Command
TEST(ServerTest, PostCommandTest) {
    std::thread serverThread([]() {
        system("./bin/server 5557 8 3 1 2");
    });

    sleep(1);
    
    // Initialize the server
    simulateClient(5557, "100 3");

    // Send POST command
    std::string response = simulateClient(5557, "POST www.example.com\n");
    EXPECT_EQ(response, "201 Created\n");
    std::cout << response << std::endl;

    system("pkill -f './bin/server 5557'");
    serverThread.detach();
}

// Test Case: DELETE Command
TEST(ServerTest, DeleteCommandTest) {
    std::thread serverThread([]() {
        system("./bin/server 5558 8 3 1 2");
    });

    sleep(1);
    
    // Initialize the server
    simulateClient(5558, "100 3\n");
    simulateClient(5558, "POST www.example.com\n");

    // Send DELETE command
    std::string response = simulateClient(5558, "DELETE www.example.com\n");
    EXPECT_EQ(response, "204 No Content\n");
    std::cout << response << std::endl;


    system("pkill -f './bin/server 5558'");
    serverThread.detach();
}

// Test Case: Invalid Command
TEST(ServerTest, InvalidCommandTest) {
    std::thread serverThread([]() {
        system("./bin/server 5559 8 3 1 2");
    });

    sleep(1);
    
    // Initialize the server (to ensure it is ready)
    simulateClient(5559, "100 3\n");

    // Send an invalid command
    std::string response = simulateClient(5559, "INVALID www.example.com\n");
    EXPECT_EQ(response, "400 Bad Request\n");
    std::cout << response << std::endl;

    system("pkill -f './bin/server 5559'");
    serverThread.detach();
}

