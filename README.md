# MusicClassification

## Topic
Music Classification

## Reason for Topic
Music is cool. There are different files for music and visuals that 
are interesting to categorize by genre and train a machine learning model
to classify this data set, and we further plan to create visualizations
illustrating data relationships.

## Description of data
The data comes from the GTZAN Genre collection used in the paper "Musical
genre classification of audio signals" by G. Tzanetakis and P. Cook. It
contains `.wav` audio files, Mel Spectrogram images as `.png` files, and two
`.csv` files containing statistical features of the songs such as average
tempo, rms chromatic shift, etc, over a three second and 30 second sample.
There are over 9990 songs in this data set.

## Question we hope to answer
Given the variety of data, we will compare methods for classifying music. The
first method will be classifiying the genre of audio files based on numerical
features using machine learning, the second method classifying genres based on
the Mel Spectrogram image files, and the third method classifiying genres from
the raw `.wav` audio files.

## Communication Protocols
- Always commit work to personal branch.
- Once personal branch is ready for merging with main, create pull request,
and choose at least one person to review.

## Database Usage
### Mongo Interface
To launch and load data into a MongoDB database, use the following steps
(MacOS):

1) Install MongoDB using Homebrew by following the appropriate section of its
[installation instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/):
2) Check successful installation:
```
$ brew services list
Name              Status  User Plist
mongodb-community stopped
```
3) Start `mongdb-community` service:
```
$ brew services start mongodb-community
==> Successfully started `mongodb-community` (label: homebrew.mxcl.mongodb-community)
```
4) Launch MongoDB shell:
```
$ mongo
```
3) Create new MongoDB database using the mongo shell:
```
> use Music_db
```
4) Exit the mongo shell using `<CTRL+D>`.
5) Add the `.csv` file to the database using `mongofiles` and the data file's
relative path:
```
$ mongofiles -d=Music_db put features_3_sec.csv
2021-04-17T12:20:11.546-0700	connected to: mongodb://localhost/
2021-04-17T12:20:11.547-0700	adding gridFile: features_3_sec.csv

2021-04-17T12:20:11.849-0700	added gridFile: features_3_sec.csv
```
6) Ensure successful storage in the database from the command line:
```
$ mongofiles -d=Music_db list
2021-04-17T12:22:58.153-0700	connected to: mongodb://localhost/
features_3_sec.csv	1071
```
7) Check file storage within the mongo shell:
```
$ mongo
> use Music_db
> show collections
fs.chunks
fs.files
> db.fs.files.find()
{ "_id" : ObjectId("607b34eb92ce0e4b44de0138"), "length" : NumberLong(10713), "chunkSize" : 261120, "uploadDate" : ISODate("2021-04-17T19:20:11.849Z"), "filename" : "features_3_sec.csv", "metadata" : {  } }
```

### Python Interface
1) Read in the file einto a jupyter notebook from Mongodb database using
`pymongo.MongoClient`, then instantiate the database:
```
from pymongo import MongoClient
client = MongoClient()
db = client["Music_db"]
```
2) Create a GridFS file instance and get the last version of the input file:
```
import gridfs
fs = gridfs.GridFS(db)
features_raw = fs.get_last_version(infile)  # infile = value for "filename" key in output of db.fs.files.find() above
bytes_string = features_raw.read()
```
3) Convert byte string returned by `features_raw.read()` into a regular
string: using `.decode("utf-8")`:
```
data_string = bytes_string.decode("utf-8")
``` 
4) Read converted string into a pandas dataframe using `pd.read_csv`:
```
from io import StringIO
import pandas as pd
data_string_IO = StringIO(data_string)
features_df = pd.read_csv(data_string_IO)
``` 

## Machine Learning Model
We first classify music genres by training various machine learning models on
the statistical features of each song taken over a three second sample in
[`features_3_sec.csv`](Data_Sample/features_3_sec.csv). This sample contains
9990 songs eaching belonging to one of ten genres (our target classes). After
initial training with minimal hyper-parameter tuning, we obtain the following
results:
- `sklearn.tree.DecisionTreeClassifier()`: 63% accuracy
- `sklearn.neighbors.KNeigborsClassifier(n_neighbors=21)`: 28% accuracy
- `sklearn.naive_bayes.GaussianNB()`: 43% accuracy
- `sklearn.ensemble.RandomForestClassifier()`: 88% accuracy
