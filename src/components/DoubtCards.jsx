import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function DoubtCards() {
    const navigate = useNavigate();

    const navigateToYourDoubts = () => {
        navigate('/userDoubts');
    }
    const navigateToAllDoubts = () => {
        navigate('/allDoubts');
    }
    const navigateToAskDoubt = () => {
        navigate('/askDoubt');
    }
    return (
        <div>
            <div className="container bg-white w-[90vw] mx-auto h-auto sm:h-[32rem] mt-20 rounded-2xl flex justify-center items-center text-center ">
                {/* Cards container */}
                <div className="flex flex-wrap justify-center gap-8">
                    {/* Card 1 */}
                    <div className="hover:cursor-pointer w-[70vw] sm:w-[30%] bg-gray-100 p-4 rounded-xl shadow-md flex flex-col items-center transition-all transform hover:scale-110 mt-8 sm:mt-0"
                        onClick={navigateToAskDoubt}
                    >
                        <img src="/src/assets/askDoubt.png" alt="Card Image 1" className=" w-[50vw] sm:w-full h-auto sm:h-[20vw] object-cover rounded-t-xl" />
                        <p className="mt-4 text-lg text-center">Ask Doubt</p>
                    </div>

                    {/* Card 2 */}
                    <div className="hover:cursor-pointer w-[70vw] sm:w-[30%] bg-gray-100 p-4 rounded-xl shadow-md flex flex-col items-center transition-all transform hover:scale-110"
                        onClick={navigateToAllDoubts}
                    >
                        <img src="/src/assets/allDoubts.png" alt="Card Image 2" className="w-[50vw] sm:w-full h-auto sm:h-[20vw] object-cover rounded-t-xl" />
                        <p className="mt-4 text-lg text-center">All Doubts</p>
                    </div>

                    {/* Card 3 */}
                    <div
                        className="hover:cursor-pointer w-[70vw] sm:w-[30%] bg-gray-100 p-4 rounded-xl shadow-md flex flex-col items-center transition-all transform hover:scale-110 mb-8 sm:mb-0"
                        onClick={navigateToYourDoubts}
                    >
                        <img
                            src="/src/assets/yourDoubts.png"
                            alt="Card Image 3"
                            className="w-[50vw] sm:w-full h-auto sm:h-[20vw] object-cover rounded-t-xl"
                        />
                        <p className="mt-4 text-lg text-center">Your Doubts</p>
                    </div>

                </div>
            </div>
        </div>
    )
}
