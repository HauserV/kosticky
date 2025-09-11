import { Player } from './hooks/usePlayer';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type BoardCell = [string | number, string];
export type GameBoard = BoardCell[][];

export const createBoard = (): GameBoard => 
    Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill([0, 'clear']));

type TetrominoShape = {
    shape: (string | number)[][];
    color: string;
};

type Tetrominos = {
    [key: string]: TetrominoShape;
};

// FIX: The tetromino shapes have been "trimmed" to their minimal bounding box.
// This removes all empty, padded rows and columns, which was the root cause
// of the ambiguity and the persistent off-by-one rendering bug.
export const TETROMINOS: Tetrominos = {
    '0': { shape: [[0]], color: '0, 0, 0' }, // Empty cell
    I: {
        shape: [
            ['I'],
            ['I'],
            ['I'],
            ['I']
        ],
        color: '80, 227, 230', // Cyan
    },
    J: {
        shape: [
            [0, 'J'],
            [0, 'J'],
            ['J', 'J']
        ],
        color: '36, 95, 223', // Blue
    },
    L: {
        shape: [
            ['L', 0],
            ['L', 0],
            ['L', 'L']
        ],
        color: '223, 173, 36', // Orange
    },
    O: {
        shape: [
            ['O', 'O'],
            ['O', 'O']
        ],
        color: '223, 217, 36', // Yellow
    },
    S: {
        shape: [
            [0, 'S', 'S'],
            ['S', 'S', 0]
        ],
        color: '48, 211, 56', // Green
    },
    T: {
        shape: [
            ['T', 'T', 'T'],
            [0, 'T', 0]
        ],
        color: '132, 61, 198', // Purple
    },
    Z: {
        shape: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z']
        ],
        color: '227, 78, 78', // Red
    }
};

export const randomTetromino = (): keyof typeof TETROMINOS => {
    const tetrominoKeys = Object.keys(TETROMINOS).filter(key => key !== '0');
    const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)] as keyof typeof TETROMINOS;
    return randomKey;
};

export const checkCollision = (
    player: Player,
    board: GameBoard,
    { x: moveX, y: moveY }: { x: number, y: number }
): boolean => {
    for (let y = 0; y < player.tetromino.shape.length; y += 1) {
        for (let x = 0; x < player.tetromino.shape[y].length; x += 1) {
            if (player.tetromino.shape[y][x] !== 0) {
                if (
                    !board[y + player.pos.y + moveY] ||
                    !board[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                    board[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};