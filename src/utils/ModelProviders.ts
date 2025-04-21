// Model provider types and configuration
export type ModelProvider = 'openai' | 'azure' | 'anthropic' | 'bedrock';

export interface ModelOption {
  id: ModelProvider;
  name: string;
  logo: string;
  isAvailable: boolean;
  disabled?: boolean;
}

// Function to check if a provider is available based on environment variables
export function isProviderAvailable(provider: ModelProvider): boolean {
  switch (provider) {
    case 'openai':
      return !!process.env.OPENAI_API_KEY;
    case 'azure':
      return !!process.env.AZURE_API_KEY && !!process.env.AZURE_DEPLOYMENT_NAME;
    case 'anthropic':
      return !!process.env.ANTHROPIC_API_KEY;
    case 'bedrock':
      return !!process.env.AWS_ACCESS_KEY_ID && 
             !!process.env.AWS_SECRET_ACCESS_KEY && 
             !!process.env.AWS_REGION;
    default:
      return false;
  }
}

// Get all available model providers
export function getAvailableModelProviders(): ModelOption[] {
  return [
    {
      id: 'openai',
      name: 'OpenAI with Vercel AI SDK',
      logo: '/openai-logomark.svg',
      isAvailable: isProviderAvailable('openai'),
      disabled: !isProviderAvailable('openai')
    },
    {
      id: 'azure',
      name: 'Azure OpenAI with Vercel AI SDK',
      logo: '/azure-logo.svg',
      isAvailable: isProviderAvailable('azure'),
      disabled: !isProviderAvailable('azure')
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude with Vercel AI SDK',
      logo: '/anthropic-logo.svg',
      isAvailable: isProviderAvailable('anthropic'),
      disabled: !isProviderAvailable('anthropic')
    },
    {
      id: 'bedrock',
      name: 'AWS Bedrock with Vercel AI SDK',
      logo: '/aws-logo.svg',
      isAvailable: isProviderAvailable('bedrock'),
      disabled: !isProviderAvailable('bedrock')
    }
  ];
}

// Get a default model provider (first available one)
export function getDefaultModelProvider(): ModelProvider {
  const providers = getAvailableModelProviders();
  const availableProvider = providers.find(provider => provider.isAvailable);
  return availableProvider?.id || 'openai';
}

// Get provider logo
export function getProviderLogo(provider: ModelProvider): string {
  const providers = getAvailableModelProviders();
  const providerConfig = providers.find(p => p.id === provider);
  return providerConfig?.logo || '/openai-logomark.svg';
}