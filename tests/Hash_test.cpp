#include <gtest/gtest.h>
#include "../src/Bloom/HashFunction.h"

//Testing if the output s deterministic for current session
TEST(StdHashFunctionTest, HashIsDeterministicForSameInput) {
    StdHashFunction h;
    std::string input = "https://example.com";

    size_t hash1 = h(input);
    size_t hash2 = h(input);

    EXPECT_EQ(hash1, hash2);
}
//Testing if the hash function yields different outputs for different iterations
TEST(StdHashFunctionTest, DifferentInputsProduceDifferentHashes) {
    StdHashFunction h;
    std::string input1 = "https://example.com/page1";
    std::string input2 = "https://example.com/page2";

    EXPECT_NE(h(input1), h(input2));  // Ideally true for different inputs
}
//Testing if the hash function handles empty strings
TEST(StdHashFunctionTest, HandlesEmptyString) {
    StdHashFunction h;
    EXPECT_NO_THROW(h(""));
}


// Handles long strings
TEST(StdHashFunctionTest, HandlesLongString) {
    StdHashFunction h;
    std::string longInput(10000, 'a');
    EXPECT_NO_THROW(h(longInput));
}
