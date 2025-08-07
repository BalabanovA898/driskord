import { useParams } from "react-router";
import { useWebRTC } from "../hooks/useWebRTC";

const LOCAL_VIDEO = "LOCAL_VIDEO";

const Room = () => {
    const {id: roomID} = useParams();
    const {clients, provideMediaRef} = useWebRTC(roomID);

    console.log(clients);
    
    return <>
        Demos!
        {clients.map(id => {
            console.log(id);
            return <div>
                <video
                ref={instance => {
                    provideMediaRef(id, instance);
                }}
                autoPlay
                playsInline
                muted={id === LOCAL_VIDEO}></video>
            </div>
        })}
    </>;
}

export default Room;