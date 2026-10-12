# 📘 My Study Notes

Short, simple notes for quick revision. Each topic has everything in one place: **key points → code → quiz answers**.

## 📚 Contents
**Part A – Claude API Course** ([Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api))
1. [API Basics](#1-api-basics)
2. [Prompt Evaluation](#2-prompt-evaluation)
3. [Prompt Engineering](#3-prompt-engineering)
4. [Tool Use](#4-tool-use)
5. [RAG (Search in Documents)](#5-rag-search-in-documents)
6. [Claude Features](#6-claude-features)
7. [MCP (Model Context Protocol)](#7-mcp-model-context-protocol)
8. [Claude Code & Computer Use](#8-claude-code--computer-use)
9. [Agents & Workflows](#9-agents--workflows)

**Part B – System Design**
10. [System Design Basics](#10-system-design-basics)

**[⚡ One-Page Cheat Sheet](#-one-page-cheat-sheet)**

---

# Part A – Claude API Course

## 1. API Basics

> 🧠 **Remember:** "**K**ind **M**onkeys **M**ake **M**agic" = **K**ey, **M**odel, **M**essages, **M**ax tokens

| Topic | Simple meaning |
|---|---|
| **Flow** | App → **Your Server** → Claude → Server → App. Never call Claude from the browser. |
| **API Key** | Your secret password. Keep it **on the server** in a `.env` file. |
| **Request** | Needs 4 things: **key, model, messages, max_tokens**. |
| **Multi-turn** | Claude has **no memory**. Send the **full chat history** every time. |
| **System prompt** | Sets Claude's **role and rules** (e.g. "You are a math tutor"). |
| **Temperature** | **0.0** = same, safe answers (facts, code). **1.0** = creative (stories). |
| **Streaming** | Shows the reply **word by word** so users don't wait. |
| **Structured data** | Get clean JSON using a **prefill** (start) + **stop sequence** (end). |

```python
import anthropic
client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1000,
    system="You are a math tutor. Give hints, not answers.",
    messages=[{"role": "user", "content": "Hi"}]
)
print(response.content[0].text)
```

**Clean JSON trick:**
```python
messages=[
    {"role": "user", "content": "Give user data as JSON"},
    {"role": "assistant", "content": "```json"}   # prefill = start
],
stop_sequences=["```"]                             # stop = end
```

**✅ Quiz answers**
- 4 things in every request → **API key, model, messages, max tokens**
- Where to keep the API key → **On your server**, never in JavaScript, GitHub or the browser
- Claude forgot the earlier question → **Send the whole conversation history**
- Tutor that gives hints → **System prompt**
- Very creative stories → **Temperature 1.0**

---

## 2. Prompt Evaluation

> 🧠 **Remember:** "**D**ogs **T**ake **R**ed **G**ifts **R**epeatedly" = **D**raft → **T**est data → **R**un → **G**rade → **R**epeat

**Prompt engineering = improve** a prompt. **Prompt evaluation = measure** it.
⚠️ Testing only once is risky. Real users send unexpected inputs.

**Workflow**
```
1. Draft a prompt
2. Create a test dataset    ← use a fast, cheap model like Haiku; add edge cases
3. Run each input through Claude
4. Grade the responses      ← comes right after running
5. Improve → repeat → compare scores
```

**Grader types**
| Grader | Who checks | Good for |
|---|---|---|
| **Code** | A program | Valid JSON, length, keywords |
| **Model** | AI (Claude) | Quality, clarity, tone |
| **Human** | A person | Most accurate, but slow |

💡 Model grader tip: ask for **strengths, weaknesses and reasoning first, score last**. Otherwise every answer gets a dull 6/10.

```python
results = []
for test in dataset:
    output = run_prompt(test)
    results.append(grade(test, output))
print("Average:", sum(results) / len(results))
```

**✅ Quiz answers**
- Measure how well a prompt works → **Prompt evaluation with automated testing**
- Step after getting responses → **Send them to a grader**
- Model grader → **Another AI model that scores quality**
- After changing a prompt → **Run the eval again to check it improved**

---

## 3. Prompt Engineering

> 🧠 **Remember:** "**C**ats **S**leep **X**tra **E**arly" = **C**lear, **S**pecific, **X**ML, **E**xamples

| Technique | Rule | Example |
|---|---|---|
| **Clear & Direct** | Start with an **action verb**, not a question | ❌ "What workout should I do?" ✅ "Create a workout plan" |
| **Specific** | Add length, audience, format, steps | "30-minute plan for beginners, no equipment" |
| **XML Tags** | Separate **data** from **instructions** | `<email>...</email>` |
| **Examples** | Show input → output pairs (one-shot / multi-shot) | Best fix for tricky things like sarcasm |

```xml
Summarize the email below in 2 sentences.
<email>
Hi team, the meeting moved to Friday...
</email>
```

⚠️ Prompt engineering does **not** train the model. XML tags do **not** make Claude faster.

**✅ Quiz answers**
- Clearest prompt → **"Write a product description for running shoes."**
- Reviews + sales data in one prompt → **XML tags `<reviews>` and `<sales_data>`**

---

## 4. Tool Use

> 🧠 **Remember:** "**I**n **T**he **D**ark **F**orest" = **I**nitial request → **T**ool request → **D**ata retrieval → **F**inal response

**Why tools?** Claude only knows its training data. Tools give it **real-time info** and access to **outside systems**.

**How it works**
```
Claude asks for a tool (tool_use) → Your code runs it → You send back tool_result → Claude answers
```

| Part | Simple meaning |
|---|---|
| **Tool function** | A normal Python function that does the real work |
| **Tool schema** | JSON telling Claude the tool's **name, purpose, inputs** |
| **Message blocks** | Reply can have **text + tool_use** blocks together (multi-block) |
| **tool_result** | Send the result back with the **same id** |
| **Loop** | Keep going while `stop_reason == "tool_use"`. `"end_turn"` = done |
| **Multiple tools** | Pass many schemas; Claude **picks the right one** |
| **Batch tool** | Many tool calls in **one request** = fewer round trips |
| **Fine-grained** | Streams tool inputs piece by piece (JSON may be incomplete) |
| **Text editor tool** | Built-in schema, but **you write** the file code |
| **Web search tool** | Built-in, **Anthropic runs it** for you |

```python
def get_weather(city):                       # tool function
    return f"18°C, sunny in {city}"

tool_schema = {                              # tool schema
  "name": "get_weather",
  "description": "Get current weather for a city",
  "input_schema": {
    "type": "object",
    "properties": {"city": {"type": "string"}},
    "required": ["city"]
  }
}

while response.stop_reason == "tool_use":    # the loop
    result = run_tool(response)
    response = send_result_back(result)
```

**✅ Quiz answers**
- Purpose of tools → **Real-time info and outside systems**
- Tool function → **A plain function run when Claude needs it**
- Text + tool_use in one reply → **Multi-block message**
- Batch tool → **Runs many tool calls together**

---

## 5. RAG (Search in Documents)

> 🧠 **Remember:** "**C**ut, **C**ode, **S**tore, **F**ind, **F**eed" = Chunk → Embed → Store → Find → Feed to Claude

**RAG = open-book exam.** Find only the useful parts of a big document and give them to Claude.

| Term | Simple meaning |
|---|---|
| **Chunking** | Cut documents into small pieces (by size, by headings, or by sentences). Use **overlap** so meaning isn't cut in half. |
| **Embedding** | Turn text into numbers that capture **meaning** ("dog" ≈ "puppy"). Compare with **cosine similarity**. |
| **Vector DB** | Stores the embeddings |
| **BM25** | **Keyword** search. Finds **exact words** like IDs and codes. Rare words count more. |
| **Hybrid search** | Embeddings + BM25 together, merged = **meaning + exact words** |

```
SETUP:   Document → Chunk → Embed → Store
ASK:     Question → Embed → Find closest chunks
ANSWER:  Question + chunks → Claude → Answer
```

---

## 6. Claude Features

> 🧠 **Remember:** "**T**iny **I**guanas **P**lay **C**hess, **C**limb **C**liffs" = Thinking, Images, PDFs, Citations, Caching, Code execution

| Feature | What it does | Key code |
|---|---|---|
| **Extended thinking** | Thinks step by step first. Returns a thinking block + answer. | `thinking={"type": "enabled", "budget_tokens": 2000}` |
| **Images** | Send an image as base64 | `"type": "image"` |
| **PDFs** | Reads text, tables, charts, images | `"type": "document"` + `"application/pdf"` |
| **Citations** | Links the answer back to the source so users can **verify** | `"citations": {"enabled": True}` |
| **Prompt caching** | Saves a big repeated prompt → **faster and cheaper** | `"cache_control": {"type": "ephemeral"}` |
| **Files API** | Upload once, reuse with `file_id` | `client.beta.files.upload(...)` |
| **Code execution** | Claude runs Python in a safe container, **no internet** | — |

**Caching rules**
| Rule | Value |
|---|---|
| Minimum size | ~1024 tokens (varies by model). Smaller = just not cached, no error |
| Lifetime | 5 minutes (refreshes on each use) |
| Max breakpoints | 4 |
| What's cached | Everything **before** the breakpoint (order: tools → system → messages) |
| Breaks if | Anything before the breakpoint changes |

**✅ Quiz answers**
- Users must verify facts from documents → **Citations**
- Same long document, many questions → **Prompt caching with cache breakpoints**

---

## 7. MCP (Model Context Protocol)

**MCP** = a standard way to connect Claude to outside tools and data **without writing all the integration code yourself**.

**Problem without MCP:** for GitHub, you'd write and maintain every tool yourself.
**With MCP:** someone builds a GitHub MCP server once, and any app can use it.

```
Your App → MCP Client → MCP Server → (tools, resources, prompts)
```

| Part | Role |
|---|---|
| **MCP Server** | Holds **tools, resources, prompts** |
| **MCP Client** | The **bridge** your app uses to reach the server. Made of **your Client class + the SDK's Client Session** |
| **Transport agnostic** | Works over **stdio** (local) or **HTTP** (remote) |

**The 3 primitives – who controls them?**
| Primitive | Controlled by | Example |
|---|---|---|
| **Tools** | **Model** (Claude decides) | Claude calls `read_doc_contents` |
| **Resources** | **App** | App loads a document's data |
| **Prompts** | **User** | User clicks "Summarize document" |

**Resources**
- **Direct:** fixed URI → `docs://documents`
- **Templated:** URI with a parameter → `docs://documents/{doc_id}`

**Messages:** `ListToolsRequest` = what tools exist? `CallToolRequest` = run a tool.

```python
@mcp.tool(name="read_doc_contents", description="Read a document")
def read_document(doc_id: str = Field(description="Id of the document")):
    return docs[doc_id]                  # SDK makes the JSON schema for you

@mcp.resource("docs://documents/{doc_id}")
def fetch_doc(doc_id: str) -> str:
    return docs[doc_id]
```

**Test your server:** `mcp dev mcp_server.py` → opens the **MCP Inspector** in the browser.

**✅ Quiz answers**
- What is MCP → **Communication layer giving Claude tools and context without integration code**
- Server vs client → **Server holds tools/prompts/resources; client is the bridge**
- Transport agnostic → **Works over HTTP or stdio**
- Problem without MCP → **You write and maintain all tool code yourself**
- Easiest way to define a tool → **`@mcp.tool()` decorator**
- Test before building an app → **MCP Inspector (`mcp dev mcp_server.py`)**
- Two parts of a client → **MCP Client class + Client Session**
- Find available tools → **`ListToolsRequest`**
- Fetch a doc by ID → **Templated resource**
- User clicks a button to start a workflow → **Prompt**

---

## 8. Claude Code & Computer Use

| Tool | Simple meaning |
|---|---|
| **Claude Code** | AI coding helper in the **terminal**. Reads, writes, edits code and runs commands. Add MCP servers for more abilities. |
| **Computer Use** | Claude uses a computer **like a human**: screenshots, mouse, keyboard. |

**✅ Quiz answer**
- Computer Use → **Claude interacts with a desktop like a human would**

---

## 9. Agents & Workflows

**Used for tasks that Claude can't finish in one request.**

| | **Workflow** | **Agent** |
|---|---|---|
| Steps | **Fixed**, decided by you | Claude **decides** |
| Use when | You **know** the steps | Task is **unknown** |
| Strength | Reliable, testable | Flexible |
| Weakness | Less flexible | Less reliable, costs more |

### Workflow patterns

| Pattern | Simple meaning | Example | Use when |
|---|---|---|---|
| **Parallelization** | Split into sub-tasks, run **at the same time**, combine | Check a part for metal, polymer, ceramic, composite at once → pick the best | Independent checks, many options |
| **Chaining** | Steps **one after another**; each output feeds the next | Topic → research → script → video → post | Many rules, Claude ignores some, steps depend on each other |
| **Routing** | **Sort first**, then send to **one** special prompt | "Python functions" → Educational prompt | Many request types with clear categories |
| **Evaluator-Optimizer** | **Make → check → fix → repeat** until good | Image → 3D model → compare with photo → fix | Output must meet a quality bar |

💡 **Long prompt problem (Chaining fix):** Step 1, write the article. Step 2, send it back and ask Claude **only** to fix broken rules (remove emojis, remove AI mentions, fix casual tone).

### Agents
- **Give a goal + tools**, and Claude finds the steps.
- **Combines simple tools:** with get time + add days + set reminder, it can answer "What day is it in 11 days?"
- **Asks for missing info:** "When does my 90-day warranty end?" → asks when you bought it.
- **Keep tools general:** Claude Code uses `bash`, `read`, `write`, `edit`, `glob`, `grep`, not "refactor_code".

### Environment inspection
Claude must **see the result** of each action, or it works blind.
- Computer Use → screenshot after each click
- Files → **read before write**
- Video → check captions (whisper.cpp) and screenshots (FFmpeg)

🔑 **Golden question:** "How will Claude know if this action worked?"

**✅ Quiz answers**
- Know the exact steps → **Workflow**
- Reliability matters most → **Workflow**
- Car damage photo → repair estimate (same steps) → **Workflow with fixed steps**
- Compare many materials → **Parallelization**
- Claude ignores rules in a long prompt → **Chaining**
- Educational vs entertainment content → **Routing**
- Write → check → improve → **Evaluator-Optimizer**
- Most flexible agent tools → **Abstract tools (`read_file`, `write_file`, `run_command`)**
- Why environment inspection → **Agent sees the results of its actions**

---

# Part B – System Design

## 10. System Design Basics

**System design** = planning the parts of a system and how they work together.

**Steps:** Understand the problem → Set the scope → Study existing systems → Draw the architecture → Test, improve, document

| Concept | Simple meaning |
|---|---|
| **Performance vs Scalability** | Performance = fast for one user. Scalability = still works with many users. |
| **Latency vs Throughput** | Latency = time for one response. Throughput = how many requests at once. |
| **Availability vs Consistency** | Availability = system stays up. Consistency = data is the same everywhere (strong / weak / eventual). |

**API patterns** – pick by need:
| Need | Use |
|---|---|
| Simple request/response | REST |
| Fetch exactly the fields you need | GraphQL |
| Fast, typed service-to-service | gRPC / tRPC |
| Real-time two-way | WebSockets |
| Server notifies you | Webhooks |
| Simple periodic check | Polling |

**Frontend performance**
- Code splitting, tree shaking, compression
- Lazy load on scroll or click, prefetch/preload
- Virtual lists for long lists
- **Web Vitals:** LCP (load speed), INP (response to clicks), CLS (layout jumps)

**Images:** use WebP/AVIF, `srcset` / `<picture>`, `loading="lazy"`, a CDN.
```html
<picture>
  <source srcset="image-1600.webp" type="image/webp">
  <img src="image-800.webp" alt="Description" loading="lazy" width="800">
</picture>
```

**Testing & monitoring:** Unit → Integration → E2E tests. Load tests with k6 or JMeter. Logs, metrics, tracing.

**Accessibility:** semantic HTML, ARIA, keyboard navigation, good color contrast. Check with axe or Lighthouse.

📌 **To fix:** `Frontend System Design Yatra1.png` is empty (0 bytes). Re-upload the real image.

**Resources:** [System Design Roadmap](https://roadmap.sh/system-design) · [Excalidraw board](https://app.excalidraw.com/l/8lwXEYCWFUz/5BWKjqfiBK6)

---

# ⚡ One-Page Cheat Sheet

| Question | Answer |
|---|---|
| 4 things in a request? | Key, model, messages, max_tokens |
| Claude forgets? | Send full history |
| Set role/rules? | System prompt |
| Creative? / Factual? | Temp 1.0 / Temp 0.0 |
| Clean JSON? | Prefill + stop sequence |
| Improve vs measure a prompt? | Engineering vs Evaluation |
| After running eval? | Grade the responses |
| Separate data in a prompt? | XML tags |
| Tricky patterns like sarcasm? | Give examples |
| Tool loop check? | `stop_reason == "tool_use"` |
| Fewer tool round trips? | Batch tool |
| Exact IDs/codes in search? | BM25 |
| Meaning-based search? | Embeddings |
| Verify facts from docs? | Citations |
| Same big doc many times? | Prompt caching |
| Who controls Tools / Resources / Prompts? | Model / App / User |
| Test MCP server? | `mcp dev mcp_server.py` |
| Doc by ID? | Templated resource |
| Known steps? | Workflow |
| Unknown task? | Agent |
| Same time, independent checks? | Parallelization |
| Step after step? | Chaining |
| Sort first, then handle? | Routing |
| Make → check → fix? | Evaluator-Optimizer |
| Best agent tools? | General/abstract tools |
| Agent must see results? | Environment inspection |
