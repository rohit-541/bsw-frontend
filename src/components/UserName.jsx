import React from 'react'
import { useAuth } from "/src/context/AuthContext"

export default function UserName() {
    const { authData, isLoggedIn} = useAuth()

    if (isLoggedIn) {
        return (
            <div className='bg-white'>
                <div className="container w-[100vw] text-center sm:text-right text-xl mx-auto"><a href="/profilepage">{authData?.user?.name}</a></div>
            </div>
        )
    }
    return (
        <div>

        </div>
    )
}
