import { useEffect, useState } from "react";
import socket from "../socket";
import {useNavigate} from "react-router-dom"
import {v4} from "uuid";

const ACTIONS = require("../socket/actions");

const Main = () => {
    const [rooms, updateRooms] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
            updateRooms(rooms);
        })
    }, [])

    return <>
        <button onClick={() => {
            navigate(`/room/${v4()}`);
        }}>Create room</button>
        Rooms: 
        {rooms.map(id => 
            <div key={id}>
            {id}
            <button onClick={() => {
                navigate(`/room/${id}`);
            }}>
            JOIN
            </button>
        </div>)
        }
    </>
}

export default Main;