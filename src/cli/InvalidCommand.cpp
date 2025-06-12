#include <iostream>
#include "ICommand.h"
#include "InvalidCommand.h"
#include <string>
        std::string InvalidCommand::execute(){
                return "400 Bad Request";
        }


        