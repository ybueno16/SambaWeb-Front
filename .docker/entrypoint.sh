#!/bin/bash
set -e
# Atualiza e instala pacotes necessários
apt-get update 
apt-get install -y curl git wget unzip gdb libstdc++6 libglu1-mesa fonts-droid-fallback python3
apt-get clean

# Configura variáveis de ambiente
export DEBIAN_FRONTEND=dialog
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

# Baixa e instala o Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb || apt --fix-broken install -y

# Clona o repositório do Flutter
git clone https://github.com/flutter/flutter.git /usr/local/flutter

# Define o caminho do Flutter no ambiente
export PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Executa o flutter doctor para configurar o Flutter
flutter doctor

# Habilita o suporte para web no Flutter
flutter channel master
flutter upgrade
flutter config --enable-web
flutter pub get

# Inicia o aplicativo Flutter na web
flutter run -d web-server --web-port=4200 --wasm
tail -f /dev/null
