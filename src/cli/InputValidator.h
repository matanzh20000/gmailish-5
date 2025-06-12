#pragma once
#include <string>
#include <vector>
#include "CommandParser.h"

bool isValidNumArguments(const std::string &line);
bool isValidHashInvoke(const int &invoke);
bool isValidSize(const int &size);
bool isInteger(const std::string &line);
bool isURL(const std::string& line);
bool isValidInitLine(const std::string& line);
std::vector<std::string> breakStream(const std::string& str);
PromptType getPromptType(const std::string& line);
bool isValidPrompt(const std::string& line);