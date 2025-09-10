
import React from 'react';

type Props = {
    callback: () => void;
    text?: string;
    className?: string;
};

const StartButton: React.FC<Props> = ({ callback, text = "Start", className = "" }) => (
    <button 
        className={`px-4 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 font-press-start ${className}`}
        onClick={callback}
    >
        {text}
    </button>
);

export default StartButton;
