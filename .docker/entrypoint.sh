curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux64.tar.gz
rm -rf /opt/nvim
tar -C /opt -xzf nvim-linux64.tar.gz
cd /SambaWeb-Front/SambaWebFront
npm install
npm install -g @angular/cli@17
ng serve --host 0.0.0.0 
