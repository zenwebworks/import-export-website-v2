const nextConfig = {
    allowedDevOrigins: ['192.168.1.28'],
    outputFileTracingIncludes: {
        '/og/**': ['./public/assets/og-logo.png'],
    },
    images: {
        qualities: [25, 50, 75, 82],
  },
};

export default nextConfig;
