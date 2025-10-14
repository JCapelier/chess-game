# This basic script allows to generate separate images from the sprites' grid.
# Vite cannot handle the Node.js libraries like sharp or jimp. We rely on python and the pillow library.

from PIL import Image

sprite_sheet = Image.open("chess-splitter/sprites.png")

piece_width = 150
piece_height = 196
gap_x = 1
gap_y = 5

cols = 6
rows = 2

piece_names = ["bishop", "king", "knight", "pawn", "queen", "rook"]
colors = ["black", "white"]

grid_start_x = 1
grid_start_y = 1210

for row in range(rows):
    for col in range(cols):
        left = grid_start_x + col * (piece_width + gap_x)
        upper = grid_start_y + row * (piece_height + gap_y)
        right = left + piece_width
        lower = upper + piece_height
        piece = sprite_sheet.crop((left, upper, right, lower))
        name = f"{colors[row]}_{piece_names[col]}.png"
        piece.save(name)
        print(f"Saved {name}")
