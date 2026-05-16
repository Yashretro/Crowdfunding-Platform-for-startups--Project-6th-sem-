export interface DefaultProject {
  id: string;
  ownerId?: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  category: string;
  daysLeft: number;
  updates?: Array<{ date: string; content: string }>;
}

export const defaultProjects: DefaultProject[] = [
  {
    id: 'proj-1',
    title: 'SolarGrid Mini',
    description: 'Portable solar charging system for remote teams and travel kits.',
    goal: 50000,
    raised: 32000,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    category: 'Clean Tech',
    daysLeft: 18,
  },
  {
    id: 'proj-2',
    title: 'HealthNest AI',
    description: 'AI-assisted health dashboard that helps clinics triage routine patient queries.',
    goal: 80000,
    raised: 50000,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1e?auto=format&fit=crop&w=1200&q=80',
    category: 'Health Tech',
    daysLeft: 25,
  },
  {
    id: 'proj-3',
    title: 'CampusLoop',
    description: 'Student community platform for events, mentorship, and project collaboration.',
    goal: 25000,
    raised: 12000,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    category: 'EdTech',
    daysLeft: 31,
  },
  {
    id: 'proj-4',
    title: 'FoodFlow',
    description: 'Smart food logistics platform that reduces restaurant and grocery waste.',
    goal: 60000,
    raised: 41000,
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1200&q=80',
    category: 'Food Tech',
    daysLeft: 14,
  },
  {
    id: 'proj-5',
    title: 'MuseMint',
    description: 'Creator economy toolkit for artists to monetize and manage audience engagement.',
    goal: 70000,
    raised: 28000,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    category: 'Entertainment',
    daysLeft: 22,
  },
  {
    id: 'proj-6',
    title: 'GreenNest Homes',
    description: 'Affordable sustainable housing concept focused on modular eco-friendly construction.',
    goal: 90000,
    raised: 54000,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    category: 'Finance',
    daysLeft: 19,
  },
];