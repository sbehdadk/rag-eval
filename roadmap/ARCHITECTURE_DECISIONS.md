# Architecture Decision-Making Guide

**Purpose:** Learn to make professional, defensible architecture decisions.

---

## The Decision-Making Process

### 1. Understand Requirements
**Questions to Ask:**
- What's the scale? (100 requests/day vs. 1M requests/day)
- What's the latency requirement? (<100ms vs. <1s)
- What's the budget? ($50/month vs. $5000/month)
- What's the team size? (Solo vs. 10 engineers)
- What's the compliance requirement? (GDPR? HIPAA?)

### 2. Identify Constraints
**Common Constraints:**
- **Time:** Need to ship in 1 week vs. 3 months
- **Cost:** Startup budget vs. enterprise budget
- **Skills:** Team knows Python but not Go
- **Vendor:** Must use AWS (company policy)

### 3. List Options
**Research 2-3 Alternatives:**
- Read official docs (not Medium articles)
- Check GitHub stars, activity, community
- Look for production case studies

### 4. Evaluate Trade-offs
**Framework: Cost vs. Complexity vs. Performance**

| Option | Cost | Complexity | Performance | Portability |
|--------|------|------------|-------------|-------------|
| ECS Fargate | Low | Low | Medium | Low (AWS-only) |
| EKS | High | High | High | High (K8s standard) |
| Lambda | Very Low | Very Low | Low (cold starts) | Low (AWS-only) |

### 5. Document Decision (ADR)
**Architecture Decision Record Template:**
```markdown
# ADR-XXX: [Title]

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What's the problem? What are the constraints?

## Decision
What did you choose? Be specific.

## Rationale
Why this option? What trade-offs did you make?

## Consequences
- **Positive:** What improves?
- **Negative:** What gets worse?
- **Mitigation:** How do you handle the negatives?

## Alternatives Considered
- Option A: Why rejected?
- Option B: Why rejected?
```

### 6. Validate
**Proof of Concept:**
- Build a minimal version (1-2 days)
- Measure actual performance (not theoretical)
- Test edge cases (what breaks?)

---

## Common Architecture Decisions

### Decision 1: Container Orchestration

**Options:**
- **Kubernetes (EKS/GKE):** Industry standard, portable, complex
- **ECS Fargate:** AWS-native, simpler, vendor lock-in
- **Docker Compose:** Local dev only, not production-ready
- **Nomad:** HashiCorp, simpler than K8s, smaller community

**Decision Matrix:**

| Requirement | Choose Kubernetes | Choose ECS Fargate |
|-------------|-------------------|-------------------|
| Multi-cloud | ✅ Yes | ❌ No (AWS-only) |
| Team knows K8s | ✅ Yes | ❌ No |
| Budget <$100/mo | ❌ No (EKS=$73/mo) | ✅ Yes (ECS=$0) |
| Need autoscaling | ✅ Yes | ✅ Yes |
| Startup (speed) | ❌ No (complex) | ✅ Yes (simple) |

**Your Decision (RAG Eval):**
- **Local:** Minikube (learn K8s concepts)
- **Production:** ECS Fargate (cost-effective, simpler)
- **Rationale:** Learn K8s skills without paying for EKS

---

### Decision 2: CI/CD Platform

**Options:**
- **GitHub Actions:** Cloud-native, free for public repos
- **Jenkins:** Self-hosted, complex, flexible
- **GitLab CI:** All-in-one (Git + CI/CD)
- **CircleCI:** Managed, paid

**Decision Matrix:**

| Requirement | GitHub Actions | Jenkins |
|-------------|----------------|---------|
| Free tier | ✅ Yes (public repos) | ❌ No (self-host costs) |
| Easy setup | ✅ Yes | ❌ No (complex) |
| Custom runners | ✅ Yes | ✅ Yes |
| Enterprise features | ⚠️ Limited | ✅ Yes |

**Your Decision:** GitHub Actions  
**Rationale:** Free, simple, integrated with GitHub

---

### Decision 3: Monitoring

**Options:**
- **Prometheus + Grafana:** Self-hosted, free, complex
- **DataDog:** Managed, expensive ($100+/mo), easy
- **CloudWatch:** AWS-native, limited features
- **New Relic:** APM-focused, expensive

**Decision Matrix:**

| Requirement | Prometheus | DataDog |
|-------------|------------|---------|
| Cost <$50/mo | ✅ Yes (free) | ❌ No ($100+) |
| Custom metrics | ✅ Yes | ✅ Yes |
| Easy setup | ❌ No (Helm charts) | ✅ Yes (agent install) |
| Alerting | ✅ Yes (AlertManager) | ✅ Yes (built-in) |

**Your Decision:** Prometheus + Grafana  
**Rationale:** Cost-effective, learn industry-standard tools

---

### Decision 4: Infrastructure as Code

**Options:**
- **Terraform:** Multi-cloud, HCL language, large community
- **CloudFormation:** AWS-only, YAML/JSON, native integration
- **Pulumi:** Multi-cloud, use Python/Go, smaller community
- **CDK:** AWS-only, use TypeScript/Python, complex

**Decision Matrix:**

| Requirement | Terraform | CloudFormation |
|-------------|-----------|----------------|
| Multi-cloud | ✅ Yes | ❌ No (AWS-only) |
| Community | ✅ Large | ⚠️ Medium |
| Learning curve | ⚠️ Medium | ⚠️ Medium |
| State management | ⚠️ Manual (S3) | ✅ Automatic |

**Your Decision:** Terraform  
**Rationale:** Portable skills, industry standard

---

### Decision 5: Model Registry

**Options:**
- **S3 Versioning:** Simple, cheap, manual
- **MLflow:** Feature-rich, complex, self-hosted
- **Weights & Biases:** Managed, expensive, experiment tracking
- **DVC:** Git-like, open-source, steep learning curve

**Decision Matrix:**

| Requirement | S3 Versioning | MLflow |
|-------------|---------------|--------|
| Cost | ✅ Very low | ⚠️ Medium (hosting) |
| Complexity | ✅ Low | ❌ High |
| Features | ❌ Basic | ✅ Advanced |
| Team size | ✅ 1-3 people | ⚠️ 5+ people |

**Your Decision:** S3 Versioning  
**Rationale:** Simple, sufficient for 1 model, cost-effective

---

## How to Practice Decision-Making

### Exercise 1: Reverse Engineer Decisions
**Pick a company's tech blog (e.g., Netflix, Uber, Airbnb):**
1. Read their architecture post
2. Identify their constraints (scale, budget, team)
3. List alternatives they could have chosen
4. Explain why they chose what they did

**Example:**
- [Netflix: Why We Use Cassandra](https://netflixtechblog.com/benchmarking-cassandra-scalability-on-aws-over-a-million-writes-per-second-39f45f066c9e)
- **Your Task:** Why not PostgreSQL? Why not DynamoDB?

### Exercise 2: Debate Both Sides
**Pick a decision (e.g., ECS vs. EKS):**
1. Argue FOR ECS (5 minutes)
2. Argue FOR EKS (5 minutes)
3. Write down which you'd choose and why

### Exercise 3: Cost-Benefit Analysis
**For each decision in your project:**
1. Estimate cost (time + money)
2. Estimate benefit (performance, reliability, learning)
3. Calculate ROI (benefit / cost)

**Example:**
- **Decision:** Add Prometheus monitoring
- **Cost:** 4 hours setup + $0/month
- **Benefit:** Catch issues 10x faster, learn industry tool
- **ROI:** High (essential skill, zero cost)

---

## Red Flags (Bad Decisions)

### ❌ Choosing Based on Hype
**Example:** "Everyone uses Kubernetes, so I should too"  
**Fix:** Evaluate based on YOUR requirements, not trends

### ❌ Premature Optimization
**Example:** "I need a distributed database for 10 users/day"  
**Fix:** Start simple (SQLite), scale when needed

### ❌ Not Documenting Decisions
**Example:** "I chose X because... I forgot why"  
**Fix:** Write ADRs, even for small projects

### ❌ Ignoring Team Skills
**Example:** "Let's use Rust (team only knows Python)"  
**Fix:** Choose tools your team can maintain

### ❌ Vendor Lock-In Without Awareness
**Example:** "We use 20 AWS-specific services, can't migrate"  
**Fix:** Acknowledge trade-offs, plan mitigation (e.g., use Terraform for portability)

---

## Interview Questions You'll Answer

### Q: "Why did you choose ECS over EKS?"
**Good Answer:**
> "I evaluated both. EKS costs $73/month for the control plane, which was 50% of my budget. ECS Fargate has no control plane cost. The trade-off is vendor lock-in, but I mitigated this by learning Kubernetes locally with Minikube, so I have portable skills. For a production startup, I'd choose ECS for cost; for an enterprise, I'd choose EKS for portability."

**Bad Answer:**
> "ECS is easier."

### Q: "How do you decide between Prometheus and DataDog?"
**Good Answer:**
> "It depends on team size and budget. For a startup with <5 engineers and <$100/month budget, I'd use Prometheus (free, self-hosted). For an enterprise with 50+ engineers and $10k/month budget, I'd use DataDog (managed, less ops burden). The trade-off is complexity vs. cost."

**Bad Answer:**
> "Prometheus is free."

---

## Your Action Items

1. **Write ADRs for your project:**
   - ADR-001: Why ECS Fargate over EKS
   - ADR-002: Why Prometheus over DataDog
   - ADR-003: Why S3 versioning over MLflow

2. **Practice explaining trade-offs:**
   - Record yourself explaining a decision (5 min)
   - Listen back, improve clarity

3. **Read 5 architecture blogs:**
   - [Netflix Tech Blog](https://netflixtechblog.com/)
   - [Uber Engineering](https://eng.uber.com/)
   - [Airbnb Engineering](https://medium.com/airbnb-engineering)
   - Identify patterns in their decision-making

4. **Build a decision matrix template:**
   - Create a spreadsheet for future decisions
   - Columns: Option, Cost, Complexity, Performance, Portability
   - Use it for every major decision
