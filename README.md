
# Chess Game (React Exercise)

This project is a simple chess game built with React and TypeScript. It is intended as a personal exercise to learn and practice React concepts, component design, and state management.

## Features
- Interactive chess board with draggable pieces
- Move validation for all standard chess pieces
- Visual highlights for selected cells, possible moves, checks, and castling
- Modular code structure for easy learning and experimentation
- Custom styling using Tailwind CSS and DaisyUI

## Project Structure
- `src/components/` – React components for the board, cells, and UI
- `src/moves/` – Chess move logic for each piece
- `src/utils/` – Utility functions for board and game logic
- `src/assets/pieces/` – Chess piece images
- `chess-splitter/` – Python scripts for splitting chess board and pieces (optional)

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

## Python Scripts (chess-splitter)
If you want to use the Python scripts in `chess-splitter/`, you should create your own virtual environment. **Do not commit your `venv/` folder to the repository.**

To set up a Python virtual environment and install dependencies:

```sh
python3 -m venv venv
source venv/bin/activate
```

This is the standard workflow for Python projects. The `venv/` folder is specific to your machine and should always be in `.gitignore`.
