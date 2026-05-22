import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface StartResponse {
  submission_id: number
  bad_communication_example: string
}

export interface SubmitResponse {
  total_score: number
  score_clarity: number
  score_completeness: number
  score_tone: number
  score_actionability: number
  feedback: string
}

export interface Submission {
  id: number
  participant_name: string
  bad_communication_example: string
  participant_answer: string | null
  score_clarity: number | null
  score_completeness: number | null
  score_tone: number | null
  score_actionability: number | null
  total_score: number | null
  feedback: string | null
  created_at: string | null
}

export interface Ranking {
  rank: number
  participant_name: string
  total_score: number
  score_clarity: number
  score_completeness: number
  score_tone: number
  score_actionability: number
  feedback: string | null
  participant_answer: string | null
  bad_communication_example: string
  created_at: string | null
}

export interface TopThree {
  rank: number
  participant_name: string
  total_score: number
}

export async function startPractice(sessionCode: string, participantName: string): Promise<StartResponse> {
  const res = await api.post<StartResponse>('/practice/start', {
    session_code: sessionCode,
    participant_name: participantName,
  })
  return res.data
}

export async function submitPractice(submissionId: number, answer: string): Promise<SubmitResponse> {
  const res = await api.post<SubmitResponse>('/practice/submit', {
    submission_id: submissionId,
    participant_answer: answer,
  })
  return res.data
}

export async function getRanking(): Promise<Ranking[]> {
  const res = await api.get<Ranking[]>('/admin/ranking')
  return res.data
}

export async function getTopThree(): Promise<TopThree[]> {
  const res = await api.get<TopThree[]>('/admin/top-three')
  return res.data
}

export async function getSubmissions(): Promise<Submission[]> {
  const res = await api.get<Submission[]>('/admin/submissions')
  return res.data
}

export async function resetSubmissions(): Promise<void> {
  await api.delete('/admin/submissions')
}