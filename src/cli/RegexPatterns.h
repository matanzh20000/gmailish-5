#pragma once
#include <string>

// This header file contains regex patterns for validating URLs and integers.
namespace RegexPatterns {
    inline const std::string URL = R"(^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9\-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9\-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$)";
    inline const std::string INTEGER = R"(^-?(0|[1-9]\d*)$)";
}