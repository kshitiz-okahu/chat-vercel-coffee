import './src/libs/Env';

/** @type {import('next').NextConfig} */
export default
    {
      eslint: {
        dirs: ['.'],
        ignoreDuringBuilds: true
      },
      poweredByHeader: false,
      reactStrictMode: true,
      serverExternalPackages : ['ai']
    }

