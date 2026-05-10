export type Exercise = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string;
};

export const EXERCISES: Exercise[] = [
  // Chest
  { id: "ex_001", name: "Bench Press", muscle_group: "chest", equipment: "barbell", difficulty: "intermediate", instructions: "Lie flat on bench, grip bar slightly wider than shoulder width, lower to chest and press up." },
  { id: "ex_002", name: "Push Up", muscle_group: "chest", equipment: "bodyweight", difficulty: "beginner", instructions: "Hands shoulder width apart, lower chest to floor, push back up keeping core tight." },
  { id: "ex_003", name: "Incline Dumbbell Press", muscle_group: "chest", equipment: "dumbbell", difficulty: "intermediate", instructions: "Set bench to 30–45°, press dumbbells from chest level up and slightly together." },
  { id: "ex_004", name: "Cable Fly", muscle_group: "chest", equipment: "cable", difficulty: "intermediate", instructions: "Stand between cables set high, bring handles together in arc motion in front of chest." },
  { id: "ex_005", name: "Dips", muscle_group: "chest", equipment: "bodyweight", difficulty: "intermediate", instructions: "Lean forward on parallel bars, lower until shoulders below elbows, push back up." },

  // Back
  { id: "ex_006", name: "Pull Up", muscle_group: "back", equipment: "bodyweight", difficulty: "intermediate", instructions: "Hang from bar with overhand grip, pull until chin clears bar, lower with control." },
  { id: "ex_007", name: "Barbell Row", muscle_group: "back", equipment: "barbell", difficulty: "intermediate", instructions: "Hinge at hips, pull bar to lower chest, squeeze shoulder blades together at top." },
  { id: "ex_008", name: "Lat Pulldown", muscle_group: "back", equipment: "cable", difficulty: "beginner", instructions: "Pull bar to upper chest, lean back slightly, squeeze lats at bottom of movement." },
  { id: "ex_009", name: "Seated Cable Row", muscle_group: "back", equipment: "cable", difficulty: "beginner", instructions: "Pull handle to abdomen, keep chest up, squeeze shoulder blades at end of movement." },
  { id: "ex_010", name: "Deadlift", muscle_group: "back", equipment: "barbell", difficulty: "advanced", instructions: "Bar over mid-foot, hinge and grip, drive through floor keeping back flat, lock out at top." },

  // Shoulders
  { id: "ex_011", name: "Overhead Press", muscle_group: "shoulders", equipment: "barbell", difficulty: "intermediate", instructions: "Press bar from shoulder height overhead, fully extend arms, lower with control." },
  { id: "ex_012", name: "Lateral Raise", muscle_group: "shoulders", equipment: "dumbbell", difficulty: "beginner", instructions: "Raise dumbbells to shoulder height with slight elbow bend, lower slowly." },
  { id: "ex_013", name: "Front Raise", muscle_group: "shoulders", equipment: "dumbbell", difficulty: "beginner", instructions: "Raise dumbbell in front to shoulder height, alternate arms, keep slight elbow bend." },
  { id: "ex_014", name: "Face Pull", muscle_group: "shoulders", equipment: "cable", difficulty: "beginner", instructions: "Pull rope to face level, elbows high, focus on rear delt contraction." },

  // Arms
  { id: "ex_015", name: "Barbell Curl", muscle_group: "arms", equipment: "barbell", difficulty: "beginner", instructions: "Curl bar from hip to shoulder height, keep elbows fixed at sides." },
  { id: "ex_016", name: "Tricep Pushdown", muscle_group: "arms", equipment: "cable", difficulty: "beginner", instructions: "Push rope or bar down until arms fully extended, keep elbows tucked." },
  { id: "ex_017", name: "Hammer Curl", muscle_group: "arms", equipment: "dumbbell", difficulty: "beginner", instructions: "Curl dumbbells with neutral grip (palms facing each other) to shoulder height." },
  { id: "ex_018", name: "Skull Crusher", muscle_group: "arms", equipment: "barbell", difficulty: "intermediate", instructions: "Lower bar toward forehead by bending elbows, extend back up keeping upper arms still." },

  // Legs
  { id: "ex_019", name: "Squat", muscle_group: "legs", equipment: "barbell", difficulty: "intermediate", instructions: "Bar on upper back, squat until thighs parallel to floor, drive through heels to stand." },
  { id: "ex_020", name: "Leg Press", muscle_group: "legs", equipment: "machine", difficulty: "beginner", instructions: "Feet shoulder width on platform, lower until 90° at knee, press back up without locking out." },
  { id: "ex_021", name: "Romanian Deadlift", muscle_group: "legs", equipment: "barbell", difficulty: "intermediate", instructions: "Hinge at hips with soft knees, lower bar along legs feeling hamstring stretch, return to standing." },
  { id: "ex_022", name: "Leg Curl", muscle_group: "legs", equipment: "machine", difficulty: "beginner", instructions: "Curl weight toward glutes, hold briefly at top, lower with control." },
  { id: "ex_023", name: "Walking Lunge", muscle_group: "legs", equipment: "dumbbell", difficulty: "beginner", instructions: "Step forward into lunge, lower back knee toward floor, drive front foot to stand and repeat." },
  { id: "ex_024", name: "Calf Raise", muscle_group: "legs", equipment: "machine", difficulty: "beginner", instructions: "Rise onto toes as high as possible, pause, lower with control for full stretch." },

  // Core
  { id: "ex_025", name: "Plank", muscle_group: "core", equipment: "bodyweight", difficulty: "beginner", instructions: "Hold straight body position on forearms and toes, keep hips level, breathe steadily." },
  { id: "ex_026", name: "Cable Crunch", muscle_group: "core", equipment: "cable", difficulty: "beginner", instructions: "Kneel at cable, crunch torso down toward thighs, round lower back at bottom." },
  { id: "ex_027", name: "Hanging Leg Raise", muscle_group: "core", equipment: "bodyweight", difficulty: "intermediate", instructions: "Hang from bar, raise legs to 90° keeping them straight, lower with control." },
  { id: "ex_028", name: "Ab Wheel Rollout", muscle_group: "core", equipment: "bodyweight", difficulty: "advanced", instructions: "On knees, roll wheel out until body is near parallel to floor, pull back using core." },

  // Glutes
  { id: "ex_029", name: "Hip Thrust", muscle_group: "glutes", equipment: "barbell", difficulty: "intermediate", instructions: "Shoulders on bench, bar across hips, drive hips to ceiling squeezing glutes at top." },
  { id: "ex_030", name: "Glute Kickback", muscle_group: "glutes", equipment: "cable", difficulty: "beginner", instructions: "On all fours at cable, kick leg back and up, squeeze glute at top." },

  // Cardio
  { id: "ex_031", name: "Treadmill Run", muscle_group: "cardio", equipment: "machine", difficulty: "beginner", instructions: "Maintain steady pace, land mid-foot, keep shoulders relaxed and arms swinging naturally." },
  { id: "ex_032", name: "Jump Rope", muscle_group: "cardio", equipment: "bodyweight", difficulty: "beginner", instructions: "Keep elbows close to body, jump just high enough for rope to pass under feet." },
  { id: "ex_033", name: "Rowing Machine", muscle_group: "cardio", equipment: "machine", difficulty: "beginner", instructions: "Drive with legs first, lean back slightly, pull handle to lower chest, reverse in same order." },
  { id: "ex_034", name: "Burpee", muscle_group: "cardio", equipment: "bodyweight", difficulty: "intermediate", instructions: "From standing, drop to push up position, perform push up, jump feet to hands, jump up with arms overhead." },
];

export const MUSCLE_GROUPS = [
  "chest", "back", "shoulders", "arms", "legs", "glutes", "core", "cardio",
] as const;

export function getExercisesByMuscleGroup(group: string): Exercise[] {
  return EXERCISES.filter((e) => e.muscle_group === group);
}

export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase();
  return EXERCISES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.muscle_group.toLowerCase().includes(q) ||
      e.equipment.toLowerCase().includes(q)
  );
}
