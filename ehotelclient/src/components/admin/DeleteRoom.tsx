"use client";
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

interface Room {
    room_id: string;
    room_number: number;
}

const DeleteRoom: React.FC = () => {
    const [chains, setChains] = useState<Chain[]>([]);
    const [selectedChain, setSelectedChain] = useState('');
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState('');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        axiosInstance.get('/getchains')
            .then(response => setChains(response.data));
    }, []);

    useEffect(() => {
        if (selectedChain) {
            axiosInstance.get(`/gethotels?chain_id=${selectedChain}`)
                .then(response => setHotels(response.data));
        } else {
            setHotels([]);
        }
    }, [selectedChain]);

    useEffect(() => {
        if (selectedHotel) {
            axiosInstance.get(`/getrooms?hotel_id=${selectedHotel}`)
                .then(response => setRooms(response.data));
        } else {
            setRooms([]);
        }
    }, [selectedHotel]);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/deleteroom/${selectedRoom}`);
            alert('Room successfully deleted.');
            setRooms(rooms.filter(room => room.room_id !== selectedRoom));
            setSelectedRoom('');
        } catch (error) {
            console.error('Failed to delete room:', error);
            alert('Failed to delete room. Please try again.');
        }
    };

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
            <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
                Delete Room
            </h3>
            {isFormOpen && (
                <div className="p-4">
                    <select className="border border-gray-300 p-2 rounded w-full mb-4" value={selectedChain} onChange={e => setSelectedChain(e.target.value)}>
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

                    <select className="border border-gray-300 p-2 rounded w-full mb-4" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}>
                        <option value="">Select a Room</option>
                        {rooms.map(room => (
                            <option key={room.room_id} value={room.room_id}>Room {room.room_number}</option>
                        ))}
                    </select>
                    <div className="flex justify-center mt-4">
                        <button onClick={handleDelete} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Delete Room
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteRoom;
