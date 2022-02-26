#!/bin/bash

caddy start --config /etc/caddy/Caddyfile --adapter caddyfile

exec $@
