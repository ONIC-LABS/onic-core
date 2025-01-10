<p align="center">
    <img alt="onic Framework logo" src="/docs/assets/oniclogo.png" height="128">
    <h1 align="center">Onic Agent Framework</h1>
</p>

<p align="center">

  <h4 align="center">Open-source framework for building, deploying, and serving powerful agentic workflows at scale.</h4>
</p>

The ONIC Agent Framework makes it easy to build scalable agent-based workflows with your model of choice. The framework is been designed to perform good with [Llama 3.x](https://ai.meta.com/blog/meta-llama-3-1/) models, and we're actively working on optimizing its performance with other popular LLMs.<br><br> The goal is to make developers to adopt the latest technology with minimal changes to their current agent implementation.

## Key Features

- 🤖 **AI agents**: Use our powerful [onic agent](/docs/agents.md) refined for Llama 3.1 and Granite 3.0, or [build your own](/docs/agents.md).
- 🛠️ **Tools**: Use our [built-in tools](/docs/tools.md) or [create your own](/docs/tools.md) in Javascript/Python.
- 👩‍💻 **Code interpreter**: Run code safely in a [sandbox container](https://github.com/i-am-onic/onic-code-interpreter).
- 💾 **Memory**: Multiple [strategies](/docs/memory.md) to optimize token spend.
- ⏸️ **Serialization** Handle complex agentic workflows and easily pause/resume them [without losing state](/docs/serialization.md).
- 🔍 **Instrumentation**: Use [Instrumentation](/docs/instrumentation.md) based on [Emitter](/docs/emitter.md) to have full visibility of your agent’s inner workings.
- 🎛️ **Production-level** control with [caching](/docs/cache.md) and [error handling](/docs/errors.md).
- 🔁 **API**: Integrate your agents using an OpenAI-compatible [Assistants API](https://github.com/i-am-onic/onic-api) and [Python SDK](https://github.com/i-am-onic/onic-python-sdk).
- ... more on our [Roadmap](#roadmap)



### Installation

```shell
npm install onic-core
```

or

```shell
yarn add onic-core
```

### Example

```ts
import { onicAgent } from "onic-core/agents/onic/agent";
import { OllamaChatLLM } from "onic-core/adapters/ollama/chat";
import { TokenMemory } from "onic-core/memory/tokenMemory";
import { DuckDuckGoSearchTool } from "onic-core/tools/search/duckDuckGoSearch";
import { OpenMeteoTool } from "onic-core/tools/weather/openMeteo";

const llm = new OllamaChatLLM(); // default is llama3.1 (8B), it is recommended to use 70B model

const agent = new onicAgent({
  llm, // for more explore 'onic-core/adapters'
  memory: new TokenMemory({ llm }), // for more explore 'onic-core/memory'
  tools: [new DuckDuckGoSearchTool(), new OpenMeteoTool()], // for more explore 'onic-core/tools'
});

const response = await agent
  .run({ prompt: "What's the current weather in Las Vegas?" })
  .observe((emitter) => {
    emitter.on("update", async ({ data, update, meta }) => {
      console.log(`Agent (${update.key}) 🤖 : `, update.value);
    });
  });

console.log(`Agent 🤖 : `, response.result.text);
```



➡️ you can run this example after local installation, using the command `yarn start examples/agents/simple.ts`

> [!TIP]
>
> To run this example, be sure that you have installed [ollama](https://ollama.com) with the [llama3.1](https://ollama.com/library/llama3.1) model downloaded.

### Local Installation

> [!NOTE]
>
> `yarn` should be installed via Corepack ([tutorial](https://yarnpkg.com/corepack))

1. Clone the repository `git clone git@github.com:i-am-onic/onic-agent-framework`.
2. Install dependencies `yarn install --immutable && yarn prepare`.
3. Create `.env` (from `.env.template`) and fill in missing values (if any).
4. Start the agent `yarn run start:onic` (it runs `/examples/agents/onic.ts` file).

### 📦 Modules

The source directory (`src`) provides numerous modules that one can use.

| Name                                             | Description                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [**agents**](/docs/agents.md)                    | Base classes defining the common interface for agent.                                       |
| [**llms**](/docs/llms.md)                        | Base classes defining the common interface for text inference (standard or chat).           |
| [**template**](/docs/templates.md)               | Prompt Templating system based on `Mustache` with various improvements.                     |
| [**memory**](/docs/memory.md)                    | Various types of memories to use with agent.                                                |
| [**tools**](/docs/tools.md)                      | Tools that an agent can use.                                                                |
| [**cache**](/docs/cache.md)                      | Preset of different caching approaches that can be used together with tools.                |
| [**errors**](/docs/errors.md)                    | Error classes and helpers to catch errors fast.                                             |
| [**adapters**](/docs/llms.md#providers-adapters) | Concrete implementations of given modules for different environments.                       |
| [**logger**](/docs/logger.md)                    | Core component for logging all actions within the framework.                                |
| [**serializer**](/docs/serialization.md)         | Core component for the ability to serialize/deserialize modules into the serialized format. |
| [**version**](/docs/version.md)                  | Constants representing the framework (e.g., latest version)                                 |
| [**emitter**](/docs/emitter.md)                  | Bringing visibility to the system by emitting events.                                       |
| **internals**                                    | Modules used by other modules within the framework.                                         |

To see more in-depth explanation see [overview](/docs/overview.md).

## Tutorials

🚧 Coming soon 🚧

## Roadmap

- Onic agent performance optimization with additional models
- Single-click Agent creating app
- Improvements to building custom agents
- Multi-agent orchestration

## Contribution guidelines

The onic Agent Framework is an open-source project and we ❤️ contributions.

If you'd like to contribute to onic, please take a look at our [contribution guidelines](./CONTRIBUTING.md).

### Bugs

We are using [GitHub Issues](https://github.com/i-am-onic/onic-agent-framework/issues) to manage our public bugs. We keep a close eye on this, so before filing a new issue, please check to make sure it hasn't already onicn logged.

### Code of conduct

This project and everyone participating in it are governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please read the [full text](./CODE_OF_CONDUCT.md) so that you can read which actions may or may not be tolerated.
 

