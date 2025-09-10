
import React from 'react';

type Props = {
    callback: () => void;
    text?: string;
};

const StartButton: React.FC<Props> = ({ callback, text = "Start" }) => (
    <button 
        className="w-full px-4 py-4 mt-2 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 font-press-start"
        onClick={callback}
    >
        {text}
    </button>
);

export default StartButton;
