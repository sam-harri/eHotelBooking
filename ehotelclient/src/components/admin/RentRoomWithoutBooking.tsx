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

interface Employee {
  employee_id: string;
  name: string;
}

interface Room {
  room_id: string;
  room_number: number;
}

const RentRoomWithoutBooking: React.FC = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [capacity, setCapacity] = useState('1');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerSSN, setCustomerSSN] = useState('');
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

  useEffect(() => {
    const fetchEmployees = async () => {
      if (selectedHotel) {
        try {
          const response = await axiosInstance.get(`/getemployees?hotel_id=${selectedHotel}`);
          setEmployees(response.data);
        } catch (error) {
          console.error('Failed to fetch employees', error);
        }
      }
    };
    fetchEmployees();
  }, [selectedHotel]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedHotel && capacity) {
        try {
          const response = await axiosInstance.get(`/getrooms`, {
            params: {
              hotel_id: selectedHotel,
              capacity: capacity
            }
          });
          setRooms(response.data);
        } catch (error) {
          console.error('Failed to fetch rooms', error);
        }
      }
    };
    fetchRooms();
  }, [selectedHotel, capacity]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rentingData = {
      employee_id: selectedEmployee,
      room_id: selectedRoom,
      first_name: customerFirstName,
      last_name: customerLastName,
      address: customerAddress,
      ssn: customerSSN,
    };
  
    try {
      await axiosInstance.post('/createrenting', rentingData);
      alert('Room rented successfully');
      setSelectedChain('');
      setSelectedHotel('');
      setSelectedEmployee('');
      setCapacity('1');
      setSelectedRoom('');
      setCustomerFirstName('');
      setCustomerLastName('');
      setCustomerAddress('');
      setCustomerSSN('');
    } catch (error) {
      console.error('Failed to rent room:', error);
      alert('Failed to rent room. Please try again.');
    }
  };



  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
      <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
        Rent Without Booking
      </h3>
      {isFormOpen && (
        <>
        <form onSubmit={handleSubmit} className="space-y-4">
        <select className="border border-gray-300 p-2 rounded w-full" value={selectedChain} onChange={e => setSelectedChain(e.target.value)} required>
          <option value="">Select a Chain</option>
          {chains.map(chain => (
            <option key={chain.chain_id} value={chain.chain_id}>{chain.name}</option>
          ))}
        </select>

        <select className="border border-gray-300 p-2 rounded w-full" value={selectedHotel} onChange={e => setSelectedHotel(e.target.value)} required>
          <option value="">Select a Hotel</option>
          {hotels.map(hotel => (
            <option key={hotel.hotel_id} value={hotel.hotel_id}>{hotel.name}</option>
          ))}
        </select>

        <select className="border border-gray-300 p-2 rounded w-full" value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} required>
          <option value="">Select an Employee</option>
          {employees.map(employee => (
            <option key={employee.employee_id} value={employee.employee_id}>{employee.name}</option>
          ))}
        </select>

        <select className="border border-gray-300 p-2 rounded w-full" value={capacity} onChange={e => setCapacity(e.target.value)} required>
          <option value="">Select a Capacity</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <select className="border border-gray-300 p-2 rounded w-full" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} required>
          <option value="">Select a Room</option>
          {rooms.map(room => (
            <option key={room.room_id} value={room.room_id}>Room {room.room_number}</option>
          ))}
        </select>

        <input type="text" placeholder="Customer First Name" value={customerFirstName} onChange={e => setCustomerFirstName(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
        <input type="text" placeholder="Customer Last Name" value={customerLastName} onChange={e => setCustomerLastName(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
        <input type="text" placeholder="Customer Address" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />
        <input type="text" placeholder="Customer SSN" value={customerSSN} onChange={e => setCustomerSSN(e.target.value)} className="border border-gray-300 p-2 rounded w-full" required />

        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Rent Room
          </button>
        </div>
      </form>
        </>
      )}
      
    </div>
  );
};

export default RentRoomWithoutBooking;
