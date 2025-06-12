#include "InputValidator.h"
#include "CommandParser.h"
#include "RegexPatterns.h"

#include <string>
#include <sstream>
#include <cctype>
#include <regex>
#include <iterator>
#include <vector>
#include <fstream>
#include <iostream>
/**
 * break down a string into an array
 * "1 2 3" -> {"1", "2", "3"}
 */
std::vector<std::string> breakStream(const std::string& str) {
    std::istringstream inputStream(str);
    //creating an iterator and interating inputStream
    return {std::istream_iterator<std::string>(inputStream), std::istream_iterator<std::string>()};
}

/**
 * validates input line from user
 */
bool isValidNumArguments(const std::string& line) {
    auto numOfWords = breakStream(line);
    return (numOfWords.size() >= 2);
}

/**
 * Validates that a hash function invocation count is within bounds.
 * Min: 1
 */
bool isValidHashInvoke(const int &invoke){
    return (invoke >= 1);
}

/**
 * Validates that the size of the Bloom filter's bit array is within bounds.
 * Min: 1
 */
bool isValidSize(const int &size){
    return (size >= 1);
}

/**
 * Checks whether the string is a valid integer.
 */
bool isInteger(const std::string &line){
    return std::regex_match(line, std::regex(RegexPatterns::INTEGER));
}

/**
 * Validates that the string is in correct URL form using regular expression
 */
bool isURL(const std::string& line) {
    return std::regex_match(line, std::regex(RegexPatterns::URL));
}

/**
 * Determines the type of command given a line of input.
 * - "Init" -> size + hash function(s)
 * - "AddURL" -> line starts with "1" and valid URL
 * - "CheckURL" -> line starts with "2" and valid URL
 * - "Invalid" -> doesn't match any of this (can be changed later easily)
 */
PromptType getPromptType(const std::string& line) {
    if (isValidInitLine(line)) return PromptType::Init;

    auto arr = breakStream(line);
    if (arr.size() == 2 && arr[0] == "POST" && isURL(arr[1]))
        return PromptType::AddURL;
    if (arr.size() == 2 && arr[0] == "GET" && isURL(arr[1]))
        return PromptType::CheckURL;
        if (arr.size() == 2 && arr[0] == "DELETE" && isURL(arr[1]))
        return PromptType::DeleteURL;

    return PromptType::Invalid;
}

/**
 * Validates a line as a valid initialization input:
 * - using isValidNamArguments to make sure arg num is correct
 * - First arg: bit array size (valid integer and within bounds)
 * - Remainings: number of times to invoke each hash function
 */
bool isValidInitLine(const std::string& line) {
    auto arr = breakStream(line);
    if (!isValidNumArguments(line)) return false;

    const std::string& sizeStr = arr[0];
    if (!isInteger(sizeStr)) return false;

    int size = std::stoi(sizeStr);
    if (!isValidSize(size)) return false;

    // Check each hash function invocation token
    for (size_t i = 1; i < arr.size(); ++i) {
        if (!isInteger(arr[i])) return false;
        int invoke = std::stoi(arr[i]);
        if (!isValidHashInvoke(invoke)) return false;
    }

    return true;
}

/**
 * Returns true if the line is a valid prompt of any valied type defined
 * in inputValidator.h
 */
bool isValidPrompt(const std::string& line) {
    return getPromptType(line) != PromptType::Invalid;
    
}

