from dotenv import load_dotenv
from openai import AsyncOpenAI
from rag_eval.domain.models import EvaluationResult

load_dotenv()


class OpenAIAdapter:
    def __init__(self, client: AsyncOpenAI):
        self.client = client

    async def evaluate(self, question, answer, context) -> EvaluationResult:
        completion = await self.client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert evaluator for RAG systems.",
                },
                {
                    "role": "user",
                    "content": f"""
                        Evaluate this RAG interaction:

                        Context: {context}
                        Question: {question}
                        Answer: {answer}

                        Task: Check for hallucinations and relevance(relevance means that the answer is relevant to the question,
                        regardless of whether the facts are true or not).
                        """,
                },
            ],
            response_format=EvaluationResult,
            temperature=0.0,
        )

        return completion.choices[0].message.parsed
