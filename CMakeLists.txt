cmake_minimum_required(VERSION 3.10)
project(BloomTest)

set(CMAKE_CXX_STANDARD 17)

enable_testing()
find_package(GTest REQUIRED)

# Add include path
include_directories(${GTEST_INCLUDE_DIRS} tests)

# Create input_validator library
add_library(input_validator src/cli/InputValidator.cpp)
add_library(persistence STATIC src/persistence/Persistence.cpp)

# Create commands library
add_library(commands
    src/cli/AddURLCommand.cpp
    src/cli/CheckURLCommand.cpp
    src/cli/InitCommand.cpp
    src/cli/InvalidCommand.cpp
    src/cli/DeleteURLCommand.cpp
)

# Create server executable
add_executable(server 
    src/main.cpp
    src/cli/App.cpp
    src/Bloom/BitArray.cpp
    src/cli/App.cpp
    src/Bloom/HashFunction.cpp
    src/Bloom/StdHashFunction.cpp
    src/Bloom/BloomFilter.cpp
    src/Network/Server.cpp
)
target_link_libraries(server input_validator persistence commands pthread)

# Set output directory for the server
set_target_properties(server PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin")

# Build and link test executable (without main.cpp or Server.cpp)
add_executable(run_tests 
    tests/test_cliargs.cpp
    tests/test_all.cpp
    tests/test_bitarray.cpp
    tests/test_cliargs.cpp
    tests/Hash_test.cpp
    tests/test_bloomfilter.cpp
    tests/test_persistence.cpp
    tests/test_server.cpp
    src/Bloom/BitArray.cpp
    src/cli/App.cpp
    src/Bloom/HashFunction.cpp
    src/Bloom/StdHashFunction.cpp
    src/Bloom/BloomFilter.cpp
    src/Network/Server.cpp
)

target_link_libraries(run_tests input_validator persistence commands ${GTEST_LIBRARIES} pthread)

add_test(NAME BloomTest COMMAND run_tests)
