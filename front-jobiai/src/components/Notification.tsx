import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { notificationAPI } from "../api";
import { X } from "lucide-react";

interface Notification {
    _id: string;
    message: string;
    link: string;
    read: boolean;
}

interface NotificationComponentProps {
    visible: boolean;
    onClose: () => void;
    onNotificationsUpdate: (notifications: Notification[]) => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
                                                                         visible,
                                                                         onClose,
                                                                         onNotificationsUpdate
                                                                     }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Load existing notifications
        const fetchNotifications = async () => {
            try {
                const res = await notificationAPI.fetchMy();
                setNotifications(res.data);
                onNotificationsUpdate(res.data);
            } catch (error) {
                console.error("Error retrieving notifications:", error);
            }
        };

        if (visible) {
            fetchNotifications();
        }

        // Socket connection
        const socket = io("http://localhost:5000", {
            auth: { token: localStorage.getItem("token") || "" },
        });

        socket.on("new-notification", (data: Notification) => {
            setNotifications((prev) => {
                const updated = [...prev, data];
                onNotificationsUpdate(updated);
                return updated;
            });
        });

        // Cleanup
        return () => {
            socket.disconnect();
        };
    }, [visible, onNotificationsUpdate]);

    const handleMarkAsRead = async (id: string, link: string) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications((prev) => {
                const updated = prev.map((notif) =>
                    notif._id === id ? { ...notif, read: true } : notif
                );
                onNotificationsUpdate(updated);
                return updated;
            });

            // Navigate to the notification link
            window.location.href = link;
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleRemoveNotification = async (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            await notificationAPI.delete(id);
            setNotifications((prev) => {
                const updated = prev.filter((notif) => notif._id !== id);
                onNotificationsUpdate(updated);
                return updated;
            });
        } catch (error) {
            console.error("Error removing notification:", error);
        }
    };

    if (!visible) return null;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="absolute right-0 top-8 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 transform transition-all duration-200 ease-in-out">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="flex items-center">
                    {unreadCount > 0 && (
                        <span className="mr-2 px-2 py-0.5 bg-white text-indigo-700 text-xs font-bold rounded-full">
              {unreadCount} new
            </span>
                    )}
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-indigo-800 p-1 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                        <p className="text-gray-500 mb-2">No notifications</p>
                        <p className="text-gray-400 text-sm">New notifications will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`group relative p-4 hover:bg-gray-50 transition-colors duration-150 ${
                                    notification.read ? "bg-white" : "bg-indigo-50"
                                }`}
                            >
                                <div className="flex justify-between">
                                    <p className={`text-sm mb-2 pr-6 ${notification.read ? "text-gray-700" : "text-gray-900 font-medium"}`}>
                                        {notification.message}
                                    </p>
                                    <button
                                        onClick={(e) => handleRemoveNotification(notification._id, e)}
                                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id, notification.link)}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                                    >
                                        See details
                                    </button>
                                    {!notification.read && (
                                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationComponent;