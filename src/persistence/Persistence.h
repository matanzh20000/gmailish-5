#ifndef PERSISTENCE_H
#define PERSISTENCE_H
#include "../Bloom/BitArray.h"
#include <string>
#include <unordered_set>

// Declare the function so test can compile
void saveURLsToFile(const std::string& file, const std::unordered_set<std::string>& urls);

// Save the contents of the bit array to a file (as 0s and 1s)
void saveBitArrayToFile(const BitArray& bitArray, const std::string& filename);

// Load from a file into the bit array (expects a sequence of 0s and 1s)
void loadBitArrayFromFile(BitArray& bitArray, const std::string& filename);

void loadURLsFromFile(const std::string& file, std::unordered_set<std::string>& urls);

bool ensurePersistenceFilesExist();

 bool saveSeeds(const std::string& filename, const std::vector<int>& seeds);
 bool loadSeeds(const std::string& filename, std::vector<int>& seeds);
 std::vector<int> loadSeedsFromFile(const std::string& filePath);
 void saveSeedsToFile(const std::vector<int>& seeds, const std::string& filePath);

#endif // PERSISTENCE_H
