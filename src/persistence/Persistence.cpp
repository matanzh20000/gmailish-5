#include "Persistence.h"
#include <unordered_set>
#include <fstream>
#include <iostream>
#include <filesystem> 
#include "../Bloom/BloomFilter.h"
#include "../cli/AppState.h"
#include "Persistence.h"

// Saves a set of URLs to a file, each URL on a new line
void saveURLsToFile(const std::string &file, const std::unordered_set<std::string> &urls)
{
    std::ofstream outFile(file);
    for (const std::string &url : urls)
    {
        outFile << url << "\n";  // write each URL followed by newline
    }
    outFile.close();
}

// Loads URLs from a file into an unordered_set, assuming one URL per line
void loadURLsFromFile(const std::string &file, std::unordered_set<std::string> &urls)
{
    std::ifstream inFile(file);
    if (!inFile.is_open())
    {
        std::cerr << "Error! Can't open the file for reading: " << file << "\n";
        return;
    }

    std::string url;
    int count = 0;
    while (std::getline(inFile, url))  // read each line as a URL
    {
        urls.insert(url);  // add URL to set
        count++;
    }
}

// Saves the BitArray to a file as a string of '1' and '0' characters
void saveBitArrayToFile(const BitArray &bits, const std::string &file)
{
    std::ofstream outFile(file);
    if (!outFile.is_open())
    {
        std::cerr << "Error! can't open the file for writing: " << file << "\n";
        return;
    }

    for (std::size_t i = 0; i < bits.size(); i++)
    {
        outFile << (bits.get(i) ? '1' : '0');  // write 1 or 0 based on bit value
    }

    outFile.close();
}

// Loads a BitArray from a file of '1' and '0' characters, setting bits accordingly
void loadBitArrayFromFile(BitArray &bits, const std::string &file)
{
    std::ifstream inFile(file);
    if (!inFile.is_open())
    {
        std::cerr << "Error! can't open the file for reading: " << file << "\n";
        return;
    }

    std::string line;
    std::getline(inFile, line);  // read entire bit string in one line

    for (std::size_t i = 0; i < bits.size() && i < line.size(); ++i)
    {
        if (line[i] == '1')
        {
            bits.set(i);
        }
    }

    inFile.close();
}

// Returns the size of a file in bytes, or -1 if file can't be opened
int getFileSize(const std::string &filename)
{
    std::ifstream file(filename, std::ios::binary);
    if (!file)
    {
        return -1; 
    }

    int count = 0;
    char ch;
    while (file.get(ch))  // read each character to count file size
    {
        ++count;
    }
    return count;
}

// Function to save seeds to a file
void saveSeedsToFile(const std::vector<int>& seeds, const std::string& filePath) {
    std::ofstream file(filePath);
    if (file.is_open()) {
        for (int seed : seeds) {
            file << seed << " ";
        }
        file.close();
    } else {
        std::cerr << "Failed to save seeds to " << filePath << std::endl;
    }
}

// Function to load seeds from a file
std::vector<int> loadSeedsFromFile(const std::string& filePath) {
    std::vector<int> seeds;
    std::ifstream file(filePath);
    if (file.is_open()) {
        int seed;
        while (file >> seed) {
            seeds.push_back(seed);
        }
        file.close();
    }
    return seeds;
}

// Ensures persistence files exist and loads them into memory if available
bool ensurePersistenceFilesExist()
{
    int init = false;

    std::string baseDir = std::getenv("DATA_PATH") ? std::getenv("DATA_PATH") : ".";

    const std::string bitsFile = baseDir + "/bits.txt";
    const std::string urlsFile = baseDir + "/urls.txt";
    const std::string seedsFile = baseDir + "/seeds.txt";

    int bitFileSize = getFileSize(bitsFile);
    int urlsFileSize = getFileSize(urlsFile);
    int seedsFileSize = getFileSize(seedsFile);

    if (bitFileSize > 0)
    {
        // Create a new BloomFilter based on bit file size
        auto filter = std::make_shared<BloomFilter>(bitFileSize);
        loadBitArrayFromFile(filter->getBits(), bitsFile);  // Load bits from file
        init = true;

        if (urlsFileSize > 0)
        {
            loadURLsFromFile(urlsFile, filter->getblackList());  // Load URLs into blacklist
        }

        if (seedsFileSize > 0)
        {
            std::vector<int> seeds;
            loadSeeds(seedsFile, seeds);  // Load hash function seeds
            for (int seed : seeds)
            {
                filter->addHashFunction(std::make_shared<StdHashFunction>(), seed);
            }
            AppState::setBloomFilter(filter);  // Set the loaded filter into the app state
        }
    }
    return init;  // Return true if BloomFilter was initialized from file
}

// Saves a list of seeds to a file, one seed per line
bool saveSeeds(const std::string &filename, const std::vector<int> &seeds)
{
    std::ofstream out(filename);
    if (!out.is_open())
    {
        std::cerr << "Error opening seeds file: " << filename << std::endl;
        return false;
    }

    for (int seed : seeds)
    {
        out << seed << "\n"; 
    }

    out.close();
    return true;
}

// Loads seeds from a file into a vector, assuming one seed per line
bool loadSeeds(const std::string &filename, std::vector<int> &seeds)
{
    std::ifstream in(filename);
    if (!in.is_open())
    {
        std::cerr << "Error opening seeds file: " << filename << std::endl;
        return false;
    }

    seeds.clear();  
    int seed;
    while (in >> seed)  
    {
        seeds.push_back(seed);  
    }

    in.close();
    return true;
}
