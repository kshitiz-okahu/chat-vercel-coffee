import { logger } from '@/libs/Logger';
import { NextResponse } from 'next/server';
import { aiSdkInvoke } from './ai-sdk';
// import { setScopes } from "monocle2ai";
import type { ModelProvider } from '@/utils/ModelProviders';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const userMessage = body.message;
    const provider = body.provider as ModelProvider;
    const sessionId = request.headers.get('X-Session-Id');
    
    logger.info(`Processing request for session: ${sessionId}, provider: ${provider}`);
    
    // Include provider in S3 key prefix for telemetry tracking
    const s3KeyPrefix = sessionId ? `${sessionId}_${provider}` : provider;
    process.env["MONOCLE_S3_KEY_PREFIX_CURRENT"] = s3KeyPrefix;
    
    console.log(`Processing message with provider: ${provider}`);
    
    const aiResponse = await aiSdkInvoke(userMessage, provider);

    // Format the response to match the expected structure
    const responseMessage = {
      role: 'assistant',
      content: [
        {
          text: aiResponse
        }
      ]
    };

    return NextResponse.json({
      message: responseMessage,
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
