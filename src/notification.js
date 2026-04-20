import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";
import API from "./api/api";

const messaging = getMessaging(app);

// ✅ REQUEST PERMISSION + SAVE TOKEN
export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        // ✅ FIXED ENV
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      });

      console.log("FCM Token:", token);

      if (token) {
        const user = JSON.parse(localStorage.getItem("user"));

        // ✅ SEND USER_ID ALSO
        await API.post("/notifications/save-token", {
          token,
          user_id: user?._id,
        });
      }
    }
  } catch (err) {
    console.log("Notification error:", err);
  }
};

// ✅ FOREGROUND MESSAGE
export const listenMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);

    alert(`${payload.notification.title}\n${payload.notification.body}`);
  });
};
