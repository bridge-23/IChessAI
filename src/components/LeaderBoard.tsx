import React from 'react';

const Leaderboard: React.FC = () => {
    const players = [
        { name: 'CryptoClown', score: 1200 },
        { name: 'DegenDapp', score: 1150 },
        { name: 'ICPWhale', score: 1100 },
        { name: 'ChainJuggler', score: 1050 },
        { name: 'TokenTamer', score: 1000 },
        { name: 'DfinityFanatic', score: 950 },
        { name: 'NodeNinja', score: 900 },
        { name: 'CanisterKing', score: 850 },
        { name: 'NeuronsBeast', score: 800 },
        { name: 'SmartContractSavage', score: 750 },
    ];

    return (
        <div className="w-72 border p-4 shadow-lg rounded-lg">
            <h2 className="text-2xl mb-4 font-bold">Leaderboard</h2>
            <ul className="space-y-2">
                {players.map((player, index) => (
                    <li key={index} className="flex justify-between">
                        <span>{player.name}</span>
                        <span>{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
