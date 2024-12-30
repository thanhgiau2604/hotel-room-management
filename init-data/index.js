import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore instance
const db = admin.firestore();

// Function to generate a random timestamp (today or yesterday)
const getRandomTimestamp = () => {
  const now = new Date();
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  const randomDate =
    Math.random() > 0.5 ? now : new Date(now.setDate(now.getDate() - 1)); // Today or Yesterday
  randomDate.setHours(randomHours, randomMinutes, 0, 0);
  return admin.firestore.Timestamp.fromDate(randomDate);
};

// Data to add
const roomsData = [
  { name: "101", room_type: "fan", status: "available" },
  { name: "102", room_type: "ac", status: "available" },
  { name: "103", room_type: "ac", status: "being_used" },
  { name: "201", room_type: "ac", status: "being_used" },
  { name: "202", room_type: "fan", status: "being_used" },
  { name: "203", room_type: "fan", status: "unavailable" },
  { name: "301", room_type: "ac", status: "available" },
  { name: "302", room_type: "fan", status: "available" },
  { name: "303", room_type: "ac", status: "unavailable" },
];

const addRoomsToFirestore = async () => {
  const collectionRef = db.collection("rooms");

  for (let i = 0; i < roomsData.length; i++) {
    const room = roomsData[i];
    const now = admin.firestore.Timestamp.now();

    try {
      await collectionRef.add({
        ...room,
        sequence: i + 1, // Add sequence field to track order
        start_at: room.status === "being_used" ? getRandomTimestamp() : null,
        created_at: now,
        updated_at: now,
      });
    } catch (error) {
      console.error(`Error adding document ${room.name}:`, error);
    }
  }
};

// Execute the function
addRoomsToFirestore();
