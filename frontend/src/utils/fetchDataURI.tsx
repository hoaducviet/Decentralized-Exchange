import axios from 'axios'

interface Props {
    uri: string;
}

export const fetchDataURI = async ({ uri }: Props) => {
    try {
        if (!uri) { return { data: null } }
        const response = await axios.get(uri, { timeout: 20000 })
        if (!response) {
            throw new Error(`Error fetching data`);
        }
        if (response.status !== 200) {
            return { data: null };
        }

        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}