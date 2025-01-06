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

import { ChatLLMOutput } from "@/llms/chat.js";
import { BaseMemory } from "@/memory/base.js";
import { BaseMessage } from "@/llms/primitives/message.js";
import { Callback } from "@/emitter/types.js";
import { AnyTool, BaseToolRunOptions, ToolError, ToolOutput } from "@/tools/base.js";
import {
  OnicAssistantPrompt,
  OnicSchemaErrorPrompt,
  OnicSystemPrompt,
  OnicToolErrorPrompt,
  OnicToolInputErrorPrompt,
  OnicToolNoResultsPrompt,
  OnicToolNotFoundPrompt,
  OnicUserEmptyPrompt,
  OnicUserPrompt,
} from "@/agents/onic/prompts.js";
import { LinePrefixParser } from "@/agents/parsers/linePrefix.js";
import { JSONParserField, ZodParserField } from "@/agents/parsers/field.js";
import { NonUndefined } from "@/internals/types.js";

export interface OnicRunInput {
  prompt: string | null;
}

export interface OnicRunOutput {
  result: BaseMessage;
  iterations: OnicAgentRunIteration[];
  memory: BaseMemory;
}

export interface OnicAgentRunIteration {
  raw: ChatLLMOutput;
  state: OnicIterationResult;
}

export interface OnicAgentExecutionConfig {
  totalMaxRetries?: number;
  maxRetriesPerStep?: number;
  maxIterations?: number;
}

export interface OnicRunOptions {
  signal?: AbortSignal;
  execution?: OnicAgentExecutionConfig;
}

export interface OnicMeta {
  iteration: number;
}

export interface OnicUpdateMeta extends OnicMeta {
  success: boolean;
}

export interface OnicCallbacks {
  start?: Callback<{ meta: OnicMeta; tools: AnyTool[]; memory: BaseMemory }>;
  error?: Callback<{ error: Error; meta: OnicMeta }>;
  retry?: Callback<{ meta: OnicMeta }>;
  success?: Callback<{
    data: BaseMessage;
    iterations: OnicAgentRunIteration[];
    memory: BaseMemory;
    meta: OnicMeta;
  }>;
  update?: Callback<{
    data: OnicIterationResult;
    update: { key: keyof OnicIterationResult; value: string; parsedValue: unknown };
    meta: OnicUpdateMeta;
    memory: BaseMemory;
  }>;
  partialUpdate?: Callback<{
    data: OnicIterationResultPartial;
    update: { key: keyof OnicIterationResult; value: string; parsedValue: unknown };
    meta: OnicUpdateMeta;
  }>;
  toolStart?: Callback<{
    data: {
      tool: AnyTool;
      input: unknown;
      options: BaseToolRunOptions;
      iteration: OnicIterationToolResult;
    };
    meta: OnicMeta;
  }>;
  toolSuccess?: Callback<{
    data: {
      tool: AnyTool;
      input: unknown;
      options: BaseToolRunOptions;
      result: ToolOutput;
      iteration: OnicIterationToolResult;
    };
    meta: OnicMeta;
  }>;
  toolError?: Callback<{
    data: {
      tool: AnyTool;
      input: unknown;
      options: BaseToolRunOptions;
      error: ToolError;
      iteration: OnicIterationToolResult;
    };
    meta: OnicMeta;
  }>;
}

export interface OnicAgentTemplates {
  system: typeof OnicSystemPrompt;
  assistant: typeof OnicAssistantPrompt;
  user: typeof OnicUserPrompt;
  userEmpty: typeof OnicUserEmptyPrompt;
  toolError: typeof OnicToolErrorPrompt;
  toolInputError: typeof OnicToolInputErrorPrompt;
  toolNoResultError: typeof OnicToolNoResultsPrompt;
  toolNotFoundError: typeof OnicToolNotFoundPrompt;
  schemaError: typeof OnicSchemaErrorPrompt;
}

export type OnicParserInput = LinePrefixParser.define<{
  thought: ZodParserField<string>;
  tool_name: ZodParserField<string>;
  tool_input: JSONParserField<Record<string, any>>;
  tool_output: ZodParserField<string>;
  final_answer: ZodParserField<string>;
}>;

type OnicParser = LinePrefixParser<OnicParserInput>;
export type OnicIterationResult = LinePrefixParser.inferOutput<OnicParser>;
export type OnicIterationResultPartial = LinePrefixParser.inferPartialOutput<OnicParser>;
export type OnicIterationToolResult = NonUndefined<OnicIterationResult, "tool_input" | "tool_name">;  
