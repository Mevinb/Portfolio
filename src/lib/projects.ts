import type { ProjectArchitecture } from '../app/components/Blueprint';

export type ProjectCategory = 'AI vision' | 'AI systems' | 'Security' | 'Web systems';

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  tags: string[];
  url: string;
  featured?: boolean;
  architecture?: ProjectArchitecture;
};

export const PROJECTS: Project[] = [
  { id: 'reactor', title: 'Reactorv4', category: 'AI vision', tagline: 'ComfyUI face restoration node suite', description: 'Identity-preserving facial restoration workflows for Stable Diffusion, InsightFace, and custom ComfyUI graph execution.', tags: ['Python', 'PyTorch', 'ComfyUI'], url: 'https://github.com/Mevinb/Reactorv4', featured: true, architecture: { projectId: 'Reactorv4', projectTitle: 'Reactorv4 Face Restoration Pipeline', pipelineDescription: 'Identity preservation and facial restoration pipeline', nodes: [{ id: '1', name: 'Identity source', type: 'input', description: 'Loads the target face image.', tech: 'OpenCV / PIL' }, { id: '2', name: 'Feature extractor', type: 'process', description: 'Computes facial identity embeddings.', tech: 'InsightFace', latency: '18ms' }, { id: '3', name: 'Diffusion sampler', type: 'model', description: 'Applies identity conditioning during sampling.', tech: 'PyTorch', vram: '8.2 GB' }, { id: '4', name: 'Restored output', type: 'output', description: 'Exports the enhanced composite.', tech: 'ComfyUI' }], connections: [{ from: '1', to: '2' }, { from: '2', to: '3' }, { from: '3', to: '4' }] } },
  { id: 'story', title: 'Story Teller', category: 'AI vision', tagline: 'Multi-agent writing engine', description: 'Long-form fiction system with planning agents, live SSE generation, semantic story memory, and pluggable model backends.', tags: ['Python', 'Flask', 'FAISS'], url: 'https://github.com/Mevinb/story-teller-', featured: true },
  { id: 'mediahub', title: 'MediaHub', category: 'AI vision', tagline: 'GPU-accelerated desktop media library', description: 'AI-powered media management app with face recognition via RetinaFace & ArcFace, libmpv playback, SQLite FTS5 search, duplicate detection, and non-destructive image editing.', tags: ['Python', 'PyQt6', 'SQLAlchemy'], url: 'https://github.com/Mevinb/mediaplayer', featured: true },
  { id: 'sniper', title: 'sn1per-win', category: 'Security', tagline: 'Windows reconnaissance scanner', description: 'PowerShell-oriented reconnaissance and audit utility for host discovery, service checks, and structured reports.', tags: ['PowerShell', 'Windows API', 'Networking'], url: 'https://github.com/Mevinb/sn1per-win', featured: true },
  { id: 'cloudx', title: 'cloudx', category: 'Web systems', tagline: 'Cloud infrastructure and LMS platform', description: 'Full-stack platform for course management, virtual labs, role permissions, and scalable content delivery.', tags: ['TypeScript', 'React', 'Node.js'], url: 'https://github.com/Mevinb/cloudx', featured: true },
  { id: 'recipe', title: 'Recipe Sharing', category: 'Web systems', tagline: 'MERN community recipe platform', description: 'Full-stack social platform for sharing and discovering recipes — user auth, ratings, comments, and React Query-powered real-time data fetching.', tags: ['React', 'Node.js', 'MongoDB'], url: 'https://github.com/Mevinb/recipe-sharing', featured: true },
  { id: 'reactor-x', title: 'Reactor-X', category: 'AI vision', tagline: 'Standalone identity-preserving face swap pipeline', description: 'Local face-swap application with detection, landmark alignment, segmentation, identity aggregation, optional restoration, occlusion recovery, and identity verification.', tags: ['Python', 'ONNX', 'Computer Vision'], url: 'https://github.com/Mevinb/Reactor-X' },
  { id: 'voicelab', title: 'voicelab', category: 'AI systems', tagline: 'Local voice conversion workbench', description: 'Gradio-based voice lab combining zero-shot voice conversion and text-to-speech engines behind a process-isolated worker architecture.', tags: ['Python', 'Gradio', 'Audio AI'], url: 'https://github.com/Mevinb/voicelab' },
  { id: 'ab-talks-hackathon', title: 'AB Talks Hackathon', category: 'Web systems', tagline: 'Event experience and participant dashboard', description: 'Polished Next.js event platform with dashboard states, guarded flows, motion design, responsive layouts, and reduced-motion support.', tags: ['Next.js', 'React 19', 'Tailwind'], url: 'https://github.com/Mevinb/AB-TALKS-HACKATHON' },
  { id: 'ark', title: 'ARK', category: 'AI systems', tagline: 'Fully local modular AI assistant', description: 'Local assistant architecture combining quantized language models, speech input and output, persistent SQLite memory, intent dispatch, and configurable personality.', tags: ['Python', 'Mistral', 'SQLite'], url: 'https://github.com/Mevinb/persona' },
  { id: 'netscan', title: 'NetScan', category: 'Security', tagline: 'Network discovery and security analysis toolkit', description: 'Network scanner with threaded port discovery, banner grabbing, log analysis, risk scoring, and structured JSON reporting.', tags: ['Python', 'Networking', 'Security'], url: 'https://github.com/Mevinb/NetScan' },
];

export const PROJECT_CATEGORIES: Array<'All' | ProjectCategory> = ['All', 'AI vision', 'AI systems', 'Security', 'Web systems'];
