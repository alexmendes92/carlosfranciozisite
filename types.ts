export enum Tone {
  PROFESSIONAL = 'Profissional/Cirúrgico',
  EMPATHETIC = 'Empático/Acolhedor',
  EDUCATIONAL = 'Didático/Anatômico',
  MOTIVATIONAL = 'Motivacional/Recuperação',
  DIRECT = 'Direto/Objetivo',
}

export enum PostCategory {
  PATHOLOGY = 'Doenças e Dores',
  SURGERY = 'Cirurgias e Procedimentos',
  SPORTS = 'Esporte e Prevenção',
  REHAB = 'Reabilitação e Pós-Op',
  LIFESTYLE = 'Qualidade de Vida',
  MYTHS = 'Mitos da Ortopedia',
}

export enum PostFormat {
  FEED = 'Feed (Quadrado/Retrato)',
  STORY = 'Story (Vertical 9:16)',
}

export enum ArticleLength {
  SHORT = 'Curto (500-800 palavras)',
  MEDIUM = 'Médio (800-1200 palavras)',
  LONG = 'Longo/Completo (1500+ palavras)',
}

export enum TargetAudience {
  PATIENT = 'Paciente Leigo',
  ATHLETE = 'Atleta/Esportista',
  ELDERLY = 'Idosos/Terceira Idade',
  PARENTS = 'Pais (Ortopedia Pediátrica)',
}

export enum PatientProfile {
  CHILD = 'Criança (Pediátrico)',
  ADULT = 'Adulto',
  ELDERLY = 'Idoso',
  ATHLETE = 'Atleta de Alta Performance',
  SEDENTARY = 'Sedentário',
}

export interface GeneratedPostContent {
  headline: string;
  caption: string;
  hashtags: string[];
  imagePromptDescription: string;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  metaDescription: string;
  contentHtml: string;
  wordCount: number;
  seoSuggestions: string[];
  keywordsUsed: string[];
}

// --- NEW COMPLEX INFOGRAPHIC TYPES ---

export interface AnatomyPoint {
  label: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface MechanismStep {
  title: string;
  description: string;
  iconName: string;
}

export interface SymptomCard {
  title: string;
  description: string;
  iconName: string;
}

export interface TreatmentOption {
  type: 'conservador' | 'cirurgico';
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  indication: string;
}

export interface RehabPhase {
  phase: string;
  title: string;
  items: string[];
}

export interface GeneratedInfographic {
  topic: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImagePrompt: string;
  anatomy: {
    intro: string;
    imagePrompt: string;
    points: AnatomyPoint[];
  };
  mechanism: {
    title: string;
    intro: string;
    steps: MechanismStep[];
  };
  symptoms: {
    intro: string;
    items: SymptomCard[];
  };
  treatment: {
    intro: string;
    options: TreatmentOption[];
  };
  rehab: {
    intro: string;
    phases: RehabPhase[];
  };
  footerText: string;
}

export interface InfographicResult {
  data: GeneratedInfographic;
  heroImageUrl?: string | null;
  anatomyImageUrl?: string | null;
}

// --- CONVERSION MODULE TYPES ---

export type ConversionFormat = 'REELS' | 'DEEP_ARTICLE';

export interface ConversionState {
  pathology: string; // Ex: Artrose, Condromalácia
  objection: string; // Ex: Medo da dor, Tempo de recuperação
  format: ConversionFormat;
}

export interface ReelsScriptLine {
  time: string; // "0-5s"
  visual: string; // "Dr. apontando para o joelho"
  audio: string; // "Você acha que cirurgia é o fim?"
  textOverlay: string; // "MITO #1"
}

export interface ConversionResult {
  format: ConversionFormat;
  title: string;
  // Content for Article
  articleContent?: string; 
  // Content for Reels
  script?: ReelsScriptLine[];
  caption?: string; // For reels caption
  CTA: string;
}

// --- SCHEDULING MODULE TYPES ---

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type AppointmentType = 'first_visit' | 'return' | 'post_op' | 'infiltration';

export interface Appointment {
  id: string;
  patientName: string;
  date: string; // ISO string
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  phone: string;
  notes?: string;
}

export interface MessageTemplateState {
  appointment: Appointment;
  tone: Tone;
  customNote?: string;
}

// -------------------------------------

export interface PostState {
  topic: string;
  category: PostCategory;
  tone: Tone;
  format: PostFormat; // New: Feed or Story
  customInstructions: string;
  uploadedImage?: string | null; // New: Base64 string for Vision
}

export interface ArticleState {
  topic: string;
  keywords: string;
  length: ArticleLength;
  audience: TargetAudience;
  tone: Tone;
}

export interface InfographicState {
  diagnosis: string;
  patientProfile: PatientProfile;
  tone: Tone;
  notes: string;
}

export interface GeneratedResult {
  id: string; // New: For History
  date: string; // New: For History
  content: GeneratedPostContent | null;
  imageUrl: string | null;
  isCustomImage: boolean; // New: To know if we should regenerate or not
}