
const fetchConfig = async () => {
    const response = await fetch('/config.json');
    if (!response.ok) {
        throw new Error('Failed to load configuration');
    }
    const config = await response.json();
    return config;
};

export default fetchConfig;
