#include <gtest/gtest.h>

// main function to run all tests for application
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}