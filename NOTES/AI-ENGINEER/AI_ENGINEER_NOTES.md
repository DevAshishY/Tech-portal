# AI & Claude Notes – README

Oct 7, 2026 · @ashish yadav

> **TL;DR:** Brief Claude like a colleague → **Task + Context + Example + Format** → iterate.

## AI basics

- **AI Operators** → build AI models (OpenAI, Anthropic, Google)
- **AI Builders** → use AI to build apps and automate
- **GenAI** → creates text, images, audio, video, code
- **AI Agent** → works on its own: writes code, makes files, acts like a human workflow
- **Automation** = fixed steps: Trigger → Action → Output
- **Autonomous** = give only a goal, AI decides the steps

## How an LLM works (5 steps)

1. **Tokenize** → text to tokens (5 words ≠ 5 tokens)
2. **Vectorize** → tokens to number vectors
3. **Self-attention** → finds context between words
4. **Predict** → next token
5. **Decode** → back to words

- **Limit:** no live access (calendar, APIs) → fix with agents + integrations/connectors
- **Cost:** more tokens = more cost → skip filler words

## How models learn

- **SFT** → learns from labeled data
- **RL** → trial and error with rewards (e.g. DeepSeek-R1, strong at coding)

## Prompting: T-C-E-F

- **T**ask – what you want
- **C**ontext – who, why, constraints
- **E**xample – show the style you like
- **F**ormat – length, tone, layout
- Iterate with short feedback: "shorter", "add a table"
- Hard problem → "think step by step"
- Unsure → "ask me questions first"

## Claude features

- **Projects** → workspace with saved files + instructions
- **Artifacts** → deliverables: docs, apps, slides, diagrams
- **Skills** → repeatable workflows
- **Connectors (MCP)** → your tools' data (Drive, Gmail, Slack, M365)
- **Enterprise search** → search all company tools at once
- **Research** → deep, cited reports
- **Memory** → remembers past chats

## Where Claude lives

- Web · Desktop · Mobile
- Claude Code → coding
- Cowork → desktop tasks
- Chrome · Excel · PowerPoint
- Slack via Claude Tag (Teams coming soon)

## AI tools map

| Need | Tool |
| --- | --- |
| Chat assistant | Claude, ChatGPT, Gemini |
| Coding | Claude Code, Cursor (Agent / Plan / Debug / Ask), Gemini CLI, GitHub Copilot |
| Research & study | NotebookLM → audio/video overview, mind map, flashcards, quiz |
| Images | Midjourney |
| Voice | ElevenLabs → text-to-speech, voice cloning |
| Speech-to-text | Whisper (OpenAI) |
| Video | OpenArt |
| UI / apps from prompt | v0.dev → React, Next.js, Tailwind |
| Live web data | SearchAPI → REST API for chatbots, RAG, n8n |
| Automation | n8n (self-host), Make, Zapier |
| Autonomous agent | Manus |

## n8n on Google Cloud (free)

1. Create e2-micro VM
2. Install Docker + Compose
3. Run n8n via `docker-compose.yml`
4. Add Nginx/Caddy + SSL
5. Open on your domain

## AI safety

- **Jailbreak** → tricking AI past its rules (prompt injection, roleplay)
- **Stay safe:** ground answers with retrieval (RAG) + human review + ethical checks

ills

Source: [Claude 101 – Anthropic Academy](https://anthropic.skilljar.com/claude-101)
