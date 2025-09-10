
import React, { useState, useCallback, KeyboardEvent, useEffect } from 'react';
// FIX: Import checkCollision to handle game logic correctly
import { createBoard, BOARD_WIDTH, checkCollision } from './gameHelpers';

// Custom Hooks
import { useInterval } from './hooks/useInterval';
import { usePlayer } from './hooks/usePlayer';
import { useBoard } from './hooks/useBoard';
import { useGameStatus } from './hooks/useGameStatus';

// Components
import Board from './components/Board';
import Display from './components/Display';
import StartButton from './components/StartButton';
import NextPiece from './components/NextPiece';
import Controls from './components/Controls';

const App: React.FC = () => {
    const [dropTime, setDropTime] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(true);

    const { player, updatePlayerPos, resetPlayer, playerRotate, nextTetromino } = usePlayer();
    const { board, setBoard, rowsCleared } = useBoard(player, resetPlayer, nextTetromino, setGameOver);
    const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);
    const [highScore, setHighScore] = useState<number>(0);

    useEffect(() => {
        const savedHighScore = localStorage.getItem('tetrisHighScore');
        if (savedHighScore) {
            setHighScore(JSON.parse(savedHighScore));
        }
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('tetrisHighScore', JSON.stringify(score));
        }
    }, [score, highScore]);

    // FIX: Collision detection should happen here, before updating player position.
    const movePlayer = (dir: number) => {
        if (!checkCollision(player, board, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0, collided: false });
        }
    };

    const startGame = useCallback(() => {
        setBoard(createBoard());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
    }, [resetPlayer, setBoard, setLevel, setRows, setScore]);

    const drop = useCallback(() => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        // FIX: Check for collision before moving the piece down.
        if (!checkCollision(player, board, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game over!
            if (player.pos.y < 1) {
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }, [board, level, player, rows, setLevel, updatePlayerPos]);

    const keyUp = ({ keyCode }: { keyCode: number }) => {
        if (!gameOver) {
            if (keyCode === 40) { // down arrow
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    };

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    };

    // FIX: Correctly implement hard drop functionality.
    const hardDrop = () => {
        let y = 0;
        while (!checkCollision(player, board, { x: 0, y: y + 1 })) {
            y++;
        }
        updatePlayerPos({ x: 0, y, collided: true });
    };

     const move = ({ keyCode }: KeyboardEvent<HTMLDivElement>): void => {
        if (!gameOver) {
            if (keyCode === 37) { // left arrow
                movePlayer(-1);
            } else if (keyCode === 39) { // right arrow
                movePlayer(1);
            } else if (keyCode === 40) { // down arrow
                dropPlayer();
            } else if (keyCode === 38) { // up arrow
                playerRotate(board, 1);
            } else if (keyCode === 32) { // space bar
                // FIX: The original hard drop logic caused an infinite loop.
                hardDrop();
            }
        }
    };

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <div 
            className="w-full min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-4" 
            role="button" 
            tabIndex={0} 
            onKeyDown={e => move(e)} 
            onKeyUp={keyUp}
        >
            <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex flex-col items-center">
                    <h1 className="font-press-start text-4xl mb-6 text-cyan-400">TETRIS</h1>
                    <div 
                        className="border-4 border-gray-600 rounded-lg bg-black shadow-lg"
                        style={{ height: '70vh', maxHeight: '800px' }}
                    >
                        <Board board={board} />
                    </div>
                </div>
                <aside className="w-full md:w-60 flex flex-col gap-4">
                    {gameOver ? (
                        <div className="flex flex-col gap-4 w-full">
                            {score > 0 && <Display text="Konec Hry" />}
                            <Display text={`Nejvyšší skóre: ${highScore}`} />
                            {score > 0 && <Display text={`Tvé skóre: ${score}`} />}
                            <StartButton callback={startGame} text={score > 0 ? "Hrát Znovu" : "Start"} />
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4'>
                            <Display text={`Nejvyšší skóre: ${highScore}`} />
                            <NextPiece tetromino={nextTetromino}/>
                            <Display text={`Skóre: ${score}`} />
                            <Display text={`Řádky: ${rows}`} />
                            <Display text={`Úroveň: ${level}`} />
                            <StartButton callback={() => setGameOver(true)} text="Restartovat" />
                        </div>
                    )}
                    <Controls />
                </aside>
            </div>
        </div>
    );
};

export default App;
