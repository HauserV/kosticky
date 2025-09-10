
import React from 'react';

const Controls: React.FC = () => (
    <div className="p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-white w-full font-press-start">
        <h2 className="text-sm mb-4 text-center">Ovládání</h2>
        <div className="text-[10px] space-y-4">
            <div>
                <h3 className="text-cyan-400 mb-2">Klávesnice</h3>
                <ul className="space-y-1">
                    <li><span className="w-[110px] inline-block">Šipka nahoru:</span> Otočit</li>
                    <li><span className="w-[110px] inline-block">Šipky do stran:</span> Pohyb</li>
                    <li><span className="w-[110px] inline-block">Šipka dolů:</span> Urychlit</li>
                    <li><span className="w-[110px] inline-block">Mezerník:</span> Pád</li>
                </ul>
            </div>
            <div>
                 <h3 className="text-cyan-400 mb-2">Dotyk</h3>
                 <ul className="space-y-1">
                    <li><span className="w-[110px] inline-block">Ťuknutí:</span> Otočit</li>
                    <li><span className="w-[110px] inline-block">Přejetí nahoru:</span> Otočit</li>
                    <li><span className="w-[110px] inline-block">Přejetí do stran:</span> Pohyb</li>
                    <li><span className="w-[110px] inline-block">Přejetí dolů:</span> Pád</li>
                 </ul>
            </div>
        </div>
    </div>
);

export default Controls;