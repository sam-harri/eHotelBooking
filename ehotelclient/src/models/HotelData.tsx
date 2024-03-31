import { V4Options } from "uuid";

interface HotelRoomData {
    room_id : V4Options;
    hotel_id : V4Options;
    capacity  : number;
    view : string;
    extendable : boolean;
    imageUrl: string;
    hotelName: string;
    hotelChainName: string;
    area: string;
    address: string;
    price: number;
    amenities: string[];
    defects: string[];
    rating: number;
    start_date : Date,
    end_date : Date
}

export default HotelRoomData