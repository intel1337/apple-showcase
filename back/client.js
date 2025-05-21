import mysql from "mysql2/promise";


export default async function dbClientInstance(){
    const HOST = "localhost";
    const client = await mysql.createConnection({
        host: HOST,
        user: "root",
        password: "root",
        database: "shop"
    }).catch(err => { console.error(err) });
    return client;
}





