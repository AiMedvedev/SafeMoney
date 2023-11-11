const API__URL = 'https://cute-unmarred-gosling.glitch.me/api';

export const getData = async (url) => {
    try {
        const response = await fetch(`${API__URL}${url}`);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Ошибка при получении данных: ", error);
        throw error;
    }
}

export const postData = async (url, data) => {
    try {
        const response = await fetch(`${API__URL}${url}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Ошибка при отправке данных: ", error);
        throw error;
    }
}

export const deleteData = async (url) => {
    try {
        const response = await fetch(`${API__URL}${url}`, {
            method: 'DELETE',
        });
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Ошибка при удалении данных: ", error);
        throw error;
    }
}