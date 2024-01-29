import mysql from 'mysql2/promise'


const executeQuery = async (query, data) => {
    try {
        const db = await mysql.createConnection({
            host: "66.228.44.91",
            port: 3306,
            user: "izyk",
            password: "vf0fW9Hg&",
            database: "test"
        });

        const [result] = await db.execute(query, data);
        db.end();
        return result;
    } catch (error) {
        return (error)
    }
}

export default executeQuery



