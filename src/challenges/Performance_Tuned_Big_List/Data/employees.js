const DEPARTMENTS = [
  "POSTAL_LIFE_INSURANCE",
  "MAIL_BOOKING",
  "MAIL_DELIVERY",
  "IPPB",
  "AADHAR",
]; 

const FIRST_NAMES = [
  "Aarav",
  "Ananya",
  "Rohan",
  "Meera",
  "Vikram",
  "Kavya",
  "Siddharth",
  "Priya",
  "Arjun",
  "Neha",
];

const LAST_NAMES = [
  "Sharma",
  "Verma",
  "Reddy",
  "Nair",
  "Patel",
  "Iyer",
  "Kapoor",
  "Joshi",
  "Kulkarni",
  "Das",
];

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateEmployees(n = 5000) {
  return Array.from({ length: n }, (_, index) => {
    const firstName = pickRandom(FIRST_NAMES);
    const lastName = pickRandom(LAST_NAMES);
    const dept = pickRandom(DEPARTMENTS);
    const salary = Math.round((45000 + Math.random() * 135000) / 500) * 500;

    return {
      id: index + 1,
      name: `${firstName} ${lastName}`,
      dept,
      salary,
    }; 
  });
}