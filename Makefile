# ==========================================
# 🎨 FORMATTING & STYLES
# ==========================================
# Define standard colors
BOLD   := $(shell tput bold)
RESET  := $(shell tput sgr0)
PURPLE := $(shell tput setaf 135)
BLUE   := $(shell tput setaf 39)
CYAN   := $(shell tput setaf 6)
GREEN  := $(shell tput setaf 76)
GRAY   := $(shell tput setaf 240)

# Semantic styling macros
# Usage: $(call print_header, Message)
print_header = @echo "\n$(BOLD)$(PURPLE)┏━━━ $(1) ━━━$(RESET)"
# Usage: $(call print_info, Message)
print_info   = @echo "$(GRAY)┃$(RESET) $(BLUE)ℹ$(RESET)  $(1)"
# Usage: $(call print_success, Message)
print_success= @echo "$(GRAY)┗━━━$(RESET) $(BOLD)$(GREEN)✔ $(1)$(RESET)\n"

.PHONY: help evaluate run lint k8s-deploy

help:
	@echo ""
	@echo "$(BOLD)$(PURPLE)  RAG-EVAL PROJECT$(RESET)"
	@echo "$(GRAY)  ────────────────$(RESET)"
	@echo ""
	@echo "  $(CYAN)run$(RESET)    $(GRAY)→$(RESET)  Execute the evaluation script"
	@echo "  $(CYAN)start$(RESET)  $(GRAY)→$(RESET)  Start API server (dev mode)"
	@echo "  $(CYAN)lint$(RESET)   $(GRAY)→$(RESET)  Check code style with Ruff"
	@echo ""

run:
	$(call print_header,RUNTIME)
	$(call print_info,Booting environment...)
	@uv run python -m rag_eval.main
	$(call print_success,Execution finished)

pre-build:
	$(call print_header,BUILDING IMAGE)
	$(call print_info,Building Docker image...)
	@uv sync --frozen
	$(call print_success,Build complete)

build-docker:
	$(call print_header,BUILDING IMAGE)
	$(call print_info,Building Docker image...)
	@docker build -t rag-eval -f services/rag_eval/Dockerfile .
	$(call print_success,Build complete)

run-docker:
	$(call print_header,RUNTIME)
	$(call print_info,Booting environment...)
	@docker run -it --rm --name rag-eval -v $(shell pwd)/src:/app/src -v $(shell pwd)/.env:/app/.env -p 8000:8000 rag-eval
	$(call print_success,Execution finished)

docker-compose-up:
	$(call print_header,RUNTIME)
	$(call print_info,Booting environment...)
	@docker-compose up
	$(call print_success,Execution finished)

docker-compose-down:
	$(call print_header,RUNTIME)
	$(call print_info,Booting environment...)
	@docker-compose down
	$(call print_success,Execution finished)


lint:
	$(call print_header,QUALITY CONTROL)
	$(call print_info,Running ruff checks...)
	@uv run ruff check .
	$(call print_success,Clean code confirmed)

start:
	$(call print_header,SERVER STARTUP)
	$(call print_info,Launching FastAPI on port 8000...)
	@uv run uvicorn rag_eval.main:app --reload

test:
	$(call print_header,TESTING)
	$(call print_info,Running tests...)
	@uv run pytest servicesrag_eval/tests

k8s-deploy:
	kubectl apply -f k8s/

k8s-status:
	kubectl get deployments,services,ingress -l app.kubernetes.io/name=rag-eval
