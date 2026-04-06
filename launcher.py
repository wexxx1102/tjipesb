#!/usr/bin/env python3
import threading
import time
import webbrowser

from server import HOST, PORT, create_server


def main():
    server = create_server()
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    url = f"http://{HOST}:{PORT}"
    time.sleep(1)
    webbrowser.open(url)
    print(f"Touchscreen app started at {url}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
