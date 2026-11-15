// Landing-page content for the event. Keep these values in sync with your real event details.
export const EVENT = {
  name: 'Code-a-Nova Hackathon',
  tagline: 'Build. Innovate. Compete.',
  mode: 'Online',
  timeline: [
    { title: 'Registration opens', date: '20 November 2026' },
    { title: 'Registration closes', date: '10 December 2026' },
    { title: 'Hackathon kick-off', date: '12 December 2026' },
    { title: 'Final submission', date: '13 December 2026' },
    { title: 'Results and awards', date: '15 December 2026' },
  ],
  prizes: [
    { place: '1st Place', amount: '₹30,000' },
    { place: '2nd Place', amount: '₹20,000' },
    { place: '3rd Place', amount: '₹10,000' },
  ],
  domains: ['AI/ML', 'Web Development', 'IoT', 'Cyber Security', 'Blockchain', 'Open Innovation'],
  highlights: [
    {
      title: 'Build',
      text: 'Turn your idea into a working prototype with a team of up to five participants.',
    },
    {
      title: 'Innovate',
      text: 'Pick the domain that excites you and solve a real problem with your project.',
    },
    {
      title: 'Compete',
      text: 'Present your work to the judges and compete for the prize pool and certificates.',
    },
  ],
};

export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || '';
