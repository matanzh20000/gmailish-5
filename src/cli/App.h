#pragma once  // Ensure this header is only included once during compilation

#include <unordered_map>
#include <string>
#include "ICommand.h"
#include "CommandParser.h"

// The App class handles command execution and application flow control
class App {
    public:
       
        App();
    

        std::string runOnce(const std::string& user_prompt);
    
        
        App(const std::unordered_map<PromptType , ICommand*>& cmds) : commands(cmds) {}
    
    private:
        std::unordered_map<PromptType , ICommand*> commands;
    };