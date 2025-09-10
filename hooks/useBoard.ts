import { useState, useEffect } from 'react';
import { createBoard, GameBoard, checkCollision, TETROMINOS, BOARD_WIDTH, BOARD_HEIGHT } from '../gameHelpers';
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
            const newBoard = prevBoard.map(
                row => row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)) as typeof row
            );

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

                    // FIX: This is the definitive implementation of your requested logic.
                    // 1. A safe, deep copy of the board is created.
                    const finalBoard = JSON.parse(JSON.stringify(newBoardAfterSweep));

                    // 2. Calculate exactly how many empty rows are at the top of the board.
                    let availableRows = 0;
                    for (let y = 0; y < BOARD_HEIGHT; y++) {
                        if (newBoardAfterSweep[y].every(cell => cell[1] === 'clear')) {
                            availableRows++;
                        } else {
                            break;
                        }
                    }

                    // 3. Render the bottom part of the next piece into the available space.
                    const shape = nextPiecePlayer.tetromino.shape;
                    const shapeHeight = shape.length;

                    for (let boardY = 0; boardY < availableRows; boardY++) {
                        // Map the board row to the corresponding row in the piece's shape array
                        const shapeY = shapeHeight - availableRows + boardY;
                        
                        if (shape[shapeY]) {
                            const row = shape[shapeY];
                            row.forEach((value, x) => {
                                if (value !== 0) {
                                    const boardX = x + nextPiecePlayer.pos.x;
                                    if (newBoardAfterSweep[boardY] && newBoardAfterSweep[boardY][boardX]) {
                                        newBoardAfterSweep[boardY][boardX] = [value, 'merged'];
                                    }
                                }
                            });
                        }
                    }
                    
                    return newBoardAfterSweep;
                } 
                
                resetPlayer();
                return newBoardAfterSweep;
            }

            return newBoard;
        };

        setBoard(prev => updateBoard(prev));
    }, [player, nextTetromino, resetPlayer, setGameOver]);

    return { board, setBoard, rowsCleared };
};