#pragma once
#include "ICommand.h"
#include <string>
// Declaration of the InitCommand class following Command Pattern.
class InitCommand : public ICommand {
public:
    std::string execute() override;
    ~InitCommand() override = default;
};
