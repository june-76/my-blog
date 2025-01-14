// app/api/posts/route.js

import mysql from "mysql2";
import { NextResponse } from "next/server";

// GET 요청 처리
export async function GET(req) {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM posts", (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    })
        .then((results) => {
            return NextResponse.json(results, { status: 200 });
        })
        .catch((error) => {
            return NextResponse.json(
                { error: "Database query failed" },
                { status: 500 }
            );
        })
        .finally(() => {
            connection.end();
        });
}
