# Aplikacja Webowa Przechowująca Pliki z Dostępem Chronionym

### 1. Opis projektu

Celem niniejszej pracy dyplomowej jest  wdrożenie aplikacji internetowej umożliwiającej bezpieczne przechowywanie plików oraz zarządzanie dostępem do nich. W dobie intensywnej digitalizacji danych rośnie potrzeba opracowania niezawodnych metod ochrony informacji przechowywanych online.

### 2. Technologie
    Backend: JavaScript, Node.js
    Baza danych: MySQL
    Konteneryzacja: Docker

### 3. Uruchomienie projektu

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
```
sudo apt install apt-transport-https curl
```
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```
```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
```
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```
```
sudo systemctl is-active docker
```
```
sudo docker run hello-world
```
```
sudo usermod -aG docker ${USER}
```

2. Przygotowanie środowiska

```
cd ~/sDrive/

git clone https://github.com/eRz3T/sDrive

```
3. Inne

```
sudo mysql -u root
```


