#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
#include <thread>
#include <functional>
#include <iostream>

#define BUFFER_SIZE 1024

class App {
public:
    std::string runOnce(const std::string& input) {
        // Replace with actual logic
        return "Echo: " + input;
    }
};

class Server {
public:
    Server();
    void handleClient(int client_socket, App& app);
    int runTCPServer(int port, App& app);
};

Server::Server() {}

void Server::handleClient(int client_socket, App& app) {
    char buffer[BUFFER_SIZE];

    while (true) {
        std::memset(buffer, 0, BUFFER_SIZE);
        ssize_t bytes_received = recv(client_socket, buffer, BUFFER_SIZE - 1, 0);

        if (bytes_received <= 0) break;

        std::string input(buffer);
        input.erase(input.find_last_not_of("\r\n") + 1);

        std::string response = app.runOnce(input);
        response += "\n";

        send(client_socket, response.c_str(), response.size(), 0);
    }

    close(client_socket);
}

int Server::runTCPServer(int port, App& app) {
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        perror("socket failed");
        return 1;
    }

    sockaddr_in server_addr{};
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(port);

    if (bind(server_socket, (sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind failed");
        close(server_socket);
        return 1;
    }

    const int backlog = SOMAXCONN;
    if (listen(server_socket, backlog) < 0) {
        perror("listen failed");
        close(server_socket);
        return 1;
    }

    std::cout << "[SERVER] Listening on port " << port << std::endl;

    while (true) {
        sockaddr_in client_addr{};
        socklen_t client_size = sizeof(client_addr);
        int client_socket = accept(server_socket, (sockaddr*)&client_addr, &client_size);

        if (client_socket < 0) {
            perror("accept failed");
            continue;
        }

        std::thread(&Server::handleClient, this, client_socket, std::ref(app)).detach();
    }

    // Never reached, but for completeness:
    close(server_socket);
    return 0;
}
