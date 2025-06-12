#pragma once
#include "ICommand.h"
#include <string>

// Declaration of the CheckURLCommand class following Command Pattern.
class CheckURLCommand : public ICommand {
public:
    std::string execute() override;
    ~CheckURLCommand() override = default;
};
