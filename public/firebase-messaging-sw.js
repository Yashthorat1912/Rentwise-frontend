importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCtIAIabu-O0KVAZK_JL5WgVj3lqnBnWs8",
  authDomain: "rentwise-78515.firebaseapp.com",
  projectId: "rentwise-78515",
  messagingSenderId: "832610726505",
  appId: "1:832610726505:web:ed042f874363b18e9ae8f8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
