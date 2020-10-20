---
layout: page
title:
image: 
nav-menu: false
description: null
show_tile: false

---

![LiverpoolFootballClub](/assets/images/LPFCTeam.png) <br>
## Making game predictions for the Liverpool Premier League 2020 season with a Random Forest Classifier.

Soccer has always been a predominant piece of my life whether it has been playing competitively or just watching 
and following my favorite football club Liverpool.  The English Premier League is where Liverpool Football Club competes 
and is one of the most reputable football leagues in the world spanning nearly 9 months starting in August and ending in May.

#### Necessary imports.
```
%matplotlib inline
import pandas as pd 
import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
from sklearn.utils.multiclass import unique_labels
from sklearn.metrics import classification_report
import eli5
from eli5.sklearn import PermutationImportance
from sklearn.pipeline import make_pipeline
import category_encoders as ce
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
```

#### Step 1: Read in the 27 seasons of Liverpool FC data.
#### Pandas 
```
LPFC = pd.read_csv('https://raw.githubusercontent.com/CVanchieri/LSDS-DataSets/master/
                    EnglishPremierLeagueData/LiverpoolFootballClubData_EPL.csv')
```
```
print(LPFC.shape)
LPFC.head()
```
![LiverpoolFootballClub](/assets/images/LPFC1.png){: .center-block :}

#### Step 2: Clean and rework the data to what is needed.
```
columns = ["Div", "Date", "HomeTeam", "AwayTeam", "FTHG", "FTAG", "FTR", 
           "HTHG", "HTAG", "HTR", "HS", "AS", "HST", "AST", "HHW", "AHW", 
           "HC", "AC", "HF", "AF", "HO", "AO", "HY", "AY", "HR", "AR", "HBP", "ABP"]
LPFC = LPFC[columns]
LPFC = LPFC.rename(columns={"Div": "Division", "Date": "GameDate", "FTHG": "FullTimeHomeGoals", "FTAG": "FullTimeAwayGoals", 
                            "FTR": "FullTimeResult", "HTHG": "HalfTimeHomeGoals", "HTAG":"HalfTimeAwayGoals", "HTR": "HalfTimeResult", 
                            "HS": "HomeShots", "AS": "AwayShots", "HST": "HomeShotsOnTarget", "AST": "AwayShotsOnTarget", 
                            "HHW": "HomeShotsHitFrame", "AHW": "AwayShotsHitFrame", "HC": "HomeCorners", "AC": "AwayCorners", 
                            "HF": "HomeFouls", "AF": "AwayFouls", "HO": "HomeOffSides", "AO": "AwayOffSides", "HY": "HomeYellowCards",
                            "AY": "AwayYellowCards", "HR": "HomeRedCards", "AR": "AwayRedCards", "HBP":"HomeBookingPoints_Y5_R10",
                            "HomeBookingPoints_Y5_R10","ABP": "AwayBookingPoints_Y5_R10"})

```
```
print(LPFC.shape)
LPFC.head()
```
![LiverpoolFootballClub](/assets/images/LPFC2.png) <br>
(1993-2019 premier league dataframe.)

#### Step 3: Find the majority baseline to get started.
#### Accuracy Score
```
target = LPFC['FullTimeResult']
majority_class = target.mode()[0]
y_pred = [majority_class] * len(target)
ac = accuracy_score(target, y_pred)
```
```
print("'Majority Baseline' Accuracy Score =", ac)
```
![LiverpoolFootballClub](/assets/images/LPFC3.png) <br>
(Baseline accuracy score)

#### Step 4: import 2019-2020 premier league schedule for test data.
#### Pandas
```
train = LPFC.copy()
test = pd.read_csv('https://raw.githubusercontent.com/CVanchieri/LSDS-DataSets/master/EnglishPremierLeagueData
                    /LiverpoolFootballClubEPL_Schedule.csv')
test['Division'] = test['Division'].astype(object)
test['HalfTimeResult'] = test['HalfTimeResult'].astype(object)
test['FullTimeResult'] = test['FullTimeResult'].astype(object)
```
```
print(test)
```
![LiverpoolFootballClub](/assets/images/LPFC4.png) <br>

#### Step 5: Train val split for train data.
##### Train Test Split

```
train, val = train_test_split(train, train_size=0.80, test_size=0.20,
                              random_state=42)
```
```
print("train =", train.shape, "val =", val.shape, "test =", test.shape)
```
![LiverpoolFootballClub](/assets/images/LPFC5.png) <br>

#### Step 6: Wrangle function to adjust data.
##### Datetime
```
def wrangle(X):
    """Wrangle train, validate, and test sets in the same way"""

    X = X.copy()
    X['HalfTimeResult'] = X['HalfTimeResult'].replace({'H':'Home', 'A': 'Away', 'D': 'Tied'})   
    X['FullTimeResult'] = X['FullTimeResult'].replace({'H':'Home', 'A': 'Away', 'D': 'Tied'})   
    X['GameDate'] = pd.to_datetime(X['GameDate'], infer_datetime_format=True) 
    X['YearOfGame'] = X['GameDate'].dt.year
    X['MonthOfGame'] = X['GameDate'].dt.month
    X['DayOfGame'] = X['GameDate'].dt.day
    dropped_columns = ['FullTimeHomeGoals', 'FullTimeAwayGoals', 'Division']
    X = X.drop(columns=dropped_columns)
    return X
```
```
train = wrangle(train)
val = wrangle(val)
test = wrangle(test)
```
#### Step 7: Apply some feature engineering.
```
train_id = train['GameDate']
val_id = val['GameDate']
test_id = test['GameDate']
```
```
target = 'FullTimeResult'
train_features = train.drop(columns=[target])
numeric_features = train_features.select_dtypes(include='number').columns.tolist()
cardinality = train_features.select_dtypes(exclude='number').nunique()
categorical_features = cardinality[cardinality <= 300].index.tolist()
features = numeric_features + categorical_features
X_train = train[features]
y_train = train[target]
X_val = val[features]
y_val = val[target]
X_test = test[features]
y_test = test[target]
```
```
print("train =", train.shape, "val =", val.shape, "test =", test.shape)
```
![LiverpoolFootballClub](/assets/images/LPFC6.png) <br>

#### Step 8: 1st RandomForestClassifier Model.
```
transformers = make_pipeline(
    ce.OrdinalEncoder(),
    SimpleImputer(strategy='median'), 
    StandardScaler())   
X_train_transformed = transformers.fit_transform(X_train)
X_val_transformed = transformers.fit_transform(X_val)
X_test_transformed = transformers.fit_transform(X_test)
model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train_transformed, y_train)
```
```
print ('Train Accuracy', model.score(X_train_transformed, y_train))
print ('Validation Accuracy', model.score(X_val_transformed, y_val))
```
![LiverpoolFootballClub](/assets/images/LPFC7.png) <br>

#### Step 9: Check the features importance and remove below 0.
#### Permutation Importance
```
permuter = PermutationImportance(
    model, 
    scoring='accuracy',
    n_iter=5,
    random_state=42)
permuter.fit(X_val_transformed, y_val)
feature_names = X_val.columns.tolist()
```
```
eli5.show_weights(
    permuter,
    top=None,
    feature_names = feature_names)
```
![LiverpoolFootballClub](/assets/images/LPFC8.png) <br>

#### Step 10: 2nd RandomForestClassifier Model.
```
model = make_pipeline(
    ce.OrdinalEncoder(), 
    SimpleImputer(strategy='median'),
    StandardScaler(),
    RandomForestClassifier(max_depth=9, n_estimators=300, random_state=42, n_jobs=-1))    
model.fit(X_train, y_train)
val_pred = model.predict(X_val)
test_pred = model.predict(X_test)
```
```
print ('Train Accuracy', model.score(X_train, y_train))
print ('Validation Accuracy', model.score(X_val, y_val))
```
![LiverpoolFootballClub](/assets/images/LPFC9.png) <br>

#### Step 11: Check multiple scores.
#### Classification Report
```
print(classification_report(y_val, val_pred))
```
![LiverpoolFootballClub]/assets/images/LPFC10.png) <br>
(Precision, recall, f1 scores.)

#### Step 12: Check the importances of the features.
##### Pandas
```
rf = model.named_steps['randomforestclassifier']
importances = pd.Series(rf.feature_importances_, X_val.columns)
n = 20
plt.figure(figsize=(10,n/2))
plt.title(f'Top Features')
```
```
importances.sort_values()[-n:].plot.barh(color='red');
```
![LiverpoolFootballClub](/assets/images/LPFC11.png) <br>

#### Step 13: Merge the train and test data sets.
```
val_predictions = pd.DataFrame({
    'GameDate': val_id, 
    'prediction': val_pred, 
    'Actual': y_val})
val_predictions = val_predictions.merge( 
     val[['GameDate', 'HomeTeam', 'AwayTeam']],
     how='left')
```
```
print(val_predictions.shape)
val_predictions.head()
```
![LiverpoolFootballClub](/assets/images/LPFC12.png) <br>

#### Step 14: A confusion matrix heatmap for overall predictions.
```
def plot_confusion_matrix(y_true, y_pred):
    labels = unique_labels(y_true)
    columns = [f'Predicted {label}' for label in labels]
    index = [f'Actual {label}' for label in labels]
    table = pd.DataFrame(confusion_matrix(y_true, y_pred), 
                         columns=columns, index=index)
    return sns.heatmap(table, annot=True, fmt='d', cmap='viridis')
```
```
plot_confusion_matrix(y_val, val_pred);
plt.figure(figsize=(40,20))
```
![LiverpoolFootballClub](/assets/images/LPFC13.png) <br>
(Confusion matrix for predictions.)

#### Step 15: Final predictions for the 2020 season.
```
test_predictions = pd.DataFrame({
    'GameDate': test_id, 
    'prediction': test_pred, 
    'Actual': y_test})
test_predictions = test_predictions.merge(
     test[['GameDate', 'HomeTeam', 'AwayTeam']], 
     how='left')
```
```
test_final = test_predictions.sort_values('GameDate')
test_final.head(30)
```
![LiverpoolFootballClub](/assets/images/LPFC14.png) <br>

#### Summary
In all I believe feature engineering is the most important part to this specific data set and model. With only having in-match 
statistics there are many important variables that are just not accounted for like, weather, team roster, injury reports just to 
state a few. I came across something called FeatureTools that supposedly assists in automated feature engineering that I plan to dive 
deeper into and hopefully be able to incorporate into this project in the near future.

GitHub file:
[Link]({{'https://github.com/CVanchieri/CVanchieri.github.io/blob/master/_data/EnglishPremierLeagueBlogPost/EnglishPremierLeague_RandomForestModel.ipynb'}})




---
[[<< Back]](https://cvanchieri.github.io/DSPortfolio/d_visualizations.html)

 
