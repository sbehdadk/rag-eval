from rag_eval.domain.ports import EvaluatorPort
from rag_eval.domain.models import EvaluationResult

class EvaluationService:
    def __init__(self, evaluator: EvaluatorPort):
        self.evaluator = evaluator

    async def evaluate(self, question: str, answer: str, context: str) -> EvaluationResult:
        if not question or not answer or not context:
            raise ValueError("Question, answer, and context must not be empty.")
        return await self.evaluator.evaluate(question, answer, context)
