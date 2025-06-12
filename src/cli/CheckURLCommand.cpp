#include "ICommand.h"
#include "CheckURLCommand.h"
#include <iostream>
#include "AppState.h"
#include <sstream>
#include <string>

// Executes the CheckURL command: checks if a URL might be in the Bloom filter and if it is blacklisted
std::string CheckURLCommand::execute() {
    std::string line = AppState::getCurrentPrompt();  // Get the latest user input
    std::istringstream iss(line);  // Create a stream from the input line
    std::string command, url;
    iss >> command >> url;  // Parse command and URL from input

    bool might = AppState::getBloomFilter()->mightContain(url);
    // Check if URL was explicitly added (blacklisted)
    bool isBlackListed = AppState::getBloomFilter()->isBlacklisted(url);
    std::string s = "200 Ok\n\n";
    // Output results in specific format based on checks
    if (might && isBlackListed) {
        return s + "true true";
    } else if (might && !isBlackListed) {
        return s + "true false";
    } else {
        return s + "false";
    }
}
