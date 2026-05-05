fx_version 'cerulean'
game 'gta5'

description 'Momento RP Custom HUD'
version '1.0.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/css/style.css',
    'html/js/app.js',
    'html/assets/*'
}

client_scripts {
    'client/main.lua'
}

shared_scripts {
    '@qb-core/shared/locale.lua'
}
