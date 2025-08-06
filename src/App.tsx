import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Main from './components/Main';
import NotFound404 from './components/NotFound404';
import Room from './components/Room';


function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main/>}></Route>
      <Route path="/room/:id" element = {<Room/>}></Route>
      <Route path="*" element={<NotFound404/>}></Route>
    </Routes>
   </BrowserRouter> 
  );
}

export default App;
