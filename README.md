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
tempo, rms chromatic shift, etc, over three second and 30 second samples.
The data set as a whole contains 1000 songs processed as follows:
[1000 wave files](Data/genres_original),
[999 Mel Spectrogram images](Data/images_original),
[1000 samples of statistical features from 30 second song samples](Data/features_30_sec.csv),
and [9990 samples statistical features from 3 second song sample](Data/features_3_sec.csv).

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
[installation instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

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

5) Create new MongoDB database using the mongo shell:
```
> use Music_db
```

6) Exit the mongo shell using `<CTRL+D>`.

#### Automatic Data Loading
7) Automatic population of the database `Music_db` created in steps 1-4 is
accomplished by opening and running all cells in the Jupyter Notebook
`Load_Data.ipynb`.

#### Optional Manual Data Loading
Alternatively, one can manually load data into `Music_db` as follows: For CSV Data:
```
$ mongoimport -d <database_name> -c <collection_name> --type csv --file <path_to_csv_file> --headerline
```
And for the image/wave data:
```
$ mongofiles -d=<database_name> put <path_to_png_or_wav_file>
```
If loading data manually, ensure to update `config.py` with the chosen
database and collection. Also note that `mongofiles` will set the `filename`
field of each document in the GridFS `fs.files` collection to the
`<path_to_png_or_wav_file>`. One should therefore run the `mongofiles` command
from the root of this repository since this relative path is used to extract
the data from MongoDB in `Music_Classification.ipynb`.

8) Check image and wave file storage from the command line:
```
$ mongofiles -d=Music_db list
2021-04-17T12:22:58.153-0700	connected to: mongodb://localhost/
Data/genres_original/blues/blues.00000.wav	1323632
Data/genres_original/blues/blues.00001.wav	1323632
Data/genres_original/blues/blues.00002.wav	1323632
...
Data/images_original/blues/blues00000.png	62497
Data/images_original/blues/blues00001.png	44518
Data/images_original/blues/blues00002.png	80395
...
```

9) Check all data storage within the mongo shell:
```
$ mongo
> use Music_db
switched to db Music_db
> show collections
feat_3
feat_30
fs.chunks
fs.files
> db.fs.files.find()
{ "_id" : ObjectId("608f7c89d7c281d7d5f7d3ec"), "length" : NumberLong(1323632), "chunkSize" : 261120, "uploadDate" : ISODate("2021-05-03T04:31:05.605Z"), "filename" : "Data/genres_original/blues/blues.00000.wav", "metadata" : {  } }
{ "_id" : ObjectId("608f7c89a4de02e5c8b987fd"), "length" : NumberLong(1323632), "chunkSize" : 261120, "uploadDate" : ISODate("2021-05-03T04:31:05.686Z"), "filename" : "Data/genres_original/blues/blues.00001.wav", "metadata" : {  } }
...
```

### Python Interface
1) Read in the CSV into a jupyter notebook from MongoDB database using
`pymongo.MongoClient`, then instantiate the database:
```
from pymongo import MongoClient
from config import DB_NAME, FEAT_3_COLLECTION_NAME
client = MongoClient("localhost")
db = client[DB_NAME]
collection = db[FEAT_3_COLLECTION_NAME].find()
features_3_df = pd.DataFrame(list(collection))
features_3_df = features_3_df.drop(columns = ["_id"])
```
with a similar process for the 30 second sample features.

2) Create a GridFS file instance and get load the image files:
```
import gridfs
cwd_bytes = subprocess.check_output("pwd")
cwd = cwd_bytes.decode("utf-8").rstrip("\n") + "/"
# identify path for images
images_path = "Data/images_original/"
byte_images = subprocess.check_output(["ls", cwd + images_path])
images_folder = byte_images.decode("utf-8").split("\n")
images_folder.pop(-1)

fs = gridfs.GridFS(db)

images = []
genres = []

for folder in images_folder:
    # Get files in each image-genre folder
    byte_files = subprocess.check_output(["ls", cwd + images_path + folder])
    files = byte_files.decode("utf-8").split("\n")
    files.pop(-1)
    
    for file in files:
        # Load image using its relative path as its GridFS identifier
        file_path = images_path + folder + "/" + file
        image_raw = fs.get_last_version(file_path)
        image_bytes = image_raw.read()
        rgba_image = Image.open(io.BytesIO(image_bytes))
        rgb_image = rgba_image.convert("RGB")
        gray_image = ImageOps.grayscale(rgb_image)
        image_data = np.asarray(gray_image)
        images.append(image_data)
        genres.append(folder)
```

## Machine Learning Model
We first classify music genres by training various machine learning models on
the statistical features of each song taken over a three second sample in
[`features_3_sec.csv`](Data_Sample/features_3_sec.csv). This sample contains
9990 songs eaching belonging to one of ten genres (our target classes).

### Data Preprocessing:
- Drop unnecessary identification columns `_id` and `filename` along with
`length` which is constant for all samples.
- Separate feature data from target genre label.
- Convert categorical genre target labels to integers 0 through 9.
- Split data in 75% training and 25% testing using
`sklearn.model_selection.train_test_split`.
- Explore the following Models
    - DecisionTreeClassifier
    - KNeighborsClassifier
    - GaussianNB
    - RandomForestClassifier

After initial training with minimal hyper-parameter tuning, we obtain the following
results:
- `sklearn.tree.DecisionTreeClassifier()`: 63% accuracy
- `sklearn.neighbors.KNeigborsClassifier(n_neighbors=21)`: 28% accuracy
- `sklearn.naive_bayes.GaussianNB()`: 43% accuracy
- `sklearn.ensemble.RandomForestClassifier()`: 88% accuracy

## Neural Network Model
We next define a deep layer neural network to classify music genres from the
Mel Spectrogram images following
[How to train neural networks for image classification - Part 1](https://medium.com/nerd-for-tech/how-to-train-neural-networks-for-image-classification-part-1-21327fe1cc1)
as an example.

### Data Preprocessing
- Convert RGBA images to RGB and then to Grayscale.
- Convert categorical genre labels to integers 0 through 9.

We then define a Sequential Model with the following
architecture and parameters:
- Input layer with 124416 inputs (image_width * image_height = 288 * 432)
- One Dense layer with 300 nodes follwed by four Dense layers with 100 nodes
each
- Ouput layer with 10 output nodes for the 10 music genres to classify
- `relu` activation function at each hidden layer
- `softmax` activation function at outputer layer
- `sparse_categorical_crossentropy` loss function
- `sgd` optimizer
- `accuracy` metric

Results:
- Testing Loss: 1.8947
- Testing Accuracy: 29%

## Google Slides Presentation
https://docs.google.com/presentation/d/1mtLgLnwL2p8m_hOIKtAYMIkNlP1axNtIMz0xgWbGiqM/edit?usp=sharing
