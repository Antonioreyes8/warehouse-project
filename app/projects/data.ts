export type Media = {
  type: "image" | "video";
  src: string;
};

export type Collaborator = {
  name: string;
  role: string;
  category?: "Performers" | "Organizers" | "Preparation" | "Media" | "Other";
};

export type Project = {
  slug: string;
  title: string;
  date: string;
  img: string; // Poster
  description: string;
  causeSection?: { text: string };
  collaboratorsSection?: Collaborator[];
  recapSection?: Media[]; // can stay empty if using dynamic fetch
};

export const projects: Project[] = [
  {
    slug: "project-I",
    title: "I.",
    date: "September 25'",
    img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster1.jpg",
    description: "Details about Project I",
    causeSection: { text: "Project I focused on bringing awareness to our community and engaging participants in meaningful activities." },
    collaboratorsSection: [
      { name: "Alice Johnson", role: "Performers" },
      { name: "Frank Green", role: "Performers" },
      { name: "Charlie Lee", role: "Organizers" },
      { name: "Dana White", role: "Preparation" },
      { name: "Bob Smith", role: "Media" },
      // ... continue filling 10 per category
    ],
    recapSection: [], // <-- will populate dynamically from Supabase
  },
  {
    slug: "project-II",
    title: "II.",
    date: "January 26'",
    img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/poster2.png",
    description: "Details about Project II",
    causeSection: { text: "Project II brought together local performers for a charity event." },
    collaboratorsSection: [
      { name: "Alice Johnson", role: "Performers" },
      { name: "Charlie Lee", role: "Organizers" },
      { name: "Dana White", role: "Preparation" },
      { name: "Bob Smith", role: "Media" },
    ],
    recapSection: [], // <-- dynamic fetch
  },
  {
    slug: "project-III",
    title: "III.",
    date: "May 26'",
    img: "https://sshdocgpnnptiftcccei.supabase.co/storage/v1/object/public/posters/black_img.jpg",
    description: "Project III focused on community outreach and workshops.",
    causeSection: { text: "Project III focused on community outreach and workshops." },
    collaboratorsSection: [
      { name: "Liam Scott", role: "Preparation" },
      { name: "Mia Turner", role: "Media" },
    ],
    recapSection: [], // <-- dynamic fetch
  },
];