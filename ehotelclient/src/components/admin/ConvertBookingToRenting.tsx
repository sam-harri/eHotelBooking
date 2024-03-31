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

interface Employee {
  employee_id: string;
  name: string;
}

interface Booking {
  booking_id: string;
  name: string;
}

const ConvertBookingToRenting: React.FC = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance.get('/getchains')
      .then(response => setChains(response.data))
      .catch(error => console.error('Failed to fetch chains', error));
  }, []);

  useEffect(() => {
    if (selectedChain) {
      axiosInstance.get(`/gethotels?chain_id=${selectedChain}`)
        .then(response => setHotels(response.data))
        .catch(error => console.error('Failed to fetch hotels', error));
    }
  }, [selectedChain]);

  useEffect(() => {
    if (selectedHotel) {
      axiosInstance.get(`/getemployees?hotel_id=${selectedHotel}`)
        .then(response => setEmployees(response.data))
        .catch(error => console.error('Failed to fetch employees', error));

      axiosInstance.get(`/getbookings?hotel_id=${selectedHotel}`)
        .then(response => setBookings(response.data))
        .catch(error => console.error('Failed to fetch bookings', error));
    }
  }, [selectedHotel]);

  const handleConvert = async () => {
    try {
        if (!selectedBooking || !selectedEmployee) {
            alert('Please select both a booking and an employee.');
            return;
        }

        await axiosInstance.post('/converttorenting', {
            booking_id: selectedBooking,
            employee_id: selectedEmployee,
        });
        alert('Booking successfully converted to renting.');

        setSelectedChain('');
        setSelectedHotel('');
        setEmployees([]);
        setBookings([]);
    } catch (error) {
        console.error('Failed to convert booking to renting:', error);
        alert('Failed to convert booking. Please try again.');
    }
};
  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
      <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
        Convert Booking to Renting
      </h3>
      {isFormOpen && (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <select className="border border-gray-300 p-2 rounded w-full" value={selectedChain} onChange={e => setSelectedChain(e.target.value)}>
              <option value="">Select a Chain</option>
              {chains.map(chain => <option key={chain.chain_id} value={chain.chain_id}>{chain.name}</option>)}
            </select>
            <select className="border border-gray-300 p-2 rounded w-full" value={selectedHotel} onChange={e => setSelectedHotel(e.target.value)}>
              <option value="">Select a Hotel</option>
              {hotels.map(hotel => <option key={hotel.hotel_id} value={hotel.hotel_id}>{hotel.name}</option>)}
            </select>
            <select className="border border-gray-300 p-2 rounded w-full" value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
              <option value="">Select an Employee</option>
              {employees.map(employee => <option key={employee.employee_id} value={employee.employee_id}>{employee.name}</option>)}
            </select>
            <select className="border border-gray-300 p-2 rounded w-full" value={selectedBooking} onChange={e => setSelectedBooking(e.target.value)}>
              <option value="">Select a Booking</option>
              {bookings.map(booking => <option key={booking.booking_id} value={booking.booking_id}>{booking.name}</option>)}
            </select>
          </div>
          <button onClick={handleConvert} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Convert to Renting
          </button>
        </div>
      )}
    </div>
  );
};

export default ConvertBookingToRenting;
