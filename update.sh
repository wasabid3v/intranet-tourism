#!/bin/bash

php artisan optimize &&
    composer install &&
    php artisan storage:link &&
    npm install &&
    npm run build &&
    sudo systemctl restart nginx &&
    sudo systemctl restart artisan-queue &&
    sudo systemctl restart artisan-reverb