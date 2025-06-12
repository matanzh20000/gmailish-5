#include <iostream>
#include "DeleteURLCommand.h"
#include "AppState.h"
#include <sstream>
#include <string>

// this command adds a URL to the bloom filter and marks it as blacklisted.
std::string DeleteURLCommand::execute() {
        std::string line = AppState::getCurrentPrompt();
        std::istringstream stream(line);
        std::string url, command;
        stream >> command >> url;
        int result = AppState::getBloomFilter()->getblackList().erase(url);
        if(result == 0){
            return "404 Not Found";
        }
        return "204 No Content";
}
