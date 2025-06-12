#pragma once
#include "ICommand.h"
#include <string.h>
// Declaration of the AddURLCommand class following Command Pattern.
class AddURLCommand : public ICommand {
public:
    std::string execute() override;
    ~AddURLCommand() override = default;
};
