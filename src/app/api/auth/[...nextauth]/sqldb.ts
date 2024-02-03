import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.MySQL_HOST,
    port: 3306,
    user: process.env.MySQL_USERNAME,
    password: process.env.MySQL_PASSWORD,
    database: process.env.MySQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const executeQuery = async (query: string, data: any[]) => {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(query, data);
        connection.release();
        return result;
    } catch (error) {
        console.error("database error", error);
        throw new Error("operation failed")
    }
}

export default executeQuery



