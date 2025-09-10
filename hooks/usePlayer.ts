
import { useState, useCallback } from 'react';
import { TETROMINOS, BOARD_WIDTH, checkCollision, GameBoard } from '../gameHelpers';

type TetrominoShape = (string | number)[][];

export type Player = {
    pos: { x: number; y: number };
    tetromino: {
        shape: TetrominoShape;
        color: string;
    };
    collided: boolean;
};

export const usePlayer = () => {
    const [player, setPlayer] = useState<Player>({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS['0'],
        collided: false,
    });
    
    const [nextTetromino, setNextTetromino] = useState<keyof typeof TETROMINOS>(Object.keys(TETROMINOS)[Math.floor(Math.random() * (Object.keys(TETROMINOS).length-1))+1]);

    const rotate = (matrix: TetrominoShape, dir: number) => {
        const rotatedTetro = matrix.map((_, index) => matrix.map(col => col[index]));
        if (dir > 0) return rotatedTetro.map(row => row.reverse());
        return rotatedTetro.reverse();
    };

    const playerRotate = (board: GameBoard, dir: number) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino.shape[0].length) {
                rotate(clonedPlayer.tetromino.shape, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    };

    // FIX: The original function contained incorrect collision logic that caused a compile error and game bugs.
    // The collision detection logic is moved to App.tsx where the 'board' state is accessible.
    // This function now only updates the player's state.
    const updatePlayerPos = useCallback(({ x, y, collided }: { x: number, y: number, collided: boolean }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: prev.pos.x + x, y: prev.pos.y + y },
            collided,
        }));
    }, []);

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
            tetromino: TETROMINOS[nextTetromino],
            collided: false,
        });
        const tetrominoKeys = Object.keys(TETROMINOS).filter(key => key !== '0');
        const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)] as keyof typeof TETROMINOS;
        setNextTetromino(randomKey);
    }, [nextTetromino]);

    return { player, updatePlayerPos, resetPlayer, playerRotate, nextTetromino };
};
