#pragma once

#include <string>
#include <vector>
#include <unordered_set>
#include <memory>
#include "BitArray.h"
#include "HashFunction.h"

class BloomFilter {
private:
    BitArray bits;
    std::vector<std::pair<std::shared_ptr<HashFunction>, int>> hashArray;
    std::unordered_set<std::string> blackList;

public:
    BloomFilter(int size);

    void addHashFunction(std::shared_ptr<HashFunction> func, int repetitions);
    void add(const std::string& url);
    bool mightContain(const std::string& url) const;
    bool isBlacklisted(const std::string& url) const;

    BitArray& getBits();
    std::unordered_set<std::string>& getblackList();
    
    void loadFromFile(const std::string& bitsFile, const std::string& urlsFile);
    void saveToFile(const std::string& bitsFile, const std::string& urlsFile) const;
};
