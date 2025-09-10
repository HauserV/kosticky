
import React from 'react';
import Cell from './Cell';
import { GameBoard } from '../gameHelpers';

type Props = {
    board: GameBoard;
};

const Board: React.FC<Props> = ({ board }) => (
    <div 
        className="grid h-full"
        style={{
            gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${board.length}, 1fr)`,
            width: 'auto',
            aspectRatio: '1 / 2',
            gap: '1px'
        }}
    >
        {board.map((row) => 
            row.map((cell, x) => <Cell key={x} type={cell[0]} />)
        )}
    </div>
);

export default Board;