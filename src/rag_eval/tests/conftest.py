import pytest
from unittest.mock import AsyncMock, MagicMock
from rag_eval.tests.factories.model_factories import EvaluationResultFactory

@pytest.fixture
def mock_openai_client():
    """
    Creates a Mock AsyncOpenAI client with pre-configured responses.
    This fixture is automatically available to any test that requests 'mock_openai_client'.
    """
    mock_client = AsyncMock()
    
    # Use Factory to create a valid response object
    result = EvaluationResultFactory.build(
        faithfulness_score=1,
        relevance_score=1
    )
    
    mock_completion = MagicMock()
    # Mock the nested response structure of OpenAI
    # choices[0].message.parsed
    mock_completion.choices = [
        MagicMock(message=MagicMock(parsed=result))
    ]
    
    # Configure the async return value
    mock_client.beta.chat.completions.parse.return_value = mock_completion
    return mock_client
