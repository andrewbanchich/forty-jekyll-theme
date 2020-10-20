---
layout: page
title:
image: 
nav-menu: false
description: null
show_tile: false

---

![Covid19Header2](/assets/images/PLGCovidHeader2.jpg) <br>

## Visualizing the COVID-19 virus impact on the USA in a plotly line graph.

Line graphs are not always very engaging or eye catching on their own, I have been enjoying using Plotly to add a 
little bit of engagement with the user.  Plotly gives you easy ability to add data information into the graph that a 
user can find themselves and locate by engaging with the visualization.

#### Necessary imports.
```
import pandas as pd
import numpy as np
import requests
import json
import matplotlib.pyplot as plt
import plotly.graph_objs as go
import chart_studio.plotly as py
import plotly.offline
from plotly.offline import iplot, init_notebook_mode
```

#### Step 1: Pull in the COVID19.com API daily counts for world countries.
##### Requests | Json
```
response = requests.get'https://api.covid19api.com/all')
print(response.status_code)
covid_cs = response.json()
covid_countriessummary = pd.json_normalize(covid_cs)
```
```
print(covid_countriessummary.shape)
covid_countriessummary.head()
```
![Covid19LineGraph](/assets/images/PLG1.png) <br>
(COVID-19 daily dataframe.)

#### Step 2: Clean and filter the data for USA.
```
df = covid_countriessummary.copy()
```
```
df['Date'] = df['Date'].str[:10]
df = df.rename(columns={"CountryCode": "Code"})
df = df.drop(columns=['Province', 'City', 'CityCode', 'Active', 'Lat', 'Lon'])
df = df[['Date', 'Country', 'Code', 'Confirmed', 'Recovered', 'Deaths']]
df = df.groupby(['Date', 'Country', 'Code']).agg({'Confirmed':'sum', 
                                                  'Deaths': 'sum', 
                                                  'Recovered': 'sum'}).reset_index()
df = df[df['Country'] == 'United States of America']
df['ConDiff'] = df['Confirmed'].diff()
df['DeaDiff'] = df['Deaths'].diff()
df['RecDiff'] = df['Recovered'].diff()
df = df.fillna(0)
df['ConDiff'] = df['ConDiff'].astype(int)
df['DeaDiff'] = df['DeaDiff'].astype(int)
df['RecDiff'] = df['RecDiff'].astype(int)
```
```
print(df.shape)
df.head()
```
![Covid19LineGraph](/assets/images/PLG2.png) <br>
(Reworked data frame.)

#### Step 3: Function to configure the browser to display plotly charts properly.
##### IPython | Plotly
```
def configure_plotly_browser_state():
  import IPython
  display(IPython.core.display.HTML('''
        <script src='/static/components/requirejs/require.js'></script>
        <script>
          requirejs.config({
            paths: {
              base: '/static/base',
              plotly: 'https://cdn.plot.ly/plotly-latest.min.js?noext',
            },
          });
        </script>
        '''))
```

#### Step 4: Configure the data, design, and layout for the graph.
##### Scatter | Layout | Figure
```
configure_plotly_browser_state()
init_notebook_mode(connected=True)
trace0 = go.Scatter(
    x=df['Date'],
    y=list(df['ConDiff']),
    name='Daily New Cases',
    mode='lines+markers',
    line=dict(color='#5cb8e6', width = 3, dash= 'dot')
)
trace1 = go.Scatter(
    x=df['Date'],
    y=list(df['DeaDiff']),
    name='Daily Death Cases',
    mode='lines+markers',
    line=dict(color='#eb4034', width = 3, dash = 'dot'),
)
trace2 = go.Scatter(
    x=df['Date'],
    y=list(df['RecDiff']),
    name='Daily Recovered Cases',
    mode='lines+markers',
    line=dict(color='#42d65d', width = 3, dash = 'dot')
)
data = [trace0,trace1,trace2]
layout = go.Layout(title='USA COVID19 Numbers',
                  yaxis=dict(title='Daily Count', 
                              zeroline=False),
                  xaxis=dict(title="Date",
                              ),
                  margin=dict(l=20, r=20, t=75, b=20),
                  paper_bgcolor='whitesmoke',
                  autosize=False,
                  width=1000,
                  height=500                                    
                )                            
```
```
fig = go.Figure(data=data, layout=layout)
fig.show()
```
![Covid19LineGraph](/assets/images/PLG3.png) <br>
(Image of the graph.)

#### Summary
Just because its a 'line graph' does not mean its not useful and  or engaging.  A static graph may not be the best route 
to go but adding a little bit of data that the user can engage with can change everything.  Plotly is a big library and has 
plenty more complex beautiful charts and graphs but it also can present some of the more basic visualiation really well too.

Any suggestions or feedback is greatly appreciated, I am still learning and am always open to suggestions and comments.

GitHub file 
[Link]({{'https://github.com/CVanchieri/CVanchieri.github.io/blob/master/_data/PlotlyCOVID19LineGraphPost/PlotlyCovid19LineGraphPost.ipynb'}})




---
[[<< Back]](https://cvanchieri.github.io/DSPortfolio/d_visualizations.html)

