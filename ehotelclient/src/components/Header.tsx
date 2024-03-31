"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Admin {
    adminPage: boolean;
}

const Header: React.FC<Admin> = ({ adminPage }) => {
    const router = useRouter();

    const handleAdminClick = () => {
        router.push(`/admin`);
    };

    return (
        <header className="flex items-center justify-between bg-blue-300 px-6 pb-4">
            <div className="flex items-center mt-4">
                <div style={{ position: 'relative', width: '35px', height: '35px' }}>
                    <Image
                        src="/logo.png"
                        alt="Placeholder Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                <span className=" ml-4 text-xl font-bold">eHotel</span>
                {adminPage && <span className="pl-4 ml-2 text-xl font-bold">ADMIN PANEL</span>}
            </div>
            {!adminPage && 
            <button 
                className="bg-blue-300 hover:bg-white text-blue-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                onClick={handleAdminClick}>
                    Admin
            </button>}
        </header>
    );
};

export default Header;
