import type { Category, Participant } from '../types.js';

// Deterministic PRNG so the demo dataset looks the same on every boot,
// while the live gateway ticks still mutate it at runtime.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Krishna', 'Ishaan', 'Arjun', 'Reyansh', 'Sai',
  'Ananya', 'Diya', 'Priya', 'Saanvi', 'Aadhya', 'Myra', 'Kiara', 'Anika',
  'Rohan', 'Kabir', 'Vihaan', 'Aryan', 'Dhruv', 'Yash', 'Karthik', 'Nikhil',
  'Meera', 'Riya', 'Tanvi', 'Sneha', 'Pooja', 'Isha', 'Neha', 'Aisha',
  'Rahul', 'Varun', 'Siddharth', 'Manish', 'Abhiram', 'Tejaswini', 'Preksha', 'Preethi',
  'Santhosh', 'Benak', 'Pavani',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Iyer', 'Nair', 'Reddy', 'Rao', 'Menon',
  'Kapoor', 'Malhotra', 'Chatterjee', 'Bose', 'Pillai', 'Shetty', 'Joshi', 'Desai',
  'Agarwal', 'Bhatt', 'Mehta', 'Kulkarni', 'Patil', 'Singh', 'Chauhan', 'Rathore',
];

const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'NIT Trichy',
  'Delhi University', 'Christ University', 'VIT Vellore', 'Manipal Institute of Technology',
  'SRM Chennai', 'IIM Ahmedabad', 'Symbiosis Pune', 'Amity Noida', 'IIIT Hyderabad',
  'Loyola College Chennai', 'St. Xavier\'s Mumbai', 'Ashoka University', 'NMIMS Mumbai',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Indore', 'Chandigarh', 'Kochi',
];

const CATEGORIES: Category[] = ['Freelance', 'Sell', 'Build', 'Teach', 'Perform', 'Content'];

const BADGE_POOL = [
  'Early Bird', 'Streak Master', 'First ₹1k', 'First ₹10k', 'Comeback Kid',
  'Team Player', 'Weekend Warrior', 'Consistency King', 'Viral Hustle',
];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateParticipants(count = 42, seed = 20260101): Participant[] {
  const rng = mulberry32(seed);
  const usedNames = new Set<string>();
  const participants: Participant[] = [];

  for (let i = 0; i < count; i++) {
    let name = '';
    do {
      name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    const category = pick(rng, CATEGORIES);
    // Give each participant a "skill" multiplier so the spread feels earned, not flat-random.
    const skill = 0.4 + rng() * 2.6;
    const dailyEarnings: number[] = [];
    for (let d = 0; d < 30; d++) {
      const offDay = rng() < 0.18;
      const base = offDay ? 0 : rng() * 900 * skill;
      const spike = !offDay && rng() > 0.85 ? rng() * 4000 * skill : 0;
      dailyEarnings.push(Math.round(base + spike));
    }

    let streakDays = 0;
    for (let d = 29; d >= 0; d--) {
      if (dailyEarnings[d] > 0) streakDays++;
      else break;
    }

    const badgeCount = 1 + Math.floor(rng() * 3);
    const badges = Array.from(
      new Set(Array.from({ length: badgeCount }, () => pick(rng, BADGE_POOL))),
    );

    participants.push({
      id: `p_${i.toString(36)}_${Math.floor(rng() * 1e6).toString(36)}`,
      name,
      college: pick(rng, COLLEGES),
      city: pick(rng, CITIES),
      category,
      priorEarnings: Math.round(rng() * 8000 * skill),
      dailyEarnings,
      streakDays,
      badges,
    });
  }

  return participants;
}
