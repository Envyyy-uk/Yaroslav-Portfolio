# Yaroslav-Portfolio
## Local Run Guide / Інструкція локального запуску


🇬🇧 ENGLISH
============================================================

Description  
This project uses `fetch()` to load HTML files (Home.html, Task1.html, etc.).
Due to browser security restrictions, the project will not work correctly if
`index.html` is opened directly via double click (`file://`).

To run the project correctly, it must be opened via a local HTTP server.

Run with Python

1. Extract the project files.
2. Open a terminal in the folder where `index.html` is located.
3. Run:
   python -m http.server 8000
   (if it does not work, try)
   python3 -m http.server 8000
4. Open in your browser:
   http://localhost:8000/index.html

To stop the server, press Ctrl + C.

Run with WebStorm

1. Open the project folder in WebStorm.
2. Locate `index.html`.
3. Right click → Run / Open in Browser.
4. The page will open via a URL like http://localhost:63342/...

Important: the page must be opened via http://, not file://.

🇺🇦 УКРАЇНСЬКОЮ
============================================================

Опис  
Цей проєкт використовує `fetch()` для завантаження HTML-файлів (Home.html, Task1.html тощо).
Через обмеження безпеки браузерів проєкт не працює коректно, якщо відкрити `index.html`
подвійним кліком (`file://`).

Для правильної роботи проєкт потрібно відкривати через локальний HTTP-сервер.

Запуск через Python

1. Розархівуйте проєкт.
2. Відкрийте термінал / командний рядок у папці, де знаходиться `index.html`.
3. Виконайте команду:
   python -m http.server 8000
   (якщо не працює, спробуйте)
   python3 -m http.server 8000
4. Відкрийте в браузері:
   http://localhost:8000/index.html

Щоб зупинити сервер — натисніть Ctrl + C.

Запуск через WebStorm

1. Відкрийте папку проєкту у WebStorm.
2. Знайдіть файл `index.html`.
3. Натисніть правою кнопкою → Run / Open in Browser.
4. Сторінка відкриється через адресу виду http://localhost:63342/...

Важливо: сторінка повинна відкриватися через http://, а не file://.


