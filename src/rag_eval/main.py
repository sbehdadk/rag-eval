import os

from fastapi import FastAPI
from fastapi.param_functions import Depends
from openai import AsyncOpenAI

from rag_eval.adapters.openai_evaluator import OpenAIAdapter
from rag_eval.application.evaluation_service import EvaluationService
from rag_eval.domain.models import EvaluationRequest, EvaluationResult

app = FastAPI()


async def get_openai_client():
    """
    Creates an AsyncOpenAI client.
    The 'yield' keyword allows us to pause execution here,
    give the client to the endpoint, and then resume execution
    when the endpoint is finished to close the connection.
    """
    client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
    try:
        yield client
    finally:
        # This ensures the connection is closed even if the request crashes
        await client.close()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/evaluate", response_model=EvaluationResult)
async def evaluate_endpoint(
    request: EvaluationRequest,
    client: AsyncOpenAI = Depends(get_openai_client),  # noqa: B008
):
    # We must use 'await' because 'evaluate' is now async
    evaluator = OpenAIAdapter(client)
    evaluation_service = EvaluationService(evaluator)
    return await evaluation_service.evaluate(
        request.question, request.answer, request.context
    )


# def main():
#     question = "How do I make carbonara?"
#     answer = "Use bacon and cream"
#     context = "Recipe: Use guanciale and eggs, no cream"
#     evaluate_endpoint(request=EvaluationRequest(question=question, answer=answer, context=context))
