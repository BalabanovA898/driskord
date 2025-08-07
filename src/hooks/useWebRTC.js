import { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import socket from "../socket";
import ACTIONS from "../socket/actions";

const LOCAL_VIDEO = "LOCAL_VIDEO";
export function useWebRTC(roomID) {
    const [clients, setClients] = useStateWithCallback([]);

    const addNewClient = useCallback((newClient, cb) => {
        if (!clients.includes(newClient)) {
            setClients(list => [...list, newClient], cb);
        }
    }, [clients, setClients])

    const peerConnections = useRef({});
    const localMediaStream = useRef(null);
    const peerMediaElements = useRef({
        [LOCAL_VIDEO]: null,
    });

    useEffect(() => {
        async function startCapture(){
            localMediaStream.current = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: true,
            });
            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];
                if (localVideoElement) {
                    localVideoElement.volume = 0;
                    localVideoElement.srcObject = localMediaStream.current;
                }
            })
        }

        startCapture()
        .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))
        .catch(e => console.error(e.message));
    }, [roomID]);

    const provideMediaRef = useCallback((id, node) => {
        peerMediaElements.current[id] = node;
    })

    return {clients, provideMediaRef};
}