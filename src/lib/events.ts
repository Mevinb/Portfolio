export type Event = {
  id: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  event_date: string;
  location: string;
  role: string;
  /** Certificate preview, served from public/certificates. */
  image_url: string | null;
  tags: string[];
  /** Certificate PDF, served from public/certificates. */
  certificate_url: string | null;
};

// Newest first. To add an event, put its files in public/certificates and add a record here.
export const EVENTS: Event[] = [
  {
    id: '65456766-1d99-421a-b21e-9a3d1075035f',
    title: "ViCoDathon 2026 - India's AI Vibe Coding Hackathon by AB Talks",
    description: "Participated in ViCoDathon 2026, India's AI Vibe Coding Hackathon by AB Talks, showcasing creativity and problem-solving by building impactful solutions with AI tools.",
    event_date: '2026-08-14',
    location: 'AB Talks, India',
    role: 'Participant',
    image_url: '/certificates/vicodathon-2026-abtalks.webp',
    tags: ['Hackathon', 'AI', 'Vibe Coding', 'AB Talks'],
    certificate_url: '/certificates/vicodathon-2026-abtalks.pdf',
  },
  {
    id: 'd06a8267-e8d1-48fd-a887-0db287a53339',
    title: 'ADSSSC 2026 International Conference on AI Driven Solutions for Sustainable Smart Cities',
    description: 'Volunteered in organizing and coordinating operations for the international conference at SCET.',
    event_date: '2026-04-09',
    location: 'Sahrdaya College of Engineering & Technology, Thrissur',
    role: 'Volunteer',
    image_url: '/certificates/adsssc-2026.webp',
    tags: ['Smart Cities', 'AI Conference', 'Volunteering', 'SCET', 'College'],
    certificate_url: '/certificates/adsssc-2026-volunteer.pdf',
  },
  {
    id: 'aadef818-3c8c-47a7-a568-4fe88265a27a',
    title: 'Building the Future with STEM: Introduction to STEM & Ideathon - IEEE SIGHT',
    description: 'Participated in the STEM workshop by Inker Robotics CEO Amith Raman and the Ideathon, organized by IEEE Research and Development Society (SIGHT) with Thrissur Management Association.',
    event_date: '2026-03-10',
    location: 'IEEE Sahrdaya SB / Thrissur Management Association, Thrissur',
    role: 'Participant',
    image_url: '/certificates/ieee-sight-stem-ideathon-2026.webp',
    tags: ['IEEE', 'STEM', 'Ideathon', 'Workshop'],
    certificate_url: '/certificates/ieee-sight-stem-ideathon-2026.pdf',
  },
  {
    id: 'ffd0e86c-bb84-4611-9774-f9150e6a8146',
    title: 'ICSET 9th Edition - Agentic AI Building Blocks using Amazon Bedrock Workshop',
    description: 'Attended a hands-on workshop on Agentic AI Building Blocks using Amazon Bedrock by ICT Academy of Kerala in association with AWS, as part of ICSET 9th Edition.',
    event_date: '2026-01-13',
    location: 'Adlux Convention Centre, Angamaly, Ernakulam',
    role: 'Participant',
    image_url: '/certificates/icset-9-agentic-ai-aws-workshop.webp',
    tags: ['Workshop', 'AWS', 'Agentic AI', 'ICT Academy of Kerala'],
    certificate_url: '/certificates/icset-9-agentic-ai-aws-workshop.pdf',
  },
  {
    id: '106cb5af-9ac3-4338-ae50-4acec6bf8168',
    title: 'AI Awareness & Foundation - Dell & Intel AI for Future Workforce',
    description: 'Completed foundational AI program conducted by Dell India and Intel International Government Affairs Group.',
    event_date: '2025-04-30',
    location: 'Dell Technologies & Intel / SCET',
    role: 'Certified',
    image_url: '/certificates/ai-foundation.webp',
    tags: ['Artificial Intelligence', 'Dell', 'Intel', 'AI Foundation'],
    certificate_url: '/certificates/ai-foundation-dell-intel.pdf',
  },
  {
    id: '836f992a-4da1-43fb-a5e7-1789ea3b1e3d',
    title: 'Tech Trivia - NDLI Club SCET',
    description: 'Participated in the competitive technology trivia event organized by NDLI Club.',
    event_date: '2024-10-26',
    location: 'NDLI Club, SCET',
    role: 'Participant',
    image_url: '/certificates/tech-trivia.webp',
    tags: ['Tech Trivia', 'NDLI', 'Competition'],
    certificate_url: '/certificates/ndli-tech-trivia.pdf',
  },
  {
    id: 'ddec4ca5-977b-486b-8c6d-9e1cf1eb0654',
    title: 'EXPOS - TechxInfinia 2024',
    description: 'Technical showcase and innovation exposition conducted at IEEE Sahrdaya International Summit.',
    event_date: '2024-09-29',
    location: 'IEEE Sahrdaya SB / Computer Society',
    role: 'Participant',
    image_url: '/certificates/techx-expos.webp',
    tags: ['IEEE Computer Society', 'EXPOS', 'Summit'],
    certificate_url: '/certificates/techx-infinia-expos.pdf',
  },
  {
    id: '88f23bb8-fac0-4bf7-b303-42e8ba57f0b9',
    title: 'FLUT-DRIVE Workshop - TechxInfinia 2024',
    description: 'Hands-on engineering workshop conducted as part of TechxInfinia International Summit 24.',
    event_date: '2024-09-29',
    location: 'IEEE Sahrdaya SB & GADS',
    role: 'Participant',
    image_url: '/certificates/techx-flut-drive.webp',
    tags: ['IEEE', 'FLUT-DRIVE', 'Workshop', 'GADS'],
    certificate_url: '/certificates/techx-infinia-flut-drive.pdf',
  },
];
