"use client"
import React, { useState, useEffect, useMemo } from 'react';
import HotelCard from './HotelCard';
import axiosInstance from '@/app/axiosinstance';
import Filters from '@/models/Filters';
import SearchParams from '@/models/SearchParams';
import HotelData from '@/models/HotelData';

interface HotelsListProps {
    filters: Filters
    searchParams: SearchParams;
}

const HotelsList: React.FC<HotelsListProps> = ({ filters, searchParams }) => {
    const [hotels, setHotels] = useState<HotelData[]>([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                if (!searchParams.dates || searchParams.dates.length < 2 || !searchParams.area) {
                    console.error('Invalid filters provided');
                    return;
                }

                const startDate = searchParams.dates[0].toISOString().substring(0, 10);
                const endDate = searchParams.dates[1].toISOString().substring(0, 10);
                const area = searchParams.area;

                const response = await axiosInstance.get(`/availableHotels`, {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        area: area,
                    }
                });
                console.log(response.data)

                if (response.data && Array.isArray(response.data)) {
                    setHotels(response.data);
                } else {
                    console.error('Unexpected response format');
                }
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
            }
        };

        fetchHotels();
    }, [searchParams]);

    const filteredHotels = useMemo(() => {
        return hotels.filter(hotel => {
            
            const categoryMatch = filters.categories.includes(hotel.rating.toString());
            const priceMatch = hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1];
            const amenitiesMatch = filters.amenities.length === 0 || (hotel.amenities && Array.isArray(hotel.amenities) && filters.amenities.every(amenity => hotel.amenities.includes(amenity)));
            const chainMatch = filters.hotelChains.includes(hotel.hotelChainName);
            const capacity = hotel.capacity === filters.capacity
            return categoryMatch && priceMatch && amenitiesMatch && chainMatch && capacity;
        });
    }, [hotels, filters]);
    
    const getRandomImageUrl = () => {
        const imageNumber = Math.floor(Math.random() * 10) + 1;
        return `/hotelrooms/hotel${imageNumber}.jpg`;
    };

    return (
        <div>
            {filteredHotels.length > 0 ? (
                filteredHotels.slice(0,7).map((hotel, index) => (
                    <HotelCard
                        key={index}
                        room_id={hotel.room_id}
                        hotel_id={hotel.hotel_id}
                        capacity={hotel.capacity}
                        view={hotel.view}
                        extendable={hotel.extendable}
                        imageUrl={getRandomImageUrl()}
                        hotelName={hotel.hotelName}
                        hotelChainName={hotel.hotelChainName}
                        area={hotel.area}
                        address={hotel.address}
                        price={hotel.price}
                        amenities={hotel.amenities}
                        defects={hotel.defects}
                        rating={hotel.rating}
                        start_date={searchParams.dates[0]}
                        end_date={searchParams.dates[1]}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500 mt-9">No hotels found matching your criteria.</p>
            )}
        </div>
    );
};

export default HotelsList;
