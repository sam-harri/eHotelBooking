import React, { useState } from 'react';
import Filters from '@/models/Filters';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchParams from '@/models/SearchParams';

interface FilterProps {
    setSearchParams: (params: SearchParams) => void;
}

const SearchBar: React.FC<FilterProps> = ({ setSearchParams }) => {
    const [selectedArea, setSelectedArea] = useState('Ottawa');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    });

    const areas = ['Montreal', 'Ottawa', 'Toronto'];

    const handleSearch = () => {
        const searchParams: SearchParams = {
            dates: [startDate, endDate],
            area: selectedArea
        };
        setSearchParams(searchParams);
    };

    return (
        <div className="flex bg-gradient-to-b from-blue-300 to-white px-4 items-center justify-center">
            <div className="flex-initial" style={{ width: '15%' }}>
                <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full h-14 rounded-l-lg bg-white border-t border-b border-l border-r border-gray-300 text-gray-700 text-center cursor-pointer"
                >
                    {areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
            </div>

            <div className="flex-initial" style={{ width: 'auto' }}>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date || new Date())}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="w-full h-14 bg-white border-t border-b border-r border-gray-300 text-gray-700 text-center cursor-pointer"
                />
            </div>
            <div className="flex-initial" style={{ width: 'auto' }}>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date || new Date())}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full h-14 bg-white border-t border-b border-r border-gray-300 text-gray-700 text-center cursor-pointer"
                />
            </div>

            <div className="flex-initial" style={{ width: '15%' }}>
                <button
                    onClick={handleSearch}
                    className="w-full h-14 bg-white border-t border-b border-r border-gray-300 text-gray-700 font-bold rounded-r-lg hover:text-blue-300"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
