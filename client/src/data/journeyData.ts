export interface Milestone {
  id: string;
  title: string;
  location: string;
  year: string;
  position: [number, number, number];
  description: string;
  challenges?: string[];
  achievements?: string[];
  skills?: string[];
}

export const journeyMilestones: Milestone[] = [
  {
    id: "tanzania-highschool",
    title: "High School in Tanzania",
    location: "Tanzania",
    year: "Early Years",
    position: [-25, 1, -25],
    description: "Started my educational journey in Tanzania, building a foundation in academics and developing a global perspective that would shape my future endeavors.",
    achievements: [
      "Completed secondary education in Tanzania",
      "Developed strong academic foundation",
      "Gained cultural perspective and adaptability"
    ],
    skills: ["Academic Excellence", "Cultural Awareness", "Adaptability"]
  },
  {
    id: "texas-challenge",
    title: "Texas High School Challenge",
    location: "Texas, USA",
    year: "Age 16",
    position: [-15, 2, -10],
    description: "Moved to Texas at 16 for high school - a significant cultural transition that presented unexpected challenges and taught valuable lessons about resilience.",
    challenges: [
      "Major cultural adjustment at young age",
      "Academic and social adaptation difficulties",
      "Had to reassess educational path"
    ],
    achievements: [
      "Gained international experience",
      "Learned to navigate cultural differences",
      "Developed resilience and adaptability"
    ],
    skills: ["Cultural Adaptation", "Resilience", "Problem Solving"]
  },
  {
    id: "north-carolina-recovery",
    title: "GED & Community College",
    location: "North Carolina, USA",
    year: "Recovery Phase",
    position: [-5, 3.5, 5],
    description: "Pivoted to GED and community college in North Carolina, focusing on mechatronics. This period taught me that setbacks can lead to better opportunities and specialized knowledge.",
    challenges: [
      "Starting over with educational path",
      "Proving capability after setback"
    ],
    achievements: [
      "Successfully completed GED",
      "Excelled in mechatronics program",
      "Secured valuable internship experience",
      "Gained private equity exposure"
    ],
    skills: ["Mechatronics", "Engineering", "Technical Problem Solving", "Business Exposure"]
  },
  {
    id: "tanzania-business",
    title: "Building Business in Tanzania",
    location: "Tanzania",
    year: "Entrepreneurial Phase",
    position: [5, 5.5, 15],
    description: "Returned to Tanzania to build my own company, learning business operations, technology implementation, and self-teaching coding while developing real-world applications.",
    achievements: [
      "Built and operated own company",
      "Self-taught programming and development",
      "Developed business applications",
      "Gained comprehensive business operations experience"
    ],
    skills: ["Entrepreneurship", "Self-Taught Coding", "Business Operations", "Product Development", "Technology Implementation"]
  },
  {
    id: "san-francisco-ai",
    title: "AI Innovation in SF",
    location: "San Francisco, USA",
    year: "Current",
    position: [15, 8, 25],
    description: "Currently in San Francisco building full AI applications, products, and ventures. Exploring the intersection of AI technology with practical business applications and future venture opportunities.",
    achievements: [
      "Building AI-powered applications",
      "Developing AI business solutions",
      "Exploring venture opportunities",
      "Integrating tourism and technology"
    ],
    skills: ["AI Development", "Product Management", "Venture Building", "Full-Stack AI Applications", "Business Strategy"]
  }
];

export const futurePaths: Milestone[] = [
  {
    id: "hardware-manufacturing",
    title: "Hardware & Manufacturing",
    location: "Future Path",
    year: "Future",
    position: [25, 11, 45],
    description: "Potential path into hardware development, manufacturing, industrial applications, solar energy systems, and electrical engineering - building on mechatronics foundation.",
    skills: ["Hardware Development", "Manufacturing", "Industrial Systems", "Solar Energy", "Electrical Engineering"]
  },
  {
    id: "ai-data-science",
    title: "AI & Data Science Leadership",
    location: "Future Path",
    year: "Future",
    position: [35, 13, 35],
    description: "Continued expansion in AI applications, data science, analytics, and AI-enabled business solutions - leading innovation in the AI space.",
    skills: ["Advanced AI/ML", "Data Science", "AI Business Solutions", "Technology Leadership", "Innovation Management"]
  }
];
