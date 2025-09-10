
import React from 'react';

type Props = {
    text: string;
};

const Display: React.FC<Props> = ({ text }) => (
    <div className="flex items-center justify-start p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-white font-press-start text-sm w-full">
        {text}
    </div>
);

export default Display;
