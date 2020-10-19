---
layout: page
title:
image: 
nav-menu: false
description: null

---

![NLP](/assets/images/nlp.jpg) <br>

## Using natural language processing to query similar Yelp reviews by reviews text.

---

The goal here is to use create a fake review and then use Natural Language Processing on the text of the reivew to query similar reviews within the given Yelp data set. 

#### Necessary imports.
```
import pandas as pd
import re
import spacy 
from spacy.tokenizer import Tokenizer
from collections import Counter
import squarify
import matplotlib.pyplot as plt
from sklearn.neighbors import NearestNeighbors
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from gensim.models import LdaMulticore
from gensim.corpora import Dictionary
from gensim import corpora
import pyLDAvis
import pyLDAvis.gensim
import seaborn as sns
from gensim.models.coherencemodel import CoherenceModel
```

#### Step 1: Read in the JSON file and got a visual of the data frame being worked with.
##### Pandas 
```
yelp = pd.read_json('review_sample.json', lines=True)
yelp = yelp[['business_id', 'review_id', 'text', 'cool', 'funny', 'useful', 'stars']]
```
```
print(yelp.shape)
yelp.head()
```
![yelp](/assets/images/yelp1.png) <br>
(Yelp data frame.)

#### Step 2: Clean up the text from the data frame reviews.
##### Regex
```
yelp['text'] = yelp['text'].apply(lambda x: re.sub(r'[^a-zA-Z ^0-9]', '', x))
yelp['text'] = yelp['text'].apply(lambda x: re.sub(r'(x.[0-9])', '', x))
yelp['text'] = yelp['text'].replace('/', ' ') 
yelp['text'] = yelp['text'].apply(lambda x: re.sub('  ', ' ', x))
yelp['text'] = yelp['text'].apply(lambda x: x.lower())
```

#### Step 3: Create a list of tokens from the reviews text and add to the data frame.
##### Spacy | Tokenizer | Stop Words | Lemmatize
```
df = yelp.copy()
```
```
nlp = spacy.load("en_core_web_lg")
# set the tokenizer on nlp.vocab.
tokenizer = Tokenizer(nlp.vocab)
```
```
STOP_WORDS = nlp.Defaults.stop_words
```
```
tokens = []
for doc in tokenizer.pipe(df['text'], batch_size=500):
    doc_tokens = []
    for token in doc:
        if (token.lemma_ not in STOP_WORDS) & (token.text != ' '):
            doc_tokens.append(token.lemma_)
    tokens.append(doc_tokens)
```
```
df['tokens'] = tokens
df['tokens'].head()
```
![yelp](/assets/images/yelp2.png) <br>
(Review tokens.)

#### Step 4: Find the top words in the tokens.
##### Counter | Squarify
```
def count(docs):
        word_counts = Counter()
        appears_in = Counter()
        total_docs = len(docs)

        for doc in docs:
            word_counts.update(doc)
            appears_in.update(set(doc))
            
        temp = zip(word_counts.keys(), word_counts.values())       
        wc = pd.DataFrame(temp, columns = ['word', 'count'])
        wc['rank'] = wc['count'].rank(method='first', ascending=False)
        total = wc['count'].sum()
        wc['pct_total'] = wc['count'].apply(lambda x: x / total)       
        wc = wc.sort_values(by='rank')
        wc['cul_pct_total'] = wc['pct_total'].cumsum()
        t2 = zip(appears_in.keys(), appears_in.values())
        ac = pd.DataFrame(t2, columns=['word', 'appears_in'])
        wc = ac.merge(wc, on='word')
        wc['appears_in_pct'] = wc['appears_in'].apply(lambda x: x / total_docs)
        
        return wc.sort_values(by='rank')
```
```
wordcount = count(df['tokens'])
wordcount.head(10)
```
![yelp](/assets/images/yelp3.png) <br>
(Top 10 used words.)

``` 
wordcount_top40 = wordcount[wordcount['rank'] <= 40]
squarify.plot(sizes=wordcount_top40['pct_total'], label=wordcount_top40['word'], alpha=.8 )
plt.axis('off')
plt.show()
```
![yelp](/assets/images/yelp4.png) <br>
(Squarify plot top 40 used words.)

#### Step 5: Find the 10 most simliar reviews to a fake review.
##### Vector | Nearest Neighbors
```
vects = [nlp(doc).vector for doc in df['text']]
nn = NearestNeighbors(n_neighbors=10, algorithm='ball_tree')
nn.fit(vects)
```
```
created_review = '''
I love the gluten free food options and the service was really quick too!
'''
```
```
created_review_vect = nlp(created_review).vector
most_similiar = nn.kneighbors([created_review_vect])
```
```
yelp.iloc[most_similiar[1][0]]['text']
```
![yelp](/assets/images/yelp5.png) <br>
(10 similar reviews.)

#### Step 6: Create a star with a prediction model on the reviews text.
##### TfidVectorizer | RandomForestClassifier | GridSearchCV
```
vect = TfidfVectorizer(stop_words=STOP_WORDS)
rfc = RandomForestClassifier()
```
```
pipe = Pipeline([
                 ('vect', vect),
                 ('clf', rfc)                
                ])
```
```
parameters = {
    'vect__max_df': ( 0.5, 0.75, 1.0, 1.25, 1.50),
    'vect__min_df': (.01, .03, .05, .07, .09)
    }
grid_search = GridSearchCV(pipe, parameters, cv=5, n_jobs=-1, verbose=1)
grid_search.fit(df['text'], df['stars'])
```
```
grid_search.best_score_
```
![yelp](/assets/images/yelp6.png) <br>
(The goal was 51% and above.)

#### Step 7: Create a data frame of topics genereated the review tokens.
##### Corpora | ldaaMulticore 
```
id2word = corpora.Dictionary(tokens)
id2word.filter_extremes(no_below=5, no_above=0.95)

```
```
corpus = [id2word.doc2bow(text) for text in tokens]
lda = LdaMulticore(corpus=corpus,
                   id2word=id2word,
                   iterations=5,
                   workers=4,
                   num_topics = 20
                  )
words = [re.findall(r'"([^"]*)"',t[1]) for t in lda.print_topics()]
titles = df['text']
topics = [' '.join(t[0:5]).strip().replace('\n', '') for t in words]                  
```
```
print(topics)
```
![yelp](/assets/images/yelp8.png) <br>
(Created topics.)

```
distro = [lda[d] for d in corpus]
def update(doc):
        d_dist = {k:0 for k in range(0,14)}
        for t in doc:
            d_dist[t[0]] = t[1]
        return d_dist
new_distro = [update(d) for d in distro]
```
```
new_df = pd.DataFrame.from_records(new_distro, index=yelp.index)
new_df.columns = topics
new_df['stars'] = yelp['stars']
```
```
new_df.head()
```
![yelp](/assets/images/yelp9.png) <br>
(Topics data frame.)

#### Step 8: Visualize the most relevent terms in each topic.
##### pyLDAvis
```
pyLDAvis.enable_notebook()
pyLDAvis.gensim.prepare(lda, corpus, id2word)
```
![yelp](/assets/images/yelp10.png) <br>
(Most relevent terms in each topic.)

#### Summary
The goal was to tokenize the yelp review data, query the most similar yelp reviews to the fake review created, create a classification model to give the fake review a star rating, and implement topic modeling.
I was very happy with my first go at NLP and the overall experience, I would consider it a success. I look forward to digging deeper and learning more.

Any suggestions or feedback is greatly appreciated, I am still learning and am always open to suggestions and comments.

GitHub file
[Link]({{'https://github.com/CVanchieri/CVanchieri.github.io/blob/master/_data/YelpNLPQueryReviewsPost/YelpNLPQueryReviewsPost.ipynb'}})






---
[[<< Back]](https://cvanchieri.github.io/DSPortfolio/a_machinelearning.html)
