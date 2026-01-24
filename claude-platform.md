# Platform-Deploy Project Context

> **Note**: For communication principles, see CLAUDE.md in your main template

# claude-platform.md

This file provides comprehensive guidance to Claude Code when continuing work on the rag-eval project, specifically for building the platform-deploy infrastructure automation system and career goal achievement.

---

# PART 1: PROJECT CONTEXT

## Project Overview: rag-eval

**RAG-Eval** is a Retrieval-Augmented Generation evaluation tool that uses OpenAI's API to assess RAG interactions. It evaluates whether answers are faithful to provided context (detecting hallucinations) and relevant to questions.

### Current Tech Stack
- **Language**: Python 3.13+
- **Framework**: FastAPI
- **LLM Integration**: OpenAI API
- **Containerization**: Docker
- **Package Manager**: uv
- **Testing**: pytest + pytest-asyncio
- **Code Quality**: Ruff (linting + formatting)

### Architecture (Layered - Ports & Adapters)
1. **Domain Layer**: Core models (EvaluationRequest, EvaluationResult), ports/interfaces
2. **Application Layer**: Business logic (EvaluationService)
3. **Adapters Layer**: OpenAI implementation
4. **HTTP Layer**: FastAPI endpoints

### Essential Commands
- `make pre-build` - Install dependencies
- `make run` - Execute evaluation script
- `make start` - Start FastAPI dev server (port 8000)
- `make test` - Run all tests
- `make lint` - Check code style with Ruff
- `make build-docker` - Build Docker image
- `make run-docker` - Run containerized app

---

# PART 2: CAREER CONTEXT & GOALS

## Your Profile
- **Current Role**: Senior Consultant - MLOps, DevOps & Cloud Platform Engineering at international consulting firm
- **Experience**: 4+ years (ML Engineer, Data Scientist, Cloud/DevOps roles)
- **Strengths**:
  - AWS expertise (Lambda, RDS, EC2, CDK, Terraform)
  - Docker and containerization (casual but experienced)
  - CICD pipelines (GitHub Actions, GitLab CI, Jenkins)
  - ML system design
  - Production infrastructure (serverless, event-driven)
- **Current Salary**: ~70k
- **Gap**: Zero production Kubernetes experience (critical to close)

## Career Goal
**Get DevOps/MLOps/Platform Engineer job by April 1, 2026 at 85-90k salary in Germany**

### Role Priority (Target in this order)
1. **MLOps Engineer** (BEST FIT - your ML + DevOps background)
   - End-to-end ML pipelines, model serving, monitoring
   - Salary: 85-100k+
   - Rare candidate with both skills

2. **Platform Engineer** (GREAT FIT - infrastructure for teams)
   - Self-service deployment, developer experience, multi-team thinking
   - Salary: 85-95k+
   - Fewer positions but higher impact

3. **DevOps Engineer** (GOOD FIT - pure infrastructure)
   - CICD, infrastructure automation, reliability
   - Salary: 75-90k
   - More positions available

### Geographic Targets (Germany)
**Tier 1 Companies**: Zalando (Berlin), N26 (Berlin), Delivery Hero (Berlin), SoundCloud (Berlin)
**Tier 2 Companies**: Scout24 (Munich), Xing/New Work (Hamburg), SumUp (Berlin)
**Avoid**: Enterprise >5000 people, consulting firms, agencies

### Salary Strategy
- **Target**: 85-90k (not {current_salary})
- **Negotiation principle**: You have leverage, don't underestimate yourself
- **Phrases**:
  - "Based on market research, I'm looking at 85-90k"
  - "What's your budget range?"
  - "I appreciate the offer, but that's below my expectations"
  - Never say "I'm flexible" or current salary first

### Personal Requirements (Non-Negotiable)
- **Work-life balance**: Not burnout (no 150% booked projects)
- **Technical work**: Less meetings, more architecture/design
- **Autonomy**: Trust, no micromanagement
- **Stability**: Good team, good management, sustainable workload
- **Remote**: Hybrid preferred (was 100% remote, open to office sometimes)
- **Team culture**: Technical colleagues, avoid politics, no stupidity tolerance

### Why This Career Move
- Moving FROM: Business logic uncertainty, constant pressure, model/data science instability
- Moving TO: Infrastructure reliability, architectural autonomy, stable domain
- Value proposition: "The infrastructure that AI runs on won't be replaced by AI"

---

# PART 3: LEARNING TIMELINE & COMPLETED WORK

## Phase 1: K8s & Terraform Foundation (Weeks 1-8)
**Status**: [TO BE COMPLETED BY USER]
**Platform**: Mac (Minikube/K3d)
**Deliverables**:
- ✅ rag-eval deployed to local K8s (Week 2)
- ✅ Multi-service infrastructure (Weeks 3-4)
- ✅ Observability setup (Weeks 5-6)
- ✅ Infrastructure-as-Code with Terraform (Weeks 7-8)
- ✅ GitHub portfolio: `rag-eval-kubernetes/`

**What should be learned**:
- Kubernetes concepts (Pods, Deployments, Services, StatefulSets, ConfigMaps, Secrets)
- Resource management (requests, limits, scaling)
- Networking (ClusterIP, Ingress)
- Persistent storage (PersistentVolumeClaims)
- Monitoring (Prometheus, Grafana)
- Terraform (infrastructure-as-code)
- Bash scripting (for automation)
- GitOps basics (ArgoCD optional)

**Key insight**: This is NOT tutorial learning. Learn by deploying real services, hitting real problems, debugging, documenting.

---

## Phase 2: Platform Deploy Project (Weeks 9-12)
**Status**: [TO BEGIN AFTER PHASE 1]
**Goal**: Build MVP self-service deployment platform

### What is Platform Deploy?

**Core Idea**: Developers commit `.platform.yaml` to their repo → Platform automatically deploys to Kubernetes without them needing to understand K8s.

**Architecture**:
```
platform-deploy/ (Main repo - THE PLATFORM)
├── deployment-engine/          # Core logic to read config + deploy
├── github-actions/             # GitHub Action that triggers deployments
├── helm-charts/                # Kubernetes templates
├── monitoring/                 # Dashboards, alerts
├── terraform/                  # Infrastructure for platform itself
├── docs/                       # Documentation
└── README.md

App repos (use the platform):
├── rag-eval/
│   ├── .platform.yaml         # Config file
│   └── [app code]
├── portfolio-website/
│   ├── .platform.yaml
│   └── [app code]
└── other-app/
    ├── .platform.yaml
    └── [app code]
```

### MVP Feature Scope (KEEP SMALL)

**What to build** (Weeks 9-11):
1. **Configuration format** (`.platform.yaml`)
   - App name, image, replicas, port
   - Resources (CPU, memory)
   - Environment variables
   - Example:
   ```yaml
   apiVersion: v1
   kind: Deployment
   app:
     name: my-app
     image: registry/my-app:latest
     replicas: 2
     port: 8000
     resources:
       cpu: 500m
       memory: 512Mi
     env:
       LOG_LEVEL: INFO
   ```

2. **Deployment Engine** (Python/Flask)
   - Reads `.platform.yaml` from app repo
   - Generates Kubernetes manifest from Helm template
   - Deploys via `kubectl apply`
   - Returns status (success/failure)

3. **GitHub Action**
   - Triggered on push/merge to main
   - Builds Docker image
   - Pushes to registry
   - Calls deployment API
   - Reports result

4. **Helm Chart Template**
   - Generic app template (Deployment, Service, ConfigMap, Secret)
   - Filled in by deployment engine with config values

**What NOT to build yet**:
- ❌ Multi-cluster support
- ❌ Canary deployments
- ❌ Advanced traffic routing
- ❌ ML model serving specifics
- ❌ Advanced RBAC/security
- ❌ Cost optimization

**Success criteria for MVP**:
- ✅ Can deploy 3+ apps via platform
- ✅ Developers only touch `.platform.yaml`
- ✅ No manual K8s commands needed
- ✅ Monitoring shows all apps running
- ✅ Documentation is clear

**Week 12: Polish**
- Better error messages
- Monitoring dashboard
- Case study documentation
- Demo script
- README with examples

### Repository Structure for platform-deploy

```
platform-deploy/
├── README.md                           # Quick start + overview
├── ARCHITECTURE.md                     # Design decisions
├── GETTING_STARTED.md                  # How to deploy your app
├── deployment-engine/
│   ├── main.py                        # Flask API
│   ├── k8s_deployer.py                # K8s logic
│   ├── config_parser.py               # Parse .platform.yaml
│   └── requirements.txt
├── github-actions/
│   └── deploy.yml                     # GitHub Action workflow
├── helm-charts/
│   └── app-template/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── configmap.yaml
│           └── secrets.yaml
├── monitoring/
│   ├── prometheus-rules.yaml
│   └── grafana-dashboard.json
├── terraform/
│   ├── main.tf                        # Deploy platform itself
│   ├── variables.tf
│   └── outputs.tf
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT_FLOW.md
│   ├── TROUBLESHOOTING.md
│   └── SCALING.md
├── scripts/
│   ├── setup.sh                       # Setup platform
│   ├── add-app.sh                     # Add new app to platform
│   └── health-check.sh
└── examples/
    ├── rag-eval-platform.yaml         # Example config
    ├── website-platform.yaml
    └── my-app-platform.yaml
```

### Why This Platform Project

**Portfolio impact**: Shows you understand actual Platform Engineering, not just infrastructure

**Interview advantage**: When interviewer asks "Design a multi-app deployment system", you have real working example

**Career trajectory**: This is what Platform Engineers build. Having built it = you understand the job.

**Scope**: Small enough to finish in 4 weeks, big enough to be impressive

---

# PART 4: PORTFOLIO STRUCTURE

## Repository Hierarchy

```
GitHub Profile / Organization:
├── rag-eval/                           # Original app
│   └── README: RAG evaluation tool
├── rag-eval-kubernetes/                # LEARNING PROJECT
│   ├── README: "Kubernetes deployment of rag-eval"
│   ├── kubernetes/
│   │   ├── base/
│   │   └── overlays/
│   ├── terraform/
│   ├── monitoring/
│   ├── scripts/
│   └── docs/
│       ├── ARCHITECTURE.md
│       ├── SETUP.md
│       ├── TROUBLESHOOTING.md
│       └── INCIDENTS.md
├── platform-deploy/                    # MAIN PORTFOLIO PROJECT
│   ├── README: "Self-service K8s deployment platform"
│   ├── deployment-engine/
│   ├── github-actions/
│   ├── helm-charts/
│   ├── monitoring/
│   ├── terraform/
│   └── docs/
└── portfolio-website/                  # Uses platform-deploy
    ├── .platform.yaml                 # Deployed via platform
    └── [website code]
```

## What to Show in Interviews

**Demo flow**:
1. "Here's my platform repo" → Show GitHub
2. "Developers just commit .platform.yaml" → Show example config
3. "It automatically deploys" → Show GitHub Action
4. "Here are 3 apps running on it" → Show monitoring dashboard
5. "Here's how it works internally" → Show deployment engine code
6. "This is what I'd build at your company" → Connect to job

---

# PART 5: TECHNICAL INTERVIEW PREPARATION

## Role-Specific Answers

### If Interviewing for MLOps Engineer

**They ask**: "Describe your end-to-end ML pipeline"

**You answer**:
```
"I built automated ML systems using FastAPI for serving, K8s for orchestration,
and Terraform for infrastructure.

Example: rag-eval system
- Data ingestion → Model evaluation via OpenAI
- FastAPI serving with metrics (response time, accuracy)
- Deployed to K8s with auto-scaling
- Monitored with Prometheus
- When accuracy drops, automated retraining

The platform project extends this: I abstracted deployment so teams
can add new ML services without understanding infrastructure complexity."
```

**Why this works**: Shows both ML and infrastructure expertise

### If Interviewing for Platform Engineer

**They ask**: "Tell me about a platform you built"

**You answer**:
```
"I built a self-service deployment platform on Kubernetes.

Developers just commit .platform.yaml to their repo. The platform:
- Automatically builds Docker images
- Deploys to K8s with correct resource limits
- Injects secrets safely
- Provides monitoring out of the box

Currently 3+ apps running on it. Developers don't need to understand K8s.
That's platform thinking: infrastructure becomes invisible."
```

**Why this works**: Shows you understand developer experience, not just ops

### If Interviewing for DevOps Engineer

**They ask**: "Walk me through your deployment process"

**You answer**:
```
"Everything is Infrastructure-as-Code:
1. Application code → Docker image (built in CI/CD)
2. Infrastructure defined in Terraform (versioned in Git)
3. Configuration in K8s manifests or Helm charts
4. GitHub Action triggers deployment
5. Monitoring with Prometheus alerts if something breaks

The goal: Zero manual steps. If I lose the cluster, I recreate everything
in 5 minutes from Git."
```

**Why this works**: Shows automation and reliability mindset

---

## Red Flag Questions (Know Your Answers)

**Q: "Why are you leaving international consulting firm?"**
```
"I joined for broad exposure to infrastructure. That was valuable.
But I realized I want to specialize deep in infrastructure/platform
rather than jump between consulting projects.
I'm looking for a role where I own systems long-term and have
more autonomy in architecture decisions."
```

**Q: "You're on-call at 2am, service is down. What do you do?"**
```
"Stay systematic:
1. Check if it's real outage (check metrics, not just alert)
2. Gather info (logs, events, recent changes)
3. Hypothesis (did we deploy? Resource limit? DB slow?)
4. Mitigate quickly (rollback or scale if critical)
5. Diagnose root cause later
Document for next time. The goal: Prevent it happening again."
```

**Q: "What's your biggest learning this past year?"**
```
"I moved from 'ship features fast' to 'build reliable infrastructure.'
When you're in business logic, you optimize for velocity.
But infrastructure is different: reliability > speed.
I learned this the hard way when I lost data because I didn't think
about persistent storage on my K8s project. Now I design for
data safety first, features second."
```

---

## Questions YOU Should Ask Them

**Technical interview**:
- "What's your biggest infrastructure challenge right now?"
- "How do you currently handle deployments?"
- "What does on-call look like? How many incidents/week?"
- "Can you walk me through your monitoring/observability?"

**HR/Recruiter call**:
- "What's your budget for this role?"
- "Why did the previous person leave?"
- "What would success look like in 6 months?"
- "Can I meet my direct manager before I decide?"

---

# PART 6: SALARY NEGOTIATION SCRIPTS

## Key Principles
- **Target**: 85-90k (not {current_salary})
- **Negotiation**: You have leverage (mid-level + portfolio)
- **Phrases to use**: "Based on market research...", "What's your budget?"
- **Phrases to AVOID**: "I'm flexible", "Whatever you think is fair"

## Germany Salary Ranges (Q1 2026)

| City      | DevOps Mid | MLOps Mid | Platform Mid |
| --------- | ---------- | --------- | ------------ |
| Berlin    | 75-85k     | 85-100k   | 80-95k       |
| Munich    | 85-95k     | 95-110k   | 90-105k      |
| Frankfurt | 80-90k     | 90-100k   | 85-100k      |
| Hamburg   | 75-85k     | 85-95k    | 80-90k       |

**Your realistic range**: 82-88k (you're not senior yet, but strong mid-level)

## When They Ask Salary First

**Them**: "What are your expectations?"

**You**:
```
"Based on market research for mid-level DevOps/MLOps in Germany,
I'm looking at 85-90k. That's considering my 4+ years experience,
AWS expertise, and the portfolio I'm building.

What's your budget range?"
```

## When They Offer Low (78k)

**Them**: "We can do 78k"

**You**:
```
"I appreciate that. That's a bit below my expectations.
Help me understand: Is that your budget ceiling, or is there flexibility?

I was targeting 85k. But I'm open to exploring.
Can we add:
- Remote flexibility (full remote or 3 days/week)?
- Extra vacation (30 instead of 25 days)?
- Learning budget (2k/year)?
- Sign-on bonus?

What's possible?"
```

## When They Hold Firm

**Them**: "78k is really our max"

**You**:
```
"I understand. Let me think about this. 78k is lower than my other options at 82-85k.

Before I decide, could we revisit salary after 6 months when I've proven value?
Or is there anything else we haven't discussed?"
```

**You're allowed to walk away.** Better to find the right fit.

## When You Get Good Offer (83-85k)

**Them**: "We can do 84k, full remote, 30 days vacation"

**You**:
```
"I appreciate that. This is getting close. A few things:
1. Can I meet the hiring manager before I decide?
2. Can we document revisiting salary in 6 months?
3. Is learning/conference budget included?

If yes to those, I think we have a deal."
```

---

# PART 7: JOB SEARCH STRATEGY

## Timeline
- **Weeks 13-14** (March 15-29): Job search begins
- **April 1**: Start date

## How to Find Companies

**Platforms**:
- LinkedIn Jobs (filter: DevOps/MLOps, Germany, hybrid/remote)
- StepStone (German job board, huge)
- Indeed Germany
- Glassdoor (read reviews!)

## Companies to Target

### Tier 1 (Most Likely Match)
1. **Zalando** (Berlin) - E-commerce, engineering culture
2. **N26** (Berlin) - Fintech, infrastructure-heavy
3. **Delivery Hero** (Berlin) - Scale-up, needs DevOps
4. **SoundCloud** (Berlin) - Technical culture

### Red Flags to Avoid
- "Lots of on-call incidents" in reviews
- "Always firefighting"
- "Chaotic infrastructure"
- "Constant meetings"
- "No infrastructure as code"
- High turnover (3+ people in 2 years)

### Green Flags to Look For
- "Technical culture"
- "Infrastructure team respected"
- "Good work-life balance"
- "Manageable on-call"
- "Modern tech stack"

## Application Strategy
- Apply to 15-20 companies (mix Tier 1 + Tier 2)
- Customize cover letter for each (show you know their tech)
- Mention platform-deploy project in portfolio section
- Link to GitHub

---

# PART 8: COMMUNICATION PRINCIPLES FOR NEXT AGENT

**When you resume work on this project:**

1. **Ask for context first**
   - "How far did you get? What's the current status?"
   - "Did K8s learning complete? Any blockers?"
   - "Ready to move to platform project?"

2. **Maintain big picture focus**
   - You're not just learning K8s for learning's sake
   - You're building toward Platform Engineer job
   - Every decision connects to portfolio + interview

3. **Point out outdated info**
   - If Kubernetes landscape changed, say so
   - If job market shifted, update recommendation
   - If salary ranges changed, recalibrate

4. **Be brutally honest**
   - "You're running out of time, need to prioritize"
   - "Platform project is too ambitious, cut features"
   - "This interview question shows you don't understand"

5. **Separate knowledge from assumptions**
   - "Based on my knowledge cutoff, DevOps roles are X"
   - "But you mentioned seeing Y trend, that might be current"
   - "Help me understand current market"

6. **Practical over theoretical**
   - "Deploy this, don't read about it"
   - "Build small working MVP, not perfect system"
   - "Portfolio matters more than theory"

---

# PART 9: CURRENT BLOCKERS & QUESTIONS

**If you hit issues, document here:**

### Common K8s Learning Blockers
- ImagePullBackOff → Build + push Docker image first
- CrashLoopBackOff → Check logs: `kubectl logs <pod>`
- Pending → Resource limits too high
- Service unreachable → Check selectors, endpoints

### Platform Project Blockers
- [Add as you discover them]

### Interview Blockers
- [Add as you discover them]

---

# PART 10: SUCCESS METRICS

## Phase 1 Complete (K8s Learning)
- ✅ rag-eval running on local K8s
- ✅ Multi-service setup (3+ services)
- ✅ Monitoring with Prometheus
- ✅ Terraform for entire setup
- ✅ GitHub repo with documentation
- ✅ Can explain all decisions

## Phase 2 Complete (Platform Project)
- ✅ platform-deploy repo with MVP features
- ✅ 3+ apps deployed via platform
- ✅ Documentation complete
- ✅ Can demo in 5 minutes
- ✅ GitHub monitoring dashboard

## Job Search Complete
- ✅ 15-20 applications sent
- ✅ 5-10 interviews done
- ✅ Offer received at 85k+
- ✅ Accepted role starting April 1

---

# PART 11: RASPBERRY PI DEPLOYMENT (Phase 3)

**After job search, not before.** Timeline is too tight for Q1 2026 job goal.

**But when you do deploy to Raspberry Pi:**
- Use same K8s manifests from Mac (should work 80% as-is)
- K3s instead of Minikube (optimized for ARM)
- Deal with storage constraints (1-2 replicas max)
- Use case: Personal homelab infrastructure

---

# PART 12: QUICK REFERENCE CHECKLISTS

## Before Starting K8s Learning (Phase 1)
- [ ] Mac has Docker Desktop or Podman
- [ ] Minikube or K3d installed
- [ ] kubectl installed
- [ ] OpenAI API key ready
- [ ] GitHub account ready for portfolio
- [ ] Read existing CLAUDE.md (rag-eval project understanding)

## Before Starting Platform Project (Phase 2)
- [ ] K8s fundamentals solid (can explain concepts)
- [ ] Terraform comfortable
- [ ] rag-eval-kubernetes portfolio complete
- [ ] Bash scripting basics ok
- [ ] Ready to build something new

## Before Job Search (Weeks 13)
- [ ] Platform-deploy repo complete
- [ ] Both portfolios public on GitHub
- [ ] Resume updated (remove false K8s claim, add platform project)
- [ ] Interview scripts memorized
- [ ] Salary negotiation strategy ready
- [ ] Target companies researched

## Before Interviews
- [ ] Can explain platform project in 5 minutes
- [ ] Can answer all red flag questions
- [ ] Know your salary: 82-88k
- [ ] Know your non-negotiables (work-life balance)
- [ ] Company research done (Glassdoor, reviews)

---

# NEXT AGENT: START HERE

When you resume this project:

1. **Read this file completely** (you're reading it now)
2. **Ask user**: "Where did we leave off? K8s learning done or in progress?"
3. **Assess**: "Ready for platform project? Any blockers?"
4. **Prioritize**: Focus on portfolio + interview prep, not perfection
5. **Connect everything**: Each task connects to job goal + interview narrative
6. **Stay practical**: Build working code, not theoretical knowledge

**The goal**: April 1, 2026, MLOps/Platform Engineer job at 85-90k salary in Germany.

Everything else is a means to that end.
