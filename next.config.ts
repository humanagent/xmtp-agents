import type { NextConfig } from "next";

/**
 * APPROACHES TRIED:
 * 1. ❌ asyncWebAssembly + webassembly/async type - Still tries to resolve 'wbg' import
 * 2. ❌ Dynamic imports - Next.js still analyzes imports during build
 * 3. ❌ noParse for @xmtp/wasm-bindings - Causes "Cannot use import statement outside a module"
 * 4. ❌ externals - Need the module bundled, not external
 * 5. ❌ CopyPlugin to copy WASM files - Doesn't solve import resolution
 * 6. ✅ SUCCESS: asset/resource type + IgnorePlugin for WASM imports ('wbg', 'env', 'wasi_snapshot_preview1')
 * 
 * ADDITIONAL FIX: Add COOP/COEP headers for SharedArrayBuffer/Atomics (required for SQLite)
 */
const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ["@xmtp/browser-sdk", "@xmtp/wasm-bindings"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer, webpack }) => {
    console.log("[Next.js] Configuring webpack for XMTP browser-sdk - Approach 6");
    
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };
    
    // Approach 6: Use asset/resource for WASM files (as static assets)
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
      generator: {
        filename: "static/wasm/[name].[hash][ext]",
      },
    });

    // Ignore WASM import statements that webpack can't resolve
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^wbg$/,
        contextRegExp: /@xmtp\/wasm-bindings/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^env$/,
        contextRegExp: /@xmtp\/wasm-bindings/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^wasi_snapshot_preview1$/,
        contextRegExp: /@xmtp\/wasm-bindings/,
      })
    );

    // Client-side only configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        stream: false,
        buffer: false,
      };
    }

    console.log("[Next.js] Webpack configuration complete");
    return config;
  },
};

export default nextConfig;
