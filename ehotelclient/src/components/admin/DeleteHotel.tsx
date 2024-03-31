"use client"
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/axiosinstance';

interface Chain {
    chain_id: string;
    name: string;
}

interface Hotel {
    hotel_id: string;
    name: string;
}

const DeleteHotel: React.FC = () => {
    const [chains, setChains] = useState<Chain[]>([]);
    const [selectedChain, setSelectedChain] = useState<string>('');
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<string>('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        axiosInstance.get('/getchains')
            .then(response => {
                setChains(response.data);
            })
            .catch(error => console.error("Error fetching chains:", error));
    }, []);

    useEffect(() => {
        if (selectedChain) {
            axiosInstance.get(`/gethotels?chain_id=${selectedChain}`)
                .then(response => {
                    setHotels(response.data);
                })
                .catch(error => console.error("Error fetching hotels:", error));
        } else {
            setHotels([]);
        }
    }, [selectedChain]);

    const handleDelete = async () => {
        if (!selectedHotel) {
            alert("Please select a hotel to delete.");
            return;
        }

        try {
            await axiosInstance.delete(`/deletehotel/${selectedHotel}`);
            alert('Hotel successfully deleted.');
            setHotels(hotels.filter(hotel => hotel.hotel_id !== selectedHotel));
            setSelectedHotel('');
        } catch (error) {
            console.error('Failed to delete hotel:', error);
            alert('Failed to delete hotel. Please try again.');
        }
    };

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
            <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
                Delete Hotel
            </h3>
            {isFormOpen && (
                <div className="p-4">
                    <select className="border border-gray-300 p-2 rounded w-full mb-4" value={selectedChain} onChange={e => setSelectedChain(e.target.value)} onFocus={() => setSelectedHotel('')}>
                        <option value="">Select a Chain</option>
                        {chains.map(chain => (
                            <option key={chain.chain_id} value={chain.chain_id}>{chain.name}</option>
                        ))}
                    </select>
                    <select className="border border-gray-300 p-2 rounded w-full mb-4" value={selectedHotel} onChange={e => setSelectedHotel(e.target.value)}>
                        <option value="">Select a Hotel</option>
                        {hotels.map(hotel => (
                            <option key={hotel.hotel_id} value={hotel.hotel_id}>{hotel.name}</option>
                        ))}
                    </select>
                    <div className="flex justify-center mt-4">
                        <button onClick={handleDelete} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Delete Hotel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteHotel;
