# Base stage
FROM python:3.13-slim-bookworm AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    # Point to where we will install our venv
    VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Builder stage
FROM base AS builder


COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

COPY src /app/src
COPY README.md .

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


# RUNTIME STAGE
FROM base AS runtime

RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY --from=builder --chown=appuser:appuser /app/.venv /app/.venv
COPY --from=builder --chown=appuser:appuser /app/src /app/src

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src"

USER appuser

# 💡 OBSERVABILITY: Healthcheck
# Docker/K8s poll this command to see if the app is "alive".
# If it fails 3 times, the orchestration system (Swarm/K8s) kills & restarts it.
# In a real app, use `curl -f http://localhost:8000/health || exit 1`
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); result = s.connect_ex(('localhost', 8000)); exit(result)"

# 💡 METADATA: Labels
# Useful for inventory management tools.
LABEL org.opencontainers.image.title="RAG Eval Service" \
    org.opencontainers.image.description="Evaluation service for RAG pipelines" \
    org.opencontainers.image.version="1.0.0"

CMD ["uvicorn", "rag_eval.main:app", "--host", "0.0.0.0", "--port", "8000"]
