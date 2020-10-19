---
layout: page
title:
image: 
nav-menu: false
description: null
show_tile: false

---

![AustraliaBushFiresHeader1](/assets/images/ABFHeader.jpg) <br>
## Using mapbox to display the 2019 Australia bush fires in a time series heatmap.

The massive fires that have been devastating Australia are of a big concern to everyone right now.  I saw an example of a heatmap the other day and I decided that I would give it a try to produce a heatmap using Mapbox to represents the bush fires in Australia.

#### Necessary imports.
```
import pandas as pd
import numpy as np
import plotly.graph_objects as go
```

#### Step 1: Read in the data on the 2019 bushfires in Australia.
```
fires = pd.read_csv('https://raw.githubusercontent.com/CVanchieri/DataSets/master/Labs/AustraliaBushFires
                    /australiabushfires.csv')
```
```
print(fires.shape)
fires.head()
```
![AustraliaBushFires](/assets/images/ABF1.png) <br>
(Bushfire data frame.)

#### Step 2: Set up the data for the heatmap.
##### Times Series | Frames Data | Controls 
```
times = fires.groupby(['acq_date'])['acq_date'].count().index.tolist()
frames_data = [fires.loc[fires['acq_date'] == t] for t in times]
frames = [go.Frame(data=[go.Densitymapbox(lat=f['latitude'], lon=f['longitude'], 
         z=f['brightness'], radius=10)], name=str(f.iloc[0]['acq_date'])) for f in frames_data]
buttons=[
         dict(label='Play',method='animate',args=[None, {'fromcurrent':True, 'transition': 
                                                        {'duration': 20, 'easing': 'quadratic-in-out'}}]),
         dict(label='Pause',method='animate',args=[[None], {'frame': {'duration': 0, 'redraw':False},
                                                            'mode': 'immediate', 'transition': {'duration': 0}}])
        ]
```
```
sliders_dict = {
    'active':0,
    'currentvalue': dict(font=dict(size=15), prefix='Time: ', visible=True),
    'transition': {'duration': 300, 'easing': 'cubic-in-out'},
    'x': 0,
    'steps': []
               }

for i,t in enumerate(times):
    slider_step = {"args": [
                        [t],
                        {'frame': {'duration': 300, 'redraw': False},    
                         'transition': {'duration': 30, 'easing': 'quadratic-in-out'}}
                    ],
            'label': t,
            'method': 'animate',
            'value': t
                   }
    sliders_dict['steps'].append(slider_step)
```

#### Step 3: Set the mapbox style, access token, and configure layout.
```
mapbox_style = 'style here'
mapbox_token = 'token here'
```
```
fig = go.Figure(data = [go.Densitymapbox(lat=fires['latitude'], 
                        lon=fires['longitude'],                              
                        z=fires['brightness'], 
                        radius=5, colorscale='Hot', zmax=300, zmin=0)],
                        
               layout=go.Layout(updatemenus[dict(type='buttons',buttons=buttons,showactive=True)] ), 
               frames=frames
                )
fig.update_layout(mapbox_style=mapbox_style, 
                  mapbox_accesstoken=mapbox_style,
                  mapbox_center_lon=135,
                  mapbox_center_lat=-25.34,
                  mapbox_zoom=3.5)
fig.update_layout(sliders=[sliders_dict],
                 title='Australia bush fires 09/01/2019 - 01/30/2020')
fig.update_layout(height=1000)
```
```
fig.show()
```
![AustraliaBushFires](/assets/images/ABF2.png) <br>
((Sample image of the time-series video.)

#### Summary
I had never used Mapbox prior to this prjoect and I only have a little experience with Plotly.  I am quite impressed with the simplicity in something that has alot of detailed options for mapping, Mapbox has a vast amount of little changes that can be made and implemented.  This was a fun visual to create on a topic that is very prominent and important to me.  I can definitely see Mapbox being used again in the future of my projects, visually entertaining maps and graphs are always something I keep an eye out for.

Any suggestions or feedback is greatly appreciated, I am still learning and am always open to suggestions and comments.

GitHub file
[Link]({{'https://github.com/CVanchieri/CVanchieri.github.io/blob/master/_data/AustraliaBushFiresMapBox/AustraliaBushFiresMapB%20oxHeatMap.ipynb'}})




---
[[<< Back]](https://cvanchieri.github.io/DSPortfolio/d_visualizations.html)
