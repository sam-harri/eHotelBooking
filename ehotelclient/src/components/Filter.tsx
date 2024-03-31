import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import Filters from '@/models/Filters';

interface FilterProps {
    setFilters: (filters: Filters) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ setFilters }) => {
    const ratings = ['1', '2', '3', '4', '5'];
    const allChains = ["Hotel Chain 1", "Hotel Chain 2", "Hotel Chain 3", "Hotel Chain 4", "Hotel Chain 5"];
    const allAmenities = ["Wi-Fi", "Air Conditioning", "Swimming Pool", "Room Service", "Gym Access"];

    const [priceRange, setPriceRange] = useState<[number, number]>([50, 400]);
    const [capacity, setCapacity] = useState<number>(1);
    const [categories, setCategories] = useState<string[]>(ratings);
    const [hotelChains, setHotelChains] = useState<string[]>(allChains);
    const [amenities, setAmenities] = useState<string[]>([]);

    const handleCheckboxChange = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter((currentValues) => {
            const index = currentValues.indexOf(value);
            if (index === -1) {
                return [...currentValues, value];
            } else {
                return currentValues.filter((_, i) => i !== index);
            }
        });
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (!Array.isArray(newValue)) {
            setCapacity(newValue);
        } else {
            setPriceRange(newValue as [number, number]);
        }
        updateFilters();
    };

    useEffect(() => {
        updateFilters();
    }, [priceRange, capacity, categories, hotelChains, amenities]);

    const updateFilters = () => {
        setFilters({
            priceRange,
            capacity,
            categories,
            hotelChains,
            amenities,
        });
    };

    return (
        <div className="p-4 bg-white shadow border border-gray-300 rounded-lg space-y-4 text-center divide-solid divide-y divide-gray-200">
            <p className="text-m font-bold text-gray-900 mb-2">Filter By</p>
            <div className='py-2'>
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">Min: ${priceRange[0]}</span>
                    <span className="text-sm font-semibold text-gray-700">Max: ${priceRange[1]}</span>
                </div>
                <Slider
                    getAriaLabel={() => 'Price range'}
                    value={priceRange}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={50}
                    max={400}
                    className="text-blue-600"
                    style={{color: '#60A5FA'}}
                />
            </div>
            <div className='py-2'>
                <p className="text-sm font-bold text-gray-700">Capacity: {capacity}</p>
                <Slider
                    getAriaLabel={() => 'Minimum capacity'}
                    value={capacity}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={1}
                    max={5}
                    className="text-blue-600"
                    style={{color: '#60A5FA'}}
                />
            </div>
            <div className="py-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Category</p>
                {ratings.map((rating) => (
                    <div key={rating} className="flex items-center mt-3">
                        <input
                            id={`category-${rating}`}
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 accent-blue-300 rounded cursor-pointer"
                            value={rating}
                            checked={categories.includes(rating)}
                            onChange={() => handleCheckboxChange(rating, setCategories)}
                        />
                        <label htmlFor={`category-${rating}`} className="ml-2 text-gray-700">{rating} star{rating !== '1' && 's'}</label>
                    </div>
                ))}
            </div>
            <div className="py-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Hotel Chain</p>
                {allChains.map((chain) => (
                    <div key={chain} className="flex items-center mt-3">
                        <input
                            id={`chain-${chain}`}
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 accent-blue-300 rounded cursor-pointer"
                            value={chain}
                            checked={hotelChains.includes(chain)}
                            onChange={() => handleCheckboxChange(chain, setHotelChains)}
                        />
                        <label htmlFor={`chain-${chain}`} className="ml-2 text-gray-700">{chain}</label>
                    </div>
                ))}
            </div>
            <div className="py-4">
                <p className="text-sm font-bold text-gray-700 mb-2">Amenities</p>
                {allAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center mt-3">
                        <input
                            id={`amenity-${amenity}`}
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 accent-blue-300 rounded cursor-pointer"
                            value={amenity}
                            checked={amenities.includes(amenity)}
                            onChange={() => handleCheckboxChange(amenity, setAmenities)}
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 text-gray-700">{amenity}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterComponent;
