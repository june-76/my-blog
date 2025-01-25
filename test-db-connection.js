const mysql = require("mysql2/promise");
require("dotenv").config();

async function testConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        connectTimeout: 60000, // 60초 타임아웃 설정
    });

    try {
        const [rows] = await connection.execute("SELECT 1");
        console.log("Connection successful:", rows);
    } catch (error) {
        console.error("Connection failed:", error);
    } finally {
        await connection.end();
    }
}

testConnection();
