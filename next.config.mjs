/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["d11hlrm9khx0pi.cloudfront.net"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
};

export default nextConfig;
