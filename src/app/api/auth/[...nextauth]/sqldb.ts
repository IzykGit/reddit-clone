import mysql from 'mysql2/promise'


const executeQuery = async (query, data) => {
    try {
        const db = await mysql.createConnection({
            host: process.env.MySQL_HOST,
            port: 3306,
            user: process.env.MySQL_USERNAME,
            password: process.env.MySQL_PASSWORD,
            database: process.env.MySQL_DATABASE
        });

        const [result] = await db.execute(query, data);
        db.end();
        return result;
    } catch (error) {
        return (error)
    }
}

export default executeQuery



