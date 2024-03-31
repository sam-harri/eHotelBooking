import React, { useState } from 'react';
import axiosInstance from '@/app/axiosinstance';

interface BookingDetails {
    room_id: string;
    start_date: Date;
    end_date: Date;
    chain_name: string;
    hotel_name: string;
    price: number;
}

const formatDate = (date: Date) => {
    const ret = date.toISOString().split('T')[0];
    console.log(ret)
    return ret
};

const BookCard: React.FC<BookingDetails> = ({
    room_id,
    start_date,
    end_date,
    chain_name,
    hotel_name,
    price,
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [ssn, setSsn] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const bookingData = {
            room_id,
            start_date: formatDate(start_date),
            end_date: formatDate(end_date),
            ssn,
            first_name: firstName,
            last_name: lastName,
            address,
        };
    
        try {
            const response = await axiosInstance.post('/book', bookingData);
            alert(`Booking confirmed for ${firstName} ${lastName}. Booking ID: ${response.data.booking_id}`);
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to confirm booking. Please try again.');
        }
    };
    

    return (
        <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Confirmation</h3>
                <p className="text-gray-600">Room at <span className="font-semibold">{hotel_name}</span>, part of <span className="font-semibold">{chain_name}</span> chain</p>
                <p className="text-gray-600">From <span className="font-semibold">{formatDate(start_date)}</span> to <span className="font-semibold">{formatDate(end_date)}</span></p>
                <p className="text-gray-600 mb-6">Total Price: <span className="text-green-500 font-semibold">${price.toFixed(2)}</span></p>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-300 p-2 rounded mt-4 w-full"
                    required
                />
                <input
                    type="text"
                    placeholder="SSN"
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                    className="border border-gray-300 p-2 rounded mt-4 w-full"
                    required
                />
                <div className="flex flex-wrap justify-center mt-4">
                    <button type="submit" className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                        Confirm Booking
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookCard;
