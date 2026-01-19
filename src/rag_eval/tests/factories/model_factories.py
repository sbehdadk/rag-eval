from polyfactory.factories.pydantic_factory import ModelFactory
from rag_eval.domain.models import EvaluationRequest, EvaluationResult

class EvaluationRequestFactory(ModelFactory[EvaluationRequest]):
    """
    Factory for creating EvaluationRequest objects.
    Usage:
        request = EvaluationRequestFactory.build()
        request_custom = EvaluationRequestFactory.build(question="Specific Q")
    """
    __model__ = EvaluationRequest


class EvaluationResultFactory(ModelFactory[EvaluationResult]):
    """
    Factory for creating EvaluationResult objects.
    """
    __model__ = EvaluationResult