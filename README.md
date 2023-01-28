# vue3-display

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


### Raspberry Pi Daemon

```sh
/lib/systemd/system/vue3-weather-instagram-display.service
sudo chmod 644 /lib/systemd/system/vue3-weather-instagram-display.service
sudo systemctl daemon-reload
sudo systemctl enable vue3-weather-instagram-display.service
sudo reboot
```
### vue3-weather-instagram-display.service

```sh
[Unit]
Description=Electron Vue Weather and Instagram Display
Requires=local-fs.target
After=network.target

[Service]
User=pi
Group=pi
Type=idle
TimeoutSec=infinity
Restart=always
RestartSec=10s
KillMode=process
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
Environment=NODE_ENV=production
WorkingDirectory=/home/pi/vue3-weather-instagram-display
ExecStart=startx /home/pi/vue3-weather-instagram-display/node_modules/electron/dist/electron /home/pi/vue3-weather-instagram-display

[Install]
WantedBy=multi-user.target
```

### .env.local

```
VITE_APP_OPENWEATHER=
VITE_APP_INSTAGRAM_TOKEN=
VITE_APP_INSTAGRAM_USERNAME=
```
