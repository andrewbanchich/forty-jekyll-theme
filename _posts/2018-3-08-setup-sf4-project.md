---
layout: post
title: Setting up a new Symfony 4 project
category: anvil
description: Blacksmith's Project API
image: assets/images/pic08.jpg
---

## The Librairies

- doctrine/doctrine-migrations-bundle (to handle migrations for the database)
- ramsey/uuid (allowing to use `uuid`)
- ramsey/uuid-doctrine (allowing to have a `uuid doctrine type`)
- myclabs/php-enum (allowing to use `Enums`)
- acelaya/doctrine-enum-type (allowing to have an `enum doctrine type`)
- nelmio/cors-bundle (allow to handle `Cross Origin Resource Sharing`)
- lexik/jwt-authentication-bundle (allow to use `Json Web Token`s)

For most of those libraries, config is self-handled, I didn't need to change anything, thanks to Symfony 4 and its recipes !

### Uuid
For now on, I decided to use `Uuid`'s instead of simple integer to identify my objects. `Uuid-doctrine` does not need specific configuration.

### Doctrine
I also wanted to use `Doctrine`, because I am used to it, and did not want to try too many things (I failed in that matter^^). The configuration part will come along an other Post, about how I create my Doctrine Entities.  

### Enum
Also, I am using `Enums` to define some status, because I found that having an object is more comfortable in the end than a simple constant. Some configuration will be needed to create `Enum Doctrine types`, but it will come along with an other post.  

### CORS
The `CORS Bundle` does not need changes in its config file, but you will need to update your `.env` file.

### JWT
The `Json Web Token Bundle` does not need changes in its config file, but you need to run some commands:
```console
mkdir var/jwt
openssl genrsa -out config/jwt/private.pem -aes256 4096
openssl rsa -pubout -in config/jwt/private.pem -out var/jwt/public.pem
```
You will also need to update your `.env` file.