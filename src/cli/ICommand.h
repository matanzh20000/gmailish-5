#pragma once
#include <string>
// Command pattern inteface for all commands
class ICommand {
public:
    virtual std::string execute() = 0;
    virtual ~ICommand() = default;
};