#pragma once
#include <string>
#include <memory>
#include "../Bloom/BloomFilter.h"

// AppState is a static class that holds the current state of the application
// It contains a bloom filter and the correct prompt.
class AppState {
    private:
        static inline std::shared_ptr<BloomFilter> activeFilter = nullptr;
        static inline std::string currentPrompt = "";
        static inline std::string output = ""; 
    
    public:
        // Already defined
        static void setBloomFilter(std::shared_ptr<BloomFilter> filter) { activeFilter = filter; }
        static std::shared_ptr<BloomFilter> getBloomFilter() { return activeFilter; }
    
        static void setCurrentPrompt(const std::string& prompt) { currentPrompt = prompt; }
        static std::string getCurrentPrompt() { return currentPrompt; }
    

        static void setOutput(const std::string& out) { output = out; }
        static std::string getOutput() { return output; }
    };