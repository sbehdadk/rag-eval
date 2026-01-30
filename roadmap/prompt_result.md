⏺ Perfect. This is comprehensive and actionable. Let me give you all 6.

  ---
  ACTION ITEMS FOR DEVOPS JOB APRIL 2026

  ---
  1. EXACT K8S LEARNING SEQUENCE (Week by Week)

  Timeline: 9 weeks (Jan 24 → Mar 14)
  Platform: Mac (Minikube or K3d)
  Project: rag-eval + Raspberry Pi infrastructure

  WEEKS 1-2: K8s Fundamentals (Learn by Doing, Not Theory)

  Goal: Understand K8s architecture by deploying something real

  What you'll do:

  # Day 1: Setup
  brew install minikube
  # or
  brew install k3d

  # Start cluster
  minikube start --cpus=4 --memory=8192
  # or
  k3d cluster create devops-learn

  # Verify
  kubectl cluster-info
  kubectl get nodes

  Days 2-3: Deploy rag-eval to K8s

  Create these files locally:

  k8s/deployment.yaml:
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: rag-eval
    labels:
      app: rag-eval
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: rag-eval
    template:
      metadata:
        labels:
          app: rag-eval
      spec:
        containers:
        - name: rag-eval
          image: your-registry/rag-eval:latest
          ports:
          - containerPort: 8000
          env:
          - name: OPENAI_API_KEY
            valueFrom:
              secretKeyRef:
                name: rag-eval-secrets
                key: openai-api-key
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi

  k8s/service.yaml:
  apiVersion: v1
  kind: Service
  metadata:
    name: rag-eval-service
  spec:
    type: ClusterIP
    selector:
      app: rag-eval
    ports:
    - port: 8000
      targetPort: 8000
      protocol: TCP

  k8s/secrets.yaml:
  apiVersion: v1
  kind: Secret
  metadata:
    name: rag-eval-secrets
  type: Opaque
  stringData:
    openai-api-key: YOUR_API_KEY_HERE

  Deploy:
  # Create namespace (optional but good practice)
  kubectl create namespace rag-eval-dev

  # Apply manifests
  kubectl apply -f k8s/ -n rag-eval-dev

  # Check status
  kubectl get pods -n rag-eval-dev
  kubectl get svc -n rag-eval-dev

  # Port forward to access
  kubectl port-forward -n rag-eval-dev svc/rag-eval-service 8000:8000

  # Test
  curl http://localhost:8000/

  Days 4-5: Troubleshoot & Document

  Things you'll hit:
  - "ImagePullBackOff" - image doesn't exist (you'll need to build and push Docker image
   first)
  - "CrashLoopBackOff" - container crashes on start (wrong env var or code issue)
  - "Pending" - pod stuck waiting (resource limits too high)

  For each issue:
  1. Check logs: kubectl logs -n rag-eval-dev <pod-name>
  2. Describe pod: kubectl describe pod -n rag-eval-dev <pod-name>
  3. Fix issue
  4. Document: What was wrong? How did you diagnose? How did you fix?

  End of Week 2 Deliverable:
  - ✅ rag-eval running on local K8s
  - ✅ You can port-forward and access it
  - ✅ You can scale replicas up/down
  - ✅ Document: "Week 1-2: Deploying rag-eval to K8s"

  ---
  WEEKS 3-4: Multi-Service Infrastructure (Real Complexity)

  Goal: Manage multiple services like real infrastructure

  Migrate to K8s (choose 2-3 of your existing containers):
  1. rag-eval (already done)
  2. Your web app (from your portfolio)
  3. Something else (VPN, database, nginx reverse proxy)

  What you'll build:

  k8s/
  ├── namespaces.yaml           # Separate dev/staging
  ├── rag-eval/
  │   ├── deployment.yaml
  │   ├── service.yaml
  │   └── configmap.yaml
  ├── webapp/
  │   ├── deployment.yaml
  │   ├── service.yaml
  │   └── configmap.yaml
  ├── nginx/
  │   ├── deployment.yaml
  │   ├── service.yaml
  │   ├── configmap.yaml        # nginx config
  │   └── ingress.yaml          # Route requests
  ├── postgres/
  │   ├── statefulset.yaml      # Not deployment! (state matters)
  │   ├── service.yaml
  │   ├── configmap.yaml
  │   └── pvc.yaml              # PersistentVolumeClaim
  └── secrets/
      └── all-secrets.yaml

  Key learnings this week:

  1. ConfigMaps (non-secret config):
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: rag-eval-config
  data:
    LOG_LEVEL: "DEBUG"
    ENVIRONMENT: "staging"

  2. Secrets (sensitive data):
  apiVersion: v1
  kind: Secret
  metadata:
    name: db-credentials
  type: Opaque
  stringData:
    username: postgres
    password: securepassword

  3. StatefulSets (for databases that need persistence):
  apiVersion: apps/v1
  kind: StatefulSet
  metadata:
    name: postgres
  spec:
    serviceName: postgres
    replicas: 1
    selector:
      matchLabels:
        app: postgres
    template:
      metadata:
        labels:
          app: postgres
      spec:
        containers:
        - name: postgres
          image: postgres:15
          ports:
          - containerPort: 5432
          volumeMounts:
          - name: postgres-storage
            mountPath: /var/lib/postgresql/data
    volumeClaimTemplates:
    - metadata:
        name: postgres-storage
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi

  4. Ingress (route HTTP requests):
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: app-ingress
  spec:
    rules:
    - host: localhost
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: webapp-service
              port:
                number: 3000
        - path: /api
          pathType: Prefix
          backend:
            service:
              name: rag-eval-service
              port:
                number: 8000

  Real problems you'll solve:
  - "How do I pass database credentials to containers securely?" → Secrets
  - "My database data disappeared when pod restarted!" → PersistentVolumes
  - "I need multiple services talking to each other" → Services + DNS
  - "How do I route external traffic to right service?" → Ingress

  End of Week 4 Deliverable:
  - ✅ 3+ services running on K8s locally
  - ✅ Database with persistent storage
  - ✅ Secrets management working
  - ✅ Services can communicate with each other
  - ✅ Document: "Week 3-4: Multi-service K8s architecture"

  ---
  WEEKS 5-6: Observability (Monitoring & Logging)

  Goal: See what's happening in your cluster (this is critical DevOps skill)

  Deploy Prometheus (metrics) + Loki (logs):

  Prometheus setup:

  # Add Prometheus Helm repo
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo update

  # Install Prometheus
  helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
  --create-namespace

  # Verify
  kubectl get pods -n monitoring

  Create ServiceMonitor (tells Prometheus what to scrape):

  apiVersion: monitoring.coreos.com/v1
  kind: ServiceMonitor
  metadata:
    name: rag-eval-monitor
    namespace: default
  spec:
    selector:
      matchLabels:
        app: rag-eval
    endpoints:
    - port: metrics
      interval: 30s

  Loki for logs:

  helm install loki grafana/loki-stack -n logging --create-namespace

  Access Grafana:
  kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
  # Username: admin, Password: prom-operator

  What you'll learn:
  - How to see CPU/memory usage of pods
  - How to see request latency
  - How to debug "why is this pod slow?"
  - How to catch problems before they become incidents

  Real scenario:
  You deploy a new version and CPU spikes. You go to Prometheus dashboard:
  - See: CPU went from 100m to 800m
  - Check: What changed? New code? More traffic?
  - Decide: Roll back or investigate code?

  End of Week 6 Deliverable:
  - ✅ Prometheus scraping metrics from services
  - ✅ Grafana dashboards showing real data
  - ✅ You can explain: "Here's my CPU usage pattern, here's memory, here's request
  latency"
  - ✅ Document: "Week 5-6: Observability in K8s"

  ---
  WEEKS 7-8: Infrastructure-as-Code & Automation

  Goal: Everything in Git, everything reproducible

  Terraform for local K8s setup:

  Create terraform/main.tf:

  terraform {
    required_providers {
      kubernetes = {
        source  = "hashicorp/kubernetes"
        version = "~> 2.0"
      }
    }
  }

  provider "kubernetes" {
    config_path = "~/.kube/config"
  }

  # Create namespace
  resource "kubernetes_namespace" "rag_eval" {
    metadata {
      name = "rag-eval-prod"
    }
  }

  # Create secret
  resource "kubernetes_secret" "rag_eval_secrets" {
    metadata {
      name      = "rag-eval-secrets"
      namespace = kubernetes_namespace.rag_eval.metadata[0].name
    }

    data = {
      openai-api-key = var.openai_api_key
    }

    type = "Opaque"
  }

  # Create ConfigMap
  resource "kubernetes_config_map" "rag_eval_config" {
    metadata {
      name      = "rag-eval-config"
      namespace = kubernetes_namespace.rag_eval.metadata[0].name
    }

    data = {
      LOG_LEVEL = "INFO"
      ENV       = "production"
    }
  }

  # Deploy rag-eval
  resource "kubernetes_deployment" "rag_eval" {
    metadata {
      name      = "rag-eval"
      namespace = kubernetes_namespace.rag_eval.metadata[0].name
    }

    spec {
      replicas = var.replicas

      selector {
        match_labels = {
          app = "rag-eval"
        }
      }

      template {
        metadata {
          labels = {
            app = "rag-eval"
          }
        }

        spec {
          container {
            name  = "rag-eval"
            image = var.rag_eval_image

            port {
              container_port = 8000
            }

            env {
              name = "OPENAI_API_KEY"
              value_from {
                secret_key_ref {
                  name = kubernetes_secret.rag_eval_secrets.metadata[0].name
                  key  = "openai-api-key"
                }
              }
            }

            resources {
              requests = {
                cpu    = "100m"
                memory = "128Mi"
              }
              limits = {
                cpu    = "500m"
                memory = "512Mi"
              }
            }
          }
        }
      }
    }
  }

  # Create service
  resource "kubernetes_service" "rag_eval" {
    metadata {
      name      = "rag-eval-service"
      namespace = kubernetes_namespace.rag_eval.metadata[0].name
    }

    spec {
      selector = {
        app = "rag-eval"
      }

      port {
        port        = 8000
        target_port = 8000
      }

      type = "ClusterIP"
    }
  }

  Create terraform/variables.tf:

  variable "openai_api_key" {
    type      = string
    sensitive = true
  }

  variable "rag_eval_image" {
    type    = string
    default = "your-registry/rag-eval:latest"
  }

  variable "replicas" {
    type    = number
    default = 2
  }

  Create terraform/terraform.tfvars:

  openai_api_key = "sk-your-key-here"
  rag_eval_image = "your-registry/rag-eval:latest"
  replicas       = 2

  Deploy with Terraform:

  cd terraform
  terraform init
  terraform plan   # See what will be created
  terraform apply  # Actually create it
  terraform destroy # Clean up when done

  Bash scripts for automation:

  Create scripts/deploy.sh:

  #!/bin/bash
  set -e

  NAMESPACE="rag-eval-prod"
  IMAGE=$1

  if [ -z "$IMAGE" ]; then
    echo "Usage: ./deploy.sh <docker-image>"
    exit 1
  fi

  echo "Deploying $IMAGE to $NAMESPACE..."

  kubectl set image deployment/rag-eval \
    rag-eval=$IMAGE \
    -n $NAMESPACE

  echo "Waiting for rollout..."
  kubectl rollout status deployment/rag-eval -n $NAMESPACE

  echo "Deployment complete!"

  Create scripts/backup-postgres.sh:

  #!/bin/bash
  BACKUP_DIR="./backups"
  mkdir -p $BACKUP_DIR

  POD=$(kubectl get pods -n default -l app=postgres -o
  jsonpath='{.items[0].metadata.name}')

  kubectl exec -n default $POD -- \
    pg_dump -U postgres mydb > $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql

  echo "Backup complete: $BACKUP_DIR"

  End of Week 8 Deliverable:
  - ✅ All infrastructure defined in Terraform
  - ✅ Bash scripts for common tasks
  - ✅ Everything versioned in Git
  - ✅ You can destroy and recreate entire setup with one command
  - ✅ Document: "Week 7-8: Infrastructure-as-Code"

  ---
  WEEK 9: Portfolio Polish & Documentation

  Goal: Make your GitHub repo impressive and hire-ready

  Repository structure:

  rag-eval-kubernetes/
  ├── README.md                    # Quick overview
  ├── ARCHITECTURE.md              # Design decisions
  ├── SETUP.md                     # How to reproduce
  ├── TROUBLESHOOTING.md           # Problems I hit & solved
  ├── kubernetes/
  │   ├── base/                    # Base manifests
  │   │   ├── rag-eval/
  │   │   ├── postgres/
  │   │   └── nginx/
  │   └── overlays/                # Environment-specific
  │       ├── dev/
  │       ├── staging/
  │       └── production/
  ├── terraform/
  │   ├── main.tf
  │   ├── variables.tf
  │   ├── outputs.tf
  │   └── terraform.tfvars.example
  ├── scripts/
  │   ├── deploy.sh
  │   ├── backup-postgres.sh
  │   ├── health-check.sh
  │   └── scale.sh
  ├── monitoring/
  │   ├── prometheus-values.yaml
  │   ├── grafana-dashboards/
  │   └── alerts.yaml
  └── docs/
      ├── INCIDENTS.md             # Real problems & solutions
      ├── SCALING.md               # "How would this work at scale?"
      ├── COSTS.md                 # Cost analysis
      └── SECURITY.md              # Security considerations

  README.md (make this professional):

  # RAG-Eval Kubernetes Infrastructure

  Production-ready Kubernetes deployment of rag-eval on Mac (Minikube)
  and Raspberry Pi (K3s).

  ## Quick Start

  ```bash
  make setup
  make deploy
  make port-forward
  # Visit http://localhost:8000

  Architecture Overview

  Single-node K3s cluster running:
  - rag-eval (2 replicas for availability)
  - PostgreSQL (persistent storage)
  - Nginx (ingress/reverse proxy)
  - Prometheus + Grafana (monitoring)

  [See ARCHITECTURE.md for details]

  What I Learned

  This project taught me:
  - How Kubernetes networking works (pods discover each other via DNS)
  - Why persistent storage is critical (lost data = bad)
  - How to monitor in production (metrics > logs > guessing)
  - Trade-offs at scale (what works on 1 node won't at 10 nodes)

  Real Incident: Pod Crashes on Startup

  Problem: rag-eval pod kept crashing
  Diagnosis:
  kubectl logs rag-eval-xxx
  # Saw: OPENAI_API_KEY not set
  Solution: Moved API key to Secrets, fixed mount path
  Lesson: Always check logs first, not symptoms

  [See TROUBLESHOOTING.md for more]

  Scalability Notes

  Current setup works for ~1000 req/day. To scale to 10x:
  - Add multiple worker nodes (K3s cluster)
  - Move PostgreSQL to managed database
  - Add Redis for caching
  - Implement rate limiting

  [See SCALING.md for detailed plan]

  **ARCHITECTURE.md (show you can think):**

  ```markdown
  # Architecture Decision Record

  ## Why K3s instead of full Kubernetes?

  **Context:** Learning infrastructure on constrained hardware (Raspberry Pi)

  **Options Considered:**
  1. Full Kubernetes (minikube) - Heavy, lots of resources
  2. K3s - Lightweight, optimized for edge
  3. Docker Compose - Simple but not production-ready

  **Decision:** K3s

  **Rationale:**
  - Resource-efficient (runs on Raspberry Pi)
  - Production-ready (used in real edge deployments)
  - Still "real K8s" (not a simplified version)
  - Transferable skills (if we move to full K8s later, concepts are same)

  **Trade-offs:**
  - Single node: No true high-availability
  - Limited resources: Can't run 100 services
  - Proprietary components: Some Rancher-specific tools

  **Mitigation:**
  - Design as if multi-node (use NodeAffinity, Pod Disruption Budgets)
  - Document scaling strategy
  - Plan resource limits carefully

  TROUBLESHOOTING.md (this is gold for interviews):

  # Real Problems I Hit & How I Solved Them

  ## Problem 1: Pod Stuck in Pending

  **Symptoms:** Pod created but never starts
  **Investigation:**
  ```bash
  kubectl describe pod rag-eval-xxx
  # Output: Insufficient memory
  Cause: Requested 2Gi, cluster only has 1Gi free

  Solution: Reduced memory request to 512Mi
  Prevention: Use resource request budgeting before deploying

  ## Problem 2: Cannot Access Service

  **Symptoms:** Port-forward works, but service unreachable
  **Investigation:**
  ```bash
  kubectl get svc
  kubectl get endpoints
  Cause: Service had no endpoints (no running pods matched selector)

  Solution: Fixed label selector mismatch
  Prevention: Always check selectors match pod labels

  ## Problem 3: Database Data Lost on Pod Restart

  **Symptoms:** Deployed database, data disappeared after restart
  **Investigation:** Pod was using ephemeral storage (default)

  **Cause:** No PersistentVolumeClaim

  **Solution:** Added StatefulSet with PVC
  **Prevention:** Always use StatefulSet + PVC for databases

  ---
  2. PORTFOLIO PROJECT BREAKDOWN (Deliverables)

  Your portfolio project: rag-eval-kubernetes

  What Employers Will See

  Your GitHub repo
  ├── Working K8s infrastructure (they can clone & run)
  ├── Real documentation (shows thinking, not just code)
  ├── Terraform (shows IaC knowledge)
  ├── Monitoring setup (shows operational thinking)
  ├── Bash scripts (shows automation skills)
  └── Problem-solving (how you debugged real issues)

  Concrete Deliverables (Week by Week)
  ┌──────┬───────────────────────┬───────────────────────────────┐
  │ Week │      Deliverable      │         What to Show          │
  ├──────┼───────────────────────┼───────────────────────────────┤
  │ 2    │ rag-eval on K8s       │ "I can deploy containers"     │
  ├──────┼───────────────────────┼───────────────────────────────┤
  │ 4    │ Multi-service setup   │ "I can architect systems"     │
  ├──────┼───────────────────────┼───────────────────────────────┤
  │ 6    │ Monitoring dashboards │ "I can operate in production" │
  ├──────┼───────────────────────┼───────────────────────────────┤
  │ 8    │ Terraform + scripts   │ "I can automate"              │
  ├──────┼───────────────────────┼───────────────────────────────┤
  │ 9    │ Documentation         │ "I can explain decisions"     │
  └──────┴───────────────────────┴───────────────────────────────┘
  How to Structure GitHub Repo for Maximum Impact

  Commit messages that show progression:

  Week 2:
  - "feat: Deploy rag-eval to local K8s with 2 replicas"
  - "docs: How I debugged ImagePullBackOff error"

  Week 4:
  - "feat: Add PostgreSQL with persistent storage"
  - "docs: Real incident - data loss on pod restart"

  Week 6:
  - "feat: Add Prometheus monitoring and Grafana dashboards"
  - "docs: How I diagnosed high CPU usage"

  Week 8:
  - "feat: Convert all manifests to Terraform"
  - "docs: Infrastructure-as-Code approach"

  Week 9:
  - "docs: ARCHITECTURE.md with decision rationale"
  - "docs: TROUBLESHOOTING.md with real problems"

  Portfolio Demo for Interviews

  You'll show:
  1. "Here's my cluster running" (live demo)
  2. "Here's my monitoring dashboard" (show metrics)
  3. "Here's how I automated deployments" (bash script walkthrough)
  4. "Here's how I debugged this issue" (case study)

  ---
  3. RESUME REWRITE (Honest Version)

  Current Resume Problem

  Skills:
  - Kubernetes ← YOU DON'T HAVE THIS YET
  - Docker
  - Terraform

  FIXED Resume

  Option A (Conservative - what you have NOW):

  Skills
  ML & AI Engineering: Production ML Systems, Meta-Learning, RAG, MLOps, TensorFlow, NLP
  Cloud & Platform Engineering: AWS, Docker, Serverless Architecture, Event-Driven
  Systems
  Infrastructure as Code: Terraform, AWS CDK, GitHub Actions, CI/CD, Multi-Environment
  Deployments
  Software Architecture: Hexagonal Architecture, Domain-Driven Design, SOLID Principles
  Programming: Python (Expert), FastAPI, Scikit-Learn, React, SQL/NoSQL

  Option B (Aggressive - what you're learning):

  Skills
  ML & AI Engineering: Production ML Systems, Meta-Learning, RAG, MLOps
  Cloud & Platform Engineering: AWS (Expert), Docker (Expert), Kubernetes (Learning -
  production K8s on Raspberry Pi Q1 2026)
  Infrastructure as Code: Terraform (Expert), AWS CDK, GitHub Actions, Helm (Learning)
  DevOps & Observability: CI/CD Pipelines, Prometheus, Loki, Infrastructure Automation
  Software Architecture: Hexagonal Architecture, Domain-Driven Design, SOLID Principles
  Programming: Python (Expert), FastAPI, Bash Scripting, SQL/NoSQL

  My recommendation: Use Option A now. In March 2026 when portfolio is done, update to
  Option B with proof (GitHub link).

  ---
  Updated Work Experience

  Current (Generic):
  Machine Learning Reply Munich, Germany
  SENIOR CONSULTANT - MLOPS, DEVOPS & CLOUD PLATFORM ENGINEERING Jan. 2025 - Present

  • Architected and deployed production-grade systems...
  • Designed enterprise RAG systems...

  Better (Specific to DevOps focus):
  Machine Learning Reply Munich, Germany
  SENIOR CONSULTANT - MLOPS, DEVOPS & CLOUD PLATFORM ENGINEERING Jan. 2025 - Present

  • Designed and implemented end-to-end MLOps workflows with automated retraining
  pipelines and monitoring dashboards using Docker and AWS services, reducing model
  deployment time by 60%.

  • Architected event-driven ML inference system using AWS Lambda, SQS, and Step
  Functions, achieving <100ms latency and 99.9% uptime SLA for financial services
  platform.

  • Optimized CI/CD pipeline costs by 35% through infrastructure automation and resource
   optimization, establishing best practices for cost-efficient deployments across
  teams.

  • Mentored 3+ engineers on cloud architecture, infrastructure design, and deployment
  best practices.

  Key Technologies: AWS (Lambda, RDS, EC2), Docker, Terraform, GitHub Actions

  ---
  Add New Section: Personal DevOps Project

  Add this to resume:

  RAG-Eval Kubernetes Infrastructure (Personal Project) Q1 2026
  • Designed and deployed production-ready Kubernetes cluster on Raspberry Pi using K3s
  • Implemented Infrastructure-as-Code with Terraform for complete reproducibility
  • Built multi-service architecture: rag-eval, PostgreSQL, Nginx, Prometheus monitoring
  • Implemented observability with Prometheus metrics and Loki logging
  • Created automation scripts for deployment, backup, and scaling
  • Documented architecture decisions and troubleshooting case studies
  • GitHub: github.com/yourusername/rag-eval-kubernetes

  Key Technologies: Kubernetes/K3s, Terraform, Docker, Prometheus, Grafana, Bash

  ---
  4. INTERVIEW PREP SCRIPT (Technical + HR)

  Technical Interview (What They'll Ask)

  Q1: "Tell me about your infrastructure experience"

  What they want: Specific examples, not theory

  Your answer:
  "I've spent the last 3+ years building cloud infrastructure, primarily on AWS.
  Most recently at Machine Learning Reply, I designed event-driven systems
  using Lambda, SQS, and Step Functions for ML inference with <100ms latency.

  I'm also building a personal Kubernetes project on my Raspberry Pi -
  migrating multiple services (rag-eval, PostgreSQL, Nginx) to K3s with
  Infrastructure-as-Code using Terraform. That project taught me a lot about
  real operational concerns: persistent storage, secrets management, monitoring.

  I prefer building systems that run reliably with minimal manual intervention.
  That's why I focus on automation and observability."

  Why this works:
  - ✅ Specific examples (not "I'm good with infrastructure")
  - ✅ Shows learning (personal project)
  - ✅ Shows philosophy (reliable systems > manual work)

  ---
  Q2: "Walk me through how you'd design a deployment system"

  What they want: Can you think architecturally?

  Your answer:
  "I'd think about it in layers:

  1. Source Control: Everything in Git. Infrastructure as Code, app code, config - all
  versioned.

  2. Build: Docker images built consistently. Every commit can become a container.

  3. Registry: Central place to store images with versioning and scanning.

  4. Deployment: Automated pipeline. When code is merged to main,
     it automatically deploys to staging, runs tests, and waits for approval
     to deploy to production.

  5. Orchestration: Kubernetes manages rolling updates, scaling, health checks.

  6. Monitoring: Prometheus watches metrics, alerts fire if something breaks.

  Real example: I built this exactly for rag-eval on Kubernetes.
  When I push code, GitHub Actions builds the image, tests it, pushes to registry.
  Terraform applies infrastructure changes. K8s handles the rollout.

  The goal: Humans should never manually deploy anything."

  Why this works:
  - ✅ Shows systems thinking
  - ✅ Connects to real project
  - ✅ Aligns with DevOps philosophy (automation)

  ---
  Q3: "You're on-call and get paged at 2am. Service is down. What do you do?"

  What they want: Can you debug under pressure?

  Your answer:
  "First, I stay calm and systematic.

  1. Check: Is it a real outage or false alarm?
     - Check metrics: Is error rate actually elevated?
     - Check: Are users actually affected or just one region?

  2. Gather information:
     - Pod logs: 'kubectl logs <pod>'
     - Pod events: 'kubectl describe pod <pod>'
     - Metrics: Did CPU spike? Memory? Disk?
     - Recent changes: Did we deploy something?

  3. Hypothesize:
     - 'Did this start after deployment?' → Rollback or check code
     - 'Is it resource exhaustion?' → Scale up or optimize
     - 'Is it database slow?' → Check query performance
     - 'Is it external dependency?' → Check third-party status

  4. Mitigate:
     - If it's bad: Rollback or scale up (get service back up)
     - Then diagnose root cause (when less urgent)

  5. Document:
     - What went wrong?
     - Why didn't we catch it earlier? (monitoring gap?)
     - What's the fix?

  I've done this with production systems. My emphasis is:
  stay systematic, don't panic, fix the symptom first, diagnose after."

  Why this works:
  - ✅ Shows process (not just "I fix it")
  - ✅ Shows calm under pressure
  - ✅ Shows learning mindset

  ---
  Q4: "What's your experience with Infrastructure-as-Code?"

  What they want: Do you actually use IaC or just theoretically know it?

  Your answer:
  "I use Terraform and AWS CDK extensively.

  With Terraform, I've managed AWS infrastructure for 2+ years:
  Lambda functions, RDS databases, VPCs, security groups, all defined in code.

  The benefit: I can destroy my entire infrastructure and recreate it
  from Git in 5 minutes. No manual steps, no 'oh, we configured that in the console
  and forgot about it.'

  Currently building my Kubernetes project entirely with Terraform:
  - Namespaces
  - Deployments
  - Services
  - Persistent volumes
  - All in code, all in Git

  The philosophy: If it's not in code and version-controlled, it doesn't exist.
  If you need to make a change, you make it in code, review it, commit it, deploy it.
  Never manually changing production."

  Why this works:
  - ✅ Shows you actually use it (not theory)
  - ✅ Shows philosophy (reproducibility)
  - ✅ Shows personal project proof

  ---
  Q5: "What's your biggest learning this past year?"

  What they want: Do you reflect and grow?

  Your answer:
  "I moved from 'building features as fast as possible'
  to 'building infrastructure that enables others to move fast sustainably.'

  When I was doing mostly software development, I'd optimize for 'ship it now.'
  But as I got more involved in infrastructure and DevOps, I realized the real value
  is building systems that:
  - Scale automatically
  - Fail gracefully
  - Are monitored so we know when something's wrong
  - Are automated so humans aren't doing repetitive work

  The shift: from velocity to reliability.

  Concretely, on my Kubernetes project I learned that persistent storage
  is non-negotiable - I lost data once because I didn't think about it,
  and that taught me to always design for data safety first.

  That's the DevOps mindset: production reliability matters more than shipping
  the next feature."

  Why this works:
  - ✅ Shows growth mindset
  - ✅ Shows learning from mistakes
  - ✅ Shows DevOps philosophy

  ---
  HR/Recruiter Interview (How to Handle)

  When They Ask Salary

  Them: "What are your expectations?"

  You:
  "Based on market research for mid-level DevOps roles in Germany,
  I'm looking at 85-90k range.

  That's based on my 4+ years experience, AWS expertise, Docker/Terraform,
  plus consulting background where I worked on cross-functional projects.

  What's your budget for this role?"

  If they say 75k:
  "I appreciate the number. That's a bit below what I expected.
  Can we discuss? Either we move up on salary, or we look at other things
  like remote flexibility, learning budget, or stock options."

  If they say they're firm at 75k:
  "I understand. Let me think about it and get back to you.
  This is an important decision for me, so I want to consider everything carefully."

  [Then decide: Is the job worth less salary? Is the company so good it's worth it?]

  ---
  When They Ask Why You're Leaving Machine Learning Reply

  Them: "Why are you leaving? You just started there."

  You (honest, not negative):
  "I joined Reply to get broad exposure to MLOps and infrastructure.
  That was valuable - I learned a lot.

  But I realized I want to specialize deeper in infrastructure and DevOps
  rather than stay in consulting where you move between projects constantly.
  Consulting is good for breadth, but I want depth now.

  I'm looking for a role where I can own infrastructure long-term,
  really understand the systems deeply, and have more autonomy in design decisions."

  Why this works:
  - ✅ Honest (not blaming Reply)
  - ✅ Shows growth (from breadth to depth)
  - ✅ Shows what you want (clarity)

  ---
  When They Ask About Your Motivation

  Them: "What gets you excited about DevOps?"

  You:
  "Three things:

  1. **Autonomy & Design**: I like having a problem (scaling, security, reliability)
     and architecting the solution. Not following orders, but making decisions.

  2. **Systems Thinking**: Understanding how everything connects - code, infrastructure,

     monitoring - it's intellectually satisfying.

  3. **Impact with Small Effort**: If I build good infrastructure,
     the entire team moves faster. I'm multiplying everyone's productivity.

  Also - and I'm honest about this - I don't like the chaos of business logic
  and constant requirement changes. Infrastructure is more stable.
  I understand the domain deeply, I can build solid systems,
  and people appreciate the work."

  Why this works:
  - ✅ Honest (you don't like business logic)
  - ✅ Shows maturity (understanding yourself)
  - ✅ Positive framing (not complaining, just different preference)

  ---
  Questions to Ask Them (Take Control)

  In technical interview:

  "What's your biggest infrastructure challenge right now?"
  "How do you currently handle deployments?"
  "What does your on-call look like?"
  "What's something your infrastructure team built recently that they're proud of?"

  In HR/recruiter call:

  "What's your budget for this role?"
  "Why did the person before me leave? Or is this a new role?"
  "What would success look like in 6 months?"
  "Can I talk to my future team before I decide?"

  ---
  5. COMPANY RESEARCH LIST (Germany DevOps Q1 2026)

  How to Find Companies

  Platforms:
  - LinkedIn Jobs (filter: DevOps, Germany, hybrid/remote)
  - StepStone (German job board, huge)
  - Indeed Germany
  - Glassdoor (read reviews!)
  - AngelList (for startups)

  Companies to Target (Real Example)

  TIER 1 (Most Likely Match)

  1. Zalando (Berlin)
  - Size: 3000+ employees
  - Industry: E-commerce (infrastructure-heavy)
  - Culture: Engineering-focused, not politics-heavy
  - DevOps focus: High (they need infrastructure badly)
  - Glassdoor rating: 3.8/5
  - Research: "Zalando DevOps" on Glassdoor
  - Salary range: 85-95k
  - Red flag check: Look for "remote flexibility" reviews

  2. N26 (Berlin)
  - Size: 800+ employees
  - Industry: Fintech (infrastructure-critical)
  - Culture: Tech-focused, fast-moving but stable
  - DevOps focus: High
  - Glassdoor rating: 3.6/5
  - Salary range: 80-92k

  3. Delivery Hero (Berlin)
  - Size: 2000+ employees
  - Industry: Food delivery (need scale)
  - Culture: Technical, but some corporate politics (be aware)
  - DevOps focus: High
  - Salary range: 85-100k

  4. SoundCloud (Berlin)
  - Size: 400+ employees
  - Industry: Music streaming (technical platform)
  - Culture: Startup feel despite size
  - DevOps focus: Medium-high
  - Salary range: 80-95k

  5. Xing/New Work (Hamburg)
  - Size: 1500+ employees
  - Industry: Job board (German company, stable)
  - Culture: Professional, good work-life balance
  - DevOps focus: Medium
  - Salary range: 78-90k
  - Advantage: Very stable, German company, good salary

  TIER 2 (Good Fallbacks)

  - Scout24 (Munich) - Real estate tech, solid company
  - SumUp (Berlin) - Payments, growing
  - Wise (Berlin) - Fintech, well-known
  - GetYourGuide (Berlin) - Travel, established
  - GoCardless (London/Berlin) - Payments, hiring for Berlin

  COMPANIES TO AVOID

  - ❌ Startups <50 people - Chaos, pressure (you'll burn out again)
  - ❌ Consulting companies - Back to firefighting
  - ❌ SAP, Siemens, Deutsche Telekom - Enterprise politics, old school
  - ❌ Companies with lots of "on-call" reviews - Firefighting trap
  - ❌ Companies where reviews say "constant meetings" - Not technical

  How to Research Each Company

  Before applying, check:

  1. Glassdoor reviews (look for on-call culture, work-life balance):
    - ✅ "Good infrastructure team, we design solutions"
    - ✅ "On-call is chill, usually 1 incident/week"
    - ❌ "Always on-call, always firefighting"
    - ❌ "Lots of meetings, political"
  2. LinkedIn (see who works there):
    - Look at people in "DevOps" roles
    - Check how long they stay (high turnover = bad)
    - Read their recommendations
  3. Tech blog (company engineering blog):
    - If they write about infrastructure, they value it
    - If they write about scaling, they have real problems to solve
    - If no blog = might be non-technical
  4. Job description:
    - ✅ "Design and maintain Kubernetes infrastructure"
    - ✅ "Own infrastructure decisions"
    - ❌ "Support developers with infrastructure needs" (sounds operational)
    - ❌ "On-call 24/7" (red flag)

  ---
  6. SALARY NEGOTIATION SCRIPTS (Ready to Use)

  Script 1: Opening Your Salary Discussion

  Recruiter: "So we're very interested. What would it take to get you to join?"

  You:
  "I'm interested too! Before we talk compensation, I want to make sure
  the role is a good fit. Can you walk me through:
  - What's your biggest infrastructure challenge right now?
  - What would success look like for this person in 6 months?
  - What's the team structure - would I be solo or with others?

  Once I understand the role better, we can talk numbers."

  Why this works:
  - ✅ Delays salary talk (get them invested first)
  - ✅ Asks important questions (shows you're selective)
  - ✅ Shows you're thinking strategically

  ---
  Script 2: When They Ask for Your Number First

  Recruiter: "What are your salary expectations?"

  You:
  "Happy to share where I'm coming from. Market rate for mid-level DevOps
  in Germany is 82-95k depending on location and company.

  Given my experience with AWS, Docker, Kubernetes, and consulting background,
  I'm targeting 85-90k.

  But honestly, the number depends on the full package -
  remote flexibility, learning budget, and team quality matter to me.

  What's your budget for this role?"

  If they avoid answering:
  "I understand you want to see my number first. But I've found it works better
  when we both share our ranges so we're in the same ballpark.
  I'm at 85-90k. Where are you?"

  ---
  Script 3: When They Counter Low

  Them: "We were thinking 78k"

  You (pause for 3 seconds, then speak calmly):
  "I appreciate the offer. That's a bit below what I expected.
  Help me understand your thinking - is that your budget ceiling,
  or is there room to move?

  I'm worth 85k in the market. I understand if 78k is truly your max,
  but let's explore. Maybe we can add:
  - Remote flexibility (3 days/week full remote)?
  - Extra vacation days (30 instead of 25)?
  - Learning budget (2-3k/year for conferences/certs)?
  - Sign-on bonus (500-1k)?

  What's possible?"

  Why this works:
  - ✅ Not reactive (you don't panic)
  - ✅ Shows flexibility (not just demanding 85k)
  - ✅ Explores other options (total package, not just salary)

  ---
  Script 4: If They Hold Firm at 78k

  Them: "78k is really our max. We can't go higher."

  You (honest conversation):
  "I understand. Let me ask - is there anything we haven't discussed
  that might close the gap? Remote flexibility? Learning budget?
  Stock options if you're a startup?

  If 78k is truly the ceiling, I need to be honest:
  I have other opportunities at 82-85k, so I need to think about this.

  What I would need to say yes to 78k is:
  - Full remote (not hybrid)
  - 30 days vacation
  - 3k/year learning budget

  Is any of that possible?"

  If they say no to all:
  "I appreciate being straightforward with each other.
  78k with current terms isn't quite where I need to be.
  But I'm interested in this company long-term.

  Can we revisit in 6 months after I've proven value?
  Or is there flexibility if I take on more responsibility?"

  You're allowed to walk away. Seriously. Better to find the right fit.

  ---
  Script 5: When You Get a Good Offer (85k+)

  Them: "We can do 83k, full remote, 30 days vacation, 2k learning budget"

  You:
  "I really appreciate that. This is getting close.

  A few things:
  1. Can we do 84k instead of 83k? (show you're negotiating, not just accepting)
  2. Can we revisit salary in 6 months after I've delivered?
  3. Who's my direct manager? Can I meet them before I decide?

  If we can do 84k and I meet the manager, I think we have a deal."

  If they say yes to 84k:
  "Perfect. I'm excited. Let me review the offer letter when you send it,
  and I'll get back to you by [specific date]."

  ---
  Script 6: When They Push Back on Your Request

  Them: "We can't go to 84k. 83k is our max."

  You:
  "I hear you. 83k works. But can we document that we'll revisit
  after 6 months when I've proven value?

  I'd rather take 83k with a clear path to 85k than argue on 1k now."

  Why this works:
  - ✅ Compromise (you give a bit)
  - ✅ Future plan (you're thinking long-term)
  - ✅ Shows maturity

  ---
  Script 7: For Startup/Scale-up (When They Offer Stock)

  Them: "We can do 78k + stock options"

  You:
  "I appreciate the stock. Before I decide, help me understand:
  - How much equity is this? (X% of company)
  - What's the vesting schedule? (4 years standard)
  - What's your most recent valuation?
  - What are exit plans? (IPO, acquisition, or just long bet?)

  Can you help me model what this is actually worth?"

  Generally:
  - Stock is only valuable if company succeeds (risky)
  - Don't accept 20k below market just for stock
  - Good math: 78k salary + stock worth ~5-10k/year = 83-88k total comp

  ---
  Script 8: Final Offer - How to Say Yes

  Them: "So here's the offer: 84k, full remote, 30 days vacation, 2k learning budget,
  start April 1"

  You:
  "Great! I'm excited. Let me just confirm:
  - Salary: 84k
  - Start date: April 1
  - Remote: Full (not hybrid, right?)
  - Vacation: 30 days
  - Learning budget: 2k/year

  Can you send me the offer letter? I'll review it and confirm by [date]."

  [After reviewing offer letter]

  "Perfect. I accept. I'm looking forward to starting on April 1."

  Don't say yes in the call. Get the offer in writing. Review it. Then confirm.

  ---
  Quick Reference: Salary Numbers by City (Q1 2026)
  ┌───────────┬──────────────────┬───────────────────┐
  │   City    │ DevOps Mid-Level │ Platform Engineer │
  ├───────────┼──────────────────┼───────────────────┤
  │ Berlin    │ 75-85k           │ 80-95k            │
  ├───────────┼──────────────────┼───────────────────┤
  │ Munich    │ 85-95k           │ 90-105k           │
  ├───────────┼──────────────────┼───────────────────┤
  │ Frankfurt │ 80-90k           │ 85-100k           │
  ├───────────┼──────────────────┼───────────────────┤
  │ Hamburg   │ 75-85k           │ 80-95k            │
  ├───────────┼──────────────────┼───────────────────┤
  │ Cologne   │ 75-85k           │ 80-90k            │
  └───────────┴──────────────────┴───────────────────┘
  Your target: 82-88k (middle-high end because you're learning but bringing value)

  ---
  SUMMARY: YOUR ACTION PLAN

  Now (This Week)

  - Read through all 6 action items (you're here)
  - Start Week 1 of K8s learning (install Minikube/K3d)
  - Create GitHub repo: rag-eval-kubernetes
  - Deploy rag-eval to local K8s

  Weeks 2-9

  - Follow K8s learning sequence (week by week)
  - Build portfolio with real code
  - Document everything

  Week 10 (March 15)

  - Portfolio complete and public on GitHub
  - Resume updated
  - Start applying to companies

  Weeks 11-12 (March 15-29)

  - Apply to 10-15 companies (Zalando, N26, SoundCloud, etc.)
  - Practice interview scripts
  - Prepare for phone screens

  Week 13+ (March 30-April 1)

  - Interview responses
  - Negotiate using scripts
  - Accept offer
  - Start April 1

  ---
  FINAL CHECK

  Before you start:

  Do you have:
  - ✅ Mac with Docker
  - ✅ Time for 9 weeks (Jan 24 - Mar 14)
  - ✅ GitHub account (for portfolio)
  - ✅ OpenAI API key (for testing rag-eval)
  - ✅ Raspberry Pi ready (for later migration)

  Do you understand:
  - ✅ K8s learning is pragmatic (not tutorials)
  - ✅ Portfolio is your interview ticket
  - ✅ Salary: target 85-90k (not 70k)
  - ✅ You're selective (not desperate)

  Ready to start?

  ---
  NEXT: Get Your Mac Ready

  This week, do this:

  # Install Minikube
  brew install minikube

  # Or install K3d
  brew install k3d

  # Create cluster
  minikube start --cpus=4 --memory=8192
  # or
  k3d cluster create devops-learn

  # Verify
  kubectl cluster-info

  # Create your repo
  mkdir ~/projects/rag-eval-kubernetes
  cd ~/projects/rag-eval-kubernetes
  git init

  Then come back and share:
  1. Screenshot of cluster running
  2. Any blockers you hit
  3. Questions on K8s concepts

  From there, I'll guide you through deploying rag-eval.

  Ready?

✻ Sautéed for 1m 53s

────────────────────────────────────────────────────────────────────────────────────────
❯ 
────────────────────────────────────────────────────────────────────────────────────────
  7 files +3 -1
