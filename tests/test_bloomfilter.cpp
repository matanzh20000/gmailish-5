#include <gtest/gtest.h>
#include "../src/Bloom/BloomFilter.h"
#include "../src/Bloom/BitArray.h"
#include "../src/Bloom/HashFunction.h"
#include <memory>
#include <unordered_set>

// Helper function to create a BloomFilter with StdHashFunction
BloomFilter createTestBloomFilter(int size, int numHashInvokes) {
    BloomFilter filter(size);
    auto hashFunc = std::make_shared<StdHashFunction>();
    filter.addHashFunction(hashFunc, numHashInvokes);
    return filter;
}

TEST(BloomFilterTest, URLAddedIsDetected) {
    BloomFilter filter = createTestBloomFilter(100, 1);
    std::string url = "www.example.com0";

    EXPECT_FALSE(filter.mightContain(url));
    filter.add(url);
    EXPECT_TRUE(filter.mightContain(url));
    EXPECT_TRUE(filter.isBlacklisted(url));
}

TEST(BloomFilterTest, FalsePositivePossibility) {
    BloomFilter filter = createTestBloomFilter(10, 2);  // small size → higher false positive rate
    filter.add("www.example.com0");

    // This URL was not added, but might be detected due to bit collisions
    std::string falseUrl = "www.example.com1";
    bool mightContain = filter.mightContain(falseUrl);

    // It’s either false positive or not detected
    // So just check that it's *not* blacklisted
    EXPECT_FALSE(filter.isBlacklisted(falseUrl));
}

TEST(BloomFilterTest, BitsAreSetCorrectly) {
    BloomFilter filter = createTestBloomFilter(50, 1);
    std::string url = "www.example.com0";

    // Check bits before adding
    int bitCountBefore = 0;
    for (int i = 0; i < filter.getBits().size(); ++i) {
        if (filter.getBits().get(i)) bitCountBefore++;
    }

    filter.add(url);

    int bitCountAfter = 0;
    for (int i = 0; i < filter.getBits().size(); ++i) {
        if (filter.getBits().get(i)) bitCountAfter++;
    }

    EXPECT_GT(bitCountAfter, bitCountBefore);
}

TEST(BloomFilterTest, BlacklistFunctionality) {
    BloomFilter filter = createTestBloomFilter(100, 1);
    std::string url = "www.example.com0";

    EXPECT_FALSE(filter.isBlacklisted(url));
    filter.add(url);
    EXPECT_TRUE(filter.isBlacklisted(url));
}

TEST(BloomFilterPersistenceTest, CanSaveAndLoadBitsAndURLs) {
    BloomFilter filter = createTestBloomFilter(20, 1);
    std::string url1 = "www.example.com0";
    std::string url2 = "www.example.com1";
    filter.add(url1);
    filter.add(url2);

    const std::string bitsFile = "test_bits.txt";
    const std::string urlsFile = "test_urls.txt";

    filter.saveToFile(bitsFile, urlsFile);

    // Load into new filter
    BloomFilter loadedFilter(20);
    loadedFilter.addHashFunction(std::make_shared<StdHashFunction>(), 1);
    loadedFilter.loadFromFile(bitsFile, urlsFile);

    EXPECT_TRUE(loadedFilter.mightContain(url1));
    EXPECT_TRUE(loadedFilter.mightContain(url2));
    EXPECT_TRUE(loadedFilter.isBlacklisted(url1));
    EXPECT_TRUE(loadedFilter.isBlacklisted(url2));
}
