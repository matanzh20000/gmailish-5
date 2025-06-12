#include "BloomFilter.h"
#include "../persistence/Persistence.h"
#include "HashFunction.h"
#include "BitArray.h"
#include <iostream>
#include "../cli/AppState.h"

// Constructor for BloomFilter, initializes the BitArray with the given size
BloomFilter::BloomFilter(int size) : bits(size) {}

// Adds a hash function and how many times it should be applied to the internal list
void BloomFilter::addHashFunction(std::shared_ptr<HashFunction> func, int numOfInvokes) {
    hashArray.emplace_back(func, numOfInvokes);
}

// Adds a URL to the Bloom filter and sets bits according to hash values
void BloomFilter::add(const std::string& url) {
    for (auto iterator = hashArray.begin(); iterator != hashArray.end(); ++iterator) {
        std::shared_ptr<HashFunction> func = iterator->first;
        int count = iterator->second;

        std::string input = url;
        size_t hashed = 0;

        // Apply the hash function multiple times as specified
        for (int i = 0; i < count; ++i) {
            hashed = (*func)(input);  // apply hash
            input = std::to_string(hashed);  // prepare input for next round
        }

        // Map hash result to a valid bit index and set that bit
        int index = func->ModuloHash(hashed, bits.size());
        bits.set(index);  // only set bit after full iteration
    }


    // Keep a record of added URLs for precise lookup
    blackList.insert(url);
}

// Checks whether the URL might be in the Bloom filter (false positives possible)
bool BloomFilter::mightContain(const std::string& url) const {
    for (auto it = hashArray.begin(); it != hashArray.end(); ++it) {
        std::shared_ptr<HashFunction> func = it->first;
        int count = it->second;

        std::string input = url;
        size_t hashValue = 0;

        // Apply the hash function repeatedly as specified
        for (int i = 0; i < count; ++i) {
            hashValue = (*func)(input);  // hash current input
            input = std::to_string(hashValue);  // prepare input for next round
        }

        // Map hash result to bit index and check if the bit is set
        int index = func->ModuloHash(hashValue, bits.size());

        if (!bits.get(index)) {
            return false;  // bit not set, definitely not in filter
        }
    }

    return true;  // all final hash indexes matched bits → possibly in filter
}

// Checks whether the URL was explicitly blacklisted (added to the filter)
bool BloomFilter::isBlacklisted(const std::string& url) const {
    return blackList.count(url) > 0;
}

// Returns a reference to the internal BitArray
BitArray& BloomFilter::getBits() {
    return bits;
}

// Returns a reference to the internal blacklist set
std::unordered_set<std::string>& BloomFilter::getblackList() {
    return blackList;
}

// Loads Bloom filter bit array and blacklist from given files
void BloomFilter::loadFromFile(const std::string& bitsFile, const std::string& urlsFile) {
    loadBitArrayFromFile(bits, bitsFile);  // Load bits from file into BitArray
    loadURLsFromFile(urlsFile, blackList); // Load blacklisted URLs into set
}

// Saves the current state of the Bloom filter and blacklist to files
void BloomFilter::saveToFile(const std::string& bitsFile, const std::string& urlsFile) const {
    saveBitArrayToFile(bits, bitsFile);    // Save BitArray bits to file
    saveURLsToFile(urlsFile, blackList);   // Save blacklisted URLs to file
}
