# User Action Recorder Demo

This project demonstrates how to capture user interactions (clicks, inputs) in a structured format suitable for prompting Large Language Models (LLMs). It uses `rrweb` for session recording and custom JavaScript to extract semantic events.

## Features

- **Semantic Event Extraction**: Captures clicks and input changes with relevant metadata (tag name, ID, class, inner text, attributes).
- **DOM Path Tracking**: Generates a unique CSS selector/path for each interacted element.
- **Session Recording**: Uses `rrweb` to record the full DOM session (optional, but included).
- **JSON Export**: Displays the captured logs in a JSON format that can be easily copied or exported.

## How to Use

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/domguia/browser_events_recorder.git
    cd browser_events_recorder
    ```

2.  **Run a local server**:
    You can use Python's built-in HTTP server or any other static file server.
    ```bash
    python3 -m http.server 8080
    ```

3.  **Open the demo**:
    Navigate to `http://localhost:8080` in your web browser.

4.  **Interact with the page**:
    - Click on "Add to Cart" buttons.
    - Type in the email subscription box.
    - Click "Subscribe".

5.  **View Logs**:
    Scroll down to the "Recorded Actions (for LLM)" section. You will see a real-time JSON log of your actions.

## Project Structure

- `index.html`: The main demo page with sample UI elements.
- `style.css`: Basic styling for the demo.
- `recorder.js`: The core logic for capturing events and `rrweb` integration.

## Example Output

```json
[
  {
    "type": "click",
    "timestamp": "2023-10-27T10:00:00.000Z",
    "element": {
      "tagName": "button",
      "className": "add-to-cart-btn",
      "innerText": "Add to Cart",
      "attributes": {}
    },
    "context": {
      "url": "http://localhost:8080/",
      "path": "div#p1 > button.add-to-cart-btn"
    }
  }
]
```
