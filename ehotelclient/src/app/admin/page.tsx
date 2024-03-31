import Header from "@/components/Header";
import ConvertBookingToRenting from "@/components/admin/ConvertBookingToRenting";
import RentRoomWithoutBooking from "@/components/admin/RentRoomWithoutBooking";
import AddEmployee from "@/components/admin/AddEmployee";
import AddHotelChain from "@/components/admin/AddHotelChain";
import AddHotel from "@/components/admin/AddHotel";
import AddRoom from "@/components/admin/AddRoom";
import DeleteRoom from "@/components/admin/DeleteRoom";
import DeleteHotel from "@/components/admin/DeleteHotel";
import DeleteHotelChain from "@/components/admin/DeleteChain";
import React from 'react';

export default function Home() {
    return (
        <>
            <Header 
            adminPage={true}
            />
            <div className="flex justify-center  min-h-screen bg-gray-100">
                <div className="max-w-6xl w-full mx-auto p-5">
                    <ConvertBookingToRenting/>
                    <RentRoomWithoutBooking/>
                    <AddEmployee/>
                    <AddHotelChain/>
                    <AddHotel/>
                    <AddRoom/>
                    <DeleteRoom/>
                    <DeleteHotel/>
                    <DeleteHotelChain/>
                </div>
            </div>
        </>
    );
}
