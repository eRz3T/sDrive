# Aplikacja Webowa Przechowująca Pliki z Dostępem Chronionym

### 1. Opis projektu

Celem niniejszej pracy dyplomowej jest  wdrożenie aplikacji internetowej umożliwiającej bezpieczne przechowywanie plików oraz zarządzanie dostępem do nich. W dobie intensywnej digitalizacji danych rośnie potrzeba opracowania niezawodnych metod ochrony informacji przechowywanych online.

### 2. Technologie
    Backend: JavaScript, Node.js
    Baza danych: MySQL
    Konteneryzacja: Docker

### 3. Instalacja projektu

1. Aktualizacja systemu i instalacja niezbędnych paczek

```
sudo apt update && sudo apt upgrade -y
```
```
sudo apt install mysql-server -y
```
```
sudo systemctl status mysql
```
```
(sudo systemctl start mysql.service / sudo systemctl stop mysql.service)
```
```
sudo mysql_secure_installation
```
Odpowiedzi do instalacji mysql -> 0 n n n y
```
sudo apt install nodejs -y
```
```
sudo apt install npm -y
```

2. Przygotowanie środowiska

```
cd ~/sDrive/

git clone https://github.com/eRz3T/sDrive
```
```
cd sDrive/sdrive

sudo npm install express ejs dotenv jsonwebtoken mysql bcryptjs cookie-parser nodemon diff
```
### 4. Uruchomienie projektu
```
nodemon index.js
```
W przeglądarce wpisać adres
```
http://localhost:3000/
```
