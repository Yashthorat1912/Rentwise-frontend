import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import socket from "../socket";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [leaseId, setLeaseId] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const bottomRef = useRef();

  useEffect(() => {
    fetchChat();
  }, []);

  const fetchChat = async () => {
    try {
      const leaseRes = await API.get("/leases/my");
      const leaseData = leaseRes.data;

      const lease = Array.isArray(leaseData) ? leaseData[0] : leaseData;

      if (!lease || !lease._id) {
        console.log("No lease found");
        return;
      }

      setLeaseId(lease._id);

      const msgRes = await API.get(`/messages/${lease._id}`);
      setMessages(msgRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SOCKET (FIXED)
  useEffect(() => {
    if (!leaseId) return;

    socket.emit("join_room", leaseId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [leaseId]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      content: message,
      lease_id: leaseId,
      sender_id: currentUser._id,
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-2xl shadow-lg">
      <div className="bg-blue-600 text-white px-5 py-4 rounded-t-2xl">
        <h2 className="text-lg font-semibold">Conversation</h2>
        <p className="text-xs opacity-80">
          {currentUser.role === "tenant"
            ? "Chat with Landlord"
            : "Chat with Tenant"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No messages yet 👋</p>
        ) : (
          messages.map((msg, i) => {
            const isMine =
              msg.sender_id === currentUser._id ||
              msg.sender_id?._id === currentUser._id;

            return (
              <div
                key={i}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-xs text-sm shadow ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white rounded-bl-none"
                  }`}
                >
                  <p className="text-[10px] opacity-70 mb-1">
                    {isMine ? "You" : msg.sender_id?.name || "User"}
                  </p>

                  <p>{msg.content}</p>

                  <p className="text-[10px] opacity-60 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
