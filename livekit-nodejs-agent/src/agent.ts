// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { JobContext, JobProcess } from '@livekit/agents';
import { WorkerOptions, cli, defineAgent, llm, pipeline } from '@livekit/agents';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as elevenlabs from '@livekit/agents-plugin-elevenlabs';
import * as openai from '@livekit/agents-plugin-openai';
import * as silero from '@livekit/agents-plugin-silero';
import type { VoicePipelineAgent } from '@livekit/agents/dist/pipeline';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HttpTextProcessorAdapter } from './adapter/http-service.js';
import { WinstonLogger } from './component/winston-logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env.local');
dotenv.config({ path: envPath });

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
    proc.userData.textProcessor = new HttpTextProcessorAdapter();
  },
  entry: async (ctx: JobContext) => {
    const vad = ctx.proc.userData.vad! as silero.VAD;

    const initialContext = new llm.ChatContext().append({
      role: llm.ChatRole.SYSTEM,
      text:
        'You are a voice assistant created by LiveKit. Your interface with users will be voice. ' +
        'You should use short and concise responses, and avoiding usage of unpronounceable ' +
        'punctuation.',
    });

    await ctx.connect();
    const logger = new WinstonLogger();
    logger.info('[MSG_UNNEEDED_PROCESS] waiting for participant');
    const participant = await ctx.waitForParticipant();
    logger.info(
      `[MSG_UNNEEDED_PROCESS] starting assistant example agent for ${participant.identity}`,
    );

    /**
     * Function to process the text before it is spoken
     * @returns text to be spoken
     */
    const textProcess = async (agent: VoicePipelineAgent, text: string | AsyncIterable<string>) => {
      const textProcessorAdapter = ctx.proc.userData.textProcessor! as HttpTextProcessorAdapter;
      const logger = new WinstonLogger();
      
      if (typeof text === 'string') {
        logger.info(`[MSG_UNNEEDED_PROCESS] text: ${text}`);
        return text;
      } else {
        const fullMessageArr = [];
        for await (const item of text) {
          fullMessageArr.push(item);
        }

        const fullMessage = fullMessageArr.join('');
        logger.info(`[MSG_NEEDED_PROCESS] Message before process: ${fullMessage}`);

        const result = await textProcessorAdapter.truncate(fullMessage);
        return result;
      }
    };

    const agent = new pipeline.VoicePipelineAgent(
      vad,
      new deepgram.STT(),
      new openai.LLM(),
      new elevenlabs.TTS(),
      // Function before TTS Callback to process the text before it is spoken
      { chatCtx: initialContext, beforeTTSCallback: textProcess },
    );
    agent.start(ctx.room, participant);

    await agent.say('Hey, how can I help you today', true);
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
