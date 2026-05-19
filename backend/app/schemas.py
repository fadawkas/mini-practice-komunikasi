from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PracticeStartRequest(BaseModel):
    session_code: str
    participant_name: str


class PracticeStartResponse(BaseModel):
    submission_id: int
    bad_communication_example: str


class PracticeSubmitRequest(BaseModel):
    submission_id: int
    participant_answer: str


class PracticeSubmitResponse(BaseModel):
    total_score: int
    score_clarity: int
    score_completeness: int
    score_tone: int
    score_actionability: int
    feedback: str


class SubmissionResponse(BaseModel):
    id: int
    participant_name: str
    bad_communication_example: str
    participant_answer: Optional[str]
    score_clarity: Optional[int]
    score_completeness: Optional[int]
    score_tone: Optional[int]
    score_actionability: Optional[int]
    total_score: Optional[int]
    feedback: Optional[str]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


class RankingResponse(BaseModel):
    rank: int
    participant_name: str
    total_score: int
    score_clarity: int
    score_completeness: int
    score_tone: int
    score_actionability: int
    feedback: Optional[str]
    participant_answer: Optional[str]
    bad_communication_example: str
    created_at: Optional[datetime]


class TopThreeResponse(BaseModel):
    rank: int
    participant_name: str
    total_score: int