//Запуск бд
В репозитории проекта зайди в database.js
и заполни pool
const pool = new Pool({
    user:"postgres",
    password:"****",
    host:"localhost",
    port:5432,
    database: "ecomdb" = это название бд котороые ты создашь позже
})
Заходим в корень папки PostgresSQL
примерная репозитория C:\Program Files\PostgreSQL\16\bin
Находясь в папке bin, вызываем cmd
psql --version - Если отработало, и вывелась версия, можно продолжать дальше.
psql -U postgres - провалиться в PostgresSQL
\l - все созданные бд
create database ecomdb - создание бд
\connect ecomdb - подключение в бд
\dt - существующие в бд таблицы 
Подключившись к бд, заходи в репозиторий проекта в файл database.sql, там будут команды, и по очереди вставляй в cmd. Так ты создашь таблицы 
