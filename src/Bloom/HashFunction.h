#ifndef HASH_FUNCTION_H
#define HASH_FUNCTION_H

#include <string>
#include <memory>

// Declaration of the abstract interface HashFunction
class HashFunction {
public:
    virtual size_t operator()(const std::string& input) const = 0;
    virtual ~HashFunction() = default;
    virtual int ModuloHash(size_t hash, int arraySize);
};

// Standard hash function: applies std::hash on input + iteration string
class StdHashFunction : public HashFunction {
public:
    size_t operator()(const std::string& input) const override;
};


#endif // HASH_FUNCTION_H