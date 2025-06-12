#pragma once

#include <string>
#include <vector>

// CommandType enum to represent different command types
enum class PromptType {
    Invalid,
    Init,
    AddURL,
    CheckURL,
    DeleteURL
};


PromptType getPromptType(const std::string& line);