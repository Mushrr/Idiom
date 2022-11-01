#!/usr/bin/env sh


if [[ ! -f "$HOME/.ovo" ]]; then
    npm run init
    touch ~/.ovo
fi

npm run build