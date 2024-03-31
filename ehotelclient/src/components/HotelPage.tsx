"use client"
import React, { useState, useCallback } from 'react';
import FilterComponent from './Filter';
import Filters from '@/models/Filters';
import HotelsList from './HotelList';
import SearchBar from './SearchBar';

interface SearchParams {
    dates : [Date, Date],
    area : string
}

const HotelsPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    priceRange: [50, 400],
    categories: [],
    hotelChains: [],
    amenities: [],
    capacity: 2,
  });

  const [searchParams, setSearchParams] = useState<SearchParams>({
    dates : [new Date(), new Date()],
    area : "Ottawa"
  })

  return (
    <div className="flex flex-col w-full">
      <div className="">
        <SearchBar setSearchParams={setSearchParams}/>
      </div>
      <div className="flex">
        <div className="w-1/4 p-4 bg-white shadow-md">
          <FilterComponent setFilters={setFilters}/>
        </div>
        <div className="flex-grow p-4 bg-white">
          <HotelsList filters={filters} searchParams={searchParams}/>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
