# Weekly Checkpoints

**Purpose:** Show me what you built, explain what you learned, get feedback.

---

## Week 3: CI/CD Pipeline

### What to Show Me
1. **GitHub Repo URL** (with green checkmark on latest commit)
2. **`.github/workflows/ci.yml`** (show me the file)
3. **Docker Image URL** (e.g., `ghcr.io/sbehdadk/rag-eval:abc123`)

### What to Explain (In Your Own Words)
1. **How does caching work in GitHub Actions?** (Why is it faster the second time?)
2. **What happens if tests fail?** (Does the image still get built?)
3. **Why tag with git SHA?** (What problem does it solve?)

### What I'll Check
- ✅ Pipeline runs in <3 minutes
- ✅ Secrets not hardcoded
- ✅ Image tagged with commit SHA

### Common Mistakes I'll Look For
- ❌ No `permissions: packages: write`
- ❌ Not using cache
- ❌ Hardcoded API keys

---

## Week 4: Kubernetes

### What to Show Me
1. **`k8s/` directory** (deployment.yaml, service.yaml, configmap.yaml, secret.yaml)
2. **Screenshot:** `kubectl get pods` (showing 3/3 Running)
3. **Screenshot:** `curl http://localhost:8000/evaluate` (working response)

### What to Explain
1. **What's the difference between a Deployment and a Pod?**
2. **Why 3 replicas?** (What happens if 1 pod crashes?)
3. **How do Secrets work?** (Are they encrypted? Where?)

### What I'll Check
- ✅ Health checks configured (liveness + readiness)
- ✅ Resource limits set
- ✅ Secrets base64 encoded

### Common Mistakes
- ❌ No resource limits
- ❌ Secrets in plaintext
- ❌ Using `LoadBalancer` (expensive in production)

---

## Week 5: Monitoring

### What to Show Me
1. **Screenshot:** Grafana dashboard (showing request count, latency, error rate)
2. **Screenshot:** Custom metric `faithfulness_score_avg`
3. **Screenshot:** Alert firing (test by adding `time.sleep(1)`)

### What to Explain
1. **What are RED metrics?** (Rate, Errors, Duration)
2. **How does Prometheus scrape metrics?** (Pull vs. Push)
3. **When would you use DataDog instead of Prometheus?**

### What I'll Check
- ✅ `/metrics` endpoint exposed
- ✅ Dashboard shows p50, p95, p99 latency
- ✅ Alert rules configured

### Common Mistakes
- ❌ Prometheus not scraping `/metrics`
- ❌ Default Grafana password
- ❌ No alert testing

---

## Week 6: Terraform

### What to Show Me
1. **`terraform/` directory** (vpc.tf, ecs.tf, ecr.tf, alb.tf)
2. **Screenshot:** `terraform plan` output
3. **Live URL:** ALB DNS name (e.g., `http://rag-eval-123.us-east-1.elb.amazonaws.com`)
4. **Cost estimate:** `infracost breakdown --path .`

### What to Explain
1. **Why use S3 for state?** (What problem does it solve?)
2. **What's the difference between ECS and EKS?**
3. **How do you handle secrets in Terraform?** (Not hardcoded)

### What I'll Check
- ✅ State in S3 with DynamoDB locking
- ✅ IAM roles (no hardcoded keys)
- ✅ Cost <$50/month

### Common Mistakes
- ❌ No state locking
- ❌ Public subnets for everything
- ❌ Hardcoded secrets in `.tf` files

---

## Week 7: Model Serving

### What to Show Me
1. **S3 bucket** (with versioned prompts: `v1.0.0`, `v1.1.0`)
2. **A/B test proof:** Metrics showing 90/10 traffic split
3. **Batch endpoint:** `curl -X POST /batch-evaluate -d @1000_items.json`

### What to Explain
1. **How do you version models?** (Git tags? S3 versions? Both?)
2. **What's the difference between online and batch inference?**
3. **How do you rollback a bad model?** (What's the process?)

### What I'll Check
- ✅ S3 versioning enabled
- ✅ Metrics show traffic split
- ✅ Batch endpoint processes 1000 items in <10s

### Common Mistakes
- ❌ No rollback strategy
- ❌ Public S3 bucket
- ❌ No lifecycle policies (old versions pile up)

---

## Week 8: Advanced

### What to Show Me
1. **MCP server:** Screenshot of it working in Claude Desktop
2. **Cost dashboard:** AWS Cost Explorer with tags
3. **Multi-region:** Route53 failover test (shut down us-east-1)

### What to Explain
1. **What is MCP?** (Why is it useful?)
2. **How did you reduce costs by 30%?** (Specific changes)
3. **How does multi-region failover work?** (DNS? Load balancer?)

### What I'll Check
- ✅ MCP server functional
- ✅ Cost reduced (show `infracost diff`)
- ✅ WAF rules active

### Common Mistakes
- ❌ No cost tagging
- ❌ No WAF testing
- ❌ Multi-region not tested

---

## How to Submit Checkpoints

**Format:**
```markdown
# Week X Checkpoint

## What I Built
- [Link to code/config]
- [Screenshots]

## What I Learned
- [Explain concepts in your own words]

## What I'm Stuck On
- [Specific blockers, if any]
```

**Where to Submit:**
- Create a GitHub Discussion in your repo
- Or: Send me a message with the above format

**What Happens Next:**
- I'll review within 24 hours
- I'll point out mistakes (brutally honest)
- I'll approve you to move to next week OR ask you to fix issues first
