# MLOps Mastery Roadmap (8 Weeks)

**Goal:** Transform from mid-level developer to senior MLOps engineer with production-ready skills.

**Your Skill Gaps:** Kubernetes (1/5→4/5), Monitoring (0/5→3/5), Terraform (2/5→4/5), CI/CD (2.5/5→4/5)

---

## Week 3: CI/CD Pipeline (GitHub Actions)

### Objective
Automate lint → test → build → deploy pipeline. Zero manual steps from commit to production-ready image.

### Deliverables
- [ ] `.github/workflows/ci.yml` with 3 jobs: lint, test, build
- [ ] Green checkmark on GitHub after push
- [ ] Docker image pushed to `ghcr.io/YOUR_USERNAME/rag-eval:latest`
- [ ] **Security:** Secrets stored in GitHub Secrets (not hardcoded)
- [ ] **Cost:** Use GitHub-hosted runners (free for public repos)

### Tasks
1. **Lint Job:** Run `ruff check` and `ruff format --check`
2. **Test Job:** Run `pytest` with coverage report (>80%)
3. **Build Job:** Build Docker image, tag with git SHA + `latest`
4. **Push Job:** Authenticate to ghcr.io, push image
5. **Security:** Add Dependabot for dependency updates
6. **Cost:** Cache `uv` dependencies to speed up builds

### Resources
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Build-Push Action](https://github.com/docker/build-push-action)
- [Caching Dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

### Acceptance Criteria
- ✅ Pipeline runs in <3 minutes
- ✅ Failed tests block deployment
- ✅ Image tagged with commit SHA (traceability)
- ✅ No secrets in code (use `${{ secrets.GITHUB_TOKEN }}`)

### Common Pitfalls
- ❌ Forgetting `permissions: packages: write` for ghcr.io
- ❌ Not using cache → slow builds (5min+ vs 1min)
- ❌ Hardcoding versions → use `@v4` for actions

---

## Week 4: Kubernetes (Minikube)

### Objective
Deploy your service to Kubernetes locally. Understand Pods, Deployments, Services, ConfigMaps, Secrets.

### Deliverables
- [ ] `k8s/deployment.yaml` (3 replicas, resource limits)
- [ ] `k8s/service.yaml` (LoadBalancer type)
- [ ] `k8s/configmap.yaml` (non-sensitive config)
- [ ] `k8s/secret.yaml` (OpenAI API key, base64 encoded)
- [ ] Working endpoint: `curl http://localhost:8000/evaluate`
- [ ] **Security:** Secrets encrypted at rest, RBAC enabled
- [ ] **Cost:** Set resource requests/limits (prevent overprovisioning)

### Tasks
1. **Install Minikube:** `brew install minikube` (macOS)
2. **Start Cluster:** `minikube start --driver=docker`
3. **Write Manifests:** Deployment (app), Service (networking), ConfigMap, Secret
4. **Apply:** `kubectl apply -f k8s/`
5. **Verify:** `kubectl get pods`, `kubectl logs <pod-name>`
6. **Expose:** `minikube service rag-eval-service`
7. **Security:** Use `imagePullPolicy: Always` to avoid stale images
8. **Cost:** Set `resources.requests` = `resources.limits` (guaranteed QoS)

### Resources
- [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Resource Management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

### Acceptance Criteria
- ✅ 3 pods running (`kubectl get pods` shows `3/3 Running`)
- ✅ Health checks pass (liveness + readiness probes)
- ✅ Secrets not visible in `kubectl describe pod`
- ✅ Service accessible via `minikube service` URL

### Common Pitfalls
- ❌ Forgetting to encode secrets in base64: `echo -n "value" | base64`
- ❌ No resource limits → pods consume all cluster resources
- ❌ Using `LoadBalancer` in production (expensive) → use `Ingress` instead

---

## Week 5: Monitoring (Prometheus + Grafana)

### Objective
Track request latency, error rates, and custom metrics (faithfulness score). Set up alerts for degradation.

### Deliverables
- [ ] Prometheus deployed in Minikube
- [ ] Grafana dashboard with RED metrics (Rate, Errors, Duration)
- [ ] Custom metric: `faithfulness_score_avg`
- [ ] Alert: Latency >500ms or Error rate >1%
- [ ] **Security:** Grafana admin password changed from default
- [ ] **Cost:** Use Prometheus for metrics (free) vs. DataDog ($100+/mo)

### Tasks
1. **Install Prometheus:** `helm install prometheus prometheus-community/prometheus`
2. **Instrument FastAPI:** Add `prometheus-fastapi-instrumentator`
3. **Expose Metrics:** `/metrics` endpoint
4. **Install Grafana:** `helm install grafana grafana/grafana`
5. **Create Dashboard:** Import template #12230 (FastAPI metrics)
6. **Add Custom Metric:** Track average faithfulness score
7. **Set Alerts:** Prometheus AlertManager rules
8. **Security:** Enable Grafana authentication, use HTTPS
9. **Cost:** Use local Prometheus (free) vs. managed (Grafana Cloud: $50+/mo)

### Resources
- [Prometheus Docs](https://prometheus.io/docs/introduction/overview/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
- [FastAPI Instrumentator](https://github.com/trallnag/prometheus-fastapi-instrumentator)

### Acceptance Criteria
- ✅ Dashboard shows request count, latency (p50, p95, p99), error rate
- ✅ Custom metric visible: `faithfulness_score_avg{version="v1"}`
- ✅ Alert fires when latency >500ms (test by adding `time.sleep(1)`)
- ✅ Grafana password changed (not `admin/admin`)

### Common Pitfalls
- ❌ Not scraping `/metrics` endpoint → no data in Prometheus
- ❌ Using default Grafana password → security risk
- ❌ No alert testing → alerts never fire in production

---

## Week 6: Terraform (AWS ECS Fargate)

### Objective
Deploy to AWS using Infrastructure as Code. Provision VPC, ECS cluster, Load Balancer, ECR.

### Deliverables
- [ ] `terraform/` directory with modules: `vpc`, `ecs`, `ecr`, `alb`
- [ ] Working deployment: `terraform apply` → live URL
- [ ] State stored in S3 with DynamoDB locking
- [ ] **Security:** IAM roles (least privilege), secrets in AWS Secrets Manager
- [ ] **Cost:** ECS Fargate (no EC2 management), Spot tasks (70% cheaper)

### Tasks
1. **Setup AWS CLI:** `aws configure` (use IAM user, not root)
2. **Create S3 Backend:** Bucket for Terraform state
3. **Write Modules:**
   - `vpc.tf`: VPC, subnets (public/private), NAT gateway
   - `ecs.tf`: ECS cluster, task definition, service
   - `ecr.tf`: Docker registry
   - `alb.tf`: Application Load Balancer, target group
4. **Apply:** `terraform init`, `terraform plan`, `terraform apply`
5. **Verify:** Access ALB DNS name
6. **Security:** Use IAM roles for ECS tasks (not hardcoded keys)
7. **Cost:** Use Fargate Spot (add `capacity_provider_strategy`)

### Resources
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [Terraform State Backend](https://developer.hashicorp.com/terraform/language/settings/backends/s3)

### Acceptance Criteria
- ✅ `terraform apply` completes without errors
- ✅ Service accessible via ALB URL (e.g., `http://rag-eval-123.us-east-1.elb.amazonaws.com`)
- ✅ State locked (concurrent `terraform apply` fails)
- ✅ No hardcoded secrets (use AWS Secrets Manager)
- ✅ Cost estimate: <$50/month (use `infracost` tool)

### Common Pitfalls
- ❌ No state locking → corrupted state from concurrent runs
- ❌ Public subnets for everything → security risk (use private subnets + NAT)
- ❌ Forgetting to destroy resources → unexpected AWS bills

---

## Week 7: Model Serving Patterns

### Objective
Implement A/B testing, batch prediction, and model versioning.

### Deliverables
- [ ] Model registry (S3 with versioned prompts)
- [ ] A/B testing: 90% traffic to v1, 10% to v2
- [ ] Batch endpoint: `/batch-evaluate` (process 1000 items)
- [ ] **Security:** Signed S3 URLs (no public access)
- [ ] **Cost:** S3 Intelligent-Tiering (auto-archive old versions)

### Tasks
1. **Model Registry:** Store prompt templates in S3 with versions (`v1.0.0`)
2. **A/B Testing:** Use ALB weighted target groups or feature flags
3. **Batch Endpoint:** Accept JSON array, return results
4. **Versioning:** Git tags + Docker image tags + S3 object versions
5. **Security:** S3 bucket policy (deny public access)
6. **Cost:** Enable S3 lifecycle policies (delete versions >90 days old)

### Resources
- [S3 Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [ALB Weighted Routing](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-routing-configuration)

### Acceptance Criteria
- ✅ `/evaluate?version=v1` uses prompt v1, `version=v2` uses v2
- ✅ Metrics show 90/10 traffic split
- ✅ Batch endpoint processes 1000 items in <10 seconds
- ✅ Old model versions archived (not deleted, for rollback)

---

## Week 8: Advanced Topics

### Objective
MCP integration, cost optimization, multi-region deployment.

### Deliverables
- [ ] MCP server exposing `/evaluate` as a tool
- [ ] Cost dashboard (AWS Cost Explorer tags)
- [ ] Multi-region deployment (us-east-1 + eu-west-1)
- [ ] **Security:** WAF rules (rate limiting, SQL injection protection)
- [ ] **Cost:** Reserved capacity for baseline, Spot for spikes

### Tasks
1. **MCP Server:** Follow [MCP spec](https://modelcontextprotocol.io/), expose evaluator
2. **Cost Optimization:**
   - Tag all resources (`Project=rag-eval`, `Environment=prod`)
   - Use Savings Plans for predictable workloads
   - Enable ECS autoscaling (scale to zero at night)
3. **Multi-Region:** Replicate Terraform stack, use Route53 for DNS failover
4. **Security:** Add AWS WAF to ALB (block malicious requests)

### Resources
- [MCP Documentation](https://modelcontextprotocol.io/)
- [AWS Cost Optimization](https://aws.amazon.com/pricing/cost-optimization/)
- [WAF Best Practices](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html)

### Acceptance Criteria
- ✅ MCP server works in Claude Desktop
- ✅ Cost reduced by 30% (use `infracost diff`)
- ✅ Multi-region failover tested (shut down us-east-1, traffic routes to eu-west-1)
- ✅ WAF blocks 100+ requests/min from single IP

---

## Architecture Decision-Making Framework

### When to Choose What

| Decision | Option A | Option B | Choose A When | Choose B When |
|----------|----------|----------|---------------|---------------|
| **Container Orchestration** | Kubernetes | ECS Fargate | Need portability, complex workloads | AWS-only, simpler setup |
| **CI/CD** | GitHub Actions | Jenkins | Cloud-native, simple | Self-hosted, complex pipelines |
| **Monitoring** | Prometheus | DataDog | Cost-sensitive, self-hosted | Enterprise, managed service |
| **IaC** | Terraform | CloudFormation | Multi-cloud | AWS-only |
| **Model Registry** | S3 Versioning | MLflow | Simple, few models | Complex, many models |
| **Database** | PostgreSQL | DynamoDB | Relational data, ACID | NoSQL, high scale |

### Decision-Making Process
1. **Understand Requirements:** Latency? Scale? Cost? Compliance?
2. **Identify Constraints:** Budget? Team size? Timeline?
3. **List Options:** Research 2-3 alternatives
4. **Evaluate Trade-offs:** Cost vs. Complexity vs. Performance
5. **Document Decision:** Write ADR (Architecture Decision Record)
6. **Validate:** Build proof-of-concept, measure

### Example ADR Template
```markdown
# ADR-001: Use ECS Fargate over EKS

## Context
Need to deploy containerized ML service to AWS.

## Decision
Use ECS Fargate instead of EKS.

## Rationale
- Cost: EKS control plane = $73/month, ECS = $0
- Complexity: ECS simpler (no K8s learning curve)
- Trade-off: Less portable (AWS-only)

## Consequences
- Positive: Lower cost, faster setup
- Negative: Vendor lock-in, limited K8s skills growth
- Mitigation: Use K8s locally (Minikube) for learning
```

---

## Security Checklist (Integrated)

### Week 3 (CI/CD)
- [ ] Secrets in GitHub Secrets (not code)
- [ ] Dependabot enabled (auto-update dependencies)
- [ ] Branch protection (require PR reviews)

### Week 4 (Kubernetes)
- [ ] Secrets encrypted at rest
- [ ] RBAC enabled (least privilege)
- [ ] Network policies (restrict pod-to-pod traffic)
- [ ] Non-root containers (`runAsUser: 1000`)

### Week 5 (Monitoring)
- [ ] Grafana admin password changed
- [ ] Prometheus authentication enabled
- [ ] HTTPS for Grafana (use Let's Encrypt)

### Week 6 (Terraform)
- [ ] IAM roles (no hardcoded keys)
- [ ] Secrets in AWS Secrets Manager
- [ ] S3 bucket encryption (AES-256)
- [ ] VPC: Private subnets for ECS tasks

### Week 7 (Model Serving)
- [ ] S3 bucket policy (deny public access)
- [ ] Signed URLs for model downloads
- [ ] Input validation (prevent injection attacks)

### Week 8 (Advanced)
- [ ] WAF rules (rate limiting, SQL injection)
- [ ] CloudTrail enabled (audit logs)
- [ ] GuardDuty enabled (threat detection)

---

## Cost Optimization Checklist (Integrated)

### Week 3 (CI/CD)
- [ ] Cache dependencies (reduce build time)
- [ ] Use GitHub-hosted runners (free for public repos)

### Week 4 (Kubernetes)
- [ ] Set resource requests = limits (avoid overprovisioning)
- [ ] Use Horizontal Pod Autoscaler (scale down at night)

### Week 5 (Monitoring)
- [ ] Use Prometheus (free) vs. DataDog ($100+/mo)
- [ ] Retention policy (delete metrics >30 days)

### Week 6 (Terraform)
- [ ] ECS Fargate Spot (70% cheaper than on-demand)
- [ ] Use `infracost` to estimate costs before apply
- [ ] Delete unused resources (`terraform destroy`)

### Week 7 (Model Serving)
- [ ] S3 Intelligent-Tiering (auto-archive old versions)
- [ ] Lifecycle policies (delete versions >90 days)

### Week 8 (Advanced)
- [ ] Tag all resources (track costs by project)
- [ ] Savings Plans for baseline workload
- [ ] Autoscaling (scale to zero at night)
- [ ] Reserved capacity for predictable loads

---

## Keywords for Search

**CI/CD:** GitHub Actions, pipeline, lint, test, build, deploy, cache, secrets, Dependabot  
**Kubernetes:** Pod, Deployment, Service, ConfigMap, Secret, kubectl, Minikube, RBAC, resource limits  
**Monitoring:** Prometheus, Grafana, metrics, alerts, RED (Rate/Errors/Duration), instrumentation  
**Terraform:** IaC, modules, state, S3 backend, VPC, ECS, Fargate, ALB, IAM  
**Security:** Secrets Manager, IAM roles, encryption, WAF, least privilege, RBAC  
**Cost:** Spot instances, autoscaling, tagging, Savings Plans, lifecycle policies, infracost  
**Architecture:** ADR, trade-offs, decision-making, ECS vs EKS, Terraform vs CloudFormation
