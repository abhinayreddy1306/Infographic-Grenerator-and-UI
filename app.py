from flask import Flask, request, render_template, json
import pandas as pd

app = Flask(__name__)


@app.route('/uploadFile', methods=['POST'])
def uploadFile():
    if request.method == 'POST' and request.files.get('dataset'):
        df = pd.read_csv(request.files.get('dataset'))
        df.to_csv('dataset.csv')
        return "Success"
    return "Success"


df = pd.read_csv('dataset.csv')


@app.route('/', methods=['GET'])
def upload():
    return render_template('upload.html')


@app.route('/getColumns', methods=['GET'])
def getColumns():
    lst = list(df.columns)
    return json.dumps(lst)


@app.route('/scatterPlot', methods=['POST'])
def getScatterPlot():
    list = [request.form.get("first"), request.form.get("second")]
    df_tmp = df[list]
    df_tmp.dropna()
    return df_tmp.to_json(orient='values')

@app.route('/barPlot', methods=['POST'])
def getBarPlot():
    df_tmp = df[[request.form.get("first")]]
    df_tmp.dropna()
    df_tmp = pd.Series.to_frame(df_tmp[request.form.get("first")].value_counts());
    df_tmp.reset_index(inplace=True)
    print(df_tmp)
    return df_tmp.to_json(orient='values')


if __name__ == '__main__':
    app.run(debug=True)
