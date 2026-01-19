from typing import Protocol
from rag_eval.domain.models import EvaluationResult

class EvaluatorPort(Protocol):
    async def evaluate(self, question: str, answer: str, context: str) -> EvaluationResult: ...

