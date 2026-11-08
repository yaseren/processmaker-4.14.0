FROM php:8.3-fpm-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        $PHPIZE_DEPS \
        libc-client2007e-dev \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libkrb5-dev \
        libmagickwand-dev \
        libpng-dev \
        librdkafka-dev \
        libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure imap --with-kerberos --with-imap-ssl \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        exif \
        gd \
        imap \
        intl \
        opcache \
        pcntl \
        pdo_mysql \
        sockets \
        zip \
    && pecl install imagick \
    && pecl install rdkafka-6.0.5 \
    && docker-php-ext-enable imagick rdkafka \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

EXPOSE 9000
