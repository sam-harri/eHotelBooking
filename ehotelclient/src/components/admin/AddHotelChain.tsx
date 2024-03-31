"use client";
import React, { useState } from 'react';
import axiosInstance from '@/app/axiosinstance';

const AddHotelChain: React.FC = () => {
  const [chainName, setChainName] = useState('');
  const [chainAddress, setChainAddress] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([{ phone: '' }]);
  const [emailAddresses, setEmailAddresses] = useState([{ email: '' }]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { phone: '' }]);
  };

  const addEmailAddress = () => {
    setEmailAddresses([...emailAddresses, { email: '' }]);
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const updatedPhoneNumbers = phoneNumbers.map((phone, i) =>
      i === index ? { ...phone, phone: value } : phone
    );
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const handleEmailAddressChange = (index: number, value: string) => {
    const updatedEmailAddresses = emailAddresses.map((email, i) =>
      i === index ? { ...email, email: value } : email
    );
    setEmailAddresses(updatedEmailAddresses);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axiosInstance.post('/addhotelchain', {
        name: chainName,
        address: chainAddress,
        phone_numbers: phoneNumbers,
        email_addresses: emailAddresses,
      });
      alert('Hotel chain successfully added.');
      setChainName('');
      setChainAddress('');;
      setPhoneNumbers([{ phone: '' }]);
      setEmailAddresses([{ email: '' }]);
    } catch (error) {
      console.error('Failed to add hotel chain:', error);
      alert('Failed to add hotel chain. Please try again.');
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4 p-4">
      <h3 className="text-xl font-semibold text-gray-800 p-4 cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
        Add Hotel Chain
      </h3>
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <input
            type="text"
            placeholder="Chain Name"
            value={chainName}
            onChange={(e) => setChainName(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Chain Address"
            value={chainAddress}
            onChange={(e) => setChainAddress(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full"
            required
          />
          {phoneNumbers.map((phone, index) => (
            <div key={index}>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone.phone}
                onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                required={index === 0}
              />
            </div>
          ))}
          <button type="button" onClick={addPhoneNumber} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-2">
            Add Phone Number
          </button>
          {emailAddresses.map((email, index) => (
            <div key={index}>
              <input
                type="email"
                placeholder="Email Address"
                value={email.email}
                onChange={(e) => handleEmailAddressChange(index, e.target.value)}
                className="border border-gray-300 p-2 rounded w-full"
                required={index === 0}
              />
            </div>
          ))}
          <button type="button" onClick={addEmailAddress} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-2">
            Add Email Address
          </button>
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

export default AddHotelChain;
