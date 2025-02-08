import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar';
import DoubtCards from '../components/DoubtCards';
export default function Doubt() {
    const navigate = useNavigate();

    const navigateToYourDoubts = () => {
        navigate('/userDoubts');
    }
    return (
        <div className='bg-white'>
            <Navbar />
            <DoubtCards/>
        </div>
    )
}
