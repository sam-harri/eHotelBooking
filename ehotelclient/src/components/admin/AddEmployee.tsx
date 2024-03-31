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

const AddEmployee: React.FC = () => {
    const [chains, setChains] = useState<Chain[]>([]);
    const [selectedChain, setSelectedChain] = useState<string>('');
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [ssn, setSsn] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [isManager, setIsManager] = useState<boolean>(false);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);


    useEffect(() => {
        const fetchChains = async () => {
            try {
                const response = await axiosInstance.get('/getchains');
                setChains(response.data);
            } catch (error) {
                console.error('Failed to fetch chains', error);
            }
        };
        fetchChains();
    }, []);

    useEffect(() => {
        const fetchHotels = async () => {
            if (selectedChain) {
                try {
                    const response = await axiosInstance.get(`/gethotels?chain_id=${selectedChain}`);
                    setHotels(response.data);
                } catch (error) {
                    console.error('Failed to fetch hotels', error);
                }
            }
        };
        fetchHotels();
    }, [selectedChain]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const employeeData = {
            hotel_id: selectedHotel,
            first_name: firstName,
            last_name: lastName,
            ssn,
            address,
            is_manager: isManager,
        };

        try {
            await axiosInstance.post('/addemployee', employeeData);
            alert('Employee added successfully');
            resetFormFields();
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee. Please try again.');
        }
    };

    const resetFormFields = () => {
        setSelectedHotel('');
        setFirstName('');
        setLastName('');
        setSsn('');
        setAddress('');
        setIsManager(false);
    };

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
            <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
                Add Employee
            </h3>
            {isFormOpen && (
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <select className="border border-gray-300 p-2 rounded w-full" value={selectedChain} onChange={(e) => setSelectedChain(e.target.value)}>
                        <option value="">Select a Chain</option>
                        {chains.map((chain) => (
                            <option key={chain.chain_id} value={chain.chain_id}>{chain.name}</option>
                        ))}
                    </select>

                    <select className="border border-gray-300 p-2 rounded w-full" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                        <option value="">Select a Hotel</option>
                        {hotels.map((hotel) => (
                            <option key={hotel.hotel_id} value={hotel.hotel_id}>{hotel.name}</option>
                        ))}
                    </select>

                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
                    <input type="text" placeholder="SSN" value={ssn} onChange={(e) => setSsn(e.target.value)} className="border border-gray-300 p-2 rounded w-full" pattern="^\d{3}-\d{3}-\d{3}$" required />
                    <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={isManager} onChange={(e) => setIsManager(e.target.checked)} className="form-checkbox h-5 w-5" />
                        <span>Manager</span>
                    </label>

                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Employee
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddEmployee;
