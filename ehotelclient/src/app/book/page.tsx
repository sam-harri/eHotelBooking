"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import BookCard from '@/components/BookCard';

export default function BookingPage() {
    const searchParams = useSearchParams();

    const room_id = searchParams.get('room_id');
    const chain_name = searchParams.get('chain_name');
    const hotel_name = searchParams.get('hotel_name');
    const price = Number(searchParams.get('price')) || 0;
    const start_date_param = searchParams.get('start_date');
    const end_date_param = searchParams.get('end_date');

    let start_date = start_date_param ? new Date(start_date_param) : new Date();
    let end_date = end_date_param ? new Date(end_date_param) : new Date();

    start_date.setDate(start_date.getDate() + 1);
    end_date.setDate(end_date.getDate() + 1);

    if (!room_id || !chain_name || !hotel_name || !price) {
        return <div>Missing booking information</div>;
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="max-w-lg w-full mx-auto p-5">
                    <BookCard
                        room_id={room_id || ""}
                        start_date={start_date}
                        end_date={end_date}
                        chain_name={chain_name || ""}
                        hotel_name={hotel_name || ""}
                        price={price}
                    />
                </div>
            </div>
        </>
    );
}
