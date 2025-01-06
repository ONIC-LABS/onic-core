/**
 * Copyright 2025 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PromptTemplate } from "@/template.js";
import { BaseMessageMeta } from "@/llms/primitives/message.js";
import { z } from "zod";

export const OnicSystemPrompt = new PromptTemplate({
  schema: z.object({
    instructions: z.string().default("You are a knowledgeable and friendly assistant."),
    tools: z.array(
      z
        .object({
          name: z.string().min(1),
          description: z.string().min(1),
          schema: z.string().min(1),
        })
        .passthrough(),
    ),
    createdAt: z.string().datetime().nullish(),
  }),
  template: `# Available Functions
{{#tools.length}}
Here are the functions you are allowed to use. Always ensure all required parameters are included.

{{#tools}}
Function Name: {{name}}
Description: {{description}}
Parameters: {{schema}}

{{/tools}}
{{/tools.length}}
{{^tools.length}}
No functions available at this time.

{{/tools.length}}
# Communication Rules
All communication must follow strict instruction lines. Each instruction line starts with "Instruction:" and provides the expected output. No empty lines between instructions are allowed.
{{#tools.length}}
Skip Function Name, Function Input, and Function Output lines if no function is needed.
{{/tools.length}}

Message: This line represents the user’s message and should not appear in your response.
{{^tools.length}}
Thought: Provide a concise plan to respond to the user’s query. This must be immediately followed by Final Answer.
{{/tools.length}}
{{#tools.length}}
Thought: Outline a step-by-step approach to addressing the user’s query. If a function is needed, provide its name and input parameters. This must be followed by Function Name, Function Input, or Final Answer as appropriate.
Function Name: Specify the function you will use. This must be immediately followed by Function Input.
Function Input: Provide the parameters for the selected function. Use an empty object if no parameters are required.
Function Output: The function's response in JSON format.
Thought: Continue elaborating your process if necessary.
{{/tools.length}}
Final Answer: Provide the user with a clear and concise answer or ask for clarification if needed. This must always follow a Thought.

## Examples
Message: Translate "Good morning" into Spanish.
Thought: The user wants a translation to Spanish. I can do this easily.
Final Answer: Buenos días.

# Guidelines
Always use the defined communication structure.
{{^tools.length}}
Follow the rule that Thought must always lead directly to Final Answer.
{{/tools.length}}
{{#tools.length}}
Ensure each Thought line leads to either Function Name or Final Answer. Leverage Functions for factual or historical details.
{{/tools.length}}
If a user requests an unavailable function, inform them and suggest alternatives if possible.
When unsure or requiring additional input, ask the user in Final Answer.

# Capabilities
Prioritize these over functions when applicable:
- Proficient in English, Spanish, and French.
- Capable of translating, summarizing, and analyzing long documents.

# Additional Notes
- If unsure, admit it.
- Display date and time in friendly formats when needed.
- Format code, links, JSON, and tables using markdown.
- Reattempt different inputs or functions when initial attempts fail.
- Avoid complex calculations or data manipulations unless a function is available for the task.

# Role
{{instructions}}`,
});

export const OnicAssistantPrompt = new PromptTemplate({
  schema: z
    .object({
      thought: z.array(z.string()),
      toolName: z.array(z.string()),
      toolInput: z.array(z.string()),
      toolOutput: z.array(z.string()),
      finalAnswer: z.array(z.string()),
    })
    .partial(),
  template: `{{#thought}}Thought: {{.}}
{{/thought}}{{#toolName}}Function Name: {{.}}
{{/toolName}}{{#toolInput}}Function Input: {{.}}
{{/toolInput}}{{#toolOutput}}Function Output: {{.}}
{{/toolOutput}}{{#finalAnswer}}Final Answer: {{.}}{{/finalAnswer}}`,
});

export const OnicUserPrompt = new PromptTemplate({
  schema: z
    .object({
      input: z.string(),
      meta: z
        .object({
          createdAt: z.string().datetime().optional(),
        })
        .passthrough()
        .optional(),
    })
    .passthrough(),
  functions: {
    formatMeta: function () {
      const meta = this.meta as BaseMessageMeta;
      if (!meta) {
        return "";
      }

      const parts = [meta.createdAt && `Message created at: ${meta.createdAt}`]
        .filter(Boolean)
        .join("\n");

      return parts ? `\n\n${parts}` : parts;
    },
  },
  template: `Message: {{input}}{{formatMeta}}`,
});

export const OnicUserEmptyPrompt = new PromptTemplate({
  schema: z.object({}).passthrough(),
  template: `Message: This message is empty.`,
});

export const OnicToolErrorPrompt = new PromptTemplate({
  schema: z
    .object({
      reason: z.string(),
    })
    .passthrough(),
  template: `The function encountered an error. Below is the error log. If the issue persists, try a different function or explain why it can't be used.

{{reason}}`,
});

export const OnicToolInputErrorPrompt = new PromptTemplate({
  schema: z
    .object({
      reason: z.string(),
    })
    .passthrough(),
  template: `Input Error: {{reason}}

TIP: If the input seems correct but the function can't process it, consider using a different function or state that you're unsure.`,
});

export const OnicToolNoResultsPrompt = new PromptTemplate({
  schema: z.record(z.any()),
  template: `No results were found for your request!`,
});

export const OnicToolNotFoundPrompt = new PromptTemplate({
  schema: z
    .object({
      tools: z.array(z.object({ name: z.string() }).passthrough()),
    })
    .passthrough(),
  template: `The requested function is unavailable.
{{#tools.length}}
Consider using one of these functions: {{#trim}}{{#tools}}{{name}},{{/tools}}{{/trim}}
{{/tools.length}}`,
});

export const OnicSchemaErrorPrompt = new PromptTemplate({
  schema: z.object({}).passthrough(),
  template: `Error: The response structure does not comply with the communication rules outlined in the system prompt.
Follow valid instruction lines: 'Thought' followed by either 'Function Name' + 'Function Input' + 'Function Output' or 'Final Answer'.`,
});
