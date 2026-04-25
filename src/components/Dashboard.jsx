import React from 'react'
import { useState, useEffect } from 'react';
import { Logs } from './Logs';
import { useAnalyticsContext } from '../context/Analytics';

export const Dashboard = () => {
    const {stats, error} = useAnalyticsContext();

    // useEffect(() => {
    //     fetchStats();
    // }, []);

    // useEffect(() => {
    //     console.log("Setting up socket listeners...");

    //     socket.on("connect", () => {
    //         console.log("✅ Connected FRONTEND:", socket.id);
    //     });

    //     socket.on("new_log", (log) => {
    //         console.log("🔥 New log received:", log);
    //     });

    //     socket.on("connect_error", (err) => {
    //         console.error("❌ Socket error:", err.message);
    //     });

    //     return () => {
    //         socket.off("connect");
    //         socket.off("new_log");
    //         socket.off("connect_error");
    //     };
    // }, []);

    // const fetchStats = async () => {
    //     try {
    //         const res = await fetch("http://localhost:4000/dashboard/stats");
    //         if (!res.ok) {
    //             setError(`Error fetching stats: ${res.status}`);
    //             setStats(null);
    //             return;
    //         }
    //         const data = await res.json();
    //         setStats(data);
    //         setError(null);
    //     } catch (err) {
    //         setError(`Failed to fetch stats: ${err.message}`);
    //         setStats(null);
    //     }
    // };

    console.log(stats);



    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8'>
            {/* Header */}
            <div className='mb-8 flex justify-between items-center'>
                <div>
                    <h1 className='text-5xl font-bold text-white mb-2'>🚀 API Gateway Dashboard</h1>
                    <p className='text-slate-400 text-lg'>Real-time rate limiting analytics</p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className='mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg'>
                    <p className='text-red-200 font-semibold'>⚠️ Error</p>
                    <p className='text-red-100 text-sm'>{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                    <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white'>
                        <div className='text-sm font-semibold opacity-90 mb-2'>Total Requests</div>
                        <div className='text-4xl font-bold'>{stats.totalRequests}</div>
                        <div className='text-xs opacity-75 mt-2'>All requests processed</div>
                    </div>

                    <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white'>
                        <div className='text-sm font-semibold opacity-90 mb-2'>Successful</div>
                        <div className='text-4xl font-bold'>{stats.successRequests}</div>
                        <div className='text-xs opacity-75 mt-2'>Allowed requests</div>
                    </div>

                    <div className='bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white'>
                        <div className='text-sm font-semibold opacity-90 mb-2'>Blocked</div>
                        <div className='text-4xl font-bold'>{stats.blockedRequests}</div>
                        <div className='text-xs opacity-75 mt-2'>Rate limited requests</div>
                    </div>

                    <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white'>
                        <div className='text-sm font-semibold opacity-90 mb-2'>Block Rate</div>
                        <div className='text-4xl font-bold'>{stats.blockedPercentage?.toFixed(2)}%</div>
                        <div className='text-xs opacity-75 mt-2'>Percentage blocked</div>
                    </div>
                </div>
            )}

            {/* Logs Table */}
            <Logs />
        </div>
    )
}
