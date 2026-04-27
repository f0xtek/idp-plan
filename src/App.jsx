import { useState, useEffect, useRef, useCallback } from "react";

const phases = [
  {
    id: 1,
    title: "Phase 1",
    subtitle: "Foundations",
    weeks: "Weeks 1–8",
    color: "#f97316",
    accent: "#7c2d12",
    description: "Build the mental model across both layers simultaneously. Agentic AI concepts and AWS security foundations run in parallel — not sequentially. By end of phase you can explain the full AWS threat model and have a working toy agent.",
    weeklyHours: "7 hrs/week",
    focus: ["Agentic AI design patterns", "IAM and AWS security fundamentals", "Hands-on labs: flaws.cloud", "Ed Donner modules 1 & 2"],
    weeks_data: [
      {
        week: 1,
        title: "Mental models: agents and the AWS threat landscape",
        hours: 7,
        tasks: [
          { type: "read", label: "Anthropic — 'Building Effective Agents' essay", url: "https://www.anthropic.com/research/building-effective-agents", time: "1.5h" },
          { type: "read", label: "AWS Security Blog — 'IAM policies: what they can and cannot control' (understand the policy model before building on top of it)", url: "https://aws.amazon.com/blogs/security/", time: "1h" },
          { type: "read", label: "Hacking the Cloud — AWS General Knowledge section (attacker's mental model of AWS)", url: "https://hackingthe.cloud/aws/general-knowledge/", time: "1h" },
          { type: "read", label: "Wiz Blog — 'Twenty Years of Cloud Security Research' (essential historical context)", url: "https://www.wiz.io/blog/twenty-years-of-cloud-security-research", time: "1h" },
          { type: "habit", label: "Subscribe: CloudSecList (cloudseclist.com), AWS Security Digest (awssecuritydigest.com), AWS Security Blog RSS, Hacking the Cloud blog", time: "0.5h" },
          { type: "habit", label: "Follow: Scott Piper, Nick Frichette, Marco Lancini, Clint Gibler on X/LinkedIn", time: "0.5h" },
          { type: "read", label: "DDIA 2nd ed — foreword + ch 1 (reliability, scalability, maintainability)", time: "1.5h" },
        ],
        checkpoint: "You can describe the AWS shared responsibility model, the IAM policy evaluation logic, and what an attacker does first when they get credentials. You understand why agents and cloud security intersect."
      },
      {
        week: 2,
        title: "Agentic AI foundations + Ed Donner module 1",
        hours: 7,
        tasks: [
          { type: "course", label: "DeepLearning.AI — 'Agentic AI' (Andrew Ng) — full course. Focus on tool use and planning patterns — these map directly to security automation.", url: "https://www.deeplearning.ai/short-courses/agentic-ai/", time: "4h" },
          { type: "course", label: "Ed Donner — Module 1: Foundations (1_foundations) — design patterns in code. Do all labs.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "1.5h" },
          { type: "read", label: "Lilian Weng — 'LLM Powered Autonomous Agents'", url: "https://lilianweng.github.io/posts/2023-06-23-agent/", time: "1h" },
          { type: "habit", label: "Weekly reading: CloudSecList + AWS Security Digest", time: "0.5h" },
        ],
        checkpoint: "You understand the four agentic design patterns in code. You can articulate how a tool-use loop maps to a security triage workflow: detect → investigate → decide → act."
      },
      {
        week: 3,
        title: "LangGraph vs OpenAI SDK + IAM deep dive",
        hours: 7,
        tasks: [
          { type: "course", label: "DeepLearning.AI — 'AI Agents in LangGraph'", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/", time: "2.5h" },
          { type: "course", label: "Ed Donner — Module 2: OpenAI Agents SDK (2_openai) — contrast with LangGraph. Note what each trades off.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "2h" },
          { type: "build", label: "LangGraph quickstart: build a ReAct agent with two AWS tools (list-s3-buckets, describe-ec2-instances via boto3 tool wrappers)", time: "2h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Working LangGraph agent that calls real AWS APIs as tools. You can articulate 3 differences between LangGraph and OpenAI Agents SDK."
      },
      {
        week: 4,
        title: "MCP + AWS MCP suite — the critical skill",
        hours: 7,
        tasks: [
          { type: "course", label: "DeepLearning.AI — 'MCP: Build Rich-Context AI Apps with Anthropic'", url: "https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic", time: "2h" },
          { type: "course", label: "Anthropic Academy — 'Intro to MCP' + 'MCP Advanced Topics'", url: "https://anthropic.skilljar.com/", time: "2h" },
          { type: "build", label: "Install the full awslabs/mcp suite — focus on: AWS API server, Security Hub MCP, GuardDuty (via AWS API MCP), CloudTrail. Verify agent can call each.", url: "https://github.com/awslabs/mcp", time: "2.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Agent can query GuardDuty findings and Security Hub controls via MCP tools. You understand why the AWS MCP suite is your agent's primary read interface to the security plane."
      },
      {
        week: 5,
        title: "Evals + observability + multi-agent mental models",
        hours: 7,
        tasks: [
          { type: "read", label: "Hamel Husain — 'Your AI Product Needs Evals'", url: "https://hamel.dev/blog/posts/evals/", time: "1h" },
          { type: "read", label: "Eugene Yan — 'Patterns for Building LLM-based Systems'", url: "https://eugeneyan.com/writing/llm-patterns/", time: "1h" },
          { type: "build", label: "Set up Langfuse (Docker) — instrument your agent, trace every AWS API tool call. Security triage agents must be fully auditable — this is non-negotiable.", time: "2h" },
          { type: "course", label: "Ed Donner — Module 3: CrewAI (3_crew) — 45-min skim, videos only. The GuardDutyAgent → IAMAnalyzerAgent → RemediationAgent → ValidatorAgent pattern from CrewAI maps directly to your capstone design.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "0.75h" },
          { type: "read", label: "DDIA ch 5 (replication) — how distributed state applies to multi-account security telemetry", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "1.25h" },
        ],
        checkpoint: "Langfuse tracing every tool call. You understand the multi-agent decomposition pattern: one agent per security domain (IAM, network, compute)."
      },
      {
        week: 6,
        title: "flaws.cloud — learn security by breaking it",
        hours: 7,
        tasks: [
          { type: "build", label: "Complete all 6 levels of flaws.cloud — S3 misconfigurations, EC2 metadata, exposed credentials, IAM privilege escalation. Read the write-up for each level.", url: "http://flaws.cloud/", time: "4h" },
          { type: "read", label: "AWS Security Blog — 'Understanding IAM policy evaluation' (deep read, not a skim)", url: "https://aws.amazon.com/blogs/security/", time: "1.5h" },
          { type: "read", label: "DDIA ch 6 (partitioning) + ch 7 (transactions)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "You've exploited real AWS misconfigurations hands-on. You can explain exactly why each flaws.cloud level worked and what the defensive control is."
      },
      {
        week: 7,
        title: "flaws2.cloud + IAM Vulnerable — attacker and defender paths",
        hours: 7,
        tasks: [
          { type: "build", label: "flaws2.cloud — complete both the attacker AND defender paths. The defender path is more relevant to your use case but the attacker path builds essential intuition.", url: "http://flaws2.cloud/", time: "3h" },
          { type: "build", label: "Deploy IAM Vulnerable (BishopFox) — explore 5–10 of the 31 privilege escalation pathways. Focus on PassRole, CreatePolicyVersion, and AssumeRole chains.", url: "https://github.com/BishopFox/iam-vulnerable", time: "2.5h" },
          { type: "read", label: "Hacking the Cloud — IAM section (privilege escalation techniques)", url: "https://hackingthe.cloud/aws/exploitation/iam/", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "You can walk through 5 IAM privilege escalation paths from memory and explain the detection logic for each. This is the knowledge your agent needs to reason about IAM findings."
      },
      {
        week: 8,
        title: "Phase 1 checkpoint — design your capstone agent",
        hours: 7,
        tasks: [
          { type: "read", label: "AWS re:Invent 2025 AIM340 — 'AI Agents for Cloud Ops: Automating Infrastructure Management' (watch or read the transcript — this is your reference architecture)", url: "https://dev.to/kazuya_dev/aws-reinvent-2025-ai-agents-for-cloud-ops-automating-infrastructure-management-aim340-gln", time: "1.5h" },
          { type: "read", label: "Chip Huyen — AI Engineering chs 1–3 (foundations, what AI engineering is, evaluation)", time: "1.5h" },
          { type: "build", label: "Write a 1-page design doc for your capstone: a GuardDuty finding triage agent. Scope: finding fires → agent investigates CloudTrail + Security Hub → generates remediation PR → human approves → GitOps reconciles.", time: "2h" },
          { type: "read", label: "DDIA ch 8 (trouble with distributed systems)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Design doc exists. You can draw the full architecture: EventBridge → SQS → LangGraph agent → AWS MCP tools → GitHub MCP → PR → Terraform/GitOps → remediation applied."
      }
    ]
  },
  {
    id: 2,
    title: "Phase 2",
    subtitle: "Build the Core Agent",
    weeks: "Weeks 9–16",
    color: "#a78bfa",
    accent: "#3b0764",
    description: "Ship a working GitOps-native AWS security agent. By end of phase you have a real GuardDuty triage agent with evals, human-in-the-loop approval, and a second workflow for IaC security scanning.",
    weeklyHours: "7 hrs/week",
    focus: ["GuardDuty triage agent scaffold", "CloudTrail + Security Lake analysis tools", "IaC security scanning (Checkov + Terraform MCP)", "Eval set from real findings"],
    weeks_data: [
      {
        week: 9,
        title: "Scaffold the agent — event-driven trigger + LangGraph + AWS MCP",
        hours: 7,
        tasks: [
          { type: "build", label: "Scaffold event-driven trigger: EventBridge rule on GuardDuty HIGH/CRITICAL findings → SQS → Lambda → LangGraph agent invocation", time: "3h" },
          { type: "build", label: "Wire AWS MCP (GuardDuty, Security Hub, CloudTrail tools) as agent tools. Test: agent can fetch a finding, pull associated CloudTrail events, and summarise in plain English.", time: "3h" },
          { type: "read", label: "Anthropic Academy — 'Claude Agent SDK' module", url: "https://anthropic.skilljar.com/", time: "0.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "When a test GuardDuty finding fires, the agent automatically investigates and produces a triage summary. No human has typed anything."
      },
      {
        week: 10,
        title: "The GitOps write path — remediation via PR",
        hours: 7,
        tasks: [
          { type: "build", label: "Build tool: generate_remediation_pr() — agent identifies the Terraform resource causing the finding (e.g. overly permissive S3 bucket policy), generates a corrective Terraform diff, commits to a branch, opens PR via GitHub MCP with finding context in the PR body.", time: "4h" },
          { type: "read", label: "AWS Security Blog — 'How to use AWS Config rules to enforce security baselines'", url: "https://aws.amazon.com/blogs/security/", time: "1h" },
          { type: "read", label: "DDIA ch 9 (consistency and consensus)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Agent opens a real Terraform PR that would actually fix the finding. PR body includes the finding ID, severity, affected resource ARN, and explanation."
      },
      {
        week: 11,
        title: "AppSec + shift-left: IaC security scanning",
        hours: 7,
        tasks: [
          { type: "build", label: "Second workflow: on every Terraform PR, agent runs Checkov against the plan (via Terraform MCP) and posts a structured security finding comment. Classify findings as BLOCK (critical), WARN, or INFO.", url: "https://github.com/bridgecrewio/checkov", time: "3.5h" },
          { type: "read", label: "AWS Security Blog + Snyk/Wiz content on supply chain security: SBOM, Cosign image signing, ECR image scanning with Inspector", time: "1.5h" },
          { type: "build", label: "Add Trivy scan to your EKS/ECR pipeline — wire findings into agent's context when it's investigating container-related GuardDuty findings", time: "1.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Two agent workflows running: GuardDuty triage + Terraform PR security review. Both GitOps-native (reads only or writes via PR)."
      },
      {
        week: 12,
        title: "Eval set — build your ground truth from real findings",
        hours: 7,
        tasks: [
          { type: "build", label: "Generate 20–30 test GuardDuty findings using CloudGoat or your own sandbox account. Label each with: correct root cause, correct remediation action, whether a PR is needed or just an alert. This is your eval set.", url: "https://github.com/RhinoSecurityLabs/cloudgoat", time: "3.5h" },
          { type: "build", label: "Wire eval set into Langfuse — run agent against all cases, measure: correct root cause identified, correct remediation PR generated, no false-positive blocks on legitimate activity.", time: "2h" },
          { type: "read", label: "Anthropic prompt engineering interactive tutorial — improve your agent's system prompt based on failures", url: "https://github.com/anthropics/prompt-eng-interactive-tutorial", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Eval set of 20+ real finding scenarios exists. Baseline accuracy score documented. You know which finding types the agent handles poorly."
      },
      {
        week: 13,
        title: "Iterate on evals + Ed Donner LangGraph deep dive",
        hours: 7,
        tasks: [
          { type: "build", label: "Fix top 3 eval failure modes — tune tool descriptions, system prompt, or add a CloudTrail analysis tool. Re-run evals to confirm improvement.", time: "3h" },
          { type: "course", label: "Ed Donner — Module 4: LangGraph (4_langgraph) — you've built a real LangGraph security agent for 4 weeks. Ed's content will surface gaps in your graph design. Pay attention to his stateful workflow patterns.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "3h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Eval score improved measurably from week 12 baseline. You've identified at least one LangGraph pattern from Ed's module to apply to your agent."
      },
      {
        week: 14,
        title: "Human-in-the-loop approval gates + Ed Donner AutoGen",
        hours: 7,
        tasks: [
          { type: "build", label: "Add Slack approval gates: agent posts finding summary + proposed remediation PR with ✅ Approve / ❌ Reject / 🔍 Investigate More buttons. Critical findings (IAM changes, SCPs) require named security lead approval.", time: "3.5h" },
          { type: "build", label: "Add Postgres checkpointer — agent state survives Lambda cold starts and retries mid-investigation", time: "2h" },
          { type: "course", label: "Ed Donner — Module 5: AutoGen (5_autogen) — commute listening (~45 min). Focus on the multi-agent orchestration model: supervisor delegates to specialist agents. This is the architecture for your multi-domain security agent in Phase 3.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "0.75h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.75h" },
        ],
        checkpoint: "Agent pauses before any write action and requests Slack approval. Critical finding types require named approval. State survives restarts."
      },
      {
        week: 15,
        title: "Amazon Security Lake + CloudTrail deep analysis",
        hours: 7,
        tasks: [
          { type: "build", label: "Set up Amazon Security Lake in sandbox — wire OCSF-normalised logs (GuardDuty, CloudTrail, VPC Flow Logs). Build agent tool: query_security_lake(nl_query) — converts natural language to Athena SQL, returns structured results.", time: "4h" },
          { type: "read", label: "AWS re:Invent 2025 AIM340 transcript — study how their demo agent uses Security Lake + Athena for 'hours to seconds' investigation reduction. Map this to your own agent.", url: "https://dev.to/kazuya_dev/aws-reinvent-2025-ai-agents-for-cloud-ops-automating-infrastructure-management-aim340-gln", time: "1h" },
          { type: "read", label: "DDIA ch 11 (stream processing) — how event-driven security telemetry pipelines work", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Agent can answer 'who made changes to IAM in the last 24 hours?' by querying Security Lake via Athena. Investigation depth is now hours of log data, not just the finding itself."
      },
      {
        week: 16,
        title: "Phase 2 checkpoint — demo and measure",
        hours: 7,
        tasks: [
          { type: "build", label: "End-to-end test: trigger a GuardDuty HIGH finding (public S3 bucket) → agent investigates CloudTrail + Security Lake → generates Terraform remediation PR → security lead approves in Slack → GitOps reconciles → bucket no longer public", time: "2h" },
          { type: "build", label: "Write a short demo doc / brownbag deck: architecture diagram, eval results, MTTD and MTTI metrics before/after agent, known limitations", time: "2h" },
          { type: "read", label: "Chip Huyen — AI Engineering chs 4–7 (evaluation, prompt engineering, agents, RAG)", time: "2.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Full end-to-end workflow demonstrated. You have a before/after story: how long did this finding type take to investigate manually vs with the agent?"
      }
    ]
  },
  {
    id: 3,
    title: "Phase 3",
    subtitle: "Harden, Extend, Operate",
    weeks: "Weeks 17–24",
    color: "#34d399",
    accent: "#064e3b",
    description: "Production-harden the agent, extend to EKS and detection engineering, and build the durable habits that keep you relevant. By end of phase you have a multi-domain security agent and something worth publishing.",
    weeklyHours: "7 hrs/week",
    focus: ["Production deployment + security hardening", "EKS and container security domain", "Detection engineering with MITRE ATT&CK", "Ed Donner MCP capstone"],
    weeks_data: [
      {
        week: 17,
        title: "Deploy to production account + security hardening",
        hours: 7,
        tasks: [
          { type: "build", label: "Deploy agent to a production-adjacent account — Lambda + SQS + EventBridge, IAM role with least-privilege (use IAM Access Analyzer to validate the role policy). Rate limits, circuit breakers, DLQ for failed invocations.", time: "3h" },
          { type: "read", label: "Simon Willison — prompt injection tag archive. Security agents are high-value targets for prompt injection — a finding payload could instruct your agent to approve its own PR.", url: "https://simonwillison.net/tags/prompt-injection/", time: "1h" },
          { type: "build", label: "Implement input sanitisation: strip any instruction-like text from finding descriptions before inserting into agent context. Add output guardrails: agent cannot approve its own PRs.", time: "2h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Agent running in production account. Prompt injection mitigations in place. You can explain the threat model of a security agent to a sceptical CISO."
      },
      {
        week: 18,
        title: "EKS and container security — extend the agent's domain",
        hours: 7,
        tasks: [
          { type: "build", label: "EKSGoat: complete the attack scenarios in your sandbox EKS cluster — RBAC misconfig, privileged container escape, exposed dashboard, secrets in env vars.", url: "https://github.com/amethystcoder/EKSGoat", time: "3h" },
          { type: "build", label: "Add Falco to your sandbox EKS cluster — wire Falco alerts into the same EventBridge pipeline as GuardDuty. Agent now handles both cloud-layer and runtime container security findings.", time: "2.5h" },
          { type: "read", label: "Kubernetes pod security standards + Kyverno policy library (security policies your agent should check in IaC PRs)", url: "https://kyverno.io/policies/", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Agent handles Falco runtime alerts as well as GuardDuty findings. Your Checkov/Kyverno IaC scanning includes Kubernetes manifest checks."
      },
      {
        week: 19,
        title: "MITRE ATT&CK for Cloud — detection engineering",
        hours: 7,
        tasks: [
          { type: "read", label: "MITRE ATT&CK for Cloud — AWS techniques (attack.mitre.org/matrices/enterprise/cloud/). Map each technique to a GuardDuty finding type or a CloudTrail signature your agent can detect.", url: "https://attack.mitre.org/matrices/enterprise/cloud/", time: "2h" },
          { type: "build", label: "Build tool: classify_attack_technique(finding) — agent maps a finding to a MITRE technique and retrieves the recommended mitigations. This adds structured context to every Slack triage message.", time: "2.5h" },
          { type: "read", label: "CloudGoat — complete the 'ecs_takeover' and 'lambda_privesc' scenarios. These represent MITRE T1525 and T1078 in a real AWS context.", url: "https://github.com/RhinoSecurityLabs/cloudgoat", time: "2h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Every Slack triage message now includes the MITRE ATT&CK technique classification and recommended mitigations. You've mapped your eval set to ATT&CK techniques."
      },
      {
        week: 20,
        title: "Ed Donner MCP capstone + CI evals",
        hours: 7,
        tasks: [
          { type: "course", label: "Ed Donner — Module 6: MCP Capstone (6_mcp) — the Trading Floor: 4 agents, 6 MCP servers, 44 tools. Study the supervisor/specialist architecture and tool-call failure handling — directly applicable to your multi-domain security agent.", url: "https://www.udemy.com/course/the-complete-agentic-ai-engineering-course/", time: "2h" },
          { type: "build", label: "Add CI workflow: every change to agent prompts or tools automatically runs the eval set. Build fails if accuracy drops below threshold or if any previously-passing finding type now fails.", time: "2h" },
          { type: "build", label: "Refactor agent to supervisor + specialist pattern: IAM specialist agent, network specialist agent, compute/container specialist agent — all orchestrated by a supervisor. Based on Ed's MCP capstone architecture.", time: "2.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Multi-agent architecture in place. CI runs evals on every commit. You can explain why the supervisor/specialist pattern is more maintainable than a single monolithic agent for security."
      },
      {
        week: 21,
        title: "Secrets management + supply chain security domain",
        hours: 7,
        tasks: [
          { type: "build", label: "Add supply chain security workflow: on every container image push to ECR, agent runs Inspector scan + Cosign signature verification. Blocks unsigned images from reaching production namespaces via a Kyverno policy + agent-generated PR if policy needs updating.", time: "3.5h" },
          { type: "read", label: "AWS Builders' Library — 'Implementing least-privilege in AWS' + 'Controlling access with VPC endpoints' (the two most important AWS security architecture patterns for a platform engineer)", url: "https://aws.amazon.com/builders-library/", time: "1.5h" },
          { type: "read", label: "Finish Chip Huyen — AI Engineering (chs 8–12: production, monitoring, reliability, future)", time: "1.5h" },
          { type: "habit", label: "Weekly reading ritual", time: "0.5h" },
        ],
        checkpoint: "Three distinct agent workflows exist: GuardDuty triage, IaC security PR review, supply chain/container scanning. All GitOps-native."
      },
      {
        week: 22,
        title: "Incident response automation",
        hours: 7,
        tasks: [
          { type: "build", label: "Extend agent: automated containment workflow for CRITICAL findings. For a confirmed compromised IAM key: agent generates Terraform PR to attach an explicit-deny policy (immediate effect) AND opens a second PR to revoke the key permanently. Human approves both separately.", time: "3.5h" },
          { type: "read", label: "AWS Incident Response Guide (docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide) — map its phases (preparation, detection, containment, eradication, recovery) to your agent's workflow capabilities", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/aws-security-incident-response-guide.html", time: "1.5h" },
          { type: "read", label: "DDIA ch 12 (future of data systems)", time: "1h" },
          { type: "habit", label: "Weekly reading ritual", time: "1h" },
        ],
        checkpoint: "Agent can execute a two-step containment + revocation workflow for a compromised credential. Human approves each step separately. Audit log is complete."
      },
      {
        week: 23,
        title: "Contribute upstream + publish your work",
        hours: 7,
        tasks: [
          { type: "build", label: "Open a PR to Hacking the Cloud (add a new technique or defensive control), the awslabs/mcp repo (improve Security Hub tool descriptions), or CloudGoat (new scenario). The review process teaches more than any course.", url: "https://github.com/Hacking-the-Cloud/hackingthe.cloud", time: "3h" },
          { type: "build", label: "Write a blog post or internal wiki article: 'How we built a GitOps-native GuardDuty triage agent'. Cover: architecture, eval methodology, the MTTD/MTTI improvement, prompt injection mitigations, what failed, what you'd do differently.", time: "3h" },
          { type: "habit", label: "Share in CloudSecList community / fwd:cloudsec Discord. Weekly reading ritual.", time: "1h" },
        ],
        checkpoint: "PR opened upstream. Post published or shared. You've received feedback from the cloud security community on your architecture."
      },
      {
        week: 24,
        title: "Capstone reflection + durable habits locked in",
        hours: 7,
        tasks: [
          { type: "read", label: "fwd:cloudsec 2025 recorded sessions (YouTube) — watch 2–3 talks on AI + cloud security. This is your community now.", url: "https://www.youtube.com/@fwdcloudsec", time: "2h" },
          { type: "build", label: "Retrospective: measure your agent against real metrics — Mean Time to Detect (MTTD), Mean Time to Investigate (MTTI), false positive rate on Slack alerts, remediation PR acceptance rate", time: "2h" },
          { type: "read", label: "OWASP Agentic AI Top 10 2026 — review your agent against each risk. Document which you've mitigated and which need more work.", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", time: "1h" },
          { type: "build", label: "Set durable weekly rhythm: 1h reading (CloudSecList + AWS Security Digest + Hacking the Cloud + Latent Space), 1h podcast commute, 2h personal agent work or lab, rest on work. Register for fwd:cloudsec EU 2026.", time: "2h" },
        ],
        checkpoint: "Three+ agent workflows in production or staging. Metrics documented. OWASP Agentic review complete. You're a practitioner who ships, not a learner who studies."
      }
    ]
  }
];

const budget = [
  { item: "Practical Cloud Security — Chris Dotson (O'Reilly)", cost: "£35", type: "essential", note: "Best single book on securing AWS workloads in practice" },
  { item: "AI Engineering — Chip Huyen (O'Reilly)", cost: "£35", type: "essential", note: "The AI engineering bible — same as IDP plan" },
  { item: "DDIA 2nd ed — Kleppmann (O'Reilly)", cost: "£40", type: "essential", note: "Distributed systems foundations — same as IDP plan" },
  { item: "Ed Donner — Complete Agentic AI Engineering Course (Udemy, on sale)", cost: "£15", type: "essential", note: "All 6 modules, properly sequenced across the plan" },
  { item: "DeepLearning.AI short courses (Agentic AI, LangGraph, MCP)", cost: "Free", type: "free" },
  { item: "Anthropic Academy (13 courses with certs)", cost: "Free", type: "free" },
  { item: "flaws.cloud + flaws2.cloud (Scott Piper)", cost: "Free", type: "free" },
  { item: "CloudGoat (Rhino Security Labs)", cost: "Free", type: "free" },
  { item: "IAM Vulnerable + Cloudfoxable (BishopFox)", cost: "Free", type: "free" },
  { item: "EKSGoat (EKS Attack and Defense)", cost: "Free", type: "free" },
  { item: "Hacking the Cloud (hackingthe.cloud)", cost: "Free", type: "free" },
  { item: "AWS Security Blog + Builders' Library", cost: "Free", type: "free" },
  { item: "AWS Security Ramp-Up Guide (PDF)", cost: "Free", type: "free" },
  { item: "AWS Security Workshops (workshops.aws)", cost: "Free", type: "free" },
  { item: "Langfuse (self-hosted Docker)", cost: "Free", type: "free" },
  { item: "awslabs/mcp + GitHub MCP + Terraform MCP", cost: "Free", type: "free" },
  { item: "CloudSecList + AWS Security Digest newsletters", cost: "Free", type: "free" },
  { item: "fwd:cloudsec recorded sessions (YouTube)", cost: "Free", type: "free" },
];

const mcpServers = [
  { name: "awslabs/mcp — AWS API server", desc: "GuardDuty, Security Hub, CloudTrail, IAM, EC2, S3 — your primary read interface to the AWS security plane", priority: "day 1" },
  { name: "hashicorp/terraform-mcp-server", desc: "IaC plan inspection, Checkov integration, resource-to-finding correlation for remediation PRs", priority: "day 1" },
  { name: "github/github-mcp-server", desc: "Remediation PR creation — the only write path for the agent into infrastructure", priority: "day 1" },
  { name: "awslabs/mcp — AWS Knowledge", desc: "Queries AWS documentation so agent can explain controls and suggest fixes accurately", priority: "week 4" },
  { name: "pab1it0/prometheus-mcp-server", desc: "Runtime metrics context — agent checks if a finding correlates with anomalous traffic patterns", priority: "week 10" },
  { name: "manusa/kubernetes-mcp-server", desc: "EKS cluster reads — pod status, RBAC bindings, events — for container security findings", priority: "week 18" },
  { name: "IAM Policy Autopilot MCP (AWS)", desc: "AWS's own open-source MCP server for IAM policy generation — validates least-privilege remediations", priority: "week 21" },
];

const labsProgression = [
  { lab: "flaws.cloud (6 levels)", week: "Week 6", type: "POSTURE", desc: "S3 misconfigs, EC2 metadata, exposed credentials — the classic AWS security mistakes" },
  { lab: "flaws2.cloud (attacker + defender paths)", week: "Week 7", type: "POSTURE", desc: "Attacker path builds intuition; defender path maps directly to your agent's investigation logic" },
  { lab: "IAM Vulnerable (31 escalation paths)", week: "Week 7", type: "IAM", desc: "PassRole, CreatePolicyVersion, AssumeRole chains — the knowledge your IAM specialist agent needs" },
  { lab: "CloudGoat (scenarios)", week: "Weeks 12 + 19", type: "ATTACK", desc: "Generate realistic test findings for your eval set. ecs_takeover + lambda_privesc in week 19." },
  { lab: "EKSGoat", week: "Week 18", type: "CONTAINER", desc: "RBAC misconfig, privileged container escape, secrets in env vars — extends agent to EKS domain" },
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

  useEffect(() => {
    tokenRef.current = userToken;
  }, [userToken]);

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

  const scheduleDebouncedSync = useCallback((token, state) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      syncToApi(token, state);
    }, DEBOUNCE_MS);
  }, [syncToApi]);

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

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

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
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    }}>
      <div style={{
        background: "#0f0f1a", border: "1px solid #1e293b", borderRadius: 8,
        padding: "32px", width: "100%", maxWidth: 400, margin: "0 16px",
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
          {userToken ? "Switch identity" : "Start tracking"}
        </h2>
        <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
          Enter a passphrase to sync your progress across devices
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="passphrase-input" style={{ display: "block", fontSize: 11, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.05em" }}>
            Passphrase
          </label>
          <input
            id="passphrase-input"
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (error) setError(null); }}
            placeholder="At least 8 characters"
            autoFocus
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 4,
              border: `1px solid ${error ? "#ef4444" : "#1e293b"}`,
              background: "#0a0a0f", color: "#e2e8f0", fontSize: 13,
              fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
          />
          {error && <p style={{ fontSize: 11, color: "#ef4444", margin: "6px 0 0" }}>{error}</p>}
          <button type="submit" style={{
            width: "100%", padding: "10px 16px", marginTop: 16, borderRadius: 4,
            border: "1px solid #60a5fa", background: "#1e3a5f", color: "#60a5fa",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            letterSpacing: "0.02em", transition: "all 0.15s",
          }}>
            {userToken ? "Sign in" : "Start tracking"}
          </button>
        </form>
        {userToken && (
          <p style={{ fontSize: 11, color: "#475569", margin: "16px 0 0", textAlign: "center" }}>
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
        width: 44, height: 44, minWidth: 44, minHeight: 44, padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 4, border: `2px solid ${checked ? phaseColor : "#475569"}`,
        background: checked ? phaseColor : "transparent",
        cursor: "pointer", transition: "all 0.15s", flexShrink: 0, fontFamily: "inherit",
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
      <span style={{
        position: "relative", width: 60, height: 6, borderRadius: 3,
        background: "#1e293b", overflow: "hidden", display: "inline-block",
      }}>
        <span style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${ratio * 100}%`, borderRadius: 3, background: phaseColor,
          opacity: isComplete ? 1 : 0.7,
          boxShadow: isComplete ? `0 0 6px ${phaseColor}` : "none",
          transition: "width 0.2s, opacity 0.2s, box-shadow 0.2s",
        }} />
      </span>
      <span style={{
        fontSize: 10, fontFamily: "inherit",
        color: isComplete ? phaseColor : "#94a3b8", whiteSpace: "nowrap",
      }}>
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
        <span style={{ fontSize: 11, color: "#ef4444", lineHeight: 1.4 }}>
          Reset all progress for {phaseTitle}? This cannot be undone.
        </span>
        <span style={{ display: "inline-flex", gap: 6 }}>
          <button onClick={() => { onReset(); setConfirming(false); }} style={{
            padding: "4px 10px", borderRadius: 4, border: "1px solid #ef4444",
            background: "#3b1111", color: "#ef4444", fontSize: 11, fontWeight: 600,
            fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
          }}>Confirm</button>
          <button onClick={() => setConfirming(false)} style={{
            padding: "4px 10px", borderRadius: 4, border: "1px solid #1e293b",
            background: "transparent", color: "#94a3b8", fontSize: 11, fontWeight: 600,
            fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
          }}>Cancel</button>
        </span>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} style={{
      padding: "4px 8px", borderRadius: 4, border: "none", background: "transparent",
      color: "#64748b", fontSize: 11, fontFamily: "inherit", cursor: "pointer",
      transition: "color 0.15s",
    }}>
      Reset progress
    </button>
  );
}

export default function SecurityLearningPlan() {
  const [activePhase, setActivePhase] = useState(0);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [activeTab, setActiveTab] = useState("plan");
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);

  const {
    completionState,
    userToken,
    isLoading,
    isSyncing,
    syncError,
    toggleTask,
    setPassphrase,
    resetPhase,
    switchIdentity,
  } = useCompletionState(phases);

  const [dismissedError, setDismissedError] = useState(null);

  const phase = phases[activePhase];
  const totalEssentialCost = budget
    .filter(b => b.type === "essential")
    .reduce((sum, b) => sum + parseInt(b.cost.replace("£", "")), 0);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh" }}>
      {/* Passphrase Modal */}
      {(userToken === null || showPassphraseModal) && (
        <PassphraseModal
          onSubmit={(passphrase) => { setPassphrase(passphrase); setShowPassphraseModal(false); }}
          userToken={userToken}
        />
      )}

      {/* Sync status indicator */}
      {isSyncing && (
        <div style={{ position: "fixed", top: 8, right: 16, padding: "6px 12px", borderRadius: 4, background: "#1e3a5f", border: "1px solid #60a5fa40", color: "#60a5fa", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", zIndex: 9998, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", animation: "pulse 1s infinite" }} />
          Syncing…
        </div>
      )}

      {/* Sync error display */}
      {syncError && syncError !== dismissedError && (
        <div style={{ position: "fixed", top: 8, right: 16, padding: "8px 12px", borderRadius: 4, background: "#3b1111", border: "1px solid #ef444440", color: "#ef4444", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", zIndex: 9998, display: "flex", alignItems: "center", gap: 8, maxWidth: 320 }}>
          <span style={{ flex: 1, lineHeight: 1.4 }}>Sync error: {syncError}</span>
          <button onClick={() => setDismissedError(syncError)} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: 14, cursor: "pointer", padding: "0 2px", fontFamily: "inherit", flexShrink: 0 }} aria-label="Dismiss sync error">×</button>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a0a 50%, #0a0f1a 100%)", borderBottom: "1px solid #1e293b", padding: "32px 24px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", boxShadow: "0 0 8px #f97316" }} />
            <span style={{ color: "#64748b", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>6-Month Learning Plan — AWS Security Edition</span>
            {userToken && (
              <button onClick={() => setShowPassphraseModal(true)} style={{ marginLeft: "auto", padding: "4px 10px", borderRadius: 4, border: "1px solid #1e293b", background: "transparent", color: "#64748b", fontSize: 10, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.15s" }}>
                Switch identity
              </button>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(20px, 4vw, 30px)", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Platform Engineer → <span style={{ color: "#f97316" }}>AWS Security</span> + <span style={{ color: "#a78bfa" }}>AI Agent Builder</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            24 weeks · 7 hrs/week · GitOps-native GuardDuty triage agent capstone · ~£125 total
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
            {["plan", "budget", "labs", "mcp-stack"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "6px 16px", borderRadius: 4,
                border: `1px solid ${activeTab === tab ? "#f97316" : "#1e293b"}`,
                background: activeTab === tab ? "#3a1a0a" : "transparent",
                color: activeTab === tab ? "#f97316" : "#64748b",
                fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>
                {tab === "plan" ? "Week-by-Week" : tab === "budget" ? "Budget" : tab === "labs" ? "Labs Path" : "MCP Stack"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>

        {activeTab === "plan" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {phases.map((p, i) => (
                <button key={p.id} onClick={() => { setActivePhase(i); setExpandedWeek(null); }} style={{
                  flex: 1, minWidth: 160, padding: "14px 16px", borderRadius: 6,
                  border: `1px solid ${activePhase === i ? p.color : "#1e293b"}`,
                  background: activePhase === i ? `${p.color}15` : "#0f0f1a",
                  color: activePhase === i ? p.color : "#64748b",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{p.weeks}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>{p.subtitle}</div>
                </button>
              ))}
            </div>

            <div style={{ background: `${phase.color}0d`, border: `1px solid ${phase.color}30`, borderRadius: 6, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ color: "#cbd5e1", fontSize: 13, margin: "0 0 12px", lineHeight: 1.6 }}>{phase.description}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {phase.focus.map(f => (
                      <span key={f} style={{ padding: "3px 10px", borderRadius: 3, background: `${phase.color}20`, border: `1px solid ${phase.color}40`, color: phase.color, fontSize: 10 }}>{f}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: phase.color, fontSize: 20, fontWeight: 700 }}>{phase.weeklyHours}</div>
                  <div style={{ color: "#64748b", fontSize: 10 }}>per week</div>
                  <div style={{ marginTop: 8 }}>
                    <ResetPhaseButton
                      phaseTitle={phase.title + ": " + phase.subtitle}
                      onReset={() => resetPhase(activePhase)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {phase.weeks_data.map((w) => {
                const isOpen = expandedWeek === w.week;
                const weekCompleted = w.tasks.reduce((count, _task, tIdx) => {
                  const tid = getTaskId(activePhase, w.week, tIdx);
                  return count + (completionState[tid] ? 1 : 0);
                }, 0);
                return (
                  <div key={w.week} style={{ border: `1px solid ${isOpen ? phase.color + "50" : "#1e293b"}`, borderRadius: 6, background: isOpen ? `${phase.color}08` : "#0f0f1a", overflow: "hidden", transition: "all 0.15s" }}>
                    <button onClick={() => setExpandedWeek(isOpen ? null : w.week)} style={{ width: "100%", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left", fontFamily: "inherit", color: "inherit" }}>
                      <span style={{ width: 48, height: 24, borderRadius: 3, background: `${phase.color}20`, border: `1px solid ${phase.color}50`, color: phase.color, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>W{w.week}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: isOpen ? 600 : 400, color: isOpen ? "#e2e8f0" : "#94a3b8" }}>{w.title}</span>
                      <WeekProgressBar completed={weekCompleted} total={w.tasks.length} phaseColor={phase.color} />
                      <span style={{ color: "#64748b", fontSize: 11 }}>{w.hours}h</span>
                      <span style={{ color: "#64748b", fontSize: 14, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>›</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 16px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                          {w.tasks.map((task, i) => {
                            const tc = typeColors[task.type];
                            const taskId = getTaskId(activePhase, w.week, i);
                            return (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 4, background: tc.bg, border: `1px solid ${tc.border}30` }}>
                                <TaskCheckbox
                                  checked={completionState[taskId] || false}
                                  onChange={() => toggleTask(taskId)}
                                  phaseColor={phase.color}
                                  taskLabel={task.label}
                                />
                                <span style={{ padding: "2px 7px", borderRadius: 2, background: tc.labelBg, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", flexShrink: 0, marginTop: 1 }}>{tc.label}</span>
                                <span style={{ flex: 1, fontSize: 12, color: completionState[taskId] ? "#64748b" : "#cbd5e1", lineHeight: 1.5, textDecoration: completionState[taskId] ? "line-through" : "none", transition: "all 0.15s" }}>
                                  {task.url ? <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ color: completionState[taskId] ? "#475569" : "#93c5fd", textDecoration: "none" }}>{task.label}</a> : task.label}
                                </span>
                                {task.time && <span style={{ color: "#475569", fontSize: 10, flexShrink: 0, marginTop: 2 }}>{task.time}</span>}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ padding: "10px 12px", borderRadius: 4, background: "#0a1628", border: "1px solid #1e3a5f", display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ color: "#60a5fa", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", flexShrink: 0, marginTop: 1, padding: "2px 7px", background: "#1e3a5f", borderRadius: 2 }}>✓ CHECK</span>
                          <span style={{ fontSize: 12, color: "#7dd3fc", lineHeight: 1.5 }}>{w.checkpoint}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", padding: "12px 16px", background: "#0a0a0f", border: "1px solid #1e293b", borderRadius: 6 }}>
              <span style={{ fontSize: 10, color: "#475569", marginRight: 4 }}>TASK TYPES:</span>
              {Object.entries(typeColors).map(([type, tc]) => (
                <span key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ padding: "1px 6px", borderRadius: 2, background: tc.labelBg, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>{tc.label}</span>
                </span>
              ))}
            </div>
          </>
        )}

        {activeTab === "budget" && (
          <div>
            <div style={{ background: "#0f1a0f", border: "1px solid #166534", borderRadius: 6, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Essential spend</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#4ade80" }}>£{totalEssentialCost}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Everything else on this list is free. The AWS security lab ecosystem is exceptionally well-resourced for free content.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {budget.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 4, background: item.type === "essential" ? "#0f1a0f" : "#0a0a0f", border: `1px solid ${item.type === "essential" ? "#166534" : "#1e293b"}` }}>
                  <span style={{ padding: "2px 8px", borderRadius: 3, background: item.type === "essential" ? "#14532d" : "#1e293b", color: item.type === "essential" ? "#4ade80" : "#475569", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", flexShrink: 0, marginTop: 1 }}>{item.type === "essential" ? "PAID" : "FREE"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: item.type === "essential" ? "#cbd5e1" : "#64748b" }}>{item.item}</div>
                    {item.note && <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{item.note}</div>}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: item.type === "essential" ? "#4ade80" : "#475569", flexShrink: 0 }}>{item.cost}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#1a1a0f", border: "1px solid #713f12", borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: "#facc15", marginBottom: 6 }}>OPTIONAL</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                PwnedLabs subscription (~£30/month or annual) — the most realistic AWS attack/defend lab environment available. Worth it in Phase 2 if you want more depth than CloudGoat. AWS Skill Builder Individual subscription (~£25/month) — gives access to Security Engineering on AWS hands-on labs. The Pragmatic Engineer newsletter (~£120/yr). O'Reilly Online Learning (~£400/yr) — access to all essential books plus sandboxes.
              </div>
            </div>
          </div>
        )}

        {activeTab === "labs" && (
          <div>
            <p style={{ color: "#64748b", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
              The AWS security lab ecosystem is uniquely well-resourced for free, hands-on learning. These are sequenced so you build the knowledge your agent needs before you build the agent. Breaking things before defending them is the fastest path to understanding what to detect.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {labsProgression.map((lab, i) => {
                const typeColor = lab.type === "POSTURE" ? "#f97316" : lab.type === "IAM" ? "#a78bfa" : lab.type === "CONTAINER" ? "#34d399" : "#60a5fa";
                return (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 6, background: "#0f0f1a", border: `1px solid ${typeColor}25`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ padding: "3px 8px", borderRadius: 3, background: `${typeColor}20`, color: typeColor, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>{lab.type}</div>
                      <div style={{ fontSize: 10, color: "#475569", whiteSpace: "nowrap" }}>{lab.week}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{lab.lab}</div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{lab.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, padding: "16px", background: "#0f1428", border: "1px solid #1e3a5f", borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Why break things before building the agent?</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
                Your agent needs to reason about <span style={{ color: "#f97316" }}>what happened</span>, <span style={{ color: "#a78bfa" }}>how the attacker moved</span>, and <span style={{ color: "#34d399" }}>what needs to change</span>. If you haven't personally exploited a PassRole chain or escaped a privileged container, your agent's investigation prompts will be shallow. The labs in Phase 1 build the attacker intuition that makes Phase 2's agent prompts precise rather than generic.
              </div>
            </div>
          </div>
        )}

        {activeTab === "mcp-stack" && (
          <div>
            <p style={{ color: "#64748b", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
              The security agent's MCP stack is primarily read-only against AWS services. The only write path is GitHub — via Pull Requests. The agent never applies changes directly to AWS.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {mcpServers.map((s, i) => {
                const priorityColor = s.priority === "day 1" ? "#f97316" : s.priority === "week 4" ? "#a78bfa" : s.priority === "week 10" ? "#60a5fa" : "#34d399";
                return (
                  <div key={i} style={{ padding: "14px 16px", borderRadius: 6, background: "#0f0f1a", border: `1px solid ${priorityColor}25`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ padding: "3px 8px", borderRadius: 3, background: `${priorityColor}20`, color: priorityColor, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", flexShrink: 0, marginTop: 1, whiteSpace: "nowrap" }}>{s.priority.toUpperCase()}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, padding: "16px", background: "#0f1428", border: "1px solid #1e3a5f", borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>The security write path — why GitOps matters even more here</div>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
                <span style={{ color: "#f97316" }}>Read tools</span> (AWS MCP — GuardDuty, Security Hub, CloudTrail, Security Lake) → fully autonomous, no approval needed<br/>
                <span style={{ color: "#60a5fa" }}>Write tools</span> (GitHub MCP — remediation PRs, policy changes) → always via Pull Request, human approves merge<br/>
                <span style={{ color: "#a78bfa" }}>Emergency containment</span> (deny policy attachment) → named security lead approval required, separate PR from permanent revocation<br/>
                <span style={{ color: "#34d399" }}>Agent never touches AWS directly</span> → blast radius is bounded to what a developer with write access to the Terraform repo can do
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
