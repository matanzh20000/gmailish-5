#include <iostream>
#include <unordered_map>
#include <string>
#include <vector>
#include <cstring>
#include <unistd.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <fstream>
#include <sstream>
#include "cli/ICommand.h"
#include "cli/InvalidCommand.h"
#include "cli/AddURLCommand.h"
#include "cli/CheckURLCommand.h"
#include "cli/InitCommand.h"
#include "cli/App.h"
#include "cli/DeleteURLCommand.h"
#include "Network/Server.h"
#include "Bloom/BloomFilter.h"
#include "cli/AppState.h"
#include "persistence/Persistence.h"
#include "Bloom/BloomFilter.h"
#include "Bloom/BitArray.h"
#include "persistence/Persistence.h"

// Function to load an existing Bloom Filter from disk
std::shared_ptr<BloomFilter> loadExistingBloomFilter(const std::string& baseDir) {
    auto bloomFilter = std::make_shared<BloomFilter>(8); // Default size (will be overwritten)
    if (ensurePersistenceFilesExist()) {
        std::cout << "Loading existing Bloom Filter from disk..." << std::endl;
        loadBitArrayFromFile(bloomFilter->getBits(), baseDir + "/bits.txt");
        loadURLsFromFile(baseDir + "/urls.txt", bloomFilter->getblackList());
        return bloomFilter;
    }
    return nullptr;
}

int getEnvInt(const char* name, int defaultVal) {
    const char* val = std::getenv(name);
    return val ? std::stoi(val) : defaultVal;
}

std::vector<int> getEnvSeeds(const char* name, const std::vector<int>& defaultSeeds) {
    const char* val = std::getenv(name);
    if (!val) return defaultSeeds;

    std::istringstream iss(val);
    std::vector<int> seeds;
    int seed;
    while (iss >> seed) {
        seeds.push_back(seed);
    }
    return seeds;
}

// Main function: initializes commands and starts the TCP server
int main(int argc, char* argv[]) {
    // Defaults
    const int DEFAULT_PORT = 5555;
    const int DEFAULT_BLOOM_SIZE = 8;
    const std::vector<int> DEFAULT_SEEDS = {1, 2, 4};

    // Read values from environment with fallbacks
    int port = getEnvInt("SERVER_PORT", DEFAULT_PORT);
    int bloomSize = getEnvInt("BLOOM_SIZE", DEFAULT_BLOOM_SIZE);
    std::vector<int> seeds = getEnvSeeds("SEEDS", DEFAULT_SEEDS);

    // Set base directory for data
    std::string baseDir = std::getenv("DATA_PATH") ? std::getenv("DATA_PATH") : ".";

    // Attempt to load an existing Bloom Filter
    auto bloomFilter = loadExistingBloomFilter(baseDir);
    if (bloomFilter) {
        std::cout << "Existing Bloom Filter loaded successfully.\n";
    } else {
        // No existing Bloom Filter, create a new one
        std::cout << "No existing Bloom Filter found. Initializing with provided settings..." << std::endl;
        bloomFilter = std::make_shared<BloomFilter>(bloomSize);
        for (int seed : seeds) {
            bloomFilter->addHashFunction(std::make_shared<StdHashFunction>(), seed);
        }

        // Save the newly initialized Bloom Filter and seeds to disk
        saveBitArrayToFile(bloomFilter->getBits(), baseDir + "/bits.txt");
        saveURLsToFile(baseDir + "/urls.txt", bloomFilter->getblackList());
        saveSeedsToFile(seeds, baseDir + "/seeds.txt");
        std::cout << "Bloom Filter and seeds saved to disk." << std::endl;
    }

    // Initialize command map with different command types
    std::unordered_map<PromptType, ICommand*> commands;
    commands[PromptType::Invalid] = new InvalidCommand();
    commands[PromptType::Init] = new InitCommand();
    commands[PromptType::AddURL] = new AddURLCommand();
    commands[PromptType::CheckURL] = new CheckURLCommand();
    commands[PromptType::DeleteURL] = new DeleteURLCommand();

    // Create an App instance with the command map
    App app(commands);
    AppState::setBloomFilter(bloomFilter);

    // Display the server startup message
    std::cout << "Starting server on port: " << port << std::endl;
    Server server; // Correctly declared server object

    // Run the TCP server with the specified port
    int result = server.runTCPServer(port, app);

    // Clean up dynamically allocated commands
    for (auto& pair : commands) {
        delete pair.second;
    }

    return result;
}
