#include <gtest/gtest.h>
#include "../src/cli/InputValidator.h"

// ---------------------------
// Argument Count Validation
// ---------------------------

// Validates that isValidNumArguments accepts exactly 2 or 3 words
TEST(InitLine, numOfArguments) {
    EXPECT_TRUE(isValidNumArguments("8 1 2"));           // 3 args 
    EXPECT_TRUE(isValidNumArguments("a 1"));             // 2 args
    EXPECT_FALSE(isValidNumArguments(""));               // no args
    EXPECT_TRUE(isValidNumArguments("   313  1  3 "));   // extra spaces
}

// ---------------------------
// Hash Invoke Count Validation
// ---------------------------

// Tests isValidHashInvoke with edge values
TEST(InitLine, ValidHashInvoke) {
    EXPECT_FALSE(isValidHashInvoke(0));        // too low
    EXPECT_FALSE(isValidHashInvoke(-1.1));     // invalid type
    EXPECT_TRUE(isValidHashInvoke(5));         // valid
    EXPECT_TRUE(isValidHashInvoke(1000));     // above limit
}

// ---------------------------
// Bit Array Size Validation
// ---------------------------

// Tests isValidSize with different Bloomfilter sizes
TEST(InitLine, ValidSize) {
    EXPECT_TRUE(isValidSize(1));       // lowest bound
    EXPECT_TRUE(isValidSize(8));       // example from demo
    EXPECT_TRUE(isValidSize(1000));    // in bounds
    EXPECT_FALSE(isValidSize(0));      // below limit
    EXPECT_FALSE(isValidSize(-10));    // negative
}

// ---------------------------
// Integer String Validation
// ---------------------------

// verifies that isInteger accepts only correct numbers
TEST(Validator, IsInteger) {
    EXPECT_TRUE(isInteger("0"));        // edge case
    EXPECT_TRUE(isInteger("40"));       // positive
    EXPECT_TRUE(isInteger("-2"));       // negative
    EXPECT_FALSE(isInteger(" 1b2a"));   // alphanumeric
    EXPECT_FALSE(isInteger("abc +"));   // symbols
    EXPECT_FALSE(isInteger(""));        // empty
    EXPECT_FALSE(isInteger("12 3"));    // space
    EXPECT_FALSE(isInteger("12.3"));    // float
    EXPECT_FALSE(isInteger("Gmailish"));// letters only
    EXPECT_FALSE(isInteger("-01"));     // leading minus and zero
}

// ---------------------------
// URL Validation
// ---------------------------

// Tests basic URL's
TEST(Validator, IsURL) {
    EXPECT_TRUE(isURL("www.example.com0"));     // valid
    EXPECT_FALSE(isURL("examplecom"));          // missing dot
    EXPECT_FALSE(isURL("www,examplec.om"));     // invalid characters
    EXPECT_FALSE(isURL(""));                    // empty
}

// Edge cases for URL structure
TEST(Validator, IsURLEdgeCases) {
    EXPECT_FALSE(isURL("www.example"));         // no ".com"
    EXPECT_FALSE(isURL("example.com"));         // no "www"
    EXPECT_TRUE(isURL("www.example.co.il"));    // multiple domains
    EXPECT_FALSE(isURL("ww.example1.com"));     // no "w" prefix
}

// ---------------------------
// Prompt Detection
// ---------------------------

// Checks if a full line is recognized correctly
TEST(InitLine, validPrompt) {
    EXPECT_FALSE(isValidPrompt("a"));                        // invalid
    EXPECT_TRUE(isValidPrompt("8 1 2"));                     // init
    EXPECT_TRUE(isValidPrompt("GET www.example.com0"));        // check
    EXPECT_FALSE(isValidPrompt("x"));                        // invalid
    EXPECT_TRUE(isValidPrompt("POST www.example.com0"));        // add
    EXPECT_TRUE(isValidPrompt("GET www.example.com1"));        // check
    EXPECT_TRUE(isValidPrompt("8 1"));                       // init
    EXPECT_TRUE(isValidPrompt("8 2"));                       // init
}

// Tests edge cases for initLine input
TEST(InitLine, ValidInitLineEdgeCases) {
    EXPECT_TRUE(isValidInitLine("128 1000 1000"));          // invokes too high
    EXPECT_FALSE(isValidInitLine("   64   0   -1 "));        // invalid spaced values
    EXPECT_FALSE(isValidInitLine("0 1 2"));                  // invalid size
    EXPECT_FALSE(isValidInitLine("128 -1 2"));               // negative invoke
    EXPECT_TRUE(isValidInitLine("128 2"));                   // valid with one hash
    EXPECT_FALSE(isValidInitLine("abc 1 2"));                // invalid size
    EXPECT_FALSE(isValidInitLine(""));                       // empty
}

// ---------------------------
// Tokenization
// ---------------------------

// verifies that breakStream splits correctly
TEST(Tokenizer, SplitsWordsCorrectly) {
    std::vector<std::string> expected = {"128", "2", "1"};
    EXPECT_EQ(breakStream("128 2 1"), expected);
}

// ---------------------------
// Command Parser Detection
// ---------------------------

//Should return PromptType::Init
TEST(CommandParser, DetectsInitPrompt) {
    EXPECT_EQ(getPromptType("100 1 1"), PromptType::Init); //init command
    EXPECT_EQ(getPromptType("40 2"), PromptType::Init); //init command
}

// Should return PromptType::AddURL
TEST(CommandParser, DetectsAddURLPrompt) {
    EXPECT_EQ(getPromptType("POST www.example.com0"), PromptType::AddURL);
}

// Should return PromptType::CheckURL
TEST(CommandParser, DetectsCheckURLPrompt) {
    EXPECT_EQ(getPromptType("GET www.example.com0"), PromptType::CheckURL);
}
// Detects invalid commands
TEST(CommandParser, InvalidPromptCases) {
    EXPECT_EQ(getPromptType("x"), PromptType::Invalid);
    EXPECT_EQ(getPromptType("1 URL"), PromptType::Invalid);
    EXPECT_EQ(getPromptType(""), PromptType::Invalid);
    EXPECT_EQ(getPromptType("128"), PromptType::Invalid);
    EXPECT_EQ(getPromptType("0 1 2"), PromptType::Invalid);
}

// Should verify that PromptType corresponds to user input
TEST(CommandParser, VerifyCommand) {
    EXPECT_EQ(getPromptType("128 2 1"), PromptType::Init); //init command
    EXPECT_EQ(getPromptType("61 1"), PromptType::Init); //init command
    EXPECT_NE(getPromptType("2 www.example0.com"), PromptType::Init); // check URL
    EXPECT_NE(getPromptType("1 www.example1.com"), PromptType::Init); // add URL
    EXPECT_NE(getPromptType("Gmailish"), PromptType::Init); // invalid command
    EXPECT_EQ(getPromptType("0 1 2"), PromptType::Invalid); // invalid command


}

// ---------------------------
// Prompt Line Validation
// ---------------------------

// validates prompt test
TEST(InputValidator, ValidPromptLines) {
    EXPECT_TRUE(isValidPrompt("128 4"));                 // init
    EXPECT_TRUE(isValidPrompt("1024 2 3"));              // init
    EXPECT_TRUE(isValidPrompt("POST www.example.com0"));    // add
    EXPECT_TRUE(isValidPrompt("GET www.example.com0"));    // check
}

// edge cases for invalid prompt test
TEST(InputValidator, InvalidPromptLines) {
    EXPECT_FALSE(isValidPrompt("128"));                  // too short
    EXPECT_FALSE(isValidPrompt("1 not-a-url"));          // bad URL
    EXPECT_FALSE(isValidPrompt("3 something.com"));      // unknown command
    EXPECT_FALSE(isValidPrompt(""));                     // empty
}