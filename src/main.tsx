import React from 'react';
import ReactDOM from 'react-dom/client';
import Achivements from './Achivements';
import App from './App';
import Gallery from './Gallery';
import Navbar from './Navbar';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<Gallery />}></Route>
            <Route path="/Achivement" element={<Achivements />}></Route>
        </Routes>
    </BrowserRouter>
);
