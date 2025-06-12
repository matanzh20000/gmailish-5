#include "HashFunction.h"

// Implementation of the virtual function in the base class
int HashFunction::ModuloHash(size_t hash, int arraySize) {
    return hash % arraySize;
}

