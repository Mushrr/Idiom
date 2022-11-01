#!/usr/bin/env sh


if [[ ! -f "$HOME/.ovo" ]]; then
    yarn run init
    touch ~/.ovo
fi

yarn run start