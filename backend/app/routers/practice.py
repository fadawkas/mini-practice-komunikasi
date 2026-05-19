from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Session as SessionModel, Submission
from app.schemas import (
    PracticeStartRequest,
    PracticeStartResponse,
    PracticeSubmitRequest,
    PracticeSubmitResponse,
)
from app.services.openrouter_service import (
    generate_bad_communication,
    evaluate_answer,
)

router = APIRouter(prefix="/api/practice", tags=["practice"])


@router.post("/start", response_model=PracticeStartResponse)
async def start_practice(req: PracticeStartRequest, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(
        SessionModel.code == req.session_code,
        SessionModel.is_active == True,
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found or inactive")

    bad_example = await generate_bad_communication()

    submission = Submission(
        session_id=session.id,
        participant_name=req.participant_name,
        bad_communication_example=bad_example,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return PracticeStartResponse(
        submission_id=submission.id,
        bad_communication_example=bad_example,
    )


@router.post("/submit", response_model=PracticeSubmitResponse)
async def submit_practice(req: PracticeSubmitRequest, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == req.submission_id).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    if submission.participant_answer is not None:
        raise HTTPException(status_code=400, detail="Submission already evaluated")

    submission.participant_answer = req.participant_answer
    db.commit()

    evaluation = await evaluate_answer(
        submission.bad_communication_example,
        req.participant_answer,
    )

    submission.score_clarity = evaluation["score_clarity"]
    submission.score_completeness = evaluation["score_completeness"]
    submission.score_tone = evaluation["score_tone"]
    submission.score_actionability = evaluation["score_actionability"]
    submission.total_score = evaluation["total_score"]
    submission.feedback = evaluation["feedback"]
    db.commit()
    db.refresh(submission)

    return PracticeSubmitResponse(
        total_score=submission.total_score,
        score_clarity=submission.score_clarity,
        score_completeness=submission.score_completeness,
        score_tone=submission.score_tone,
        score_actionability=submission.score_actionability,
        feedback=submission.feedback,
    )