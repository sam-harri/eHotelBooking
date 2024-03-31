import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import HotelRoomData from '@/models/HotelData';
import Filters from '@/models/Filters';
import SearchParams from '@/models/SearchParams';


const HotelCard: React.FC<HotelRoomData> = ({
    room_id,
    hotel_id,
    capacity,
    view,
    extendable,
    imageUrl,
    hotelName,
    hotelChainName,
    area,
    address,
    price,
    amenities,
    defects,
    rating,
    start_date,
    end_date,
}) => {
    const router = useRouter();

    const renderStars = (rating : number) => {
        let stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push("⭐");
        }
        return stars.join('');
    };
    const handleBookingClick = () => {
        start_date.setDate(start_date.getDate()-1)
        end_date.setDate(end_date.getDate()-1)
        const queryParams = new URLSearchParams({
            room_id: room_id.toString(),
            chain_name: hotelChainName,
            hotel_name: hotelName,
            price: price.toString(),
            start_date: start_date.toISOString().substring(0, 10),
            end_date: end_date.toISOString().substring(0, 10),
        }).toString();
        router.push(`/book?${queryParams}`);
    };


    return (
        <div className="flex bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden mb-4">
            <div className="relative w-48 h-48 flex-none m-3">
                <Image
                    src={imageUrl}
                    alt="Hotel"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>
            <div className="flex-grow p-4 leading-normal">
                <h5 className="text-xl font-bold">{hotelName}</h5>
                <p className="text-sm text-gray-500">{hotelChainName}</p>
                <p className="text-sm text-gray-500">{area}</p>
                <p className="text-sm text-gray-500">Room for {capacity}</p>
                <div className="mt-2 text-yellow-400">{renderStars(rating)}</div>
                <div className="mt-2">
                    <div className="flex flex-wrap text-xs">
                        {amenities?.map((amenity, index) => (
                            <span key={index} className="text-green-500 pr-2">{amenity}</span>
                        ))}
                    </div>
                </div>
                <div className="mt-1">
                    <div className="flex flex-wrap text-xs">
                        {defects?.map((defect, index) => (
                            <span key={index} className="text-red-500 pr-2">{defect}{" "}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between p-4 text-right space-y-2">
                <div className="space-y-1">
                </div>
                <div className="space-y-1">
                    <p className="text-2xl font-semibold">CAD {price}</p>
                    <button 
                        className="bg-blue-200 hover:bg-blue-300 text-blue-800 px-4 py-2 rounded-md transition duration-300 ease-in-out"
                        onClick={handleBookingClick}
                    > Book </button>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;