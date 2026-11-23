
# AI & Claude Interview Notes

> Question-wise notes from **Claude 101**, **Building with the Claude API** and **Claude Code 101**, plus AI-engineering and system-design interview questions.
> Each question: **short answer → real-life example → code → ⚠️ gotcha → 🎯 interview tip.**
> Questions marked **🆕** are extra interview topics. **🔄 Updated** marks API facts that changed on the latest models (checked against the Claude docs, Nov 2026).

> **TL;DR:** Brief Claude like a colleague → **Task + Context + Example + Format** → iterate.

## Table of Contents

| Part | Topic | Questions |
|---|---|---|
| A | AI & Claude Basics | AI-1 to AI-12 |
| B | Claude API Basics | AI-13 to AI-22 |
| C | Prompt Engineering & Evaluation | AI-23 to AI-30 |
| D | Tool Use | AI-31 to AI-35 |
| E | RAG | AI-36 to AI-41 |
| F | API Features (Thinking, Files, Caching…) | AI-42 to AI-47 |
| G | MCP | AI-48 to AI-53 |
| H | Claude Code & Computer Use | AI-54 to AI-60 |
| I | Agents & Workflows | AI-61 to AI-66 |
| J | 🆕 AI Engineering Interview Questions | AI-67 to AI-82 |
| K | System Design | AI-83 to AI-92 |
| L | Cheat Sheet | AI-93 |

---

## Part A — AI & Claude Basics

### AI-1. Key AI terms?

| Term | Simple meaning |
|---|---|
| **AI operators** | companies that **build** models (Anthropic, OpenAI, Google) |
| **AI builders** | people who **use** AI to build apps and automate work |
| **GenAI** | AI that **creates** text, images, audio, video, code |
| **AI agent** | AI that **takes actions** toward a goal, not just chats |
| **Automation** | **fixed steps:** trigger → action → output |
| **Autonomous** | give only a **goal**; AI decides the steps |

**Real-life:** automation = a washing machine programme. Autonomous = a housekeeper you tell "make the house clean".

### AI-2. How do models learn (SFT vs RL)?

| Method | Learns from | Real-life |
|---|---|---|
| **Pre-training** | huge amounts of text (predict the next token) | reading a whole library |
| **SFT** (Supervised Fine-Tuning) | labelled examples (input → ideal output) | a teacher showing worked answers |
| **RL** (Reinforcement Learning) | trial and error with rewards (incl. RLHF from human feedback) | a puppy learning tricks with treats |

🎯 RL-heavy training is what makes "reasoning" models strong at maths and code.

### AI-3. How does an LLM work?

```text
Input text → Tokenize → Embed → Contextualize → Generate next token → repeat → Decode
```

| Step | Meaning |
|---|---|
| **Tokenize** | split into tokens (word, part of a word, symbol); 5 words ≠ always 5 tokens |
| **Embed** | each token → a list of numbers capturing meaning |
| **Contextualize** | **self-attention** uses nearby words to pick the right meaning |
| **Generate** | compute the probability of every next token, pick one, repeat |
| **Decode** | tokens back into text |

**Real-life:** autocomplete on your phone, but trained on a library and able to keep the whole conversation in mind.

🎯 "An LLM predicts the next token, one at a time, using attention over the context."

### AI-4. When does Claude stop generating?

| Stop reason | Meaning |
|---|---|
| `max_tokens` | hit the limit you set |
| `end_turn` | natural ending |
| `stop_sequence` | found a stop phrase you defined |
| `tool_use` | wants you to run a tool |
| `refusal` | declined the request |

⚠️ Always check `stop_reason`: a `max_tokens` stop means the answer (or JSON) is **cut off**.

### AI-5. What are the limits of an LLM, and what does cost depend on?

- No live data (calendar, prices) on its own → **tools / connectors**.
- Knowledge **cutoff** date.
- Can **hallucinate** (AI-67).
- **Cost = input tokens + output tokens** (output costs more) → keep prompts lean, cache repeated parts.

**Real-life:** a brilliant expert who's been on a desert island since their cutoff date and charges by the word.

### AI-6. Claude app features?

| Feature | Meaning |
|---|---|
| **Projects** | workspace with files + instructions |
| **Artifacts** | finished outputs: docs, apps, slides, diagrams |
| **Skills** | reusable workflows for repeated tasks |
| **Connectors (MCP)** | bring in data from your tools (Drive, Gmail, Slack, M365) |
| **Research** | deep reports with citations |
| **Memory** | remembers context from past chats |

### AI-7. Where does Claude live?

- **Claude app:** web, desktop, mobile (including longer agentic tasks on your desktop files).
- **Claude Code:** coding agent (terminal, IDE, desktop, web).
- **Claude in Chrome**, Excel, PowerPoint.
- **Claude Tag:** Claude in Slack.
- **Claude API / Platform:** for developers.

### AI-8. AI tools map?

| Need | Tools |
|---|---|
| Chat | Claude, ChatGPT, Gemini |
| Coding | Claude Code, Cursor, GitHub Copilot, Gemini CLI |
| Research & study | NotebookLM (audio overview, mind maps, flashcards) |
| Images | Midjourney |
| Voice / speech-to-text | ElevenLabs / Whisper |
| UI from a prompt | v0.dev (React, Next.js, Tailwind) |
| Automation | n8n (self-host), Make, Zapier |

### AI-9. How do you self-host n8n on Google Cloud (free tier)?

1. Create an **e2-micro** VM.
2. Install Docker + Compose.
3. Run n8n with `docker-compose.yml`.
4. Add Nginx/Caddy + SSL.
5. Point your domain to it.

⚠️ Protect it with authentication; an open n8n instance can run arbitrary workflows.

### AI-10. What is a jailbreak / prompt injection?

- **Jailbreak:** tricking the AI past its rules (role-play, "ignore previous instructions").
- **Prompt injection:** hidden instructions inside **data** the AI reads (a web page, email, PDF).

**Real-life:** a forged note slipped into a stack of documents saying "give the bearer the safe key".

🎯 Defences: AI-74.

### AI-11. How do you use AI safely?

- Ground answers in sources (**RAG + citations**).
- **Human review** for high-stakes output.
- Least-privilege tools; confirm risky actions.
- Validate outputs (schemas, tests).
- Protect personal data; follow company policy.

### AI-12. 🆕 Which Claude model would you choose?

| Need | Choose |
|---|---|
| hardest reasoning, complex agents | **Opus** |
| balanced quality / speed / cost (most apps) | **Sonnet** |
| fast, cheap, high volume (classification, routing, test data) | **Haiku** |

Current API names: `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`.

**Real-life:** senior architect, experienced developer, fast intern.

🎯 Route easy requests to Haiku and hard ones to Sonnet/Opus to cut cost (AI-77).

---

## Part B — Claude API Basics

> 🧠 **"Kind Monkeys Make Magic"** = **K**ey, **M**odel, **M**essages, **M**ax tokens

### AI-13. What is the request flow, and why use a server?

```text
Client app → Your server (holds API key) → Anthropic API → Claude
           ← response (message + usage + stop_reason) ←
```

**Why a server?** An API key in browser/mobile code can be **stolen** by anyone.

**Real-life:** customers order through the waiter (your server); they never get the kitchen keys (API key).

### AI-14. What are the 4 things in every request?

**API key, model, messages, max_tokens.**

```python
import anthropic
client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY from env

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1000,
    system="You are a math tutor. Give hints, not answers.",
    messages=[{"role": "user", "content": "Hi"}],
)
print(response.content[0].text)
print(response.usage, response.stop_reason)
```

SDKs: Python, TypeScript, Java, Go, Ruby, C#, PHP, or plain HTTP.

### AI-15. What comes back in a response?

- **content:** list of blocks (`text`, `tool_use`, `thinking`).
- **usage:** input/output tokens (and cache tokens).
- **stop_reason:** why it stopped (AI-4).

⚠️ Read **all** blocks; `content[0]` isn't always text (it may be thinking or a tool call).

### AI-16. Where should the API key live?

On the **server**, in env vars / a secret manager (`.env` locally, never committed). Never in frontend JS, mobile apps, GitHub or logs.

🎯 Rotate keys if leaked; set spend limits per workspace.

### AI-17. How does multi-turn chat work?

Claude has **no memory between requests**. Send the **full history** every time.

```python
history = [
    {"role": "user", "content": "My name is Asha."},
    {"role": "assistant", "content": "Nice to meet you, Asha!"},
    {"role": "user", "content": "What's my name?"},
]
client.messages.create(model="claude-sonnet-5-5", max_tokens=200, messages=history)
```

**Real-life:** a friend with no memory who reads the whole chat log before each reply.

⚠️ Long histories cost more tokens; trim, summarise or cache them.

### AI-18. What is a system prompt?

Sets Claude's **role, rules and context** for the whole conversation.

```python
system="You are a support agent for Acme. Answer only about Acme products. Be concise."
```

**Real-life:** a job description handed to a new employee before their first customer.

### AI-19. 🔄 Temperature: creative vs predictable?

**Course answer:** `temperature` 0.0 = predictable (facts, code), 1.0 = creative (stories).

**🔄 Updated:** on the latest models (e.g. **Sonnet 5.5**), `temperature`, `top_p` and `top_k` **return a 400 error**; remove them. Steer creativity **in the prompt** instead ("give 5 very different, playful ideas").

**Real-life:** temperature was a dial on how adventurous the chef is; now you just tell the chef the style you want.

🎯 Knowing the course answer **and** the change shows you keep up.

### AI-20. What is streaming?

Show the reply **token by token** as it's generated (Server-Sent Events).

```python
with client.messages.stream(model="claude-sonnet-5-5", max_tokens=500,
                            messages=[{"role": "user", "content": "Tell me a joke"}]) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

**Real-life:** watching someone type in a chat instead of waiting for the whole message.

🎯 Better perceived speed; essential for chat UIs (AI-76).

### AI-21. 🔄 How do you get clean JSON?

**Course answer:** **prefill** the assistant turn with ` ```json ` and use `stop_sequences=["```"]`.

**🔄 Updated:** newer models (Sonnet 4.6+, Sonnet 5.5, Opus 5.5) **reject prefill** with a 400 (*"The conversation must end with a user message."*). Use **structured outputs**:

```python
from pydantic import BaseModel

class Contact(BaseModel):
    name: str
    email: str

resp = client.messages.parse(
    model="claude-sonnet-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Extract: John (john@x.com) wants a demo."}],
    output_format=Contact,
)
print(resp.parsed_output)  # name='John' email='john@x.com'
```

Raw schema: `output_config={"format": {"type": "json_schema", "schema": {...}}}`.

⚠️ Check `stop_reason` (`max_tokens` / `refusal` can break the schema). Citations can't be combined with structured outputs.

### AI-22. Quiz answers (API basics)

| Question | Answer |
|---|---|
| 4 things in a request | API key, model, messages, max_tokens |
| Where to keep the key | on your server, never in JS/GitHub/browser |
| Claude forgot the earlier question | send the whole history |
| Tutor that gives hints | system prompt |
| Very creative stories | temperature 1.0 (course) / ask for creativity in the prompt on newest models |

---

## Part C — Prompt Engineering & Evaluation

> 🧠 **"Cats Sleep Xtra Early"** = **C**lear, **S**pecific, **X**ML, **E**xamples

### AI-23. What are the core prompting techniques?

| Technique | Rule | Example |
|---|---|---|
| **Clear & direct** | start with an action verb | ❌ "What workout should I do?" ✅ "Create a workout plan" |
| **Specific** | length, audience, format, steps | "30-minute plan for beginners, no equipment" |
| **XML tags** | separate **data** from **instructions** | `<email>…</email>` |
| **Examples** | input → output pairs (one/multi-shot) | tricky tone, sarcasm, format |

**Real-life:** briefing a new colleague: what, for whom, how long, with a sample.

### AI-24. Why XML tags?

They separate instructions from data so Claude doesn't confuse them.

```xml
Summarize the email below in 2 sentences.
<email>
Hi team, the meeting moved to Friday...
</email>
```

🎯 Multiple inputs: `<reviews>…</reviews>` and `<sales_data>…</sales_data>`.

⚠️ XML tags don't make Claude **faster**, and prompt engineering doesn't **train** the model.

### AI-25. What is T-C-E-F prompting?

- **T**ask: what you want.
- **C**ontext: who, why, constraints.
- **E**xample: the style you like.
- **F**ormat: length, tone, layout.

Iterate with short feedback ("shorter", "add a table"). Hard problem → ask it to reason step by step. Unsure → "ask me questions first".

**Real-life:** ordering a cake: what, for whom, a photo of a design you like, size and colour.

### AI-26. 🆕 Zero-shot vs few-shot vs chain-of-thought?

| Technique | How |
|---|---|
| **Zero-shot** | instruction only |
| **Few-shot** | add 2–5 input → output examples |
| **Chain-of-thought** | ask it to reason step by step before answering (or use built-in thinking, AI-42) |

🎯 Few-shot for consistent **format**; reasoning for **logic** problems.

### AI-27. What is prompt evaluation?

> 🧠 **"Dogs Take Red Gifts Repeatedly"** = **D**raft → **T**est data → **R**un → **G**rade → **R**epeat

**Engineering = improve** a prompt. **Evaluation = measure** it.

```text
1. Draft a prompt
2. Create a test dataset (Haiku can generate it; include edge cases)
3. Run each input through Claude
4. Grade the outputs
5. Improve → re-run → compare scores
```

**Real-life:** a school exam for your prompt, re-taken after each study session.

⚠️ Testing once with one input is risky; real users send unexpected inputs.

### AI-28. Code vs model vs human graders?

| Grader | Good for |
|---|---|
| **Code** | valid JSON, length, keywords, regex (fast, cheap, objective) |
| **Model** (LLM-as-judge) | quality, tone, helpfulness |
| **Human** | most accurate, slow, expensive |

💡 Model grader: ask for **strengths, weaknesses and reasoning first, score last**.

```python
results = []
for test in dataset:
    output = run_prompt(test)
    results.append(grade(test, output))
print("Average:", sum(results) / len(results))
```

### AI-29. 🆕 How do you test LLM features in CI?

- Fixed **eval dataset** (golden set) + code graders in CI.
- Track scores per prompt/model version; block regressions.
- Snapshot critical outputs; sample production logs into new test cases.

**Real-life:** unit tests for prompts.

### AI-30. Quiz answers (prompting & eval)

| Question | Answer |
|---|---|
| Clearest prompt | "Write a product description for running shoes." |
| Reviews + sales data together | XML tags `<reviews>`, `<sales_data>` |
| Measure a prompt | prompt evaluation with automated tests |
| Step after responses | send them to a grader |
| Model grader | another AI that scores quality |
| After changing a prompt | run the eval again |

---

## Part D — Tool Use

> 🧠 **"In The Dark Forest"** = **I**nitial request → **T**ool request → **D**ata retrieval → **F**inal response

### AI-31. Why tools, and how does the loop work?

Claude only knows its training data. Tools give **real-time data** and access to **outside systems**.

```text
Claude replies with tool_use → your code runs the function → you send tool_result → Claude answers
```

**Real-life:** a manager (Claude) asks an assistant (your code) to check the calendar, then replies with the answer.

⚠️ **Claude doesn't run your tools**; your code does. (Built-in server tools like web search are the exception.)

### AI-32. What are the parts of a tool?

| Part | Meaning |
|---|---|
| **Tool function** | normal code that does the work |
| **Tool schema** | JSON: name, description, `input_schema` |
| **tool_use block** | Claude's request (with an `id`) |
| **tool_result block** | your answer, with the **same `tool_use_id`** |
| **Loop** | repeat while `stop_reason == "tool_use"`; `end_turn` = done |

```python
def get_weather(city):
    return f"18°C, sunny in {city}"

tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"],
    },
}]

messages = [{"role": "user", "content": "Weather in Pune?"}]
response = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024, tools=tools, messages=messages)

while response.stop_reason == "tool_use":
    messages.append({"role": "assistant", "content": response.content})
    results = [
        {"type": "tool_result", "tool_use_id": b.id, "content": get_weather(**b.input)}
        for b in response.content if b.type == "tool_use"
    ]
    messages.append({"role": "user", "content": results})
    response = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024, tools=tools, messages=messages)

print(response.content[-1].text)
```

🎯 Good **descriptions** matter most: Claude chooses tools from them.

### AI-33. Multiple tools, multi-block replies and batching?

- **Multiple tools:** Claude picks the right one from the descriptions.
- **Multi-block message:** a reply can contain **text + tool_use** together.
- **Parallel / batch calls:** several tool calls in one reply (or a custom "batch" tool) → fewer round trips.
- **Fine-grained streaming:** tool inputs stream piece by piece (JSON may be incomplete until done).

**Real-life:** asking one assistant to fetch three files in one trip, not three trips.

### AI-34. Built-in tools?

| Tool | Who runs it |
|---|---|
| **Text editor tool** | schema provided by Anthropic, **you** implement the file operations |
| **Web search / web fetch** | **Anthropic runs it** (server tool) |
| **Code execution** | Anthropic runs Python in a sandbox |
| **Computer use** | you run the actions (AI-60) |

🔄 Built-in tool **versions** change with new models (e.g. Sonnet 5.5 needs the newer computer-use toolset); check the docs when upgrading.

### AI-35. 🔄 Forcing a tool, and strict tool use?

- `tool_choice: {"type": "auto"}` → Claude decides (default).
- **🔄 Updated:** on Sonnet 5.5, forcing (`"any"` / `"tool"`) returns a **400**; use `auto` + clear instructions.
- **Strict tool use:** `strict: true` on a tool → inputs are validated against the schema.

**Quiz:** purpose of tools → real-time info and outside systems · tool function → plain function run when Claude asks · text + tool_use → multi-block message · batch tool → many calls together.

---

## Part E — RAG (Retrieval-Augmented Generation)

> 🧠 **"Cut, Code, Store, Find, Feed"** = Chunk → Embed → Store → Find → Feed to Claude

### AI-36. What is RAG?

Find the **relevant parts** of your documents and give them to Claude with the question.

**Real-life:** an **open-book exam**: you don't memorise the book, you look up the right page.

```text
SETUP:   Documents → Chunk → Embed → Store (vector DB)
ASK:     Question → Embed → Find closest chunks
ANSWER:  Question + chunks → Claude → Answer (with citations)
```

🎯 Why: up-to-date, private data; fewer hallucinations; no retraining.

### AI-37. What is chunking?

Cutting documents into pieces (by size, headings or sentences) with **overlap** so ideas aren't cut in half.

**Real-life:** cutting a long video into scenes, with a few seconds overlap so nothing is lost at the cut.

⚠️ Too small → lost context. Too big → noisy, expensive. Typical: a few hundred tokens with 10–20% overlap.

### AI-38. What are embeddings and cosine similarity?

**Embedding:** text → a vector of numbers capturing **meaning** ("dog" ≈ "puppy").
**Cosine similarity:** how close two vectors point in the same direction (1 = same meaning).

```python
import math
def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

cosine([1, 0, 1], [1, 0, 1])  # ≈ 1.0 (same direction)
```

**Real-life:** placing words on a map where similar meanings live in the same neighbourhood.

### AI-39. What is a vector database?

Stores embeddings and finds the nearest ones fast (approximate nearest neighbour).

Examples: pgvector (Postgres), Pinecone, Weaviate, Qdrant, Chroma, MongoDB Atlas Vector Search.

### AI-40. BM25 vs embeddings vs hybrid search?

| Search | Good at | Weak at |
|---|---|---|
| **BM25** (keyword) | exact words, IDs, codes; rare words count more | synonyms |
| **Embeddings** (semantic) | meaning, paraphrases | exact IDs ("ERR-4021") |
| **Hybrid** | both, merged (e.g. reciprocal rank fusion) | more setup |

**Real-life:** BM25 = Ctrl+F. Embeddings = asking a librarian who understands what you mean.

🎯 Add a **re-ranker** after retrieval to improve the top results.

### AI-41. 🆕 How do you evaluate and improve a RAG system?

| Check | Question |
|---|---|
| Retrieval | did we fetch the right chunks? (recall@k) |
| Faithfulness | is the answer supported by the chunks? |
| Answer quality | is it correct and complete? |

**Improve:** better chunking, hybrid search, re-ranking, metadata filters, contextual chunk headers, citations, "say I don't know if not in the documents".

---

## Part F — API Features

> 🧠 **"Tiny Iguanas Play Chess, Climb Cliffs"** = Thinking, Images, PDFs, Citations, Caching, Code execution

### AI-42. 🔄 What is extended / adaptive thinking?

Claude reasons step by step before answering.

**Course answer:** `thinking={"type": "enabled", "budget_tokens": 2000}`.

**🔄 Updated:** `budget_tokens` is **legacy**; Claude 4.7+ models (Opus 5.5, Sonnet 5.5, Haiku 5.5) **reject it with a 400**. Use **adaptive thinking + effort**:

```python
response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},   # low / medium / high / …
    messages=[{"role": "user", "content": "Plan a database migration..."}],
)
```

On Sonnet 5.5, thinking is **on by default**, and thinking text is **omitted** unless you ask to display it.

**Real-life:** instead of saying "think for exactly 10 minutes", you say "this is important" and Claude decides how long to think.

### AI-43. Images and PDFs?

```python
{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": b64}}
{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": b64}}
```

PDFs: Claude reads text, tables, charts and images.

**Real-life:** handing a colleague a photo or a printed report instead of retyping it.

### AI-44. What are citations?

Answers link to the **exact source passages** so users can verify.

```python
{"type": "document", "source": {...}, "citations": {"enabled": True}}
```

🎯 Use for legal, medical, support answers. ⚠️ Not combinable with structured outputs.

### AI-45. 🔄 What is prompt caching?

Reuse a big repeated prefix (system prompt, document, tools) → **faster and cheaper**.

```python
system=[
    {"type": "text", "text": "You analyse contracts."},
    {"type": "text", "text": LONG_CONTRACT, "cache_control": {"type": "ephemeral"}},
]
```

| Rule | Value |
|---|---|
| Order cached | **tools → system → messages** (everything before the breakpoint) |
| Lifetime | **5 min** (refreshes on use) or **1 hour** (`"ttl": "1h"`) |
| Max breakpoints | **4** |
| Minimum size | **512** tokens on 5.x models (1,024–4,096 on older); smaller = silently not cached |
| Breaks when | anything before the breakpoint changes |
| Cost | write 1.25× (5 min) / 2× (1 h); **read ~0.05–0.1×** base input |
| Automatic | top-level `cache_control` moves the breakpoint as a chat grows |

**Real-life:** keeping the reference book open on your desk instead of fetching it from the library each time.

⚠️ Verify with `usage.cache_read_input_tokens`; put **changing content last**.

### AI-46. Files API and code execution?

- **Files API (beta):** upload once, reuse by `file_id`.
- **Code execution:** Claude runs Python in a sandbox (data analysis, charts), **no internet access**.

**Real-life:** Files API = a shared drive link instead of emailing the same attachment every time.

### AI-47. Quiz answers (features)

| Question | Answer |
|---|---|
| Verify facts from documents | citations |
| Same long document, many questions | prompt caching |
| Think step by step (newest models) | adaptive thinking + effort |
| Strict JSON | structured outputs |

---

## Part G — MCP (Model Context Protocol)

### AI-48. What is MCP?

An **open standard** to connect AI apps to tools and data **without custom integration code for each app**. In the Claude app these are **Connectors**.

```text
Your app (host) → MCP client → MCP server → tools, resources, prompts
```

**Real-life:** **USB-C for AI**: one standard plug works with any device.

🎯 Without MCP you write and maintain every integration yourself.

### AI-49. MCP server vs client?

| Part | Role |
|---|---|
| **MCP server** | exposes **tools, resources, prompts** |
| **MCP client** | the bridge: your Client class + the SDK's **ClientSession** |
| **Transport** | **stdio** (local) or **Streamable HTTP** (remote): "transport agnostic" |

### AI-50. Tools vs resources vs prompts: who controls what?

| Primitive | Controlled by | Example |
|---|---|---|
| **Tools** | **model** | Claude calls `read_doc_contents` |
| **Resources** | **app** | app loads a document into context |
| **Prompts** | **user** | user clicks "Summarize document" |

**Real-life:** tools = what the chef can use; resources = ingredients the restaurant provides; prompts = set menu items a customer picks.

### AI-51. How do you write an MCP server?

```python
from mcp.server.fastmcp import FastMCP
from pydantic import Field

mcp = FastMCP("docs")
docs = {"plan": "Q3 plan...", "spec": "API spec..."}

@mcp.tool(name="read_doc_contents", description="Read a document")
def read_document(doc_id: str = Field(description="Id of the document")):
    return docs[doc_id]                      # SDK generates the JSON schema

@mcp.resource("docs://documents")            # direct resource
def list_docs() -> list[str]:
    return list(docs)

@mcp.resource("docs://documents/{doc_id}")   # templated resource
def fetch_doc(doc_id: str) -> str:
    return docs[doc_id]
```

### AI-52. How do you test an MCP server?

```bash
mcp dev mcp_server.py   # opens the MCP Inspector
```

- `ListToolsRequest` → what tools exist?
- `CallToolRequest` → run a tool.

### AI-53. 🆕 MCP security?

- Only install **trusted** servers; they run code and see data.
- Least privilege (read-only where possible), scoped tokens / OAuth.
- Treat tool outputs as **untrusted** (prompt injection).
- Human confirmation for destructive actions.

**Quiz:** MCP → communication layer for tools/context · without MCP → you maintain all tool code · test → MCP Inspector · tool definition → `@mcp.tool()` · find tools → `ListToolsRequest` · doc by ID → templated resource · user button → prompt.

---

## Part H — Claude Code & Computer Use

### AI-54. What is Claude Code?

An **AI coding agent** that reads, writes and edits code, runs commands and tests. Runs in the terminal, VS Code, JetBrains, the desktop app and the web.

**Agentic loop:** gather context → take action → verify → repeat.

- **Tools** = what Claude **can** do.
- **Permissions** = what it's **allowed** to do without asking.
- **Context window** = what it can see now; **auto-compacts** when full.

**Real-life:** a pair programmer who can actually type and run the tests.

### AI-55. 🔄 What are the permission modes?

`Shift+Tab` cycles modes in the CLI.

| Mode | Runs without asking | Use |
|---|---|---|
| **Manual** (`default`) | reads only | review every action |
| **Accept edits** | file edits + common file commands | iterating on code you review |
| **Plan** | reads/exploration; edits blocked until you approve a plan | think before changing |
| **Auto** | everything, with a classifier reviewing actions | long tasks, fewer prompts |
| `dontAsk` | only pre-approved tools | locked-down CI |
| `bypassPermissions` | everything | isolated containers/VMs only |

⚠️ Never bypass permissions on your real machine.

### AI-56. What's the daily workflow?

**Explore → Plan → Code → Commit**

1. **Explore:** read files/docs, no code yet.
2. **Plan:** Claude proposes; you review (Plan mode).
3. **Code:** implement and **verify** (run tests).
4. **Commit:** commit, PR, docs.

🎯 Review with a **fresh-context reviewer** (new session or subagent that didn't write the code).

### AI-57. Context commands?

| Command | Purpose |
|---|---|
| `/compact` | summarise the chat to free space |
| `/clear` | start fresh |
| `/context` | see what's using the context |
| `/init` | create a starter `CLAUDE.md` |

**Real-life:** `/compact` = writing meeting minutes and throwing away the full transcript.

### AI-58. How do you customise Claude Code?

| Feature | Meaning |
|---|---|
| **CLAUDE.md** | project memory: commands, rules, structure; read every session |
| **Subagents** | helpers with their **own context** (keeps main context clean) |
| **Skills** | reusable instructions for repeated tasks |
| **MCP servers** | connect DBs, issue trackers, APIs |
| **Hooks** | scripts that run automatically (format on save, block commands, notify) |
| **Slash commands** | saved prompts you trigger by name |

**Real-life:** CLAUDE.md = the onboarding doc you give every new team member.

### AI-59. 🆕 Best practices for AI coding assistants in a team?

- Keep `CLAUDE.md` short and accurate (build/test commands, conventions).
- Small, reviewable changes; always run tests.
- Never paste secrets; respect permissions.
- Human code review stays mandatory.
- Use hooks/CI for lint, format and tests.

### AI-60. What is Computer Use?

Claude operates a computer **like a human**: screenshots, mouse, keyboard. It gets a **screenshot after every action** to check the result.

**Real-life:** a remote assistant controlling your screen via screen-share.

⚠️ Slower and riskier than APIs; use a sandboxed VM and confirm sensitive actions. Tool versions change between models.

---

## Part I — Agents & Workflows

### AI-61. Workflow vs agent?

| | Workflow | Agent |
|---|---|---|
| Steps | **fixed**, by you | Claude **decides** |
| Use when | steps are known | task is open-ended |
| Strength | reliable, testable, cheaper | flexible |
| Weakness | rigid | less predictable, costs more |

**Real-life:** workflow = a recipe. Agent = a chef told "make dinner from what's in the fridge".

🎯 "Start with the simplest thing that works; use agents only when you need the flexibility."

### AI-62. What are the workflow patterns?

| Pattern | Meaning | Use when |
|---|---|---|
| **Chaining** | steps one after another | steps depend on each other; long prompts with many rules |
| **Routing** | classify first, send to one specialist prompt | many request types |
| **Parallelization** | run independent parts at once, combine | independent checks, voting |
| **Orchestrator-workers** | one model splits the task, workers do parts | unknown sub-tasks |
| **Evaluator-optimizer** | make → check → fix → repeat | output must pass a quality bar |

**Real-life:** chaining = an assembly line; routing = a hospital reception sending you to the right department; parallelization = several chefs cooking dishes at once; evaluator-optimizer = a writer and an editor.

💡 Long prompt ignored rules? **Chain:** step 1 writes, step 2 only fixes rule violations.

### AI-63. What makes a good agent?

- **Goal + tools**; Claude finds the steps.
- **Combines simple, general tools** (Claude Code uses `bash`, `read`, `write`, `edit`, `glob`, `grep`).
- **Asks for missing info** ("When did you buy it?" for a warranty question).
- Clear stopping conditions and budgets.

### AI-64. What is environment inspection?

The agent must **see the result** of each action, or it works blind.

- Computer use → screenshot after each click.
- Files → **read before write**.
- Code → run tests after editing.

🔑 **Golden question:** "How will Claude know if this action worked?"

### AI-65. 🆕 What are subagents / multi-agent systems?

A lead agent hands sub-tasks to **subagents** with their own context, then combines results.

✅ Parallel work, clean context, specialisation. ❌ More tokens, coordination overhead.

**Real-life:** a project lead delegating research to three team members and merging their reports.

### AI-66. Quiz answers (agents)

| Question | Answer |
|---|---|
| Known steps / reliability matters | workflow |
| Car photo → repair estimate | workflow with fixed steps |
| Compare many materials | parallelization |
| Claude ignores rules in a long prompt | chaining |
| Educational vs entertainment | routing |
| Write → check → improve | evaluator-optimizer |
| Most flexible agent tools | abstract tools (`read_file`, `write_file`, `run_command`) |
| Why environment inspection | the agent sees the results of its actions |

---

## Part J — 🆕 AI Engineering Interview Questions

### AI-67. 🆕 What are hallucinations and how do you reduce them?

The model states something **confident but false**.

**Real-life:** a student bluffing an exam answer instead of saying "I don't know".

**Reduce:**

- Ground with **RAG** + **citations**.
- Allow "I don't know" in the prompt.
- Ask for quotes from the source before answering.
- Tools for facts (search, DB) instead of memory.
- Evals that check faithfulness; human review for high stakes.

### AI-68. 🆕 What are tokens and the context window?

- **Token:** a chunk of text (~¾ of an English word on average).
- **Context window:** the max tokens (input + output) the model can see in one request.

**Real-life:** the context window is a desk; everything must fit on it at once.

⚠️ Long contexts cost more and can bury key details; put important instructions clearly, use RAG instead of dumping everything.
🎯 Newer models tokenise differently (e.g. Sonnet 5.5 produces ~30% more tokens for the same text than Sonnet 4.6), so **re-check cost estimates when upgrading**.

### AI-69. 🆕 Prompting vs RAG vs fine-tuning?

| Approach | Changes | Use when |
|---|---|---|
| **Prompting** | instructions/examples | first choice; fast, cheap |
| **RAG** | data given at request time | private / changing knowledge, citations |
| **Fine-tuning** | model weights | consistent style/format at scale, narrow tasks |

**Real-life:** prompting = giving instructions; RAG = handing over the manual; fine-tuning = sending the employee to a training course.

🎯 Try prompting → RAG → fine-tuning, in that order.

### AI-70. 🆕 Embeddings: what else are they used for?

Semantic search, recommendations ("similar products"), clustering, deduplication, classification, anomaly detection.

### AI-71. 🆕 What are guardrails?

Checks **around** the model:

- **Input:** block abusive or off-topic requests, PII redaction, prompt-injection filters.
- **Output:** schema validation, policy/toxicity checks, fact checks.
- **Action:** permission rules and human approval for risky tool calls.

**Real-life:** safety rails on a mountain road.

### AI-72. 🆕 How do you handle rate limits and errors?

- Respect `429` and `529` (overloaded) with **exponential backoff + jitter** (SDKs retry automatically).
- Queue requests; cap concurrency.
- Timeouts and fallbacks (smaller model, cached answer, friendly message).
- Use the **Batch API** for non-urgent bulk jobs (cheaper).

**Real-life:** a busy restaurant: wait a bit longer each time before asking again.

### AI-73. 🆕 How do you control cost?

- Right model for the job (route easy tasks to **Haiku**).
- **Prompt caching** for repeated prefixes.
- Trim history; summarise old turns.
- Limit `max_tokens`; concise output instructions.
- **Batch API** for offline jobs.
- Monitor tokens per feature/user.

### AI-74. 🆕 How do you defend against prompt injection?

- Treat all retrieved content, emails, web pages and tool outputs as **untrusted data**.
- Wrap data in tags and tell the model it's data, not instructions.
- **Least privilege** tools; no secrets in prompts.
- Human confirmation for sensitive actions (payments, deleting, sending emails).
- Output filtering; log and monitor.

**Real-life:** a bank teller follows the bank's rules, not instructions written on a customer's deposit slip.

### AI-75. 🆕 How do you design an LLM feature in a web app (architecture)?

```text
React/Next.js UI → your API (auth, rate limit, guardrails)
                 → prompt builder (system + RAG context + history)
                 → Claude API (streaming)
                 → validation → UI
                 → logs, evals, cost tracking
```

🎯 Mention: server-side keys, streaming, retries, caching, evals, monitoring, fallbacks, privacy.

### AI-76. 🆕 How do you stream AI responses to a React UI?

```ts
// app/api/chat/route.ts (Next.js)
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const stream = client.messages.stream({ model: "claude-sonnet-5-5", max_tokens: 1024, messages });
  const encoder = new TextEncoder();
  return new Response(new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  }));
}
```

```tsx
// client
const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ messages }) });
const reader = res.body!.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  setAnswer((a) => a + decoder.decode(value));
}
```

**Real-life:** a live commentary instead of a match report afterwards.

🎯 UX: show a stop button (`AbortController`), render Markdown safely, auto-scroll, handle errors mid-stream.

### AI-77. 🆕 What is model routing?

A cheap model (or classifier) decides which model/prompt handles each request.

**Real-life:** a hospital triage nurse sending simple cases to a GP and complex ones to a specialist.

### AI-78. 🆕 What should you log and monitor?

Latency (time to first token, total), token usage and cost, error/refusal rates, `stop_reason` distribution, tool-call failures, user feedback (👍/👎), eval scores over time.

⚠️ Don't log sensitive personal data; mask PII.

### AI-79. 🆕 What is human-in-the-loop?

A person approves or edits AI output at key points (before sending emails, payments, publishing).

**Real-life:** an autopilot that still needs the pilot for take-off and landing.

### AI-80. 🆕 How do you handle AI bias and responsible AI?

- Test with diverse inputs; measure outcomes across groups.
- Clear disclosure that AI is involved.
- Avoid fully automated high-stakes decisions (hiring, credit) without review.
- Data privacy and retention policies.

### AI-81. 🆕 What is the Batch API?

Send many requests **asynchronously**; results come back later (within hours) at a **lower price**.

**Real-life:** posting parcels by economy mail instead of express.

**Use:** evals, bulk classification, embeddings jobs, nightly reports.

### AI-82. 🆕 How do you keep up with fast-changing AI APIs?

- Read model **migration guides** and release notes before upgrading.
- Pin model versions; re-run evals on upgrade.
- Watch for breaking changes (e.g. temperature, prefill, thinking budgets now 400 on Sonnet 5.5).

---

## Part K — System Design

### AI-83. What is system design, and how do you approach it?

Planning the parts of a system and how they work together.

**Steps:** understand requirements → set scope (functional + non-functional) → estimate scale → high-level architecture → deep-dive components → trade-offs → bottlenecks, monitoring.

**Real-life:** designing a restaurant: menu, kitchen, seating, staff, peak-hour plan.

### AI-84. Performance vs scalability? Latency vs throughput?

| Pair | Meaning |
|---|---|
| Performance vs scalability | fast for one user vs still fast with many users |
| Latency vs throughput | time for one response vs requests handled per second |

**Real-life:** latency = how long one car takes on the road; throughput = how many cars pass per hour.

### AI-85. Availability vs consistency (CAP)?

- **Consistency:** everyone sees the same data.
- **Availability:** the system always responds.
- **CAP:** during a network **partition**, choose consistency **or** availability.
- Consistency levels: **strong**, **weak**, **eventual**.

**Real-life:** bank balance → consistency. Social media like count → availability (eventual).

### AI-86. 🆕 Horizontal vs vertical scaling?

| Vertical | Horizontal |
|---|---|
| bigger machine | more machines |
| simple, has a ceiling | scales further, needs load balancing + stateless apps |

**Real-life:** a bigger bus vs more buses.

### AI-87. 🆕 Caching layers?

Browser → CDN → reverse proxy → app (Redis) → database.

⚠️ Hardest part: **invalidation**. Patterns: cache-aside, TTLs, write-through.

### AI-88. Which API pattern when?

| Need | Pattern |
|---|---|
| simple request/response | REST |
| exact fields, many clients | GraphQL |
| fast typed service-to-service | gRPC / tRPC |
| real-time two-way | WebSockets |
| server pushes one way (incl. LLM streaming) | SSE |
| server notifies your server | webhooks |
| simple periodic check | polling |

### AI-89. Frontend performance?

- Code splitting, tree shaking, compression (Brotli).
- Lazy load, prefetch/preload, virtual lists.
- **Web Vitals:** LCP (load), INP (responsiveness), CLS (stability).
- Images: WebP/AVIF, `srcset`/`<picture>`, `loading="lazy"`, CDN.

```html
<picture>
  <source srcset="image-1600.webp" type="image/webp">
  <img src="image-800.webp" alt="Description" loading="lazy" width="800" height="450">
</picture>
```

⚠️ Always set `width` and `height` to avoid layout shift (CLS).

### AI-90. 🆕 Frontend system design framework (e.g. "Design a chat app / news feed")?

1. **Requirements:** features, devices, scale, offline, a11y.
2. **Architecture:** components, routing, rendering (CSR/SSR).
3. **Data model & state:** server vs client state, caching.
4. **API:** REST/GraphQL, pagination, real-time (WebSocket/SSE).
5. **Performance:** virtualisation, code splitting, images.
6. **Accessibility & i18n.**
7. **Security:** XSS, auth, CSP.
8. **Testing & monitoring.**

**Real-life:** a building plan: rooms (components), plumbing (data flow), fire exits (error handling).

### AI-91. Testing and monitoring?

- Unit → integration → E2E; load tests (k6, JMeter).
- Logs, metrics, tracing (OpenTelemetry); alerts on SLOs.

### AI-92. Accessibility?

Semantic HTML, ARIA only when needed, keyboard navigation, focus management, colour contrast. Check with axe and Lighthouse.

📌 **To fix in your notes:** `Frontend System Design Yatra1.png` is empty (0 bytes); re-upload the real image.

**Resources:** [System Design Roadmap](https://roadmap.sh/system-design) · [Your Excalidraw board](https://app.excalidraw.com/l/8lwXEYCWFUz/5BWKjqfiBK6)

---

## Part L — Cheat Sheet

### AI-93. One-line answers

| Question | Answer |
|---|---|
| Automation vs autonomous? | fixed steps vs AI decides |
| LLM steps? | tokenize → embed → contextualize → generate → decode |
| When does Claude stop? | max tokens, end turn, stop sequence, tool use, refusal |
| Good chat prompt? | Task + Context + Example + Format |
| Why a server? | keep the API key secret |
| 4 things in a request? | key, model, messages, max_tokens |
| What comes back? | content blocks + usage + stop reason |
| Claude forgets? | send full history |
| Set role/rules? | system prompt |
| Creative vs factual? | temp 1.0 / 0.0 (course); newest models: say it in the prompt (temperature → 400) |
| Clean JSON? | structured outputs (`output_config.format`); prefill → 400 on newest models |
| Step-by-step reasoning? | adaptive thinking + `effort` (`budget_tokens` legacy) |
| Improve vs measure a prompt? | engineering vs evaluation |
| Separate data in a prompt? | XML tags |
| Tool loop? | while `stop_reason == "tool_use"` |
| Exact IDs vs meaning? | BM25 vs embeddings → hybrid |
| Verify facts from docs? | citations |
| Same big doc many times? | prompt caching (5 min / 1 h, max 4 breakpoints) |
| Tools / resources / prompts? | model / app / user controlled |
| Test MCP server? | `mcp dev mcp_server.py` (Inspector) |
| Claude Code memory? | `CLAUDE.md` |
| Read-only planning? | Plan mode (`Shift+Tab`) |
| Free up context? | `/compact` (or `/clear`) |
| Auto-run scripts? | hooks |
| Known steps vs open task? | workflow vs agent |
| Same time / step after step? | parallelization / chaining |
| Sort first / make → check → fix? | routing / evaluator-optimizer |
| Agent must see results? | environment inspection |
| Prompt vs RAG vs fine-tune? | instructions / fresh data / retrain weights |
| Reduce hallucinations? | RAG + citations + "I don't know" + evals |
| Prompt injection? | treat data as untrusted, least privilege, human approval |
| Cut cost? | right model, caching, Batch API, trim history |
