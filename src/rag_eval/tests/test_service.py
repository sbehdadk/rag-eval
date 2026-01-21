from rag_eval.tests.factories.model_factories import EvaluationRequestFactory
from rag_eval.application.evaluation_service import EvaluationService
from rag_eval.adapters.openai_evaluator import OpenAIAdapter
import pytest
from openai import AsyncOpenAI

class TestEvaluationService:
    
    # test evaluate method with invalid inputs
    @pytest.mark.parametrize(
        "question, answer, context",
        [
            pytest.param(None, "it's great", "cities are great", id="none quesetion"),
            pytest.param("What is the capital of France?", "", "Paris is the capital of France", id="correct answer"),
            pytest.param("What is the capital of France?", "London", "", id="wrong answer"),   
        ]
    )

    @pytest.mark.asyncio
    async def test_evaluate_service_invalid_inputs(
        self, 
        question: str,
        answer: str,
        context: str,
        mock_openai_client: AsyncOpenAI,
    ):
        openai_adapter = OpenAIAdapter(client=mock_openai_client)
        service = EvaluationService(evaluator=openai_adapter)
        with pytest.raises(ValueError):
            request = EvaluationRequestFactory.build(question=question, answer=answer, context=context)
            result = await service.evaluate(request.question, request.answer, request.context)
            assert result

    # test evaluate method with valid inputs
    @pytest.mark.parametrize(
        "question, answer, context",
        [
            pytest.param("Tehran", "it's great", "cities are great", id="none quesetion"),
            pytest.param("What is the capital of Iran?", "  Tehran", "Tehran is the capital of Iran", id="correct answer"),
            pytest.param("What is a nice beach of Iran?", "Kish", "Kish is a nice beach of Iran", id="correct answer"),   
        ]
    )

    @pytest.mark.asyncio
    async def test_evaluate_service_valid_inputs(
        self, 
        question: str,
        answer: str,
        context: str,
        mock_openai_client: AsyncOpenAI,
    ):
        openai_adapter = OpenAIAdapter(client=mock_openai_client)
        service = EvaluationService(evaluator=openai_adapter)
        request = EvaluationRequestFactory.build(question=question, answer=answer, context=context)
        result = await service.evaluate(request.question, request.answer, request.context)
        assert result    