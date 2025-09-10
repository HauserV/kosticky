
import { useState, useEffect } from 'react';
import { createBoard, GameBoard, checkCollision, TETROMINOS, BOARD_WIDTH } from '../gameHelpers';
import { Player } from './usePlayer';

export const useBoard = (
    player: Player, 
    resetPlayer: () => void,
    nextTetromino: keyof typeof TETROMINOS,
    setGameOver: (isGameOver: boolean) => void
) => {
    const [board, setBoard] = useState<GameBoard>(createBoard());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);
        
        const sweepRows = (newBoard: GameBoard): GameBoard => 
            newBoard.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newBoard[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, [] as GameBoard);

        const updateBoard = (prevBoard: GameBoard): GameBoard => {
            // First, clear the board of any 'clear' cells from the previous render
            const newBoard = prevBoard.map(
                row => row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)) as typeof row
            );

            // Then draw the tetromino
            player.tetromino.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        const boardY = y + player.pos.y;
                        const boardX = x + player.pos.x;
                        if (newBoard[boardY] && newBoard[boardY][boardX]) {
                            newBoard[boardY][boardX] = [
                                value,
                                `${player.collided ? 'merged' : 'clear'}`
                            ];
                        }
                    }
                });
            });

            if (player.collided) {
                const newBoardAfterSweep = sweepRows(newBoard);
                
                const nextPiecePlayer = {
                    pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
                    tetromino: TETROMINOS[nextTetromino],
                    collided: false,
                };

                if (checkCollision(nextPiecePlayer, newBoardAfterSweep, { x: 0, y: 0 })) {
                    setGameOver(true);
                    // Draw the final piece that caused the game to end, but only in empty cells
                    nextPiecePlayer.tetromino.shape.forEach((row, y) => {
                        row.forEach((value, x) => {
                            if (value !== 0) {
                                const boardY = y + nextPiecePlayer.pos.y;
                                const boardX = x + nextPiecePlayer.pos.x;
                                if (
                                    newBoardAfterSweep[boardY] && 
                                    newBoardAfterSweep[boardY][boardX] &&
                                    newBoardAfterSweep[boardY][boardX][1] === 'clear' // Only draw if the cell is empty
                                ) {
                                    newBoardAfterSweep[boardY][boardX] = [value, 'merged'];
                                }
                            }
                        });
                    });
                    return newBoardAfterSweep;
                } 
                
                resetPlayer();
                return newBoardAfterSweep;
            }

            return newBoard;
        };

        setBoard(prev => updateBoard(prev));
    }, [player, resetPlayer, nextTetromino, setGameOver]);

    return { board, setBoard, rowsCleared };
};
