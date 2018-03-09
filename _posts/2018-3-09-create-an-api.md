---
layout: post
title: How to create an API
category: anvil
description: Blacksmith's Project API
image: assets/images/pic10.jpg
---

###### You may need to read before... 
- [Setting up a new Symfony 4 project]({% post_url 2018-3-08-setup-sf4-project %})

## Basics:

#### What's an API ?

API means: "application programming interface", basically, it's an interface for other programms to use yours.

#### How does it work with Symfony ?

Well, basically, you're gonna need two things:

- create a route 
- create a controller (called when previous route is reached)
- return a `JsonResponse`

And... that's it !

##### Example:
###### `app/routes.yaml`
```yml
api_say_hello:
  path: /api/hello-world
  defaults: { _controller: App\Controller\HelloController::sayHello }
  methods: [GET]
```

###### `src/Controller/HelloController.php`
```php
class HelloController {
  public function sayHello(string $userId): JsonResponse
  {
    return new JsonResponse('Hello World!');
  }
}
```

You can now try it with something like [Insomnia](https://insomnia.rest/).