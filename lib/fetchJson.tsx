export default async function fetchJson(...args) {
    try {
        const response = await fetch(args[0], args[1]);
        const data = await response.json();
        if (response.ok) {
            return data;
        }
        const error = new Error(data.message || response.statusText);
        throw error;
    } catch (error) {
        throw error;
    }
}