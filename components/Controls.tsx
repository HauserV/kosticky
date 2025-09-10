
import React from 'react';

const Controls: React.FC = () => (
    <div className="p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-white w-full font-press-start">
        <h2 className="text-sm mb-3 text-center">Ovládání</h2>
        <ul className="text-[10px] space-y-2">
            <li><span className="text-cyan-400">Šipka nahoru</span> - Otočit</li>
            <li><span className="text-cyan-400">Šipky do stran</span> - Pohyb</li>
            <li><span className="text-cyan-400">Šipka dolů</span> - Urychlit</li>
            <li><span className="text-cyan-400">Mezerník</span> - Pád</li>
        </ul>
    </div>
);

export default Controls;
