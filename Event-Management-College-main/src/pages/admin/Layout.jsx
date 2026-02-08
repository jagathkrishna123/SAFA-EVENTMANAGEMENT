import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Logo2 from "../../assets/logo2.png";


const Layout = () => {
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
    }

    return (
        <div className="flex flex-col h-screen bg-[#03050F] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between h-[80px] px-8 sm:px-12 bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 relative z-50">
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

                <div className="flex items-center w-[205px] h-[70px]">
                    <div className="flex items-center h-[66px]">
                        <img src={Logo2} alt="Logo" className="w-[50px]" />
                    </div>
                    <div className="flex items-center justify-center">
                        <h2 onClick={() => navigate("/")} className="font-sans font-bold text-white text-[27px] cursor-pointer">
                            DOCKET
                        </h2>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="group relative px-8 py-2.5 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 overflow-hidden"
                >
                    <span className="relative z-10">Logout</span>
                </button>
            </div>

            {/* Main layout */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <Sidebar />

                {/* PAGE CONTENT */}
                <div className="flex-1 p-2 md:p-8 overflow-y-auto bg-[#03050F]">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
