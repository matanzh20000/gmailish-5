#include <iostream>
#include "AddURLCommand.h"
#include "AppState.h"
#include <sstream>
#include <string.h>

// this command adds a URL to the bloom filter and marks it as blacklisted.
std::string AddURLCommand::execute() {
        std::string line = AppState::getCurrentPrompt();
        std::istringstream stream(line);
        std::string url, command;
        stream >> command >> url;
        if(AppState::getBloomFilter()->getblackList().count(url) == 0){
                AppState::getBloomFilter()->add(url);
                return "201 Created";
        }
        return "404 Not Found";
}
