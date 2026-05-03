const ACTIVE = {
  name: "Bali", country: "Indonesia",
  dates: "May 15–22", duration: "7 days", daysLeft: 3,
  budget: { spent: 1420, total: 3000 },
  weather: "28°C ☀️",
  cover: ["#c17b4e","#8a4e20"],
};
const UPCOMING = [
  { name: "Kyoto", country: "Japan", dates: "Jul 8–15", duration: "7 days", countdown: "50 days", budget: { spent: 0, total: 2500 }, weather: "22°C ⛅", cover: ["#4e7ec1","#2a4e8a"] },
  { name: "Santorini", country: "Greece", dates: "Sep 2–10", duration: "8 days", countdown: "115 days", budget: { spent: 200, total: 4000 }, weather: "29°C ☀️", cover: ["#4ea0c1","#1a608a"] },
];
const PAST = [
  { name: "Paris", country: "France", dates: "Feb 2026", duration: "7 days", budget: { spent: 2800, total: 3000 }, cover: ["#8c6e9a","#5a3a6e"] },
  { name: "New York", country: "USA", dates: "Dec 2025", duration: "8 days", budget: { spent: 1950, total: 2200 }, cover: ["#6e8c9a","#3a5a6e"] },
];
const DAYS = [
  { label: "Day 1", date: "May 15", items: [
    { time: "14:00", type: "flight", title: "Arrive Ngurah Rai Airport", note: "Pickup arranged" },
    { time: "16:00", type: "hotel", title: "Check-in — Alaya Resort Ubud", note: "Pool villa" },
    { time: "19:30", type: "food", title: "Dinner at Locavore", note: "Reservation ✓" },
  ]},
  { label: "Day 2", date: "May 16", items: [
    { time: "08:00", type: "sight", title: "Tegallalang Rice Terraces", note: "Sunrise walk" },
    { time: "11:00", type: "sight", title: "Ubud Monkey Forest" },
    { time: "14:00", type: "food", title: "Warung Babi Guling Lunch" },
    { time: "17:00", type: "activity", title: "Ubud Market & Art Walk" },
  ]},
  { label: "Day 3", date: "May 17", items: [
    { time: "09:00", type: "sight", title: "Tanah Lot Temple" },
    { time: "13:00", type: "activity", title: "Seminyak Beach", note: "Sunbathing" },
    { time: "19:00", type: "food", title: "La Lucciola Sunset Dinner", note: "Beachfront" },
  ]},
];
Object.assign(window, { ACTIVE, UPCOMING, PAST, DAYS });
