import { useEffect, useState } from "react";
import API from "../api/api";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ FETCH + REALTIME
  useEffect(() => {
    fetchNotifications();

    const handleNotification = (data) => {
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  // ✅ FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      // 🔥 instant UI update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      await API.put("/notifications/read");
    } catch (err) {
      console.error("Error marking notifications:", err);
    }
  };

  // ✅ HANDLE CLICK
  const handleClick = (n) => {
    if (!n.meta) return;

    if (n.meta?.requestId) {
      navigate(`/maintenance/${n.meta.requestId}`);
    } else if (n.meta?.leaseId) {
      navigate(`/chat`);
    } else if (n.meta?.paymentId) {
      navigate(`/payments`);
    }
  };

  // ❗ FIX: backend uses "read" not "isRead"
  const unread = notifications.filter((n) => !n.read).length;

  // ✅ STYLE
  const getTypeStyle = (type) => {
    switch (type) {
      case "CHAT_MESSAGE":
        return "border-l-4 border-blue-500";
      case "PAYMENT_SUCCESS":
        return "border-l-4 border-green-500";
      case "MAINTENANCE_CREATED":
      case "MAINTENANCE_UPDATED":
        return "border-l-4 border-yellow-500";
      case "PROPERTY_UPDATE":
        return "border-l-4 border-purple-500";
      default:
        return "";
    }
  };

  return (
    <div className="relative">
      {/* 🔔 ICON */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) markAllAsRead();
        }}
        className="relative"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border z-50 max-h-[400px] overflow-y-auto">
          <div className="p-3 border-b font-semibold sticky top-0 bg-white">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                  !n.read ? "bg-gray-100" : ""
                } ${getTypeStyle(n.type)}`}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-gray-500">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
