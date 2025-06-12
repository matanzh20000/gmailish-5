#include <iostream>
#include <string>
#include "App.h"
#include "CommandParser.h"
#include <fstream>
#include <memory>
#include "../Bloom/BloomFilter.h"
#include "../persistence/Persistence.h"
#include "AppState.h"

// Default constructor for the App class
App::App() = default;

// Executes a single command from user input
std::string App::runOnce(const std::string& user_prompt) {
    PromptType type;
    // Set base directory for data storage, defaulting to current directory
    std::string baseDir = std::getenv("DATA_PATH") ? std::getenv("DATA_PATH") : ".";

    // Initialize persistence only once during first run
    static bool init = ensurePersistenceFilesExist();

    // Determine the type of user command (Init, AddURL, CheckURL, Invalid)
    type = getPromptType(user_prompt);
    AppState::setCurrentPrompt(user_prompt);

    // Validate command based on initialization state
    if ((init && type == PromptType::Init) ||
        (!init && (type == PromptType::AddURL || type == PromptType::CheckURL)) ||
        type == PromptType::Invalid) {
            type = PromptType::Invalid;
        }

    try {
        // Execute the command and capture the result
        std::string res = commands.at(type)->execute();

        // Save data to disk after Init, AddURL, or DeleteURL commands
        if (type == PromptType::Init || type == PromptType::AddURL || type == PromptType::DeleteURL) {
            auto filter = AppState::getBloomFilter();
            saveBitArrayToFile(filter->getBits(), baseDir + "/bits.txt");
            saveURLsToFile(baseDir + "/urls.txt", filter->getblackList());
        }

        // Mark initialization complete after Init command
        if (type == PromptType::Init) {
            init = true;
        }

        return res;
    } catch (...) {
        // Return error message if any exception occurs
        return "Error Executing Command";
    }
}
