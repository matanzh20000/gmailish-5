cmake_minimum_required(VERSION 3.10)
project(GmailishApp)

set(CMAKE_CXX_STANDARD 17)

add_executable(my_app
    main.cpp
    cli/App.cpp
    cli/AddURLCommand.cpp
    cli/DeleteURLCommand.cpp
    cli/CheckURLCommand.cpp
    cli/InitCommand.cpp
    cli/InvalidCommand.cpp
    cli/InputValidator.cpp
    Bloom/BloomFilter.cpp
    persistence/Persistence.cpp
    Bloom/HashFunction.cpp
    Bloom/StdHashFunction.cpp
    Bloom/BitArray.cpp
    Network/Server.cpp
)

target_link_libraries(my_app pthread)

# Output binary to /app/bin (relative to /app/build)
set_target_properties(my_app PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/../bin")