export const fetchData = async (id: string) => {
    try {
        const key = `https://jsonplaceholder.typicode.com/todos/${id}`;
        const response = await fetch(key);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching data:', err);
        return null;
    }
}