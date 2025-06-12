#pragma once
#include "ICommand.h"
#include <string>

// Declaration of the AddURLCommand class following Command Pattern.
class DeleteURLCommand : public ICommand {
public:
    std::string execute() override;
    ~DeleteURLCommand() override = default;
};
