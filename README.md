# MusicClassification

## Topic
Music Classification

## Reason for Topic
Music is interesting, and we would like to compare classification techniques
using machine learning and neural network models trained on song statistical
features and Mel Spectrogram images.

## Description of Data
The data originates from the
[GTZAN Genre collection](http://marsyas.info/downloads/datasets.html) and
contains 1000 songs from 10 genres including blues, classical, country, disco, hiphop,
jazz, metal, pop, reggae, and rock:
- 1000 `.wav` [audio files](Data/genres_original)
    - One per song, 30 seconds each
- 999 `.png` Mel Spectrogram [image files](Data/images_original)
    - Missing one jazz image file
- [`features_3_sec.csv`](Data/features_3_sec.csv)
    - 9990 samples containing 57 statistical features for each song such as
    average tempo, rms chromatic shift, etc., over three second samples
    distributed over the original 1000 `.wav` audio files
- [`features_30_sec.csv`](Data/features_30_sec.csv)
    - 1000 samples containing the same statistical features over the complete
    30 second audio files

## Question We Hope to Answer
We will compare the following methods for classifying music:
- Models trained on song statistical features for three and
30 second samples using:
    - Supervised machine learning (classification)
    - Unsupervised machine learning (clustering)
- Image classification model trained on Mel Spectrogram images using a deep
neural network

## High Level Visualization
[Interactive Dashboard](https://jsheppard95.github.io/MusicClassification/)

## Installation Instructions
After cloning this repository, navigate to the root directory and install
the necessary dependencies as follows:

### Install Using `conda`
Install into an isolated `conda` environment with name `envname`:
```
$ conda env create --name envname --file=environment.yml
```

### Install Using `pip`
Install using the `requirements.txt` file:
```
$ pip install -r requirements.txt
```

## MongoDB Installation and Usage
Next install MongoDB by following the
[official documentation](https://docs.mongodb.com/manual/administration/install-community/).
After successful installation, use the following steps to create and populate
the database that will be used for this analysis:

1) Launch the MongoDB shell:
```
$ mongo
```

2) Create new MongoDB database using the mongo shell:
```
> use Music_db
```

3) Exit the mongo shell using `<CTRL+D>`.

4) Populate the database `Music_db` by running all cells in the Jupyter
Notebook `Load_Data.ipynb`.

### Optional Manual Data Loading
Alternatively, one can manually load data into `Music_db` as follows: For CSV Data:
```
$ mongoimport -d <database_name> -c <collection_name> --type csv --file <path_to_csv_file> --headerline
```
And for the image/wave data:
```
$ mongofiles -d=<database_name> put <path_to_png_or_wav_file>
```
If loading data manually, ensure to update `config.py` with the chosen
database and collection names. Also note that `mongofiles` sets the `filename`
field of each document in the GridFS `fs.files` collection to the specified
`<path_to_png_or_wav_file>`. One should therefore run the `mongofiles` command
from the root of this repository since this relative path is read and used to
extract the data from MongoDB in `Music_Classification.ipynb`.

5) Check image and wave file storage from the command line:
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

6) Check all data storage within the mongo shell:
```
$ mongo
> use Music_db
switched to db Music_db
> show collections
feat_3
feat_30
fs.chunks
fs.files
> db.feat_3.find()
{ "_id" : ObjectId("608f7cda932c78feba8e6a15"), "filename" : "blues.00000.0.wav", "length" : 66149, "chroma_stft_mean" : 0.3354063630104065, "chroma_stft_var" : 0.09104829281568527, "rms_mean" : 0.1304050236940384, "rms_var" : 0.0035210042260587215, "spectral_centroid_mean" : 1773.0650319904662, "spectral_centroid_var" : 167541.6308686573, "spectral_bandwidth_mean" : 1972.7443881356735, "spectral_bandwidth_var" : 117335.77156332089, "rolloff_mean" : 3714.560359074519, "rolloff_var" : 1080789.8855805045, "zero_crossing_rate_mean" : 0.08185096153846154, "zero_crossing_rate_var" : 0.0005576872402394312, "harmony_mean" : -0.00007848480163374916, "harmony_var" : 0.008353590033948421, "perceptr_mean" : -0.00006816183304181322, "perceptr_var" : 0.005535192787647247, "tempo" : 129.19921875, "mfcc1_mean" : -118.62791442871094, "mfcc1_var" : 2440.28662109375, "mfcc2_mean" : 125.08362579345703, "mfcc2_var" : 260.9569091796875, "mfcc3_mean" : -23.443723678588867, "mfcc3_var" : 364.08172607421875, "mfcc4_mean" : 41.32148361206055, "mfcc4_var" : 181.69485473632812, "mfcc5_mean" : -5.976108074188232, "mfcc5_var" : 152.963134765625, "mfcc6_mean" : 20.115140914916992, "mfcc6_var" : 75.65229797363281, "mfcc7_mean" : -16.04541015625, "mfcc7_var" : 40.22710418701172, "mfcc8_mean" : 17.85519790649414, "mfcc8_var" : 84.32028198242188, "mfcc9_mean" : -14.633434295654297, "mfcc9_var" : 83.4372329711914, "mfcc10_mean" : 10.270526885986328, "mfcc10_var" : 97.00133514404297, "mfcc11_mean" : -9.70827865600586, "mfcc11_var" : 66.66989135742188, "mfcc12_mean" : 10.18387508392334, "mfcc12_var" : 45.10361099243164, "mfcc13_mean" : -4.681614398956299, "mfcc13_var" : 34.169498443603516, "mfcc14_mean" : 8.417439460754395, "mfcc14_var" : 48.26944351196289, "mfcc15_mean" : -7.233476638793945, "mfcc15_var" : 42.77094650268555, "mfcc16_mean" : -2.8536033630371094, "mfcc16_var" : 39.6871452331543, "mfcc17_mean" : -3.2412803173065186, "mfcc17_var" : 36.488243103027344, "mfcc18_mean" : 0.7222089767456055, "mfcc18_var" : 38.099151611328125, "mfcc19_mean" : -5.05033540725708, "mfcc19_var" : 33.618072509765625, "mfcc20_mean" : -0.24302679300308228, "mfcc20_var" : 43.771766662597656, "label" : "blues" }
...

```
## Python Database Interface
Loading our data for analysis from `Music_db` is accomplished in
[`MusicClassification.ipynb`](MusicClassification.ipynb) using `pymongo` by
first instantiating a client and reading the `.csv` data into a pandas
DataFrame:

```
client = MongoClient("localhost")
db = client[DB_NAME]
collection = db[FEAT_3_COLLECTION_NAME].find()
features_3_df = pd.DataFrame(list(collection))
```

We then create a `GridFS` instance to load the image files using the relative
path from the working directory as the `filename` identifier for the function
`GridFS.get_last_version` and convert each each from RGBA to grayscale:
```
fs = gridfs.GridFS(db)

images = []

for folder in images_folder:
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
images = np.asarray(images)
```

## Model Analysis
We first classify music genres using machine learning by training a supervised
Random Forest Classifier (`sklearn.ensemble.RandomForestClassifier`) and
an unsupervised K-Means Cluster model (`sklearn.cluster.KMeans`) on both the
three and 30 second `.csv` data, then build a deep neural network using
`tensorflow.keras.models.Sequential` and train on the `.png` Mel
Spectrogram images, and finally compare the performance of the five models.

### Data Preprocessing:
- All Models:
    - Drop unnecessary columns `_id`, `filename`, and `length` (machine learning only,
    identification and rendundant for all samples)
    - Convert categorical genre target labels to integers 0 through 9

- Random Forest Classifier:
    - Separate feature data from target genre (column = `label`)
    - Split data into 75% training and 25% testing using
    `sklearn.model_selection.train_test_split`

- K-Means Cluster:
    - Shuffle feature data (handled for Random Forest Classifier by `train_test_split`)
    - Scale feature data using `sklearn.preprocessing.StandardScaler`
    - Apply principal component analysis to reduce the 57 features to three
    principal components using  `sklearn.decomposition.PCA`

- Neural Network
    - Convert RGBA images to RGB and then to grayscale and finally NumPy arrays
    - Split data into 75% training and 25% testing using
    `sklearn.model_selection.train_test_split`
    - Normalize the grayscale pixel values by dividing each by its maximum value
    of 255

### Training and Initial Results
- Random Forest Classifier:
    - `features_3_sec.csv`:
        - Model Parameters:
            - `n_estimators = 500`
            - Otherwise default parameters
        - Results:
            - [Confusion Matrix](Images/rf_3_initial_results.png)
            - Accuracy: 88%
    - `features_30_sec.csv`:
        - Model Parameters:
            - `n_estimators = 500`
            - Otherwise default parameters
        - Results:
            - [Confusion Matrix](Images/rf_30_initial_results.png)
            - Accuracy: 66%
- K-Means Cluster:
    - `n_clusters = 10`, i.e the number of genres to classify
    - `features_3_sec.csv`:
        - [Predicted Genres vs. Principal Components](Images/kmeans_3_scatter.png)
        - [Plot](Images/kmeans_act_pred_3.png) of the number of each actual genre
        for the predicted pop genre
        - Mostly random classification
    - `features_30_sec.csv`:
        - [Predicted Genres vs. Principal Components](Images/kmeans_30_scatter.png)
        - [Plot](Images/kmeans_act_pred_30.png) of the number of each actual genre
        for the predicted metal genre
        - Mostly random classification
- Neural Network:
    - Followed [How to train neural networks for image classification - Part 1](https://medium.com/nerd-for-tech/how-to-train-neural-networks-for-image-classification-part-1-21327fe1cc1)
    - [Model Summary](Images/nn_summary.png)
    - Model Parameters:
        - Input `Flatten` layer with 124416 inputs (image width * image height = 288 * 432)
        - `Dense` hidden layer with 300 nodes and `relu` activation function
        - Three additional `Dense` hidden layers with 100 nodes each and `relu`
        activation functions
        - Output `Dense` layer with 10 output nodes and `softmax` activation function
        - `sparse_categorical_crossentropy` loss function
        - `sgd` optimizer
        - `accuracy` metric
    - Results:
        - [Training Loss and Accuracy](Images/nn_training.png)
        - Testing Loss: 2.38
        - Testing Accuracy: 24%
            - Limited training data leads to overfitting and poor testing
            performance
        - [Metal music](Images/metal00000.png) classified with
        [72% accuracy](Images/nn_metal_plot.png)

### Random Forest Classifier Optimization
Focusing on the highest performing Random Forest Classifier, we optimize the
model using `sklearn.model_selection.RandomizedSearchCV` to perform a grid
search over model hyperparameters. This results in the following optimized
parameters and resulting performances for the three and 30 second
feature data:
- `features_3_sec.csv`:
    - Model Parameters:
        - `n_estimators = 1400`
        - `min_samples_split = 2`
        - `min_samples_leaf = 1`
        - `max_features = auto`
        - `max_depth = 40`
        - `bootstrap = False`
    - Results:
        - [Confusion Matrix](Images/rf_3_optimized.png)
        - [Precision vs. Genre](Images/prec_genre_3_sec.png)
        - Accuracy: 90%
- `features_30_sec.csv`:
    - Model Parameters:
        - `n_estimators = 800`
        - `min_samples_split = 5`
        - `min_samples_leaf = 1`
        - `max_features = sqrt`
        - `max_depth = 90`
        - `bootstrap = False`
    - Results:
        - [Confusion Matrix](Images/rf_30_optimized.png)
        - [Precision vs. Genre](Images/prec_genre_30_sec.png)
        - Accuracy: 66%

We thus find a 2% increase in accuracy training on the three second feature data
while no change training on the full 30 second features.

## Dashboard Visualization
To create an interactive display of the previous visualizations, we write the
classification results to [JSON files](Post_Analysis_Data/) and concatenate
them into [`results.json`](docs/static/js/results.json). This file has the
following structure:
```
{
    "ids": [id for each model],
    "metadata": [
        {
            id and model metadata
        },
        ...
    ],
    "results": [
        {
            "Random Forest precision": {
                precision for each genre
            },
            ...
        },
        ...
        {
            "K-Means Predicted Class": {
                genre and number of actual occurances in predicted class
            },
            ...
        },
        {
            "Neural Network precision": {
                precision for each genre
            },
            ...
        }
    ],
    "images": [
        {
            id and reference to image associated with model
        }
    ]
}
```
We then read `results.json` using `D3.js` and plot the classification results
using `plotly.js`. This interactive dashboard can be found
[here](https://jsheppard95.github.io/MusicClassification/).

## Conclusion and Future Considerations
In summary, we find the Random Forest Classifier trained on statistical
features for three second song samples from 10 target genres to be the highest
performing model, reaching 90% accuracy over all 10 genres. In contrast, the
K-Means classifier is not an effective method. One should note that since this
model is unsupervised, the predicted genre labels do not need to correspond
directly to the original labels. One would however expect an accurate model to
classify songs from the same genre consistently, but we instead find a random
distribution of actual genres for each K-Means predicted genre. Finally, we
find the neural network to have significantly worse performance than the
Random Forest Classifier, but this could be due to the limited image training
set as indicated by the promising training accuracy for the metal genre.

Considering future analysis, it would be worthwhile to perform more
traditional statistical analysis of the `.csv` feature data using methods such
as the two-sample t-test to identify and remove outliers which may improve
machine learning performance. Further, it would be interesting to generate our
own features from the raw `.wav` audio files. This could be accomplished using
Python's built-in `wave` module and the function
[`python_speech_features.mfcc`](https://python-speech-features.readthedocs.io/en/latest/)
to generate MFCC (Mel Frequency Cepstral Coefficients) features. This would in
turn generalize the model and allow it to be deployed as an automated music
genre classifier for any standard `.wav` audio file.

## Google Slides Presentation
https://docs.google.com/presentation/d/1mtLgLnwL2p8m_hOIKtAYMIkNlP1axNtIMz0xgWbGiqM/edit?usp=sharing
