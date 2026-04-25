import React from 'react'
import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import { useAnalyticsContext } from '../context/Analytics';

export const Logs = () => {
    const { logs, chartData } = useAnalyticsContext();



    // useEffect(() => {
    //     fetchLogs();
    // }, []);

    // const fetchLogs = async () => {
    //     try {
    //         const res = await fetch("http://localhost:4000/dashboard/logs");
    //         if (!res.ok) {
    //             setError(`Error fetching logs: ${res.status}`);
    //             setLogs([]);
    //             return;
    //         }
    //         const data = await res.json();
    //         setLogs(data.logs || []);
    //         setError(null);
    //     } catch (err) {
    //         setError(`Failed to fetch logs: ${err.message}`);
    //         setLogs([]);
    //     }
    // };

    const getStatusColor = (status) => {
        // Handle numeric status codes
        if (status === 429) return 'bg-red-100 text-red-800 border border-red-300';
        if (status === 200) return 'bg-green-100 text-green-800 border border-green-300';
        // Handle string status
        if (status === 'blocked' || status === '429') return 'bg-red-100 text-red-800 border border-red-300';
        if (status === 'success' || status === '200') return 'bg-green-100 text-green-800 border border-green-300';
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    };

    // const prepareChartData = (logs) => {
    //     const map = {};

    //     logs.forEach(log => {
    //         const time = new Date(log.time).toLocaleTimeString([], {
    //             hour: "2-digit",
    //             minute: "2-digit"
    //         });

    //         map[time] = (map[time] || 0) + 1;
    //     });

    //     return Object.entries(map).map(([time, requests]) => ({
    //         time,
    //         requests
    //     }));
    // };
    // const prepareChartData = (logs) => {
    //     const map = {};

    //     logs.forEach(log => {
    //         const time = new Date(log.time).toLocaleTimeString([], {
    //             hour: "2-digit",
    //             minute: "2-digit"
    //         });

    //         if (!map[time]) {
    //             map[time] = { time, success: 0, blocked: 0 };
    //         }

    //         if (log.status === 429) {
    //             map[time].blocked++;
    //         } else {
    //             map[time].success++;
    //         }
    //     });

    //     return Object.values(map);
    // };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">📊 Requests Over Time</h2>

                {/* <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="requests"
                            stroke="#3b82f6"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer> */}
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />

                        {/* 🔵 Total Requests */}
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            name="Total Requests"
                        />

                        {/* 🔴 Blocked Requests */}
                        <Line
                            type="monotone"
                            dataKey="blocked"
                            stroke="#ef4444"
                            strokeWidth={3}
                            name="Blocked Requests"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                <div className='px-6 py-4 bg-slate-800 border-b border-slate-700'>
                    <h2 className='text-xl font-bold text-white'>Request Logs</h2>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='bg-slate-100 border-b border-slate-200'>
                                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-700'>IP Address</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-700'>Path</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-700'>Status</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold text-slate-700'>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log, i) => (
                                    <tr key={i} className={`border-b border-slate-200 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                        <td className='px-6 py-4 text-sm text-slate-700 font-mono'>{log.ip}</td>
                                        <td className='px-6 py-4 text-sm text-slate-700'>{log.path}</td>
                                        <td className='px-6 py-4 text-sm'>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                                                {log.status ? (typeof log.status === 'number' ? `${log.status}` : String(log.status).charAt(0).toUpperCase() + String(log.status).slice(1)) : 'N/A'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-slate-700'>{new Date(log.time).toLocaleTimeString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan='4' className='px-6 py-8 text-center text-slate-500'>
                                        <p className='text-lg font-medium'>No logs available</p>
                                        <p className='text-sm'>Logs will appear as requests are made</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
