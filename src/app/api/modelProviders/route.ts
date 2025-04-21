import { NextResponse } from 'next/server';
import { getAvailableModelProviders } from '@/utils/ModelProviders';

export const GET = () => {
  const providers = getAvailableModelProviders();
  return NextResponse.json(providers);
};