---
layout: page
title:
image: 
nav-menu: false
description: null
show_tile: false

---

![Covid19Header1](/assets/images/CVbarCovidHeader1.jpg) <br>

## Visualizing the COVID-19 virus in a matplotlib barchart race.


With a little more downtime during the lockdown I decided to see if I could make one of these bar chart races I have seen.  With COVID-19 
being such a hot topic I figured that finding and API to pull some good data from shouldn't be to tough so thats how the project began, a bar chart race on 
COVID-19.  I was not sure how or which programs or libraries were used to create this type of graph, not surprising there are a few out there.  
I found a couple websites that would generate a bar chart race with the right data, but I was more interested in the full development being all 
in Python, to my surprise I found that Matplotlib was a capable source and so it was an easy decision to try something new that I was not considering 
an option.

#### Necessary imports.
```
import pandas as pd
import numpy as np
import requests
import json
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import matplotlib.animation as animation
from IPython.display import HTML
```
#### Step 1: Pull in the COVID19.com API daily counts for world countries.
##### Requests | Json
```
response = requests.get('https://api.covid19api.com/all')
print(response.status_code)
covid_cs = response.json()
covid_countriessummary = pd.json_normalize(covid_cs)
```
```
print(covid_countriessummary.shape)
covid_countriessummary.head()
```
![Covid19BarRace](/assets/images/CVbar1.png) <br>
(COVID-19 API data frame.)

#### Step 2: Clean and rework the data.
##### Groupby
```
df = covid_countriessummary.copy()
```
```
df['Date'] = df['Date'].str[:10]
df = df.rename(columns={'CountryCode': 'Code'})
df = df.drop(columns=['Province', 'City', 'CityCode', 'Active', 'Lat', 'Lon'])
df = df[['Date', 'Country', 'Code', 'Confirmed', 'Recovered', 'Deaths']]
df = df.groupby(['Date', 'Country', 'Code']).agg({'Confirmed':'sum', 'Deaths': 'sum', 'Recovered': 'sum'}).reset_index()
```
```
print(df.shape)
df.head()
```
![Covid19BarRace](/assets/images/CVbar2.png) <br>
(Reworked data frame.)

#### Step 3: Filter to keep the top 20 countries with the highest deceased counts.
```
yesterday = df['Date'].iloc[-1]
df1 = (df[df['Date'].eq(yesterday)].sort_values(by='Deaths', ascending=False).head(20))

countries = df1['Country'].unique()
df = df[df['Country'].isin(countries)]
```
```
print(df.shape)
df.head(20)
```
![Covid19BarRace](/assets/images/CVbar3.png) <br>
(Top 20 countries.)

#### Step 4: Set colors for the top countries.
```
countrycodes = df1['Code'].to_list()
colors = dict(zip(
    (countrycodes),
    ['#2f61eb', '#ffb3ff', '#90d595', '#e48381', '#aafbff',
     '#3feb2f', '#f01b0c', '#aabbf2', '#de16ac', '#a36794', 
     '#8adbac', '#eef20c', '#ebcc8a', '#e48381', '#f26e0a', 
     '#0f5c2f', '#c79322', '#ebb48a', '#f28d7e', '#ab3422',
     '#b2de83']
    ))
group_lk = df1.set_index('Country')['Code'].to_dict()
```

#### Step 5: Create a function to facilitate the data, parameters, and design of the graph.
##### Matplotlib | barchart
```
def draw_barchart(datetime):
    df1 = df[df['Date'].eq(datetime)].sort_values(by='Deaths', ascending=True).tail(20)
    ax.clear()
    ax.barh(df1['Country'], df1['Deaths'], color=[colors[group_lk[x]] for x in df1['Country']])
    dx = df1['Deaths'].max() / 200
    for i, (Deaths, Country) in enumerate(zip(df1['Deaths'], df1['Country'])):
        ax.text(Deaths-dx, i-.32, Country, size=14, weight=600, ha='right', va='bottom')
        ax.text(Deaths+dx, i, f'{Deaths:,.0f}', size=14, ha='left', va='center')
    ax.text(1, 0.4, datetime, transform=ax.transAxes, color='#777777', size=46, ha='right', weight=800)
    ax.text(0, 1.06, 'Death Cases (COVID-19)', transform=ax.transAxes, size=12, color='#777777')
    ax.xaxis.set_major_formatter(ticker.StrMethodFormatter('{x:,.0f}'))
    ax.xaxis.set_ticks_position('top')
    ax.tick_params(axis='x', colors='#777777', labelsize=12)
    ax.set_yticks([])
    ax.margins(0, 0.01)
    ax.grid(which='major', axis='x', linestyle='-')
    ax.set_axisbelow(True)
    ax.set_facecolor('#3e3f42')
    fig.set_facecolor('#3e3f42')
    ax.text(0, 1.12, 'COVID-19 Total Deaths by Country | Top 20',
            transform=ax.transAxes, size=24, weight=600, ha='left')
    ax.text(1, 0, 'by Charles Vanchieri; credit @cvnachieri', transform=ax.transAxes, ha='right',
            color='#777777', bbox=dict(facecolor='white', alpha=0.8, edgecolor='white'))
    plt.box(False)
```
```
fig, ax = plt.subplots(figsize=(15, 8))   
draw_barchart(yesterday)
```
![Covid19BarRace](/assets/images/CVbar4.png) <br>
(Barchart 2020-04-30 example.)

#### Step 6: create the animation.
##### FuncAnimation
```
%%capture
plt.rcParams['animation.html'] = 'jshtml'
time = list(df['Date'].unique())
fig, ax = plt.subplots(figsize=(18, 10)) 
animator = animation.FuncAnimation(fig, draw_barchart, frames=(time), interval=250)
```
```
HTML(animator.to_html5_video())
```
![Covid19BarRace](/assets/images/CVbar5.png) <br>
(Simplest way I found to create a downloadable video)


#### Summary
I had seen a few of these bar chart race graphs floating around but I was unsure of what programs or libraries that were necessary 
to create one.  I was surprised to find out that Matplotlib was a resource for this type of animated graph, I was under the impression
that Matplotlib was a more basic visualization library and I did not consider this 'basic' looking.  My overall take away was that 
Matplotlib is more creative and useful than I had first thought, the graph is fun to look and it wasn't a big pain to put together either 
surprisingly.  If you have overlooked Matplotlib I'd consider digging into a little bit there are some gems hidden in there.

Any suggestions or feedback is greatly appreciated, I am still learning and am always open to suggestions and comments.

GitHub file 
[Link]({{'https://github.com/CVanchieri/CVanchieri.github.io/blob/master/_data/MatplotlibCOVID19BarChartRacePost/MatplotlibCOVID19BarChartRace.ipynb'}})




---
[[<< Back]](https://cvanchieri.github.io/DSPortfolio/d_visualizations.html)

