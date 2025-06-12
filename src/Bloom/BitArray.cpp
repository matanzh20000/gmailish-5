#include "BitArray.h"

// Constructor: initializes the BitArray with the given size, setting all bits to false (0)
BitArray::BitArray(std::size_t size) : bits(size, false) {}

// Sets the bit at the given index to true (1)
void BitArray::set(std::size_t index) {
    bits[index] = true;
}

// Returns the value of the bit at the given index
bool BitArray::get(std::size_t index) const {
    return bits[index];
}

// Returns the total number of bits in the BitArray
std::size_t BitArray::size() const {
    return bits.size();
}
