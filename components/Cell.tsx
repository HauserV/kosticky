
import React from 'react';
import { TETROMINOS } from '../gameHelpers';

type Props = {
    type: string | number;
};

const Cell: React.FC<Props> = ({ type }) => {
    const color = TETROMINOS[type.toString()]?.color || '34, 34, 34';
    const cellStyle = {
        backgroundColor: `rgba(${color}, 0.8)`,
        border: type === 0 ? '0px solid' : `4px solid rgba(${color}, 1)`,
        borderBottomColor: `rgba(${color}, 0.1)`,
        borderRightColor: `rgba(${color}, 1)`,
        borderTopColor: `rgba(${color}, 1)`,
        borderLeftColor: `rgba(${color}, 0.3)`,
    };

    return <div className="w-full aspect-square" style={cellStyle}></div>;
};

export default React.memo(Cell);
