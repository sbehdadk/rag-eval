# RAG-Eval Project Context

> **Note**: For communication principles, see [CLAUDE.md](CLAUDE.md)

## Project Overview

RAG-Eval is a Retrieval-Augmented Generation (RAG) evaluation tool that uses OpenAI's API to assess RAG interactions. It evaluates whether answers are faithful to provided context (detecting hallucinations) and relevant to questions.

## Essential Commands

### Build & Setup
- `make pre-build` - Install dependencies using uv
- `uv sync --frozen` - Install exact dependency versions from lock file

### Running
- `make run` - Execute the evaluation script
- `make start` - Start FastAPI dev server on port 8000 with auto-reload
- `make test` - Run all tests in `src/rag_eval/tests`
- `pytest src/rag_eval/tests -k test_name` - Run a specific test by name
- `make lint` - Check code style and formatting with Ruff

### Docker
- `make build-docker` - Build Docker image
- `make run-docker` - Run containerized app
- `make docker-compose-up` - Start full stack via docker-compose
- `make docker-compose-down` - Stop docker-compose stack

### Development Environment
- Python 3.13+ required
- Uses `uv` as package manager (faster than pip, manages Python versions)
- FastAPI for HTTP API
- OpenAI API for LLM evaluation

## Architecture

### Layered Architecture (Ports & Adapters)

The codebase follows a clean architecture with four layers:

1. **Domain Layer** (`src/rag_eval/domain/`)
   - `models.py`: Core data structures (EvaluationRequest, EvaluationResult)
   - `ports.py`: Protocol/interface for evaluators (EvaluatorPort)
   - Contains business logic rules (e.g., overall_verdict computed field)

2. **Application Layer** (`src/rag_eval/application/`)
   - `evaluation_service.py`: Business use cases
   - Validates inputs (question/answer/context must not be empty)
   - Depends on domain ports, not concrete implementations
   - Orchestrates workflow

3. **Adapters Layer** (`src/rag_eval/adapters/`)
   - `openai_evaluator.py`: Concrete implementation of EvaluatorPort
   - Calls OpenAI's gpt-4o-mini with structured output parsing
   - System prompt: "You are an expert evaluator for RAG systems"
   - Returns: faithfulness_score, faithfulness_reasoning, relevance_score, relevance_reasoning

4. **HTTP Layer** (`src/rag_eval/main.py`)
   - FastAPI application with root endpoint (`GET /`)
   - Evaluation endpoint (`POST /evaluate`)
   - Dependency injection: AsyncOpenAI client scoped to request lifetime
   - Uses `yield` in dependency for clean resource management

### Key Design Patterns

- **Dependency Injection**: FastAPI's Depends() injects AsyncOpenAI client with proper lifecycle
- **Ports & Adapters**: EvaluatorPort protocol allows swapping OpenAI with other evaluators
- **Async-First**: All operations are async (AsyncOpenAI, async endpoints, async tests)
- **Structured Output**: Uses OpenAI's response_format parameter with Pydantic model for type-safe results

### Data Flow

```
HTTP Request (EvaluationRequest)
    → FastAPI endpoint
    → EvaluationService.evaluate()
    → OpenAIAdapter.evaluate()
    → OpenAI API (gpt-4o-mini)
    → EvaluationResult (with computed overall_verdict field)
    → HTTP Response
```

## Testing

- Framework: pytest + pytest-asyncio for async test support
- Mocking: pytest-mock for fixtures
- Factories: polyfactory for test data generation (EvaluationRequestFactory)
- Fixtures defined in `src/rag_eval/tests/conftest.py`
- Test coverage tracked in CI/CD (uses pytest-cov)

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/ci.yml`)

1. **Lint Job**: Checks code style with Ruff
2. **Test Job**: Runs pytest with coverage, checks dependencies with pip-audit
3. **Build Job**: Builds Docker image with layer caching, scans with Trivy
4. **Security Job**: Additional Trivy scan on main branch with SARIF output

### Deployment (`.github/workflows/cd.yml`)

- Triggered by successful CI on main branch or manual workflow_dispatch
- Supports staging and production environments
- Uses GitHub Container Registry (ghcr.io)

## Environment Variables

- `OPENAI_API_KEY`: Required for OpenAI API calls (loaded from .env via dotenv)
- `PYTHON_VERSION`: Set to 3.13

## Code Quality Standards

- **Linter**: Ruff with line length 88
- **Import sorting**: Enabled (isort rules)
- **Disabled rules**: E501 (line too long - handled by formatter)
- **Quote style**: Double quotes
- **Selected rules**: E, W, F, I, B, C4, UP (see pyproject.toml for details)

## Common Development Tasks

### Adding a New Evaluator
1. Create new class in `adapters/` implementing EvaluatorPort
2. Add async evaluate() method matching the protocol signature
3. Update main.py endpoint to optionally use new adapter
4. Add unit tests with mocked dependencies
5. Update conftest.py if new fixtures needed

### Running Tests with Coverage
```bash
uv run pytest --cov=rag_eval --cov-report=html
# Open htmlcov/index.html to view coverage report
```

### Debugging Async Code
- Use pytest-asyncio mark: `@pytest.mark.asyncio`
- Mock AsyncOpenAI client in tests using pytest-mock
- Check conftest.py for mock_openai_client fixture setup

### Local OpenAI API Calls
Requires OPENAI_API_KEY in .env file. The endpoint makes real API calls in dev mode—be mindful of costs when testing.
