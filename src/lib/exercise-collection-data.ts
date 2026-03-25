export type Category =
  | "strength"
  | "mobility"
  | "balance"
  | "coordination"
  | "cardio";

export type Format = "group" | "individual" | "pairs";

export type BodyFocus = "upper body" | "lower body" | "core" | "full body";

export interface ExerciseData {
  name: string;
  categories: Category[];
  format: Format;
  bodyFocus: BodyFocus;
  duration: string;
  description: string;
  variations?: string[];
  surfRelevance: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  strength: "bg-orange-100 text-orange-700 border-orange-200",
  mobility: "bg-purple-100 text-purple-700 border-purple-200",
  balance: "bg-sky-100 text-sky-700 border-sky-200",
  coordination: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cardio: "bg-rose-100 text-rose-700 border-rose-200",
};

export const FORMAT_COLORS: Record<Format, string> = {
  group: "bg-indigo-100 text-indigo-700 border-indigo-200",
  individual: "bg-slate-100 text-slate-600 border-slate-200",
  pairs: "bg-teal-100 text-teal-700 border-teal-200",
};

export const BODY_FOCUS_COLORS: Record<BodyFocus, string> = {
  "upper body": "bg-amber-50 text-amber-700 border-amber-200",
  "lower body": "bg-cyan-50 text-cyan-700 border-cyan-200",
  core: "bg-pink-50 text-pink-700 border-pink-200",
  "full body": "bg-violet-50 text-violet-700 border-violet-200",
};

export const exercises: ExerciseData[] = [
  {
    name: "Animal Walk",
    categories: ["mobility", "coordination"],
    format: "group",
    bodyFocus: "full body",
    duration: "5 min",
    description:
      "Discuss with the group one animal, how it would walk, then everyone walks it across the sand. Focus on quality of movement, not speed.",
    variations: [
      "Crabwalk: on all 4, chest towards the sky, keep buttocks locked so there is a straight surface from knees to shoulders",
      "Bear crawl: hands and feet on the ground, knees off the sand, move opposite hand and foot together",
      "Frog jumps: deep squat, hands between feet, explode forward and land soft",
      "Inchworm: hands walk forward to plank, then feet walk to hands",
      "Gorilla shuffle: deep squat, swing arms side to side and shuffle laterally",
    ],
    surfRelevance:
      "Builds the crawling and push patterns used in pop-ups and paddling",
  },
  {
    name: "90-90 Hip Switch",
    categories: ["mobility"],
    format: "group",
    bodyFocus: "lower body",
    duration: "3 min",
    description:
      "Go in small groups of 3. Sit on the sand with legs in 90-90 position (both knees bent at 90 degrees). Rotate both knees to the left, then to the right. Then stand up on your knees. Partners watch and correct each other's form.",
    variations: [
      "Add an arm reach overhead during each rotation",
      "Close eyes for a proprioception challenge",
      "Hold each side for 3 breaths before switching",
    ],
    surfRelevance:
      "Hip rotation is the foundation for bottom turns and cutbacks on the wave",
  },
  {
    name: "Pop-Up Races",
    categories: ["strength", "coordination"],
    format: "pairs",
    bodyFocus: "full body",
    duration: "5 min",
    description:
      "Lie flat on the sand face down. On the whistle, pop up to surf stance as fast as possible. Partner checks foot placement and hand position. First to a clean stance wins.",
    variations: [
      "Add a 3-step run after the pop-up",
      "Do it on soft sand for extra difficulty",
      "Coach calls 'regular' or 'goofy' mid-pop-up",
    ],
    surfRelevance:
      "Directly trains the chest-to-feet explosive movement for taking off on a wave",
  },
  {
    name: "Surf Stance Balance Duel",
    categories: ["balance"],
    format: "pairs",
    bodyFocus: "lower body",
    duration: "4 min",
    description:
      "Both surfers stand in surf stance, low and stable. Try to unbalance your partner using gentle palm pushes on shoulders only. Feet must stay planted. First to move a foot loses.",
    variations: [
      "Stand on one leg instead of surf stance",
      "Close eyes between pushes",
      "Do it on a line drawn in the sand for a narrower base",
    ],
    surfRelevance:
      "Trains the low-center-of-gravity balance needed for riding whitewater and making turns",
  },
  {
    name: "Paddle-Up Relay",
    categories: ["strength", "cardio"],
    format: "group",
    bodyFocus: "upper body",
    duration: "5 min",
    description:
      "Teams of 3. Lie flat on your belly and paddle your arms in the air 10 times with good form. Then sprint to the next teammate and tag them. Team that finishes first wins.",
    variations: [
      "Add a pop-up at the end before tagging",
      "Increase paddle count to 15 or 20",
      "Paddle with fists closed to build grip strength",
    ],
    surfRelevance:
      "Builds paddle endurance and arm speed for catching waves before they pass",
  },
  {
    name: "Crocodile Twist Walk",
    categories: ["mobility"],
    format: "individual",
    bodyFocus: "full body",
    duration: "3 min",
    description:
      "Lunge forward, plant both hands inside the front foot, then twist and reach one arm to the sky. Hold briefly, then step into the next lunge. Alternate sides walking down the beach.",
    variations: [
      "Hold each twist for 3 deep breaths",
      "Add a push-up between each lunge",
      "Keep the back knee off the ground for extra challenge",
    ],
    surfRelevance:
      "Opens the thoracic spine and hips for rotation during turns on the wave",
  },
  {
    name: "Superhero Hold Contest",
    categories: ["strength"],
    format: "individual",
    bodyFocus: "core",
    duration: "3 min",
    description:
      "Lie face down on the sand. Lift arms and legs off the ground like Superman flying. Hold as long as possible. Coach times everyone. Try to beat your own record each session.",
    variations: [
      "Add small arm flutter like a swimming motion",
      "Rock gently side to side while holding",
      "Alternate lifting right arm + left leg, then switch",
    ],
    surfRelevance:
      "Strengthens the back and core muscles used to arch during paddling and duck dives",
  },
  {
    name: "Beach Plank Tag",
    categories: ["strength", "cardio"],
    format: "group",
    bodyFocus: "core",
    duration: "4 min",
    description:
      "Everyone holds a plank position in a circle. One 'tagger' crawls around in bear crawl and taps ankles. If your ankle is tapped, you become the tagger. Drop your hips and you're out.",
    variations: [
      "Side plank variation: everyone holds side plank",
      "Add 3 mountain climbers between each tag attempt",
      "Two taggers at once for bigger groups",
    ],
    surfRelevance:
      "Core endurance keeps you stable on the board when waves push and pull underneath",
  },
  {
    name: "Wave Jump Drill",
    categories: ["balance", "cardio"],
    format: "group",
    bodyFocus: "lower body",
    duration: "4 min",
    description:
      "Draw a line in the sand to represent a wave. Jump side to side over it, landing in surf stance each time. Coach calls tempo changes: slow, fast, freeze!",
    variations: [
      "Jump forward and backward instead of side to side",
      "Single leg hops only",
      "Eyes closed on the 'freeze' command",
    ],
    surfRelevance:
      "Trains quick reactive balance for adjusting weight on the board when a wave shifts",
  },
  {
    name: "Seaweed Stretch Circle",
    categories: ["mobility"],
    format: "group",
    bodyFocus: "full body",
    duration: "4 min",
    description:
      "Stand in a circle. One person calls a body part (shoulders, hips, ankles, wrists). Everyone moves that joint slowly in big circles, swaying like seaweed in the current. Rotate who calls.",
    variations: [
      "Add partner-assisted stretches for shoulders and hamstrings",
      "Combine two body parts at once (e.g., hips and wrists)",
      "Move in slow motion, then double speed on coach's call",
    ],
    surfRelevance:
      "Full-body mobility warm-up prevents injury and prepares joints for paddling, popping up, and turning",
  },
  {
    name: "Turtle Roll Practice",
    categories: ["coordination", "balance"],
    format: "individual",
    bodyFocus: "upper body",
    duration: "4 min",
    description:
      "Lie on your back on the sand, arms holding an imaginary board above you. On the whistle, roll to your belly, grab the 'board', and start paddling. Roll back when the whistle blows again.",
    variations: [
      "Speed rounds: roll as fast as possible",
      "Add a pop-up after rolling to belly",
      "Use a real boogie board for added realism",
    ],
    surfRelevance:
      "Teaches the turtle roll technique for getting through whitewater without losing the board",
  },
  {
    name: "Sand Sprint Pop-Up",
    categories: ["strength", "cardio", "coordination"],
    format: "individual",
    bodyFocus: "full body",
    duration: "4 min",
    description:
      "Sprint 10 meters on the sand, drop to your belly, do one clean pop-up to surf stance, then sprint back. Repeat 3 times. Coach checks stance quality — clean form counts more than speed.",
    variations: [
      "Coach calls 'regular' or 'goofy' direction mid-sprint",
      "Sprint backward to the start",
      "Add a squat hold for 3 seconds after each pop-up",
    ],
    surfRelevance:
      "Combines cardio fitness with pop-up mechanics under fatigue, simulating real surf conditions",
  },
  {
    name: "Hip Mobility Castle Builder",
    categories: ["mobility"],
    format: "group",
    bodyFocus: "lower body",
    duration: "8 min",
    description:
      "Start with 1 minute of slow 90-90 hip switches to perfect the movement. Then sit in a circle with legs in 90-90 position. Scoop handfuls of sand and use the hip rotation motion to move and deposit sand on the opposite side to build a castle. Coach shouts \"Pat your castle!\" — kids scoop sand from knee position, place it, and pat their castle down. Coach shouts \"Check the castle!\" — kids do a double action, checking their left partner's castle then their own castle on the right. Prettiest castle wins!",
    variations: [
      "Eyes closed scooping for a proprioception challenge",
      "Race to build the tallest castle instead of prettiest",
      "Winner chooses a partner to work with in the water during surf time",
    ],
    surfRelevance:
      "Hip rotation through play — same movement pattern used in bottom turns and cutbacks on the wave",
  },
  {
    name: "Duck Duck Goose — Animal Moves Edition",
    categories: ["coordination", "cardio", "mobility"],
    format: "group",
    bodyFocus: "full body",
    duration: "8 min",
    description:
      "Classic Duck Duck Goose with animal exercise twists! Sit in a circle. The \"It\" player walks around tapping heads saying their chosen animal movement. Instead of saying \"Goose\", they call out an animal exercise: \"Bunny!\", \"Frog!\", \"Cobra!\", \"Peeing Dog!\", \"Butterfly!\", or \"Owl!\". Everyone does the animal movement while the two players chase each other around the circle twice using those same animal moves. If tagged, the \"It\" person goes again and picks the next animal.",
    variations: [
      "Kids invent new animals and movements each round",
      "Combine two animals in one round (e.g. Frog-Cobra combo)",
      "Slow-motion round where both chasers must move in slow-mo",
    ],
    surfRelevance:
      "Builds full-body mobility and coordination through play while keeping energy and group focus high between drills",
  },
];
