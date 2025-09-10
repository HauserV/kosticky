import React from 'react';
import { TETROMINOS } from '../gameHelpers';
import Cell from './Cell';

type Props = {
  tetromino: keyof typeof TETROMINOS;
};

const NextPiece: React.FC<Props> = ({ tetromino }) => {
  const shape = TETROMINOS[tetromino]?.shape;
  const boardSize = shape ? Math.max(shape.length, shape[0]?.length || 0) : 4;
  
  const board = Array.from({ length: boardSize }, () => Array(boardSize).fill([0, 'clear']));

  if (shape) {
    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          board[y][x] = [value, 'merged'];
        }
      });
    });
  }

  return (
    <div className="p-4 bg-gray-800 border-2 border-gray-600 rounded-lg">
      <h2 className="font-press-start text-sm text-white mb-2 text-center">Další</h2>
      <div
        className="grid mx-auto"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          width: '100px',
          height: '100px',
          gap: '1px'
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
        )}
      </div>
    </div>
  );
};

export default NextPiece;