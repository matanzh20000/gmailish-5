#include <iostream>
#include "ICommand.h"
#include "InitCommand.h"
#include <sstream>
#include "AppState.h"
#include "InputValidator.h"
#include "../persistence/Persistence.h"

// Executes the Init command: initializes the Bloom filter with size and seeds from user input
std::string InitCommand::execute() {
    std::string line = AppState::getCurrentPrompt();  // Get the current user input line
    std::istringstream stream(line);  // Create a stream to parse the input
    std::string baseDir = std::getenv("DATA_PATH") ? std::getenv("DATA_PATH") : ".";  
    // Determine directory to save data, defaulting to current directory if DATA_PATH is not set

    int size;
    stream >> size;  // First number in input is the size of the Bloom filter

    std::vector<int> seeds;
    int seed;
    // Parse remaining numbers as seeds for hash functions
    while (stream >> seed) {
        seeds.push_back(seed);
    }

    // Create a new Bloom filter with the specified size
    auto filter = std::make_shared<BloomFilter>(size);
    // Add hash functions to the filter using the parsed seeds
    for (int s : seeds) {
        filter->addHashFunction(std::make_shared<StdHashFunction>(), s);
    }

    // Store the initialized Bloom filter in the application state
    AppState::setBloomFilter(filter);

    // Save the seeds to a file for future reference (Bloom filter size is not persisted here)
    saveSeeds(baseDir + "/seeds.txt", seeds);
    return "";
}
