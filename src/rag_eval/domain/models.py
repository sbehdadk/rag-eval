from pydantic import BaseModel, Field, computed_field

class EvaluationRequest(BaseModel):
    question: str = Field(description="The question asked.")
    answer: str = Field(description="The answer provided.")
    context: str = Field(description="The context provided.")

class EvaluationResult(BaseModel):
    faithfulness_score: int = Field(description="1 if the answer is faithful and accurate, 0 if it contains hallucinations or inaccuracies.")
    faithfulness_reasoning: str = Field(description="Concise explanation of the verdict.")
    relevance_score: int = Field(description="1 if the answer is relevant, 0 if it is not relevant.")
    relevance_reasoning: str = Field(description="Concise explanation of the verdict.")

    @computed_field
    @property
    def overall_verdict(self) -> str:
        return "Pass" if self.faithfulness_score == 1 and self.relevance_score == 1 else "Failed"