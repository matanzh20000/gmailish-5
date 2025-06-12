import socket
import sys
import os

def run_tcp_client(host='127.0.0.1', port=5555):
    try:
        # Create a TCP socket for communication
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            # Attempt to connect to the specified host and port
            client_socket.connect((host, port))
            print(f"Connected to server at {host}:{port}. Type 'exit' to quit.")

            while True:
                # Prompt user for input command
                user_input = input(">>> ").strip()
                
                # Exit if user types 'exit'
                if user_input.lower() == 'exit':
                    print("Closing connection.")
                    break

                # Skip empty input lines
                if not user_input:
                    continue

                # Send user input to the server
                client_socket.sendall(user_input.encode('utf-8'))

                # Receive and print the server's response
                response = client_socket.recv(4096).decode('utf-8')
                print(response.strip())

    except ConnectionRefusedError:
        # Error if the server is unreachable
        print(f"Could not connect to server at {host}:{port}. Is it running?")
    except Exception as e:
        # Catch any unexpected errors
        print(f"Unexpected error: {e}")

# Main execution
if __name__ == "__main__":
    # Read server host and port from environment variables
    host = os.getenv("SERVER_HOST", "server-container")
    port = int(os.getenv("SERVER_PORT", 5555))
    
    # Start the TCP client
    run_tcp_client(host=host, port=port)
