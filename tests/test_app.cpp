#include <gtest/gtest.h>
#include <sstream>
#include <unordered_map>
#include "cli/App.h"
#include "cli/InitCommand.h"
#include "cli/ICommand.h"
#include "cli/CommandParser.h"

void redirectCin(std::istringstream& input) {
    std::cin.rdbuf(input.rdbuf());
}

std::string captureCout(std::function<void()> f) {
    std::stringstream buff;
    std::streambuf* cur = std::cout.rdbuf(buff.rdbuf());
    f(); 
    std::cout.rdbuf(cur);
    return buff.str();
}

TEST(AppRunTest, inputforinit) {
    std::istringstream testInput("8 1 2\ntest_end\n");
    redirectCin(testInput);

    auto* initCommand = new InitCommand();

    std::unordered_map<PromptType, ICommand*> commands;
    commands[PromptType::Init] = initCommand;

    App app(commands);

    std::string output = captureCout(std::bind(&App::run, &app));
        app.run();

    EXPECT_NE(output.find("Init"), std::string::npos);


    delete initCommand;
}
