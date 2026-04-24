import { useState, useEffect, useRef, useCallback } from "react";

const phases = [
  {
    id: 1,
    title: "Phase 1",
    subtitle: "Foundations",
    weeks: "Weeks 1–8",
    color: "#4ade80",
    accent: "#166534",
    description: "Build the mental model across all three layers simultaneously. Agent concepts, platform thinking, and distributed systems foundations run in parallel — not sequentially.",
    weeklyHours: "7 hrs/week",
    focus: ["Agentic AI concepts", "Platform-as-product thinking", "Distributed systems basics", "First toy agent"],
    weeks_data: [
      {
        week: 1,
        title: "Mental models first",
        hours: 7,
        tasks: [
          { type: "read", label: "Anthropic — 'Building Effective Agents' essay", url: "https://www.anthropic.com/research/building-effective-agents", time: "1.5h" },
          { type: "read", label: "Evan Bottcher — 'What I Talk About When I Talk About Platforms'", url: "https://martinfowler.com/articles/talk-about-platforms.html", time: "1h" },
          { type: "read", label: "Team Topologies 2nd ed — chs 1–3 (four team types, interaction modes)", time: "1.5h" },
          { type: "read", label: "DDIA 2nd ed — foreword + ch 1 (reliability, scalability, maintainability)", time: "1.5h" },
          { type: "habit", label: "Set up: subscribe to Platform Weekly, Latent Space, Simon Willison blog, SRE Weekly", time: "0.5h" },
          { type: "habit", label: "Join: platformengineering.org Slack, CNCF Cloud Native AI WG Slack, MCP Discord", time: "0.5h" },
        ],
        checkpoint: "You can articulate why the IDP agent is the mechanical expression of X-as-a-Service interaction mode."
      },
      {
        week: 2,
        title: "Agent foundations — free courses + Ed Donner module 1",
        hours: 7,
        tasks: [
          { type: "course", label: "DeepLearning.AI — 'Agentic AI' (Andrew Ng) — full course", url: "https://www.deeplearning.ai/short-courses/agentic-ai/", time: "4h" },
          { type: "course", label: "Ed Donner — Module 1: Foundations (1_foundations) — design patterns in code: tool use, memory, planning, multi-agent. Do all labs.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "1.5h" },
          { type: "read", label: "Lilian Weng — 'LLM Powered Autonomous Agents'", url: "https://lilianweng.github.io/posts/2023-06-23-agent/", time: "1h" },
          { type: "read", label: "DDIA ch 2 (data models)", time: "0.5h" },
        ],
        checkpoint: "You understand the four agentic design patterns both conceptually (Andrew Ng) and in code (Ed Donner). You've run the foundations labs."
      },
      {
        week: 3,
        title: "LangGraph vs OpenAI SDK — two frameworks, one problem",
        hours: 7,
        tasks: [
          { type: "course", label: "DeepLearning.AI — 'AI Agents in LangGraph' (Harrison Chase)", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/", time: "2.5h" },
          { type: "course", label: "Ed Donner — Module 2: OpenAI Agents SDK (2_openai) — deliberate contrast with LangGraph. Same problem, different ergonomics. Note what each trades off.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "2h" },
          { type: "build", label: "Build: LangGraph quickstart locally — ReAct agent with two tools", time: "1.5h" },
          { type: "read", label: "Fournier & Nowland — Platform Engineering chs 1–4 (what is platform engineering, the platform team)", time: "0.5h" },
          { type: "read", label: "DDIA ch 3 (storage engines)", time: "0.5h" },
        ],
        checkpoint: "Working LangGraph agent. You can articulate 3 concrete differences between LangGraph and the OpenAI Agents SDK and when you'd choose each."
      },
      {
        week: 4,
        title: "MCP — the critical skill for platform engineers",
        hours: 7,
        tasks: [
          { type: "course", label: "DeepLearning.AI — 'MCP: Build Rich-Context AI Apps with Anthropic'", url: "https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic", time: "2h" },
          { type: "course", label: "Anthropic Academy — 'Intro to MCP' + 'MCP Advanced Topics'", url: "https://anthropic.skilljar.com/", time: "2h" },
          { type: "build", label: "Install: AWS MCP suite (awslabs/mcp) + GitHub MCP + Kubernetes MCP server against a kind cluster", time: "2h" },
          { type: "read", label: "vRabbi blog — 'Backstage as the Ultimate MCP Server'", url: "https://vrabbi.cloud/post/backstage-as-the-ultimate-mcp-server/", time: "0.5h" },
          { type: "habit", label: "Weekly reading: Platform Weekly + Simon Willison + Latent Space", time: "0.5h" },
        ],
        checkpoint: "You can wire up 3+ MCP servers and have Claude/your agent call them successfully."
      },
      {
        week: 5,
        title: "Evals, observability, and multi-agent mental models",
        hours: 7,
        tasks: [
          { type: "read", label: "Hamel Husain — 'Your AI Product Needs Evals'", url: "https://hamel.dev/blog/posts/evals/", time: "1h" },
          { type: "read", label: "Eugene Yan — 'Patterns for Building LLM-based Systems & Products'", url: "https://eugeneyan.com/writing/llm-patterns/", time: "1h" },
          { type: "build", label: "Set up Langfuse (Docker) — instrument last week's agent, trace every tool call", time: "2h" },
          { type: "course", label: "Ed Donner — Module 3: CrewAI (3_crew) — skim videos only (~45 min), skip labs unless interesting. Focus on role-based multi-agent decomposition patterns — you'll apply these in week 22.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "0.75h" },
          { type: "read", label: "Fournier & Nowland — chs 5–7 (measuring platform success, developer experience, golden paths)", time: "1.25h" },
          { type: "read", label: "DDIA ch 5 (replication) + State of Platform Engineering Vol 4 executive summary", time: "1h" },
        ],
        checkpoint: "Langfuse tracing your agent. You know how Fournier defines platform success metrics. You understand how CrewAI decomposes workflows into specialist agents."
      },
      {
        week: 6,
        title: "Backstage — understand the catalog before you wire an agent to it",
        hours: 7,
        tasks: [
          { type: "build", label: "Run Backstage locally — explore the software catalog, service templates, TechDocs", url: "https://backstage.io/docs/getting-started/", time: "3h" },
          { type: "read", label: "Backstage docs — plugin architecture, Entity model (Component, API, System, Resource, Domain)", time: "1h" },
          { type: "read", label: "PlatformCon 2025 — SONIC framework session (2025.platformcon.com/program)", time: "1h" },
          { type: "read", label: "DDIA ch 6 (partitioning)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "You understand what data lives in the Backstage catalog and why it's the right knowledge base for an IDP agent."
      },
      {
        week: 7,
        title: "GitOps deep dive — Flux/ArgoCD as the agent's write path",
        hours: 7,
        tasks: [
          { type: "read", label: "AWS Prescriptive Guidance — 'Argo CD and Flux use cases' (decision framework)", time: "1h" },
          { type: "build", label: "Set up Flux or ArgoCD on kind — deploy a sample app via GitOps, break it, watch reconciliation", time: "3h" },
          { type: "read", label: "Kratix docs — understand Promises, Workflows, and the inner-source marketplace model", url: "https://docs.kratix.io/", time: "1.5h" },
          { type: "read", label: "DDIA ch 7 (transactions)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "You can articulate exactly what happens between 'agent opens PR' and 'resource exists in cluster'. No magic steps."
      },
      {
        week: 8,
        title: "Phase 1 checkpoint — design your capstone agent",
        hours: 7,
        tasks: [
          { type: "read", label: "Fournier & Nowland — chs 8–10 (build vs buy, platform roadmap, organizational dynamics)", time: "2h" },
          { type: "read", label: "Team Topologies — chs 4–6 (stream-aligned, platform, enabling, complicated-subsystem teams)", time: "1.5h" },
          { type: "build", label: "Write a 1-page design doc for your IDP agent — scope: 'handle a developer's EKS namespace request end-to-end via Slack + PR'", time: "2h" },
          { type: "read", label: "DDIA ch 8 (trouble with distributed systems)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Design doc exists. You can draw the full architecture: Slack → LangGraph agent → GitHub MCP → PR → Flux → cluster."
      }
    ]
  },
  {
    id: 2,
    title: "Phase 2",
    subtitle: "Build the Core Agent",
    weeks: "Weeks 9–16",
    color: "#60a5fa",
    accent: "#1e3a8a",
    description: "Ship a working GitOps-native IDP agent against a real (staging) environment. By end of phase you have a Slack bot that can handle namespace requests end-to-end with evals proving it works.",
    weeklyHours: "7 hrs/week",
    focus: ["LangGraph + MCP agent scaffold", "GitOps write path via GitHub MCP", "OPA policy pre-flight checks", "Eval set + Langfuse tracing"],
    weeks_data: [
      {
        week: 9,
        title: "Scaffold the agent — Slack bot + LangGraph + MCP",
        hours: 7,
        tasks: [
          { type: "build", label: "Scaffold Slack bot using Bolt SDK — connect to your LangGraph agent as the backend", time: "3h" },
          { type: "build", label: "Wire GitHub MCP + AWS MCP + Kubernetes MCP as tools. Test: agent can read cluster state and query GitHub repos", time: "2.5h" },
          { type: "read", label: "Anthropic Academy — 'Claude Agent SDK' module", url: "https://anthropic.skilljar.com/", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Developer can DM the Slack bot and get a coherent response. Agent can call at least 3 MCP tools."
      },
      {
        week: 10,
        title: "The GitOps write path — PR generation",
        hours: 7,
        tasks: [
          { type: "build", label: "Build tool: generate_namespace_pr() — takes team name + params, renders YAML from template, commits to branch, opens PR via GitHub MCP", time: "4h" },
          { type: "read", label: "Kratix workshop — 'Writing your first Promise'", url: "https://docs.kratix.io/", time: "1.5h" },
          { type: "read", label: "DDIA ch 9 (consistency and consensus)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Agent opens a real PR in a test repo when asked for a namespace. PR contains valid Kubernetes YAML from your org's template."
      },
      {
        week: 11,
        title: "Policy pre-flight — OPA/Kyverno in the agent loop",
        hours: 7,
        tasks: [
          { type: "course", label: "Styra Academy — 'OPA by Example' (free)", url: "https://academy.styra.com/", time: "2h" },
          { type: "build", label: "Build tool: validate_against_policy() — runs OPA/Conftest against generated YAML before opening PR. Agent explains failures to developer in plain English", time: "3h" },
          { type: "read", label: "Styra Academy — 'Terraform compliance with OPA'", url: "https://academy.styra.com/", time: "1.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Agent catches a policy violation (e.g. missing resource limits) before opening a PR, and explains it to the developer clearly."
      },
      {
        week: 12,
        title: "Eval set — build your ground truth",
        hours: 7,
        tasks: [
          { type: "build", label: "Collect 20–30 real platform requests from Slack history / ticket backlog. Label expected outcomes. This is your eval set.", time: "3h" },
          { type: "build", label: "Wire eval set into Langfuse — run agent against all 20 requests, measure: correct tool called, PR opened, policy check triggered correctly", time: "2.5h" },
          { type: "read", label: "Anthropic prompt engineering interactive tutorial", url: "https://github.com/anthropics/prompt-eng-interactive-tutorial", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Eval set exists. You have a baseline accuracy score. You know which request types the agent gets wrong."
      },
      {
        week: 13,
        title: "Iterate on evals + Ed Donner LangGraph deep dive",
        hours: 7,
        tasks: [
          { type: "build", label: "Fix the top 3 failure modes from week 12 evals — improve tool descriptions, system prompt, or add a new tool. Re-run evals to confirm improvement.", time: "3h" },
          { type: "course", label: "Ed Donner — Module 4: LangGraph (4_langgraph) — NOW is the right time. You've built a real LangGraph agent for 4 weeks. Ed's content will surface gaps you didn't know you had. Pay close attention to his 'Sidekick' browser agent (project 6) for long-running stateful workflow patterns.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "3h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Eval score improved from baseline. You've identified at least one pattern from Ed's LangGraph module that you're applying to your own agent."
      },
      {
        week: 14,
        title: "Human-in-the-loop approval gates + Ed Donner AutoGen",
        hours: 7,
        tasks: [
          { type: "build", label: "Add Slack approval buttons: agent posts PR summary with ✅ Approve / ❌ Reject buttons. On approval, agent comments on the PR. Production namespaces require named approver.", time: "3.5h" },
          { type: "build", label: "Add Postgres checkpointer to LangGraph for durable state — agent survives restarts mid-workflow", time: "2h" },
          { type: "course", label: "Ed Donner — Module 5: AutoGen (5_autogen) — commute/background listening only (~45 min video). Skip labs. Focus on the remote agent collaboration pattern and the 'Agent Creator' project (project 7) — useful mental model for week 22's multi-agent account vending workflow.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "0.75h" },
          { type: "read", label: "DDIA ch 10 (batch processing)", time: "0.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.25h" },
        ],
        checkpoint: "Agent pauses mid-workflow, sends approval request to Slack, resumes correctly after approval. You understand AutoGen's remote collaboration model."
      },
      {
        week: 15,
        title: "Crossplane — control-plane patterns for the agent's resource model",
        hours: 7,
        tasks: [
          { type: "build", label: "Upbound 'Level Up with Crossplane' — deploy a Composite Resource Definition for EKS namespace + RBAC + NetworkPolicy", url: "https://blog.upbound.io/introducing-levelup-with-crossplane", time: "3h" },
          { type: "build", label: "Update agent's generate_namespace_pr() to target the Crossplane XRD instead of raw Kubernetes YAML — agent now generates a higher-level resource claim", time: "2h" },
          { type: "read", label: "DDIA ch 11 (stream processing)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Agent generates a Crossplane Claim YAML rather than raw Kubernetes objects. Crossplane handles the rest."
      },
      {
        week: 16,
        title: "Phase 2 checkpoint — demo and measure",
        hours: 7,
        tasks: [
          { type: "build", label: "End-to-end test: developer asks for namespace in Slack → agent validates → policy check passes → PR opened → platform engineer approves → Flux/ArgoCD reconciles → namespace exists", time: "2h" },
          { type: "build", label: "Write a short demo doc / brownbag deck: architecture, eval results, failure modes, known limitations", time: "2h" },
          { type: "read", label: "Chip Huyen — AI Engineering chs 1–4 (foundations, evaluation, prompt engineering, RAG)", time: "2.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Full end-to-end workflow demonstrated. Eval score documented. Colleagues have seen a demo."
      }
    ]
  },
  {
    id: 3,
    title: "Phase 3",
    subtitle: "Harden, Extend, Operate",
    weeks: "Weeks 17–24",
    color: "#f472b6",
    accent: "#831843",
    description: "Production-harden the agent, extend to a second use case, and build the durable habits that keep you relevant as the stack churns. By end of phase you have something worth publishing.",
    weeklyHours: "7 hrs/week",
    focus: ["Security hardening", "Second use case", "kagent deployment", "Contribution + publishing"],
    weeks_data: [
      {
        week: 17,
        title: "Deploy to staging — Slack bot goes live",
        hours: 7,
        tasks: [
          { type: "build", label: "Deploy agent as a Kubernetes Deployment in your staging cluster — Slack bot becomes available to a pilot team of 2–3 developers", time: "3h" },
          { type: "build", label: "Add: rate limits per user, circuit breakers on MCP tool calls, audit logging of every agent action to a Postgres table", time: "2.5h" },
          { type: "read", label: "PlatformCon 2025 — Sam Gabrail: 'Backstage + Crossplane + ArgoCD + vCluster' walkthrough", url: "https://2025.platformcon.com/program", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Real developers using the agent in staging. You're collecting feedback from actual usage."
      },
      {
        week: 18,
        title: "Security hardening — prompt injection + OWASP LLM Top 10",
        hours: 7,
        tasks: [
          { type: "read", label: "Simon Willison — prompt injection tag archive", url: "https://simonwillison.net/tags/prompt-injection/", time: "1.5h" },
          { type: "build", label: "Implement: input sanitisation, output guardrails, per-namespace RBAC so agent can only act within approved boundaries, production namespace write-access requires explicit named approver", time: "3h" },
          { type: "read", label: "OWASP LLM Top 10 2025", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", time: "1h" },
          { type: "read", label: "Chip Huyen — AI Engineering chs 5–7 (agents, RAG, fine-tuning overview)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "You can present the security model to a sceptical security engineer: what the agent can and cannot do, and why."
      },
      {
        week: 19,
        title: "Extend to second use case — IaC PR review",
        hours: 7,
        tasks: [
          { type: "build", label: "Second agent workflow: on every Terraform PR, agent reviews the plan against org security baseline (using Terraform MCP server + OPA) and leaves a structured comment", time: "4h" },
          { type: "read", label: "Firefly — 'Terraform MCP Server in Platform Engineering Workflows'", url: "https://www.firefly.ai/academy/terraform-mcp-server", time: "1h" },
          { type: "read", label: "Fournier & Nowland — chs 11–13 (operating a platform, success stories, failure modes)", time: "1.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Second workflow running in staging. Agent reviews a real Terraform PR and leaves a useful comment."
      },
      {
        week: 20,
        title: "kagent — run your agent as a Kubernetes-native workload",
        hours: 7,
        tasks: [
          { type: "build", label: "Deploy your LangGraph agent via kagent CRDs — define Agent, ModelConfig (Claude Sonnet), and MCPServer resources declaratively", url: "https://kagent.dev/docs/kagent", time: "3.5h" },
          { type: "read", label: "New Stack — 'Meet Kagent, Open Source Framework for AI Agents in Kubernetes'", url: "https://thenewstack.io/meet-kagent-open-source-framework-for-ai-agents-in-kubernetes/", time: "0.5h" },
          { type: "read", label: "DDIA ch 12 (future of data systems)", time: "1h" },
          { type: "build", label: "Add CI workflow: on every prompt/tool change, run eval set automatically — fail the build if accuracy drops below threshold", time: "1.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Agent managed via GitOps like any other workload. CI runs evals on every change."
      },
      {
        week: 21,
        title: "Backstage integration — wire the catalog as the agent's knowledge base",
        hours: 7,
        tasks: [
          { type: "build", label: "Install @backstage/plugin-mcp-actions-backend — expose your Backstage catalog as MCP tools. Agent can now answer 'which team owns this service?' and 'what's the runbook URL?'", time: "3h" },
          { type: "build", label: "Add tool: query_backstage_catalog(entity_ref) — agent uses this before opening any PR to verify team ownership and check for existing resources", time: "2h" },
          { type: "read", label: "Finish Chip Huyen — AI Engineering (chs 8–12: evaluation, production, monitoring, future)", time: "1.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Agent answers 'who owns the payments service?' correctly using the Backstage catalog. No hardcoded team data."
      },
      {
        week: 22,
        title: "AWS account vending + Ed Donner MCP capstone",
        hours: 7,
        tasks: [
          { type: "read", label: "AWS Control Tower AFT docs + hashicorp-education/learn-terraform-aws-control-tower-aft", url: "https://github.com/hashicorp-education/learn-terraform-aws-control-tower-aft", time: "1.5h" },
          { type: "build", label: "Extend agent: onboard_new_team() workflow — opens a PR against AFT repo with new account request YAML, requires platform lead approval, posts status updates to Slack", time: "3h" },
          { type: "course", label: "Ed Donner — Module 6: MCP Capstone (6_mcp) — the Trading Floor: 4 agents, 6 MCP servers, 44 tools. Study it as a reference architecture for your own multi-agent account vending workflow — focus on supervisor/specialist agent routing and tool-call failure handling across many tools.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "2h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Three agent workflows exist: namespace provisioning, IaC PR review, account onboarding. All GitOps-native. You've mapped Ed's Trading Floor supervisor pattern to your own onboard_new_team() workflow."
      },
      {
        week: 23,
        title: "Contribute upstream + share your work",
        hours: 7,
        tasks: [
          { type: "build", label: "Open a PR to kagent, a CNCF MCP server, or Kratix — even a docs fix counts. The review process teaches more than any course.", time: "3h" },
          { type: "build", label: "Write a blog post or internal wiki article: full architecture, eval methodology, what failed, what you'd do differently. Share in platformengineering.org Slack.", time: "3h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "PR opened upstream. Post published or shared. You've received external feedback on your architecture."
      },
      {
        week: 24,
        title: "Capstone reflection + durable habits locked in",
        hours: 7,
        tasks: [
          { type: "read", label: "PlatformCon 2025 — '5 takeaways from PlatformCon 2025: from great platforms to doing AI right'", url: "https://platformengineering.org/events/5-takeaways-from-platformcon-2025-from-great-platforms-to-doing-ai-right-2025-07-31", time: "1h" },
          { type: "build", label: "Retrospective: measure your agent against Fournier's platform success metrics — DORA metrics for developer teams using it, support ticket reduction, time-to-namespace", time: "2h" },
          { type: "build", label: "Set your durable weekly rhythm: 1h reading (Platform Weekly + Latent Space + Simon Willison), 1h podcast commute, 2h personal agent work, rest on work", time: "1h" },
          { type: "read", label: "Hamel Husain eval tools comparison — migrate to a managed eval platform if warranted", url: "https://hamel.dev/blog/posts/eval-tools/", time: "1h" },
          { type: "habit", label: "Enrol for PlatformCon 2026 + bookmark the CNCF AI WG agenda. You are now a practitioner, not a learner.", time: "2h" },
        ],
        checkpoint: "Three working agent workflows. Published architecture write-up. Durable learning habits in place. You're shipping, not studying."
      }
    ]
  }
];

const budget = [
  { item: "Platform Engineering — Fournier & Nowland (O'Reilly)", cost: "£38", type: "essential" },
  { item: "AI Engineering — Chip Huyen (O'Reilly)", cost: "£35", type: "essential" },
  { item: "Team Topologies 2nd ed (IT Revolution)", cost: "£25", type: "essential" },
  { item: "Ed Donner — Complete Agentic AI Engineering Course (Udemy, on sale)", cost: "£15", type: "essential" },
  { item: "DDIA 2nd ed — Kleppmann & Riccomini (O'Reilly)", cost: "£40", type: "essential" },
  { item: "DeepLearning.AI short courses (Agentic AI, LangGraph, MCP)", cost: "Free", type: "free" },
  { item: "Anthropic Academy (13 courses with certs)", cost: "Free", type: "free" },
  { item: "Hugging Face Agents Course", cost: "Free", type: "free" },
  { item: "Langfuse (self-hosted Docker)", cost: "Free", type: "free" },
  { item: "Backstage, Crossplane, Kratix, kagent, ArgoCD/Flux", cost: "Free", type: "free" },
  { item: "Styra Academy (OPA courses)", cost: "Free", type: "free" },
  { item: "AWS MCP suite, GitHub MCP, Terraform MCP", cost: "Free", type: "free" },
  { item: "PlatformCon recorded sessions", cost: "Free", type: "free" },
  { item: "Google SRE books (sre.google/books)", cost: "Free", type: "free" },
];

const mcpServers = [
  { name: "awslabs/mcp", desc: "Official AWS suite — IAM, EKS, ECR, Organizations, CDK, Cost", priority: "day 1" },
  { name: "hashicorp/terraform-mcp-server", desc: "IaC generation, plan inspection, workspace management", priority: "day 1" },
  { name: "github/github-mcp-server", desc: "PR creation, branch management, repo scaffolding — your write path", priority: "day 1" },
  { name: "manusa/kubernetes-mcp-server", desc: "Cluster reads — pods, namespaces, events, resource state", priority: "day 1" },
  { name: "alexei-led/k8s-mcp-server", desc: "kubectl/helm/istioctl/argocd bridge for broader tooling", priority: "week 3" },
  { name: "backstage/mcp-actions-backend", desc: "Software catalog as MCP tools — team ownership, runbooks, APIs", priority: "week 21" },
  { name: "pab1it0/prometheus-mcp-server", desc: "Metrics queries for context (agent can check error rates before acting)", priority: "phase 3" },
];

const typeColors = {
  read: { bg: "#1e3a5f", border: "#3b82f6", label: "READ", labelBg: "#1d4ed8" },
  course: { bg: "#1a3a1a", border: "#4ade80", label: "COURSE", labelBg: "#166534" },
  build: { bg: "#3a1a2a", border: "#f472b6", label: "BUILD", labelBg: "#9d174d" },
  habit: { bg: "#2a2a1a", border: "#facc15", label: "HABIT", labelBg: "#713f12" },
};

// --- Utility functions ---

export async function deriveToken(passphrase) {
  const encoder = new TextEncoder();
  const data = encoder.encode(passphrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function getTaskId(phaseIndex, weekNumber, taskIndex) {
  return `p${phaseIndex}-w${weekNumber}-t${taskIndex}`;
}

export function mergeState(local, remote) {
  if (Object.keys(local).length === 0) {
    return { ...remote };
  }
  const merged = { ...remote };
  for (const [key, value] of Object.entries(local)) {
    if (value) merged[key] = true;
  }
  return merged;
}

// --- Custom hook ---

const LS_TOKEN_KEY = "lp-user-token";
const LS_STATE_KEY = "lp-completion-state";
const DEBOUNCE_MS = 2000;
const RETRY_INTERVAL_MS = 30000;
const MAX_RETRIES = 3;

function readLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function parseCompletionState(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

export function useCompletionState(phases) {
  const [completionState, setCompletionState] = useState(() => {
    const raw = readLocalStorage(LS_STATE_KEY);
    return parseCompletionState(raw);
  });
  const [userToken, setUserToken] = useState(() => {
    const token = readLocalStorage(LS_TOKEN_KEY);
    return token && /^[0-9a-f]{64}$/.test(token) ? token : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const debounceTimer = useRef(null);
  const retryTimer = useRef(null);
  const retryCount = useRef(0);
  const pendingState = useRef(null);
  const tokenRef = useRef(userToken);

  // Keep tokenRef in sync
  useEffect(() => {
    tokenRef.current = userToken;
  }, [userToken]);

  // Sync helper: PUT completion state to the API
  const syncToApi = useCallback(async (token, state) => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/progress", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      if (!res.ok) {
        throw new Error(`Sync failed: ${res.status}`);
      }
      setSyncError(null);
      retryCount.current = 0;
      pendingState.current = null;
    } catch (err) {
      setSyncError(err.message || "Sync failed");
      pendingState.current = state;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Schedule a debounced sync
  const scheduleDebouncedSync = useCallback((token, state) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      syncToApi(token, state);
    }, DEBOUNCE_MS);
  }, [syncToApi]);

  // Retry interval for failed syncs
  useEffect(() => {
    retryTimer.current = setInterval(() => {
      if (pendingState.current && tokenRef.current && retryCount.current < MAX_RETRIES) {
        retryCount.current += 1;
        syncToApi(tokenRef.current, pendingState.current);
      }
    }, RETRY_INTERVAL_MS);
    return () => {
      if (retryTimer.current) clearInterval(retryTimer.current);
    };
  }, [syncToApi]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Fetch remote state on mount (or when token changes) and merge
  useEffect(() => {
    if (!userToken) return;
    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/progress", {
          method: "GET",
          headers: { "Authorization": `Bearer ${userToken}` },
        });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const remote = await res.json();
        if (!cancelled) {
          setCompletionState(prev => {
            const merged = mergeState(prev, remote);
            writeLocalStorage(LS_STATE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch {
        // API unreachable — continue with local cache
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [userToken]);

  const toggleTask = useCallback((taskId) => {
    setCompletionState(prev => {
      const next = { ...prev };
      if (next[taskId]) {
        delete next[taskId];
      } else {
        next[taskId] = true;
      }
      writeLocalStorage(LS_STATE_KEY, JSON.stringify(next));
      scheduleDebouncedSync(tokenRef.current, next);
      return next;
    });
  }, [scheduleDebouncedSync]);

  const setPassphrase = useCallback(async (passphrase) => {
    const token = await deriveToken(passphrase);
    setUserToken(token);
    writeLocalStorage(LS_TOKEN_KEY, token);
    // Remote fetch + merge will be triggered by the userToken useEffect
  }, []);

  const resetPhase = useCallback((phaseIndex) => {
    setCompletionState(prev => {
      const prefix = `p${phaseIndex}-`;
      const next = {};
      for (const [key, value] of Object.entries(prev)) {
        if (!key.startsWith(prefix)) {
          next[key] = value;
        }
      }
      writeLocalStorage(LS_STATE_KEY, JSON.stringify(next));
      scheduleDebouncedSync(tokenRef.current, next);
      return next;
    });
  }, [scheduleDebouncedSync]);

  const switchIdentity = useCallback(() => {
    setUserToken(null);
    setCompletionState({});
    removeLocalStorage(LS_TOKEN_KEY);
    removeLocalStorage(LS_STATE_KEY);
    setSyncError(null);
    pendingState.current = null;
    retryCount.current = 0;
  }, []);

  return {
    completionState,
    userToken,
    isLoading,
    isSyncing,
    syncError,
    toggleTask,
    setPassphrase,
    resetPhase,
    switchIdentity,
  };
}

// --- UI Components ---

export function PassphraseModal({ onSubmit, userToken }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.length < 8) {
      setError("Passphrase must be at least 8 characters");
      return;
    }
    setError(null);
    onSubmit(value);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    }}>
      <div style={{
        background: "#0f0f1a",
        border: "1px solid #1e293b",
        borderRadius: 8,
        padding: "32px",
        width: "100%",
        maxWidth: 400,
        margin: "0 16px",
      }}>
        <h2 style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#e2e8f0",
          margin: "0 0 8px",
          letterSpacing: "-0.01em",
        }}>
          {userToken ? "Switch identity" : "Start tracking"}
        </h2>
        <p style={{
          fontSize: 12,
          color: "#64748b",
          margin: "0 0 24px",
          lineHeight: 1.6,
        }}>
          Enter a passphrase to sync your progress across devices
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="passphrase-input"
            style={{
              display: "block",
              fontSize: 11,
              color: "#94a3b8",
              marginBottom: 6,
              letterSpacing: "0.05em",
            }}
          >
            Passphrase
          </label>
          <input
            id="passphrase-input"
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="At least 8 characters"
            autoFocus
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 4,
              border: `1px solid ${error ? "#ef4444" : "#1e293b"}`,
              background: "#0a0a0f",
              color: "#e2e8f0",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
          />
          {error && (
            <p style={{
              fontSize: 11,
              color: "#ef4444",
              margin: "6px 0 0",
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px 16px",
              marginTop: 16,
              borderRadius: 4,
              border: "1px solid #60a5fa",
              background: "#1e3a5f",
              color: "#60a5fa",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 0.15s",
            }}
          >
            {userToken ? "Sign in" : "Start tracking"}
          </button>
        </form>

        {userToken && (
          <p style={{
            fontSize: 11,
            color: "#475569",
            margin: "16px 0 0",
            textAlign: "center",
          }}>
            Signing in with a new passphrase will replace your local progress.
          </p>
        )}
      </div>
    </div>
  );
}

export function TaskCheckbox({ checked, onChange, phaseColor, taskLabel }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? `Mark ${taskLabel} as incomplete` : `Mark ${taskLabel} as complete`}
      onClick={onChange}
      style={{
        width: 44,
        height: 44,
        minWidth: 44,
        minHeight: 44,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        border: `2px solid ${checked ? phaseColor : "#475569"}`,
        background: checked ? phaseColor : "transparent",
        cursor: "pointer",
        transition: "all 0.15s",
        flexShrink: 0,
        fontFamily: "inherit",
      }}
    >
      {checked && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 9L7.5 12.5L14 5.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

export function WeekProgressBar({ completed, total, phaseColor }) {
  const ratio = total > 0 ? completed / total : 0;
  const isComplete = total > 0 && completed === total;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          position: "relative",
          width: 60,
          height: 6,
          borderRadius: 3,
          background: "#1e293b",
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${ratio * 100}%`,
            borderRadius: 3,
            background: phaseColor,
            opacity: isComplete ? 1 : 0.7,
            boxShadow: isComplete ? `0 0 6px ${phaseColor}` : "none",
            transition: "width 0.2s, opacity 0.2s, box-shadow 0.2s",
          }}
        />
      </span>
      <span
        style={{
          fontSize: 10,
          fontFamily: "inherit",
          color: isComplete ? phaseColor : "#94a3b8",
          whiteSpace: "nowrap",
        }}
      >
        {completed}/{total}
      </span>
    </span>
  );
}

export function ResetPhaseButton({ phaseTitle, onReset }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{
          fontSize: 11,
          color: "#ef4444",
          lineHeight: 1.4,
        }}>
          Reset all progress for {phaseTitle}? This cannot be undone.
        </span>
        <span style={{ display: "inline-flex", gap: 6 }}>
          <button
            onClick={() => {
              onReset();
              setConfirming(false);
            }}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid #ef4444",
              background: "#3b1111",
              color: "#ef4444",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirming(false)}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              border: "1px solid #1e293b",
              background: "transparent",
              color: "#94a3b8",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Cancel
          </button>
        </span>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        padding: "4px 8px",
        borderRadius: 4,
        border: "none",
        background: "transparent",
        color: "#64748b",
        fontSize: 11,
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "color 0.15s",
      }}
    >
      Reset progress
    </button>
  );
}

export default function LearningPlan() {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [activeTab, setActiveTab] = useState("plan");

  const phase = phases[activePhase];

  const totalEssentialCost = budget
    .filter(b => b.type === "essential")
    .reduce((sum, b) => sum + parseInt(b.cost.replace("£", "")), 0);

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      background: "#0a0a0f",
      color: "#e2e8f0",
      minHeight: "100vh",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 50%, #0f1a1a 100%)",
        borderBottom: "1px solid #1e293b",
        padding: "32px 24px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 8
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#4ade80", boxShadow: "0 0 8px #4ade80"
            }} />
            <span style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              6-Month Learning Plan
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 700,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            Platform Engineer → <span style={{ color: "#60a5fa" }}>AI Platform Builder</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            24 weeks · 7 hrs/week · GitOps-native IDP Agent capstone · ~£153 total
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
            {["plan", "budget", "mcp-stack"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 4,
                  border: `1px solid ${activeTab === tab ? "#60a5fa" : "#1e293b"}`,
                  background: activeTab === tab ? "#1e3a5f" : "transparent",
                  color: activeTab === tab ? "#60a5fa" : "#64748b",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {tab === "plan" ? "Week-by-Week" : tab === "budget" ? "Budget" : "MCP Stack"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>

        {activeTab === "plan" && (
          <>
            {/* Phase selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {phases.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => { setActivePhase(i); setExpandedWeek(null); }}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    padding: "14px 16px",
                    borderRadius: 6,
                    border: `1px solid ${activePhase === i ? p.color : "#1e293b"}`,
                    background: activePhase === i ? `${p.color}15` : "#0f0f1a",
                    color: activePhase === i ? p.color : "#64748b",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
                    {p.weeks}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>{p.subtitle}</div>
                </button>
              ))}
            </div>

            {/* Phase description */}
            <div style={{
              background: `${phase.color}0d`,
              border: `1px solid ${phase.color}30`,
              borderRadius: 6,
              padding: "16px 20px",
              marginBottom: 20,
            }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ color: "#cbd5e1", fontSize: 13, margin: "0 0 12px", lineHeight: 1.6 }}>
                    {phase.description}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {phase.focus.map(f => (
                      <span key={f} style={{
                        padding: "3px 10px",
                        borderRadius: 3,
                        background: `${phase.color}20`,
                        border: `1px solid ${phase.color}40`,
                        color: phase.color,
                        fontSize: 10,
                        letterSpacing: "0.05em",
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: phase.color, fontSize: 20, fontWeight: 700 }}>{phase.weeklyHours}</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>per week</div>
                </div>
              </div>
            </div>

            {/* Weeks */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {phase.weeks_data.map((w) => {
                const isOpen = expandedWeek === w.week;
                return (
                  <div key={w.week} style={{
                    border: `1px solid ${isOpen ? phase.color + "50" : "#1e293b"}`,
                    borderRadius: 6,
                    background: isOpen ? `${phase.color}08` : "#0f0f1a",
                    overflow: "hidden",
                    transition: "all 0.15s",
                  }}>
                    <button
                      onClick={() => setExpandedWeek(isOpen ? null : w.week)}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                        fontFamily: "inherit",
                        color: "inherit",
                      }}
                    >
                      <span style={{
                        width: 48,
                        height: 24,
                        borderRadius: 3,
                        background: `${phase.color}20`,
                        border: `1px solid ${phase.color}50`,
                        color: phase.color,
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        letterSpacing: "0.05em",
                        flexShrink: 0,
                      }}>
                        W{w.week}
                      </span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: isOpen ? 600 : 400, color: isOpen ? "#e2e8f0" : "#94a3b8" }}>
                        {w.title}
                      </span>
                      <span style={{ color: "#64748b", fontSize: 11 }}>{w.hours}h</span>
                      <span style={{ color: "#64748b", fontSize: 14, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>›</span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: "0 16px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                          {w.tasks.map((task, i) => {
                            const tc = typeColors[task.type];
                            return (
                              <div key={i} style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                padding: "10px 12px",
                                borderRadius: 4,
                                background: tc.bg,
                                border: `1px solid ${tc.border}30`,
                              }}>
                                <span style={{
                                  padding: "2px 7px",
                                  borderRadius: 2,
                                  background: tc.labelBg,
                                  color: "#fff",
                                  fontSize: 9,
                                  fontWeight: 700,
                                  letterSpacing: "0.1em",
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}>
                                  {tc.label}
                                </span>
                                <span style={{ flex: 1, fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>
                                  {task.url ? (
                                    <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ color: "#93c5fd", textDecoration: "none" }}>
                                      {task.label}
                                    </a>
                                  ) : task.label}
                                </span>
                                {task.time && (
                                  <span style={{ color: "#475569", fontSize: 10, flexShrink: 0, marginTop: 2 }}>{task.time}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{
                          padding: "10px 12px",
                          borderRadius: 4,
                          background: "#0a1628",
                          border: "1px solid #1e3a5f",
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                        }}>
                          <span style={{
                            color: "#60a5fa",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            flexShrink: 0,
                            marginTop: 1,
                            padding: "2px 7px",
                            background: "#1e3a5f",
                            borderRadius: 2,
                          }}>✓ CHECK</span>
                          <span style={{ fontSize: 12, color: "#7dd3fc", lineHeight: 1.5 }}>{w.checkpoint}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "budget" && (
          <div>
            <div style={{
              background: "#0f1a0f",
              border: "1px solid #166534",
              borderRadius: 6,
              padding: "16px 20px",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Essential spend
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#4ade80" }}>£{totalEssentialCost}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Everything else on this list is free.</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {budget.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 4,
                  background: item.type === "essential" ? "#0f1a0f" : "#0a0a0f",
                  border: `1px solid ${item.type === "essential" ? "#166534" : "#1e293b"}`,
                }}>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 3,
                    background: item.type === "essential" ? "#14532d" : "#1e293b",
                    color: item.type === "essential" ? "#4ade80" : "#475569",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    flexShrink: 0,
                  }}>
                    {item.type === "essential" ? "PAID" : "FREE"}
                  </span>
                  <span style={{ flex: 1, fontSize: 12, color: item.type === "essential" ? "#cbd5e1" : "#64748b" }}>
                    {item.item}
                  </span>
                  <span style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: item.type === "essential" ? "#4ade80" : "#475569",
                  }}>
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16,
              padding: "14px 16px",
              background: "#1a1a0f",
              border: "1px solid #713f12",
              borderRadius: 6,
            }}>
              <div style={{ fontSize: 11, color: "#facc15", marginBottom: 6, letterSpacing: "0.05em" }}>
                OPTIONAL — only if your employer covers it
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                O'Reilly Online Learning (~£400/yr) — gives you all 5 essential books plus sandboxes. The Pragmatic Engineer newsletter (~£120/yr) — worth it if you want senior engineering context. ByteByteGo (~£200 lifetime) — only if you're actively interviewing.
              </div>
            </div>
          </div>
        )}

        {activeTab === "mcp-stack" && (
          <div>
            <p style={{ color: "#64748b", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
              These are the MCP servers that give your IDP agent its capabilities. Install them progressively — don't try to wire all of them on day one.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {mcpServers.map((s, i) => {
                const priorityColor = s.priority === "day 1" ? "#4ade80" : s.priority === "week 3" ? "#60a5fa" : "#f472b6";
                return (
                  <div key={i} style={{
                    padding: "14px 16px",
                    borderRadius: 6,
                    background: "#0f0f1a",
                    border: `1px solid ${priorityColor}25`,
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: 3,
                      background: `${priorityColor}20`,
                      color: priorityColor,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      flexShrink: 0,
                      marginTop: 1,
                      whiteSpace: "nowrap",
                    }}>
                      {s.priority.toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 20,
              padding: "16px",
              background: "#0f1428",
              border: "1px solid #1e3a5f",
              borderRadius: 6,
            }}>
              <div style={{ fontSize: 11, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                The write path — how the agent acts safely
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
                <span style={{ color: "#4ade80" }}>Read tools</span> (AWS MCP, Kubernetes MCP, Backstage catalog) → fully autonomous, no approval needed<br/>
                <span style={{ color: "#60a5fa" }}>Write tools</span> (GitHub MCP for PRs) → always via Pull Request, human approves merge<br/>
                <span style={{ color: "#f472b6" }}>Production writes</span> (account vending, SCPs) → named platform lead approval required, full audit log
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        {activeTab === "plan" && (
          <div style={{
            display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap",
            padding: "12px 16px",
            background: "#0a0a0f",
            border: "1px solid #1e293b",
            borderRadius: 6,
          }}>
            <span style={{ fontSize: 10, color: "#475569", marginRight: 4 }}>TASK TYPES:</span>
            {Object.entries(typeColors).map(([type, tc]) => (
              <span key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  padding: "1px 6px", borderRadius: 2,
                  background: tc.labelBg, color: "#fff",
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.1em"
                }}>{tc.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
