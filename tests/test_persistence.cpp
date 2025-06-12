#include <gtest/gtest.h>
#include "../src/persistence/Persistence.h"
#include "../src/Bloom/BitArray.h"
#include <fstream>
#include <unordered_set>

TEST(PersistenceTest, CanSaveURLToFile) {
    std::unordered_set<std::string> urls = {"google.com"};
    saveURLsToFile("test_urls.txt", urls);

    std::ifstream stream("test_urls.txt");
    ASSERT_TRUE(stream.is_open());

    std::string line;
    std::getline(stream, line);
    EXPECT_TRUE(urls.count(line));
}
TEST(PersistenceTest, CanLoadURLsFromFile) {
    const std::string file = "test_load.txt";
    {
        std::ofstream out(file);
        out << "www.example.com0\n";
        out << "www.example.com1\n";
    }

    std::unordered_set<std::string> urls;
    loadURLsFromFile(file, urls);
    EXPECT_TRUE(urls.count("www.example.com0"));
    EXPECT_TRUE(urls.count("www.example.com1"));
    EXPECT_EQ(urls.size(), 2);
}

TEST(PersistenceTest, CanSaveBitArrayToFile) {
    BitArray bitArray(5);
    bitArray.set(0);
    bitArray.set(1);

    saveBitArrayToFile(bitArray, "test_bits.txt");

    std::ifstream in("test_bits.txt");
    ASSERT_TRUE(in.is_open());

    std::string line;
    std::getline(in, line);

    EXPECT_EQ(line, "11000");
}
TEST(PersistenceTest, CanLoadBitArrayFromFile) {
    const std::string filename = "test_bits_load.txt";
    {
        std::ofstream out(filename);
        out << "100011";
    }

    BitArray bitArray(6);
    loadBitArrayFromFile(bitArray, filename);

    EXPECT_TRUE(bitArray.get(0));
    EXPECT_FALSE(bitArray.get(1));
    EXPECT_FALSE(bitArray.get(2));
    EXPECT_FALSE(bitArray.get(3));
    EXPECT_TRUE(bitArray.get(4));
    EXPECT_TRUE(bitArray.get(5));

}
