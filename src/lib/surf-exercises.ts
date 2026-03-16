export interface Exercise {
  name: string;
  description: string;
  category: "mobility" | "strength";
  videoUrl?: string;
}

export const mobilityExercises: Exercise[] = [
  {
    name: "Hip Circles",
    description:
      "Stand on one leg, draw big circles with the other knee to loosen hips — five each direction.",
    category: "mobility",
    videoUrl: "https://www.facebook.com/Rapturecamps/videos/1439071064290953/",
  },
  {
    name: "Crocodile Twist",
    description:
      "Lunge forward, plant both hands inside the front foot, twist and reach one arm to the sky.",
    category: "mobility",
    videoUrl:
      "https://www.tiktok.com/@redbullsurfing/video/7529540352924060950",
  },
  {
    name: "Cat-Cow Flow",
    description:
      "On all fours, arch the back up like a cat then drop the belly like a cow, slow and smooth.",
    category: "mobility",
  },
  {
    name: "Thread the Needle",
    description:
      "On all fours, slide one arm under the body and reach through, feeling the twist in the upper back.",
    category: "mobility",
  },
  {
    name: "Leg Swings",
    description:
      "Hold a partner's shoulder, swing one leg forward and back in a smooth rhythm — ten each side.",
    category: "mobility",
  },
  {
    name: "Downward Dog to Cobra",
    description:
      "Push hips high into a V-shape, then glide forward into cobra with chest lifted — repeat three times.",
    category: "mobility",
    videoUrl: "https://www.facebook.com/Rapturecamps/videos/1439071064290953/",
  },
  {
    name: "Ankle Circles",
    description:
      "Balance on one foot, draw slow circles with the other ankle in both directions.",
    category: "mobility",
  },
  {
    name: "Seated Butterfly",
    description:
      "Sit with feet together, gently press knees toward the sand, keep back tall and breathe.",
    category: "mobility",
  },
];

export const strengthExercises: Exercise[] = [
  {
    name: "Pop-Up Push-Ups",
    description:
      "Start flat on the sand, push up and spring to surf stance, then back down — five reps.",
    category: "strength",
    videoUrl: "https://www.instagram.com/reel/C0325b5yTKS/",
  },
  {
    name: "Superhero Hold",
    description:
      "Lie face down, lift arms and legs off the sand and hold for five seconds, then relax.",
    category: "strength",
    videoUrl: "https://www.instagram.com/reel/DQcm4DsEhuA/",
  },
  {
    name: "Beach Plank",
    description:
      "Hold a plank position on the sand, keep the body straight like a surfboard for ten seconds.",
    category: "strength",
  },
  {
    name: "Surf Squats",
    description:
      "Squat down in surf stance, touch the sand, stand tall — repeat five times.",
    category: "strength",
  },
  {
    name: "Sand Burpees",
    description:
      "Drop to the sand, push up, jump to feet in surf stance — three clean reps.",
    category: "strength",
    videoUrl: "https://www.instagram.com/reel/C0325b5yTKS/",
  },
  {
    name: "Paddle Arms",
    description:
      "Lie on belly, alternate arm reaches forward like paddling, keep chest lifted — ten each side.",
    category: "strength",
  },
  {
    name: "Side Plank Balance",
    description:
      "Hold a side plank, reach the top arm to the sky, hold five seconds each side.",
    category: "strength",
  },
  {
    name: "Bear Crawl",
    description:
      "Crawl forward on hands and feet with knees off the sand for ten meters and back.",
    category: "strength",
  },
];

/** Pick `count` random exercises from a category without repeats. */
export function pickExercises(
  count: number,
  category: "mobility" | "strength",
): Exercise[] {
  const pool = category === "mobility" ? mobilityExercises : strengthExercises;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
