#include "HashFunction.h"
#include <string>

// Implementation of the required operator() override
size_t StdHashFunction::operator()(const std::string& input) const {
    return std::hash<std::string>()(input);
}

