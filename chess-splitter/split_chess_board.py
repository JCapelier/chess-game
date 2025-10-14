# This basic script allows to generate separate images from the sprites' grid.
# Vite cannot handle the Node.js libraries like sharp or jimp. We rely on python and the pillow library.

from PIL import Image

sprite_sheet = Image.open("chess-splitter/sprites.png")

board_width = 1200
board_height = 1201

board_start_x = 1
board_start_y = 5


# Calculate the coordinates of the board area
left = board_start_x
upper = board_start_y
right = left + board_width
lower = upper + board_height

# Crop the board from the sprite sheet
board = sprite_sheet.crop((left, upper, right, lower))

# Save the cropped board image
board.save("chess_board.png")
print("Saved chess_board.png")
