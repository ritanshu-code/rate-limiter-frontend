import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { BASE_URL } from "../utils/config";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);

    // 🔥 initial fetch
    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, []);

    useEffect(() => {
        if (logs.length > 0) {
            setChartData(groupLogsByMinute(logs));
        }
    }, [logs]);

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${BASE_URL}/dashboard/logs`);
            if (!res.ok) {
                setError(`Error fetching logs: ${res.status}`);
                setLogs([]);
                return;
            }
            const data = await res.json();
            setLogs(data.logs || []);
            setError(null);
        } catch (err) {
            setError(`Failed to fetch logs: ${err.message}`);
            setLogs([]);
        }
    };


    const fetchStats = async () => {
        try {
            const res = await fetch(`${BASE_URL}/dashboard/stats`);
            if (!res.ok) {
                setError(`Error fetching stats: ${res.status}`);
                setStats(null);
                return;
            }
            const data = await res.json();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(`Failed to fetch stats: ${err.message}`);
            setStats(null);
        }
    };

    // const groupLogsByMinute = (logs) => {
    //     const map = {};

    //     logs.forEach((log) => {
    //         const time = new Date(log.time).toLocaleTimeString([], {
    //             hour: "2-digit",
    //             minute: "2-digit",
    //         });

    //         map[time] = (map[time] || 0) + 1;
    //     });

    //     return Object.entries(map).map(([time, requests]) => ({
    //         time,
    //         requests,
    //     }));
    // };

    // 🔥 SOCKET REAL-TIME

    const groupLogsByMinute = (logs) => {
        const map = {};

        logs.forEach((log) => {
            const time = new Date(log.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            if (!map[time]) {
                map[time] = {
                    time,
                    total: 0,
                    blocked: 0,
                };
            }

            map[time].total += 1;

            if (log.status === 429) {
                map[time].blocked += 1;
            }
        });

        return Object.values(map);
    };

    useEffect(() => {
        socket.on("new_log", (log) => {
            

            // update logs
            setLogs(prev => {
                const updated = [log, ...prev];

                return updated
                    .slice(0, 100)
                    .sort((a, b) => b.time - a.time);
            });

            // update stats
            setStats((prev) => {
                if (!prev) return prev;

                const newTotal = prev.totalRequests + 1;
                const isBlocked = log.status === 429;

                const newBlocked = isBlocked
                    ? prev.blockedRequests + 1
                    : prev.blockedRequests;

                const newSuccess = newTotal - newBlocked;

                const newPercentage =
                    newTotal === 0 ? 0 : (newBlocked / newTotal) * 100;

                return {
                    ...prev,
                    totalRequests: newTotal,
                    blockedRequests: newBlocked,
                    successRequests: newSuccess,
                    blockedPercentage: newPercentage,
                };
            });
        });

        return () => {
            socket.off("new_log");
        };
    }, []);

    useEffect(() => {
        if (logs.length > 0) {
            const grouped = groupLogsByMinute(logs);
            setChartData(grouped);
        }
    }, [logs]);

    return (
        <AnalyticsContext.Provider value={{ logs, stats, chartData, error }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalyticsContext = () => useContext(AnalyticsContext);