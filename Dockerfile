FROM php:8.2-apache

# Installation de l'extension PDO MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Activation du module rewrite d'Apache (optionnel mais recommandé)
RUN a2enmod rewrite