# Aplikacja Webowa Przechowująca Pliki z Dostępem Chronionym

### 1. Opis projektu

Celem niniejszej pracy dyplomowej jest  wdrożenie aplikacji internetowej umożliwiającej bezpieczne przechowywanie plików oraz zarządzanie dostępem do nich. W dobie intensywnej digitalizacji danych rośnie potrzeba opracowania niezawodnych metod ochrony informacji przechowywanych online.

### 2. Technologie
    Backend: Python, Django
    Frontend: React
    Baza danych: MySQL
    Konteneryzacja: Docker

### 3. Uruchomienie projektu

1. Aktualizacja systemu i instalacja niezbędnych paczek

```
sudo apt update && sudo apt upgrade -y

sudo apt install git python3 python3-pip python3-virtualenv
```

2. Przygotowanie środowiska

```
cd ~/sDrive/

git clone https://github.com/eRz3T/sDrive

virtualenv venv
 
source venv/bin/activate

pip install django
```

3. Uruchomienie aplikacji

```
cd ~/sDrive/sdrive/

python manage.py runserver
```

