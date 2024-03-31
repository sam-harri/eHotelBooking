"use client"
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/axiosinstance';

interface Chain {
    chain_id: string;
    name: string;
}

const DeleteHotelChain: React.FC = () => {
    const [chains, setChains] = useState<Chain[]>([]);
    const [selectedChain, setSelectedChain] = useState<string>('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        axiosInstance.get('/getchains')
            .then(response => setChains(response.data))
            .catch(error => console.error("Error fetching chains:", error));
    }, []);

    const handleDelete = async () => {
        if (!selectedChain) {
            alert("Please select a chain to delete.");
            return;
        }

        try {
            await axiosInstance.delete(`/deletechain/${selectedChain}`);
            alert('Hotel chain successfully deleted.');
            setChains(chains.filter(chain => chain.chain_id !== selectedChain));
            setSelectedChain('');
            setIsFormOpen(false);
        } catch (error) {
            console.error('Failed to delete hotel chain:', error);
            alert('Failed to delete hotel chain. Please try again.');
        }
    };

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
            <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
                Delete Hotel Chain
            </h3>
            {isFormOpen && (
                <div className="p-4">
                    <select className="border border-gray-300 p-2 rounded w-full mb-4" value={selectedChain} onChange={e => setSelectedChain(e.target.value)}>
                        <option value="">Select a Chain</option>
                        {chains.map(chain => (
                            <option key={chain.chain_id} value={chain.chain_id}>{chain.name}</option>
                        ))}
                    </select>
                    <div className="flex justify-center mt-4">
                        <button onClick={handleDelete} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Delete Chain
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteHotelChain;
