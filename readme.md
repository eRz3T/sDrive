# Aplikacja Webowa Przechowująca Pliki z Dostępem Chronionym

## Opis projektu

Celem niniejszej pracy dyplomowej jest  wdrożenie aplikacji internetowej umożliwiającej bezpieczne przechowywanie plików oraz zarządzanie dostępem do nich. W dobie intensywnej digitalizacji danych rośnie potrzeba opracowania niezawodnych metod ochrony informacji przechowywanych online.

## Technologie

    Backend: Python, Django
    Frontend: React
    Baza danych: MySQL
    Konteneryzacja: Docker
    Kontrola wersji: Git, GitHub
    Diagramy: Draw.io

# Setup sDrive

1. Aktualizacja systemu i instalacja niezbędnych paczek

```
sudo apt update && sudo apt upgrade -y

sudo apt install git python3 python3-pip python3-virtualenv
```

2. Przygotowanie środowiska

```
cd ~/sDrive/

virtualenv venv
 
source venv/bin/activate
```

3. Pobranie repozytorium git

```
cd ~/sDrive/

git clone https://github.com/eRz3T/sDrive
```
