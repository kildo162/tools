// Affiliate Configuration for DevTools
const AFFILIATE_CONFIG = {
    vultr: {
        id: 'YOUR_VULTR_REF_ID',
        url: 'https://www.vultr.com/?ref=YOUR_REF',
        banner: 'Cloud hosting for developers',
        commission: '$20/signup'
    },
    digitalocean: {
        id: 'YOUR_DO_REF_ID', 
        url: 'https://www.digitalocean.com/?refcode=YOUR_REF',
        banner: 'Developer-friendly cloud platform',
        commission: '$25/signup'
    },
    namecheap: {
        id: 'YOUR_NC_REF_ID',
        url: 'https://www.namecheap.com/?aff=YOUR_REF',
        banner: 'Domain & hosting deals',
        commission: '25% commission'
    },
    cloudflare: {
        // Cloudflare doesn't have traditional affiliate program
        // But can promote their paid plans
        url: 'https://www.cloudflare.com',
        banner: 'CDN & Security for developers'
    },
    aws: {
        // AWS Partner Program (need approval)
        url: 'https://aws.amazon.com',
        banner: 'Cloud computing services'
    }
};

// Revenue potential: $100-500/month với 1000+ monthly users
