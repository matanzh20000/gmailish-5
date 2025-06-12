#include <gtest/gtest.h>
#include "../src/Bloom/BitArray.h"

// Test case to ensure all bits are initialized to false
TEST(BitArrayTest, BitsInitialization) {
    BitArray arr(8);  // Create a BitArray with 8 bits
    EXPECT_EQ(arr.size(), 8);  // Check that the size is correct

    // Verify that all bits are false initially
    for (std::size_t i = 0; i < arr.size(); ++i) {
        EXPECT_FALSE(arr.get(i)) << "Bit " << i << " should be false initially.";
    }
}

// Test case to check that setting a bit works correctly
TEST(BitArrayTest, CanSetBitAtIndex) {
    BitArray bits(8);  // Create a BitArray with 8 bits

    bits.set(2);  // Set bit at index 2

    // Verify only the bit at index 2 is true, others remain false
    for (size_t i = 0; i < bits.size(); ++i) {
        if (i == 2)
            EXPECT_TRUE(bits.get(i)) << "Bit at index 2 should be set (true)";
        else
            EXPECT_FALSE(bits.get(i)) << "Bit at index " << i << " should still be unset (false)";
    }
}

