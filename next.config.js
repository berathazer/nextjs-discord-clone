/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.externals.push({
			"utf-8-validate": "commenjs utf-8-validate",
			bufferutil: "commenjs bufferutil",
		});
		return config;
	},
	images: {
		domains: ["uploadthing.com", "utfs.io"],
	},
};

module.exports = nextConfig;
