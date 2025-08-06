import socket from "../socket";

const Main = () => {
    socket.io.on("error", () => {
      console.log("Error");
    });

    return <>This is the main page</>
}

export default Main;