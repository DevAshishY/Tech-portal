# ALL System Design Notes — Merged

Generated: 2026-09-05

Sources
- `NOTES/SYSTEM-DESIGN/system-design.md`
- Image: `NOTES/SYSTEM-DESIGN/Frontend System Design Yatra1.png`

---

## 1 — Merged System Design Notes (condensed)

System design is the process of defining system elements and their interactions to meet requirements. Typical steps:
- Understand the problem and constraints
- Define scope and boundaries
- Research existing systems and tradeoffs
- Create a high-level architecture and component interactions
- Iterate, test, and document

Key concepts
- Performance vs Scalability: performance = single-user speed; scalability = behaviour under load.
- Latency vs Throughput: latency = response time; throughput = concurrent request capacity.
- Availability & Consistency: availability keeps system working; consistency keeps data synchronized. Patterns: strong, weak, eventual consistency.

Networking & API patterns
- REST, GraphQL, gRPC, tRPC, WebSockets, Polling, Webhooks — choose by use-case (real-time vs request/response, typed contracts, bandwidth).

Performance & Optimization
- Code splitting, compression, import-on-interaction/visibility, prefetch/preload, tree shaking, virtual lists.
- Web Vitals: LCP, INP, CLS — optimize images, resource loading, and layout stability.

Testing & Observability
- Unit / Integration / E2E testing strategy.
- Load & stress testing (k6, JMeter).
- Logging (WinstonJS), metrics, tracing.

Image & Build Optimization
- Use `picture` + `srcset` + WebP/AVIF, lazy loading, responsive sizes, compression, and CDN delivery.

Accessibility
- Semantic HTML, ARIA, keyboard navigation, color contrast, use axe/Lighthouse.

Resources
- Roadmap: https://roadmap.sh/system-design
- Frontend resources & Excalidraw: https://app.excalidraw.com/l/8lwXEYCWFUz/5BWKjqfiBK6

---

## 2 — Image Review

- File: `NOTES/SYSTEM-DESIGN/Frontend System Design Yatra1.png`
- Inspection result: file appears empty (0 bytes) in the workspace. This indicates the image is missing or a broken/placeholder file in the repo.

Recommendations
- Replace the file with a real exported image (prefer WebP/AVIF). If using PNG/JPEG, re-export with compression.
- Add a concise `alt` text and descriptive caption for accessibility.
- Use responsive delivery: generate several sizes and serve via `srcset` or `picture`.
- Use `loading="lazy"` and a low-quality placeholder (LQIP) or blurred placeholder for faster LCP.
- Host large images on a CDN and set proper cache headers (long max-age with content hashing).

Quick commands (local) to generate modern formats and sizes using `sharp` (Node):

```bash
# install sharp if needed
npm install --save-dev sharp

# example: generate webp and resized variants
node -e "require('sharp')('Frontend\x20System\x20Design\x20Yatra1.png').resize(1600).webp({quality:80}).toFile('yatra-1600.webp')"
node -e "require('sharp')('Frontend\x20System\x20Design\x20Yatra1.png').resize(800).webp({quality:80}).toFile('yatra-800.webp')"
```

HTML example to serve responsively

```html
<picture>
  <source srcset="yatra-1600.webp" type="image/webp">
  <img src="yatra-800.webp" alt="Frontend System Design overview diagram" loading="lazy" width="800" />
</picture>
```

---

## 3 — Next steps (I can do these)
- Replace the empty PNG with the original image (upload) and I will generate WebP/AVIF variants and add `srcset` examples.
- Expand the merged notes into a checklist-based HLD template (components, data flow, scaling plan). Want me to create that?


# Claude API – Part 1: Accessing Claude with the API

Short notes for memorization.

> **Memory trick:** "**K**ind **M**onkeys **M**ake **M**agic" = **K**ey, **M**odel, **M**essages, **M**ax tokens

---

## 1. Accessing the API
The flow is App → **Your Server** → Claude → Server → App.
Never call Claude directly from the browser or a mobile app.

## 2. API Key
The key is your secret password. Keep it **on your server**, in an environment variable.
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

## 3. Making a Request
Every request needs four things: **key, model, messages, max_tokens**.
```python
import anthropic
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY

response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hi"}]
)
print(response.content[0].text)
```

## 4. Multi-Turn Conversations
Claude has **no memory** between requests, so send the full history every time.
```python
messages = [
    {"role": "user", "content": "What is pizza?"},
    {"role": "assistant", "content": "Pizza is..."},
    {"role": "user", "content": "Popular toppings?"}
]
```

## 5. System Prompts
A system prompt sets Claude's **role and rules** for the whole chat.
```python
system="You are a math tutor. Give hints, not answers."
```

## 6. Temperature
| Value | Result | Use for |
|-------|--------|---------|
| ~0.0 | Predictable | Facts, Q&A |
| ~1.0 | Creative, varied | Stories, brainstorming |

## 7. Response Streaming
Streaming shows text **as it's generated**, so users don't wait on a spinner.
```python
with client.messages.stream(model="claude-sonnet-5-5", max_tokens=1000,
                            messages=messages) as stream:
    for text in stream.text_stream:
        print(text, end="")
```

## 8. Structured Data (Clean JSON)
Use a **prefill** to start the answer and a **stop sequence** to end it.
```python
messages=[
    {"role": "user", "content": "Give user data as JSON"},
    {"role": "assistant", "content": "```json"}   # prefill = start
],
stop_sequences=["```"]                             # stop = end
```

---

## Quick Recap
- **Tokens** are the small text chunks Claude reads and writes.
- **Key** stays on the server only.
- **No memory**, so send the full history.
- **System prompt** sets the role.
- **Low temperature** gives consistency.
- **Streaming** makes the app feel fast.
- **Prefill + stop sequence** gives clean JSON.


# Claude API – Part 2: Prompt Evaluation

Short notes for memorization.

> **Memory trick:** "**D**ogs **T**ake **R**ed **G**ifts **R**epeatedly" = **D**raft, **T**est data, **R**un, **G**rade, **R**epeat

---

## 1. Prompt Evaluation
Prompt evaluation **measures** how well a prompt works by testing it on many inputs and giving it a score.
- Prompt **engineering** is how you *improve* a prompt.
- Prompt **evaluation** is how you *prove* the improvement worked.

⚠️ **Risk of testing once:** real users send unexpected inputs that break the prompt.

## 2. A Typical Eval Workflow
```
1. Draft a prompt
2. Create a test dataset
3. Run each input through Claude
4. Grade the responses   ← comes right after generating
5. Improve the prompt → repeat and compare scores
```

## 3. Generating Test Datasets
- Write the tests by hand, or let Claude generate them.
- Use a **fast, cheap model like Haiku**. It's a simple task and you need many tests.
- Include **edge cases** such as typos, empty input, and odd requests.
```python
prompt = "Generate 10 test questions for an AWS help bot. Return as JSON array."
# run with model="claude-haiku-..."
```

## 4. Running the Eval
Loop through the dataset, then get a response and grade it for each input.
```python
results = []
for test in dataset:
    output = run_prompt(test)
    score  = grade(test, output)
    results.append(score)

print("Average:", sum(results) / len(results))
```

## 5. Model-Based Grading
**Another AI model** scores the outputs. It suits quality, tone, and helpfulness.

✅ Ask for **strengths, weaknesses, and reasoning** *before* the score. Otherwise you get dull middle scores like 6/10 for everything.
```json
{
  "strengths": ["Correct answer"],
  "weaknesses": ["Missing edge case"],
  "reasoning": "Solid but incomplete",
  "score": 7
}
```

## 6. Code-Based Grading
**Code** checks the output's format and rules.
```python
import json
def valid_json(output):
    try:
        json.loads(output)
        return 10
    except:
        return 0
```

---

## Grader Types
| Grader | Who checks | Good for |
|--------|-----------|----------|
| **Code** | Program | JSON valid, length, keywords |
| **Model** | AI (Claude) | Quality, clarity, tone |
| **Human** | Person | Most accurate, but slow |

## Quick Recap
- Test **many** inputs, not one.
- **Generate → Grade → Improve → Repeat**
- Use **Haiku** to make test data.
- Model grader gives **reasons first, score last**.
- Code grader checks **format**.


# Claude API – Part 3: Prompt Engineering Techniques

Short notes for memorization.

> **Memory trick:** "**C**ats **S**leep **X**tra **E**arly" = **C**lear, **S**pecific, **X**ML, **E**xamples

---

## 1. Prompt Engineering
Prompt engineering means **improving a prompt** to get more reliable, higher-quality outputs.
- It does **not** train or change the model. You only change the words you send.
- Engineering is how you **improve** a prompt. Evaluation is how you **measure** it.

## 2. Being Clear and Direct
Start with an **action verb** and give an instruction, not a question.

| ❌ Weak | ✅ Strong |
|--------|----------|
| "What kind of workout should I do?" | "Create a workout plan" |
| "Do you know about exercise?" | "Write a guide to exercise" |

## 3. Being Specific
Add **details** like length, audience, format, and steps.
```
❌ "Create a workout plan"
✅ "Create a 30-minute workout plan for beginners.
    Include warm-up, 5 exercises, and cool-down.
    No equipment needed."
```

## 4. Structure with XML Tags
Tags **add structure and clarity**, especially around large content. They separate your instructions from the data.
```xml
Summarize the email below in 2 sentences.

<email>
Hi team, the meeting moved to Friday...
</email>
```
⚠️ Tags do **not** make Claude faster or reduce tokens.

## 5. Providing Examples (One-shot / Multi-shot)
Give **sample input/output pairs**.
- 1 example is **one-shot**.
- Several examples is **multi-shot** (few-shot).

This is the best fix for tricky patterns like **sarcasm**.
```xml
<example>
Post: "Oh great, my flight got delayed AGAIN. Love this airline!"
Sentiment: Negative
</example>
```
Showing Claude what you want works better than telling it.

---

## Quick Recap
| Technique | One-line rule |
|-----------|---------------|
| **Clear & Direct** | Start with a verb, not a question |
| **Specific** | Add length, audience, format |
| **XML Tags** | Wrap big content, separate data from instructions |
| **Examples** | Show input → output pairs |



# Claude API – Part 4: Tool Use with Claude

Short notes for memorization.

> **Memory trick:** "**I**n **T**he **D**ark **F**orest" = **I**nitial Request → **T**ool Request → **D**ata Retrieval → **F**inal Response

---

## 1. Introducing Tool Use
Claude only knows its **training data**. **Tools** let it get **real-time info** such as weather, databases, and APIs.

## 2. Project Overview
Build a small app where Claude calls **your functions** to answer questions it can't answer alone.

## 3. Tool Functions
A tool function is a **normal Python function** that does the real work.
```python
def get_weather(city):
    return f"18°C, sunny in {city}"
```

## 4. Tool Schemas
A **JSON schema** tells Claude the tool's **name, purpose, and arguments**.
```python
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "input_schema": {
    "type": "object",
    "properties": {"city": {"type": "string"}},
    "required": ["city"]
  }
}
```

## 5. Handling Message Blocks
A tool response is a **multi-block message** containing **text + tool_use** blocks.
```json
"content": [
  {"type": "text", "text": "Let me check."},
  {"type": "tool_use", "id": "toolu_01", "name": "get_weather",
   "input": {"city": "Paris"}}
]
```

## 6. Sending Tool Results
Run the tool, then send a **tool_result** with the **same id**.
```python
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", "content": "18°C, sunny"}
]}
```

## 7. Multi-Turn Conversations with Tools
Keep **all messages** in the history, including Claude's tool_use blocks and your tool_result blocks.

## 8. Implementing Multiple Turns
Check **`stop_reason`** and loop while Claude wants tools.
```python
while response.stop_reason == "tool_use":
    result = run_tool(response)
    response = send_result_back(result)
```
- `"tool_use"` means run the tool.
- `"end_turn"` means the answer is complete.

## 9. Using Multiple Tools
Pass several schemas in `tools=[...]`. Claude **picks the right one**.
**Batch tool:** bundles several calls into **one request**, so there are **fewer round trips**.

## 10. Fine-Grained Tool Calling
Fine-grained tool calling **streams tool inputs piece by piece** as Claude writes them, so large inputs arrive sooner.

⚠️ The JSON may be **incomplete or invalid**, so validate it yourself.

## 11. The Text Edit Tool
This is a **built-in** tool. Claude provides the schema, and **you implement** the file read/write.
- Commands: `view`, `create`, `str_replace`, `insert`

## 12. The Web Search Tool
This is also **built-in**. **Anthropic runs it**, so you don't implement anything.
```python
tools=[{"type": "web_search_20250305", "name": "web_search"}]
```

---

## Quick Recap
| Concept | Rule |
|---------|------|
| **Why tools** | Real-time info beyond training data |
| **Schema** | Tells Claude the args |
| **Response** | Text + tool_use blocks |
| **Result** | tool_result with same `id` |
| **Loop check** | `stop_reason == "tool_use"` |
| **Batch** | Fewer round trips |
| **Built-in tools** | Schema given; text editor needs your code |



# Claude API – Part 5: RAG and Agentic Search

Short notes for memorization.

> **Memory trick:** "**C**ut, **C**ode, **S**tore, **F**ind, **F**eed"
> = **C**hunk → **C**onvert to embeddings → **S**tore → **F**ind similar → **F**eed to Claude

---

## 1. What is RAG?
**R**etrieval **A**ugmented **G**eneration means you find the right info first, then give it to Claude.

📚 It's like an **open-book exam**: Claude doesn't memorize the whole book, it looks up the right page.

Why use it? Documents can be too big for one prompt, and RAG sends **only the useful parts**.

## 2. Text Chunking Strategies
Chunking means **cutting big documents into small pieces**.

| Strategy | How | Example |
|----------|-----|---------|
| **Size-based** | Every N characters, with some **overlap** | 500 chars, 50 overlap |
| **Structure-based** | By headings or sections | Split on `## ` |
| **Semantic** | By sentences or meaning | Split on `.` |

💡 Overlap keeps the meaning from getting **cut in half** at a chunk boundary.

## 3. Text Embeddings
An embedding turns **text into a list of numbers** that captures its **meaning**.
```
"dog"   → [0.21, 0.83, ...]
"puppy" → [0.22, 0.81, ...]   ← close = similar meaning
"car"   → [0.91, 0.05, ...]   ← far = different
```
- Similarity is measured with **cosine similarity**.
- Anthropic recommends **Voyage AI** for embeddings.

## 4. The Full RAG Flow
```
SETUP:   Document → Chunk → Embed → Store in vector DB
ASK:     Question → Embed → Find closest chunks
ANSWER:  Question + chunks → Claude → Answer
```

## 5. Implementing the RAG Flow
```python
chunks  = chunk_text(document)
vectors = [embed(c) for c in chunks]
db.add(chunks, vectors)

q_vec   = embed(question)
top     = db.search(q_vec, k=3)

prompt  = f"<context>{top}</context>\nQuestion: {question}"
answer  = ask_claude(prompt)
```

## 6. BM25 Lexical Search
BM25 is **keyword search**. It matches the **exact words**, not the meaning.
- **Rare words** get more weight (for example "INC-2023-Q4").
- Common words like "the" and "a" barely count.

🔑 Embeddings find **meaning**. BM25 finds **exact terms** such as IDs, codes, and names.

## 7. Multi-Index RAG Pipeline (Hybrid)
Run **both** searches and **merge** the results.
```
Question ─┬→ Semantic search (embeddings) ─┐
          └→ BM25 search (keywords) ───────┴→ Merge (Reciprocal Rank Fusion) → Claude
```
✅ You get the best of both: **meaning + exact words**.

---

## Quick Recap
| Term | Remember as |
|------|-------------|
| **RAG** | Open-book exam |
| **Chunking** | Cut into pieces |
| **Embedding** | Text → numbers (meaning) |
| **Vector DB** | Stores the numbers |
| **BM25** | Exact keyword match |
| **Hybrid** | Meaning + keywords together |


# Claude API – Part 6: Features of Claude

Short notes for memorization.

> **Memory trick:** "**T**iny **I**guanas **P**lay **C**hess, **C**limb **C**liffs"
> = **T**hinking, **I**mages, **P**DFs, **C**itations, **C**aching, **C**ode execution

---

## 1. Extended Thinking 🧠
Claude **thinks step by step before answering**, which helps with hard problems.
You get **2 parts**: a **thinking block** (the reasoning) and a **text block** (the final answer).
```python
thinking={"type": "enabled", "budget_tokens": 2000}
```

## 2. Image Support 🖼️
Send an image as **base64** with `type: "image"`.
```python
{"type": "image",
 "source": {"type": "base64", "media_type": "image/png", "data": img_b64}}
```

## 3. PDF Support 📄
It works the same as an image. **Change 2 things:**
`type` becomes `"document"` and `media_type` becomes `"application/pdf"`.
```python
{"type": "document",
 "source": {"type": "base64", "media_type": "application/pdf", "data": pdf_b64}}
```
Claude reads **text + charts + tables + images** in the PDF.

## 4. Citations 🔗
Citations create a **trail from the answer back to the source**, so users can verify it.
```python
"citations": {"enabled": True}
```

## 5. Prompt Caching ⚡
Prompt caching **saves a big repeated prompt**, so later requests are **faster and cheaper**.
```python
"cache_control": {"type": "ephemeral"}
```

## 6. Rules of Prompt Caching 📏
| Rule | Value |
|------|-------|
| Minimum size | **1024 tokens** (varies by model) |
| Lifetime | **5 minutes** (refreshes on each use) |
| Max breakpoints | **4** |
| Cached part | **Everything before** the breakpoint |
| Order | **tools → system → messages** |
| Breaks if | **Anything before the breakpoint changes** |

💡 If the content is below the minimum, it's just **not cached**, with **no error**.

## 7. Prompt Caching in Action 🔄
```
Request 1 → cache WRITE (normal cost)
Request 2 → cache READ  (much cheaper + faster)
Request 3 → cache READ  ...
```
Check `usage` in the response for `cache_creation_input_tokens` and `cache_read_input_tokens`.

## 8. Code Execution + Files API 🐍
**Files API:** **upload once**, get a `file_id`, and reuse it. There's no need to resend base64.
```python
file = client.beta.files.upload(file=open("data.csv", "rb"))
# use: {"type": "file", "file_id": file.id}
```
**Code Execution:** Claude runs **Python** on Anthropic's servers.
- It runs in an **isolated Docker container**.
- It has **no network access**.

💡 Use them **together**: upload a file, and Claude analyzes it with code.

---

## Quick Recap
| Feature | One-line rule |
|---------|---------------|
| **Thinking** | Reasoning + answer |
| **Image** | `type: "image"` |
| **PDF** | `type: "document"` + `application/pdf` |
| **Citations** | Answer → source trail |
| **Caching** | ≥1024 tokens, 5 min, cheaper |
| **Files API** | Upload once, use `file_id` |
| **Code Exec** | Python, Docker, no internet |




## 1. Accessing Claude with the API
- **API key:** Created in the Anthropic Console and stored in an environment variable, never hard-coded.
- **Making a request:** Send a list of `messages` plus `model` and `max_tokens` to the Messages API.
- **Multi-turn conversations:** The API is stateless, so the full conversation history must be sent with every request.
- **System prompts:** Set Claude's role, tone, and rules for the whole conversation.
- **Temperature:** Low values give focused, predictable output; high values give more creative, varied output.
- **Response streaming:** Show text to the user as it is generated instead of waiting for the full response.
- **Structured data:** Get clean JSON output by giving clear format instructions and prefilling the assistant's response.

## 2. Prompt Evaluation
- **Why evaluate:** Measure prompt quality objectively instead of guessing.
- **Eval workflow:** Write a prompt → build a test dataset → run it → grade results → improve and repeat.
- **Test datasets:** Claude can generate realistic test cases automatically.
- **Model-based grading:** Use Claude to score outputs on quality, accuracy, and reasoning.
- **Code-based grading:** Use code to check things like valid JSON, syntax, or required keywords.

## 3. Prompt Engineering Techniques
- **Be clear and direct:** Start with a plain instruction of what you want.
- **Be specific:** Add guidelines, steps, and constraints for the output.
- **XML tags:** Wrap content in tags like `<document>` or `<data>` so Claude can separate instructions from content.
- **Provide examples:** Show sample inputs and ideal outputs (one-shot / multi-shot prompting).

## 4. Tool Use with Claude
- **How it works:** Claude decides when to call a tool, your code runs it, and the result is sent back to Claude.
- **Tool schemas:** Each tool is described with a name, description, and JSON Schema for its inputs.
- **Message blocks:** Responses can contain `text` and `tool_use` blocks; results go back as `tool_result` blocks.
- **Multi-turn tool use:** Loop until Claude stops requesting tools, allowing several tool calls in a row.
- **Multiple tools:** Claude chooses the right tool from several options.
- **Fine-grained tool calling:** Stream tool inputs as they are generated.
- **Built-in tools:** The text editor tool for working with files and the web search tool for live information.

## 5. RAG and Agentic Search
- **Retrieval Augmented Generation:** Find relevant pieces of large documents and give only those to Claude.
- **Text chunking:** Split documents by size, by structure (headings, sections), or semantically.
- **Embeddings:** Convert text to vectors and find similar chunks using cosine similarity.
- **BM25 lexical search:** Keyword-based search that catches exact terms embeddings may miss.
- **Multi-index (hybrid) pipeline:** Combine semantic and keyword search results for better retrieval.

## 6. Features of Claude
- **Extended thinking:** Claude reasons step by step before answering, improving results on complex tasks.
- **Image support:** Send images for analysis, comparison, and data extraction.
- **PDF support:** Read text, tables, charts, and images inside PDFs.
- **Citations:** Claude links its answers back to exact passages in the source documents.
- **Prompt caching:** Reuse repeated prompt content (system prompts, tools, long documents) to cut cost and latency.
- **Caching rules:** Mark cache breakpoints; cached content must be identical and meet a minimum length.
- **Code execution & Files API:** Upload files once, then let Claude run code to analyze data and create outputs.

## 7. Model Context Protocol (MCP)
- **What MCP is:** An open standard that lets AI apps connect to external tools and data through reusable servers.
- **Architecture:** An MCP **client** (inside your app) talks to an MCP **server** that exposes capabilities.
- **Tools:** Actions Claude can perform, defined with simple Python decorators in the MCP SDK.
- **Resources:** Read-only data the app can fetch and give to Claude (e.g., documents, files).
- **Prompts:** Pre-written, tested prompt templates served by the MCP server.
- **Server inspector:** A browser tool to test and debug an MCP server without building a full app.
- **Client implementation:** Connect to a server, list its tools/resources/prompts, and call them.

## 8. Claude Code and Computer Use
- **Claude Code:** Anthropic's agentic coding tool that runs in the terminal and can read, write, and edit code in a project.
- **Setup:** Install, sign in, and run it inside a project folder.
- **In action:** Use it to explore codebases, fix bugs, add features, and run commands.
- **Enhancing with MCP:** Connect MCP servers to give Claude Code extra tools and abilities.
- **Computer Use:** Claude controls a computer through screenshots, mouse, and keyboard to automate UI tasks.


## 9. Agents & Workflows
- **Why needed** – For tasks Claude can't finish in one request.
- **Workflow** – Fixed steps decided by us. Predictable. Use it when you already know the steps.
- **Agent** – We give Claude a goal + tools, and it decides the steps by itself. Flexible. Use it when the task is not known in advance.
- **Example (Image → 3D model workflow)**:
  1. Claude describes the image of a metal part
  2. Claude writes CadQuery code to make the 3D model
  3. A rendering of the model is created
  4. Claude compares the rendering with the original image and fixes mistakes
- **Evaluator-Optimizer Pattern** – One step makes the output (producer), another checks it (grader). If it's not good, feedback goes back and it repeats until accepted.
- **Workflow patterns** – Ready-made "recipes" that worked for other engineers; we still write the code ourselves.
- **Parallelization** – Split one big task into small sub-tasks, run them at the same time, then combine the results.
  - **Problem** – One huge prompt with many rules confuses Claude and gives weaker answers.
  - **Example (Material picker)** – Send the same part image to Claude 4 times at once, each with rules for only one material (metal, polymer, ceramic, composite). Then one final Claude call compares all results and picks the best material.
  - **Steps** – Split → Run in parallel → Aggregate (combine).
  - **Sub-tasks can differ** – Each one can have its own prompt, tools, or rules.
  - **Benefits** – Better focus, easy to improve one prompt at a time, easy to add new options, more reliable results.
  - **When to use** – When a decision can be broken into independent checks (many options, many criteria, different areas of expertise).
- **Chaining** – Break a big task into small steps done one after another. Output of one step goes into the next step.
  - **Example (Video maker)** – Find trending topics → Claude picks the best topic → Claude researches it → Claude writes a video script → AI avatar makes the video → post it online.
  - **Why not one big prompt?** – Claude does better when it focuses on one task at a time.
  - **Extra benefit** – We can run normal code (not AI) between steps to check or process results.
  - **Long prompt problem** – With many rules (no emojis, don't say "written by AI", professional tone), Claude may still break some of them.
  - **Fix in 2 steps** – Step 1: write the article. Step 2: send the article back and ask Claude only to fix the broken rules (remove emojis, remove AI mentions, fix casual words).
  - **When to use** – Many requirements, Claude ignoring rules in long prompts, or needing to check output between steps.
- **Routing** – First find out what type of request it is, then send it to the right specialized prompt.
  - **Problem** – One general prompt can't handle every topic well ("programming" needs teaching, "surfing" needs fun).
  - **Categories** – Example video types: Entertainment, Educational, Comedy, Personal vlog, Reviews, Storytelling. Each has its own prompt.
  - **2 steps** – Step 1: Claude picks the category. Step 2: use that category's prompt to make the content.
  - **Example** – "Python functions" → Claude says "Educational" → use the educational prompt.
  - **Key point** – The input goes to only ONE pipeline, not all of them.
  - **When to use** – Many different request types with clear categories (support bots, content tools).
- **Agents and Tools** – Give Claude a goal + tools, and it figures out the steps itself.
  - **Combining tools** – With simple date tools (get time, add days, set reminder), Claude can answer "What day is it in 11 days?" or set a gym reminder by using them together.
  - **Asks for missing info** – For "When does my 90-day warranty end?", Claude asks when you bought it.
  - **Keep tools general** – Claude Code uses simple tools (bash, read, write, edit, glob, grep), not special ones like "refactor code". General tools can solve many more problems.
  - **Combinable tools** – A video agent with bash (FFmpeg), generate image, text to speech, and post media can make videos and also ask the user for approval in between.
  - **Trade-off** – Agents are flexible but less reliable and cost more.
- **Environment Inspection** – Claude must be able to see the result of its actions; otherwise it works blind.
  - **Computer use** – After each click or typing, Claude gets a screenshot to see what happened.
  - **Read before write** – Claude reads a file before editing it so it doesn't break existing code.
  - **Use the system prompt** – Example for a video agent: check audio with whisper.cpp captions and take screenshots with FFmpeg to verify the video.
  - **Benefits** – Tracks progress, catches errors, checks quality, adapts its approach.
  - **Golden question** – "How will Claude know if this action worked?"
- **Tip** – Use workflows when steps are known; use agents when they're not.



## 📝 Quiz Revision Notes
Quick answers to remember, based on the course quiz questions.

### API Basics
- **4 things needed in every request** – API key, model name, messages, max tokens.
- **Where to keep the API key** – On your server (in a `.env` file), never in website JavaScript, GitHub, or the browser.
- **Claude forgets the last question** – The API is stateless, so send the whole conversation history every time.
- **Make Claude act like a tutor (hints, not answers)** – Use a system prompt.
- **Very creative stories** – High temperature (1.0). Facts and code – low temperature (0.0).

### Prompt Engineering
- **Clear and direct prompt** – Start with an action verb: "Write a product description for running shoes."
- **Separate different data (reviews + sales)** – Use XML tags like `<reviews>` and `<sales_data>`.
- **After changing a prompt** – Run a prompt evaluation to check if it really improved.

### Prompt Evaluation
- **Measure how well a prompt works** – Prompt evaluation with automated testing.
- **Step after getting Claude's responses** – Send them to a grader for scoring.
- **Model grader** – Another AI model that scores quality.
- **Code grader** – Code that checks format (JSON, syntax, keywords).

### Tool Use
- **Purpose of tools** – Let Claude get real-time info and use outside systems.
- **Tool function** – A plain function in your code that runs when Claude asks for it.
- **Text + tool_use in one reply** – A normal multi-block message with different content types.
- **Batch tool** – Takes many tool calls and runs them together.

### Claude Features
- **Users need to verify facts from documents** – Citations.
- **Same long document, different questions** – Prompt caching with cache breakpoints.

### MCP
- **What MCP is** – A communication layer that gives Claude tools and context without writing integration code yourself.
- **Server vs client** – The server holds tools, prompts, and resources; the client is the bridge to reach them.
- **Transport agnostic** – Works over different methods like HTTP or stdio.
- **Main problem without MCP (GitHub example)** – You must write and maintain all the tool code yourself.
- **Easiest way to define a tool** – Use the `@mcp.tool()` decorator on a Python function; the SDK makes the JSON schema for you.
- **Test the server before building an app** – Use the MCP Inspector: `mcp dev mcp_server.py`.
- **Two parts of an MCP client** – Your own MCP Client class + the SDK's Client Session.
- **Find which tools a server has** – Send a `ListToolsRequest`. To run a tool, send a `CallToolRequest`.
- **Fetch a document by ID (`docs://documents/{doc_id}`)** – Use a templated resource. A direct resource has a fixed URI.
- **User clicks a button to start a workflow** – Use a Prompt.
- **Who controls what** – Tools = model (Claude), Resources = app, Prompts = user.

### Claude Code & Computer Use
- **Computer Use** – Claude uses a computer like a human (screenshots, mouse, keyboard).

### Workflows & Agents
- **Workflow vs agent** – Know the exact steps → workflow. Unknown tasks → agent.
- **Reliability is most important** – Workflow (more reliable and testable).
- **Car damage photo → repair estimate (same steps every time)** – Workflow with fixed steps.
- **Compare many materials, each with its own rules** – Parallelization.
- **Claude ignores rules in a long prompt** – Chaining (write first, then fix in a second step).
- **Different content types (educational vs entertainment)** – Routing.
- **Write → check → improve until good** – Evaluator-Optimizer pattern.
- **Most flexible agent tools** – Abstract tools like `read_file`, `write_file`, `run_command`.
- **Why environment inspection matters** – So the agent can see the results of its actions.
