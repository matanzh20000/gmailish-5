# Use official cpp image
FROM gcc:latest

RUN apt-get update && \
    apt-get install -y build-essential cmake g++ libgtest-dev && \
    rm -rf /var/lib/apt/lists/*

RUN cd /usr/src/gtest && \
    cmake . && \
    make && \
    cp lib/*.a /usr/lib

WORKDIR /usr/src/app

# Copy everything (including src/)
COPY . .

RUN rm -rf build && mkdir build
WORKDIR /usr/src/app/build

# Optional: verify files exist
RUN ls -R /usr/src/app

RUN cmake .. && make

CMD ["./run_tests"]