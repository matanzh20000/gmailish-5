#ifndef BITARRAY_H
#define BITARRAY_H

#include <vector>
#include <string>

// BitArray class provides a simple abstraction over a dynamic array of bits
class BitArray {
    std::vector<bool> bits;  // Internal storage for bits using std::vector<bool>

public:
    // Constructor: initializes the BitArray with a given number of bits (all false)
    explicit BitArray(std::size_t size);

    // Sets the bit at the specified index to true
    void set(std::size_t index);

    // Returns the value of the bit at the specified index
    bool get(std::size_t index) const;

    // Returns the total number of bits in the array
    std::size_t size() const;
};

#endif  // BITARRAY_H
