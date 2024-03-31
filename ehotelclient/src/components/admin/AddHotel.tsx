"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/axiosinstance';

interface Chain {
    chain_id: string;
    name: string;
}

const AddHotel: React.FC = () => {
    const [hotelChains, setHotelChains] = useState<Chain[]>([]);
    const [selectedChain, setSelectedChain] = useState('');
    const [hotelName, setHotelName] = useState('');
    const [hotelAddress, setHotelAddress] = useState('');
    const [category, setCategory] = useState('1');
    const [area, setArea] = useState('Ottawa');
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const fetchHotelChains = async () => {
            try {
                const response = await axiosInstance.get('/getchains');
                setHotelChains(response.data);
            } catch (error) {
                console.error('Failed to fetch hotel chains:', error);
            }
        };

        fetchHotelChains();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axiosInstance.post('/addhotel', {
                chain_id: selectedChain,
                name: hotelName,
                address: hotelAddress,
                category: parseInt(category),
                area,
            });
            alert('Hotel successfully added.');
            setSelectedChain('');
            setHotelName('');
            setHotelAddress('');
            setCategory('1');
            setArea('Ottawa');
        } catch (error) {
            console.error('Failed to add hotel:', error);
            alert('Failed to add hotel. Please try again.');
        }
    };

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
            <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
                Add Hotel
            </h3>
            {isFormOpen && (
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <select
                        value={selectedChain}
                        onChange={(e) => setSelectedChain(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                        required
                    >
                        <option value="">Select a Chain</option>
                        {hotelChains.map((chain) => (
                            <option key={chain.chain_id} value={chain.chain_id}>{chain.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Hotel Name"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Hotel Address"
                        value={hotelAddress}
                        onChange={(e) => setHotelAddress(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                        required
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full"
                        required
                    >
                        <option value="">Select Area</option>
                        <option value="Ottawa">Ottawa</option>
                        <option value="Toronto">Toronto</option>
                        <option value="Montreal">Montreal</option>
                    </select>
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddHotel;
