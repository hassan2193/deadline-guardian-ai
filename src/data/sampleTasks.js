// src/data/sampleTasks.js
// Seed data so the app is demo-ready immediately, no setup required.

const now = Date.now();
const hrs = (h) => new Date(now + h * 60 * 60 * 1000).toISOString();

export const sampleTasks = [
  {
    id: "t1",
    title: "Submit ML assignment",
    description: "Final report + code submission for the coursework portal.",
    deadline: hrs(5),
    importance: 5,
    effortHours: 3,
    status: "in-progress",
    category: "Academic",
    subtasks: [
      { id: "t1-1", title: "Finish model evaluation section", done: true },
      { id: "t1-2", title: "Write conclusion", done: false },
      { id: "t1-3", title: "Proofread report", done: false },
      { id: "t1-4", title: "Upload to portal", done: false },
    ],
  },
  {
    id: "t2",
    title: "Pay electricity bill",
    description: "Due before late fee kicks in.",
    deadline: hrs(20),
    importance: 3,
    effortHours: 0.2,
    status: "todo",
    category: "Bills",
    subtasks: [],
  },
  {
    id: "t3",
    title: "Prep for client interview",
    description: "Round 2 interview with the design lead.",
    deadline: hrs(30),
    importance: 5,
    effortHours: 2,
    status: "todo",
    category: "Career",
    subtasks: [
      { id: "t3-1", title: "Research company + interviewer", done: false },
      { id: "t3-2", title: "Prepare 3 portfolio stories", done: false },
      { id: "t3-3", title: "Mock interview run-through", done: false },
    ],
  },
  {
    id: "t4",
    title: "Team standup notes",
    description: "Send async update before tomorrow's sync.",
    deadline: hrs(-2),
    importance: 2,
    effortHours: 0.3,
    status: "todo",
    category: "Work",
    subtasks: [],
  },
  {
    id: "t5",
    title: "Gym session",
    description: "Leg day, keep the habit streak alive.",
    deadline: hrs(10),
    importance: 2,
    effortHours: 1,
    status: "todo",
    category: "Habit",
    subtasks: [],
  },
  {
    id: "t6",
    title: "Renew passport appointment",
    description: "Book slot before the visa deadline window closes.",
    deadline: hrs(72),
    importance: 4,
    effortHours: 0.5,
    status: "todo",
    category: "Personal",
    subtasks: [],
  },
];

export const sampleCompletionLog = [
  new Date(now - 1 * 86400000).toISOString(),
  new Date(now - 2 * 86400000).toISOString(),
  new Date(now - 3 * 86400000).toISOString(),
  new Date(now - 5 * 86400000).toISOString(),
];
