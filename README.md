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
To store Data into MongoDB, run Load_Data.ipynb.
Load_Data.ipynb uses the ‘subprocess’ and ‘os’ libraries to run the necessary mongo commands in the terminal.
```
# For both genres and images folders: list all files
# in each folder. Add to python list, iterate through this list,
# put in mongodatabase using mongofiles

for folder in genre_folder:
    byte_files = subprocess.check_output(["ls", cwd + genres_path + folder])
    files = byte_files.decode("utf-8").split("\n")
    files.pop(-1)

    for file in files:
        file_path = genres_path + folder + "/" + file
        os.system("mongofiles -d=Music_db put " + file_path)
        
for folder in images_folder:
    byte_files = subprocess.check_output(["ls", cwd + images_path + folder])
    files = byte_files.decode("utf-8").split("\n")
    files.pop(-1)

    for file in files:
        file_path = images_path + folder + "/" + file
        os.system("mongofiles -d=Music_db put " + file_path)
```
```
# Saves csv files as Mongodb collections
os.system(f"mongoimport -d Music_db -c feat_3 --type csv --file {features_3_path} --headerline")
os.system(f"mongoimport -d Music_db -c feat_30 --type csv --file {features_30_path} --headerline")
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

## Google Slides Presentation
https://docs.google.com/presentation/d/1mtLgLnwL2p8m_hOIKtAYMIkNlP1axNtIMz0xgWbGiqM/edit?usp=sharing
