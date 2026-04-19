import { useEffect, useState } from "react";
import API from "../api/api";
import { Bell } from "lucide-react";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data);
  };

  const markAsRead = async () => {
    await API.put("/notifications/read");
    fetchNotifications();
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* 🔔 ICON */}
      <button
        onClick={() => {
          setOpen(!open);
          markAsRead();
        }}
        className="relative"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border z-50">
          <div className="p-3 border-b font-semibold">Notifications</div>

          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 border-b text-sm ${
                  !n.read ? "bg-gray-100" : ""
                }`}
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
