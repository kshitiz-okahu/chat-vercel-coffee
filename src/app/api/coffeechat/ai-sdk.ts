import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createAzure } from '@ai-sdk/azure';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { ModelProvider } from '@/utils/ModelProviders';

export const aiSdkInvoke = async (msg: string, provider?: ModelProvider): Promise<string> => {
  const systemPrompt = `You are an AI assistant specialized in answering questions about coffee. 
  Provide accurate and concise information about coffee beans, brewing methods, 
  coffee history, preparation techniques, and related topics. 
  If you don't know the answer, you can say "I don't know".`;
  
  // Determine which provider to use
  const selectedProvider = provider || 'openai';
  
  try {
    // Configure the model based on the selected provider
    const model = getModel(selectedProvider as ModelProvider);
    console.log(`AI SDK invoked with provider: ${selectedProvider}, model:`, model);

    const { text } = await generateText({
      model: model,
      system: systemPrompt,
      prompt: msg,
    });
    
    return text;
  } catch (error) {
    console.error(`Error in AI SDK generation with ${provider}:`, error);
    return "Sorry, I couldn't process your request at this time.";
  }
};

// Function to get the appropriate model based on provider
function getModel(provider: ModelProvider) {
  switch (provider) {
    case 'azure':
      // Get Azure deployment name from env vars
      const azureDeployment = process.env.AZURE_DEPLOYMENT_NAME;
      if (!azureDeployment) {
        console.warn('Azure deployment name not found, falling back to OpenAI');
        return openai('gpt-4o');
      }
      const azureModelProvider =  createAzure({
        resourceName: process.env.AZURE_RESOURCE_NAME || '',
        apiKey: process.env.AZURE_API_KEY || '',
        // baseURL: process.env.AZURE_ENDPOINT || '',
        apiVersion: process.env.AZURE_API_VERSION || '2023-12-01-preview'
      });
      return azureModelProvider(azureDeployment);

    case 'anthropic':
      const modelId = process.env.ANTHROPIC_MODEL_ID || 'claude-3-5-sonnet-20241022';
      const anthropicModelProvider = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
      return anthropicModelProvider(modelId)

    case 'bedrock':
      // Using Claude on Bedrock as an example
      const bedrockModelProvider =  createAmazonBedrock({
        // The Bedrock provider will use AWS environment variables by default:
        // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
        region: process.env.AWS_REGION || 'us-east-1'
      });
      return bedrockModelProvider('anthropic.claude-3-sonnet-20240229-v1:0');

    case 'openai':
    default:
      return openai(process.env.OPENAI_MODEL || 'gpt-4o');
  }
}
