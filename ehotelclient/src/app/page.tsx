import Header from "@/components/Header";
import HotelsPage from "@/components/HotelPage";
import React from 'react';

export default function Home() {
  return (
    <main>
      <Header 
        adminPage={false}
      />
      <HotelsPage/>
    </main>
  );
}
