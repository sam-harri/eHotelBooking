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

interface Amenity {
  amenity_id: string;
  description: string;
}

interface Defect {
  defect_id: string;
  description: string;
}

const AddRoomToHotel: React.FC = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [capacity, setCapacity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [view, setView] = useState<string>('');
  const [extendable, setExtendable] = useState<boolean>(false);
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chainResponse = await axiosInstance.get('/getchains');
        setChains(chainResponse.data);

        const amenitiesResponse = await axiosInstance.get('/getamenities');
        setAmenities(amenitiesResponse.data);

        const defectsResponse = await axiosInstance.get('/getdefects');
        setDefects(defectsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedChain) {
      axiosInstance.get(`/gethotels?chain_id=${selectedChain}`)
        .then(response => setHotels(response.data))
        .catch(error => console.error('Failed to fetch hotels for selected chain', error));
    } else {
      setHotels([]);
    }
  }, [selectedChain]);

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(current => 
      current.includes(amenityId) ? current.filter(id => id !== amenityId) : [...current, amenityId]
    );
  };

  const handleDefectChange = (defectId: string) => {
    setSelectedDefects(current => 
      current.includes(defectId) ? current.filter(id => id !== defectId) : [...current, defectId]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosInstance.post('/addroom', {
        hotel_id: selectedHotel,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        view,
        extendable,
        room_number: parseInt(roomNumber),
        amenities: selectedAmenities,
        defects: selectedDefects,
      });
      alert('Room successfully added to the hotel.');
      resetForm();
    } catch (error) {
      console.error('Failed to add room:', error);
      alert('Failed to add room. Please try again.');
    }
  };

  const resetForm = () => {
    setSelectedHotel('');
    setCapacity('');
    setPrice('');
    setView('');
    setExtendable(false);
    setRoomNumber('');
    setSelectedAmenities([]);
    setSelectedDefects([]);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
      <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
        Add Room to Hotel
      </h3>
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <select
            value={selectedChain}
            onChange={e => setSelectedChain(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Select a Chain</option>
            {chains.map(chain => (
              <option key={chain.chain_id} value={chain.chain_id}>{chain.name}</option>
            ))}
          </select>

          <select
            value={selectedHotel}
            onChange={e => setSelectedHotel(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Select a Hotel</option>
            {hotels.length > 0 ? 
              hotels.map(hotel => (
                <option key={hotel.hotel_id} value={hotel.hotel_id}>{hotel.name}</option>
              )) : <option disabled>Loading hotels...</option>
            }
          </select>

          <input
            type="number"
            placeholder="Capacity (e.g., 2)"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />

          <input
            type="text"
            placeholder="Price (e.g., 100.00)"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />

          <select
            value={view}
            onChange={e => setView(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Select View</option>
            <option value="sea">Sea</option>
            <option value="mountain">Mountain</option>
            <option value="city">City</option>
            <option value="garden">Garden</option>
          </select>

          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={extendable}
              onChange={e => setExtendable(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Extendable</span>
          </label>

          <input
            type="number"
            placeholder="Room Number (e.g., 101)"
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />

          <fieldset className="mt-4">
            <legend className="text-gray-900 font-semibold">Amenities</legend>
            {amenities.map((amenity) => (
              <label key={amenity.amenity_id} className="inline-flex items-center mr-2">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.amenity_id)}
                  onChange={() => handleAmenityChange(amenity.amenity_id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{amenity.description}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-gray-900 font-semibold">Defects</legend>
            {defects.map((defect) => (
              <label key={defect.defect_id} className="inline-flex items-center mr-2">
                <input
                  type="checkbox"
                  checked={selectedDefects.includes(defect.defect_id)}
                  onChange={() => handleDefectChange(defect.defect_id)}
                  className="form-checkbox h-5 w-5 text-red-600"
                />
                <span className="ml-2 text-gray-700">{defect.description}</span>
              </label>
            ))}
          </fieldset>

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

export default AddRoomToHotel;
