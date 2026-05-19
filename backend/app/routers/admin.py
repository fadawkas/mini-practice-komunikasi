from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import Submission
from app.schemas import SubmissionResponse, RankingResponse, TopThreeResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/submissions", response_model=list[SubmissionResponse])
def get_submissions(db: Session = Depends(get_db)):
    submissions = (
        db.query(Submission)
        .filter(Submission.total_score.isnot(None))
        .order_by(desc(Submission.total_score), Submission.created_at)
        .all()
    )
    return submissions


@router.get("/ranking", response_model=list[RankingResponse])
def get_ranking(db: Session = Depends(get_db)):
    submissions = (
        db.query(Submission)
        .filter(Submission.total_score.isnot(None))
        .order_by(desc(Submission.total_score), Submission.created_at)
        .all()
    )
    result = []
    for i, s in enumerate(submissions, start=1):
        result.append(RankingResponse(
            rank=i,
            participant_name=s.participant_name,
            total_score=s.total_score,
            score_clarity=s.score_clarity,
            score_completeness=s.score_completeness,
            score_tone=s.score_tone,
            score_actionability=s.score_actionability,
            feedback=s.feedback,
            participant_answer=s.participant_answer,
            bad_communication_example=s.bad_communication_example,
            created_at=s.created_at,
        ))
    return result


@router.get("/top-three", response_model=list[TopThreeResponse])
def get_top_three(db: Session = Depends(get_db)):
    submissions = (
        db.query(Submission)
        .filter(Submission.total_score.isnot(None))
        .order_by(desc(Submission.total_score), Submission.created_at)
        .limit(3)
        .all()
    )
    result = []
    for i, s in enumerate(submissions, start=1):
        result.append(TopThreeResponse(
            rank=i,
            participant_name=s.participant_name,
            total_score=s.total_score,
        ))
    return result


@router.delete("/submissions")
def reset_submissions(db: Session = Depends(get_db)):
    count = db.query(Submission).delete()
    db.commit()
    return {"message": f"Deleted {count} submissions"}