---
layout: post
title:  "Vacation Calculator"
date:   2017-02-11 
categories: Python
---
{% highlight ruby %}

def hotel_cost(nights):
    return nights * 140

def plane_ride_cost(city):
    if city == "Charlotte":
        return 183
    if city == "Tampa":
        return 220
    if city == "Pittsburgh":
        return 222
    if city == "Los Angeles":
        return 475
        
def rental_car_cost(days):
    if days >= 7:
        return ((days * 40) - 50)
    elif (days >= 3) and (days < 7):
        return ((days * 40) - 20)
    elif days < 3:
        return days * 40
        
def trip_cost(city,days,spending_money):
    return rental_car_cost(days) + hotel_cost(days) + plane_ride_cost(city) + spending_money
 
print trip_cost("Los Angeles",5,600)

{% endhighlight %}
