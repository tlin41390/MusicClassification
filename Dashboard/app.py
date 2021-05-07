from flask import Flask, render_template, request


app = Flask(__name__)
app.debug = True

@app.route("/",methods=['GET'])
def dropdown():
    models = ["Random Forest Classifier","Neural Net"]
    return render_template('index.html', models = models)
@app.route("/",methods=['GET'])
def get_img():
    return "burger.jpg"


if __name__=="__main__":
    app.run()
