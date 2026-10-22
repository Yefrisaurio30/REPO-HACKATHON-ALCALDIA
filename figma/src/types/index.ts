export type VerificationStatus = "verified" | "unverified" | "demo"
export type ActivityStatus = "upcoming" | "finished" | "demo"

export interface Service {
  id: string
  name: string
  description: string
  category: string
  modality: "Presencial" | "Virtual" | "Híbrida" | "Telefónica"
  audience: string
  contact?: string
  sourceUrl?: string
  sourceLabel: string
  consultedAt: string
  status: VerificationStatus
}

export interface Activity {
  id: string
  name: string
  description: string
  category: string
  organizer: string
  date: string
  time: string
  location: string
  requirements?: string
  sourceLabel: string
  sourceUrl?: string
  participationUrl?: string
  status: ActivityStatus
}
