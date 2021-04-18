# MusicClassification

## Topic:
Music Classification
## Reason for Topic:
   Music is cool. There are different files for music and visuals that 
   would be really interesting to categorize and have the machine train a model
   based on a diverse dataset, and create a visualization for how the data interacts
   with each other.
## Description of data:
The data comes from the GTZAN Genre collection used in the paper " Musical genre classification of audio signals " by G. Tzanetakis and P. Cook. It holds .wav audio files, Mel Spectrogram images as .png files, and two .csv files which describe various features of the songs. There are over one-thousand song samples. 
## Question we hope to answer:
Given the variety of data, we will compare methods for classifying music. The first method will 
be running the audio files through a machine learning model, and grouping them. Method two will be grouping based on the image files, and the third method will be using the data from the .CSV files. 
## Communication Protocols: 
- Always commit work to personal branch.
- Once personal branch is ready for merging with main, create pull request, and choose at least one person to review.

## Database updates/commands

Use the following steps:

1) Run `brew services list` to show mongo installation
2) Launch mongo shell
3) Update mongodb database by first creating a mongodb database in the mongo shell.
4) Use the command: `mongofiles -d=<database_name> put <file_name>`. This inserts a csv file into the database.

* Read in the file into a jupyter notebook from Mongodb database.
* Convert byte string into a regular string using `.decode("utf-8")`.
* Make converted string into a pandas dataframe. 





