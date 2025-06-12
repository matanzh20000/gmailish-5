#pragma once
#include "ICommand.h"
#include <string>
// Declaration of the InvalidCommand class following Command Pattern.
class InvalidCommand : public ICommand {
public:
    std::string execute() override;
    ~InvalidCommand() override = default;
};
