from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np

app = Flask(__name__)

# Reading data
data_df = pd.read_csv("static/data/Students_Performance.csv")

@app.route('/')
def index():
    return render_template('index.html')

def calculate_percentage(val, total):
    """Calculates the percentage of a value over a total"""
    percent = np.round((np.divide(val, total) * 100), 2)
    return percent

def data_creation(data, percent, class_labels, group=None):
    for index, item in enumerate(percent):
        data_instance = {}
        data_instance['category'] = class_labels[index]
        data_instance['value'] = item
        data_instance['group'] = group
        data.append(data_instance)

@app.route('/get_piechart_data')
def get_piechart_data():
    gender_counts = data_df['gender'].value_counts()
    class_percent = calculate_percentage(gender_counts.values, gender_counts.sum())

    piechart_data = []
    data_creation(piechart_data, class_percent, gender_counts.index)
    return jsonify(piechart_data)

@app.route('/get_barchart_data')
def get_barchart_data():
    group_labels = ['Group C', 'Group D', 'Other']
    overall = data_df.copy()
    overall['group'] = overall['race/ethnicity'].apply(lambda x: x if x in ['group C', 'group D'] else 'Other')

    gender_groups = overall.groupby('gender')
    
    barchart_data = []
    
    for gender, group in gender_groups:
        gender_data = group['group'].value_counts()
        gender_percent = calculate_percentage(gender_data.values, gender_data.sum())
        data_creation(barchart_data, gender_percent, group_labels, gender)
    
    overall_data = overall['group'].value_counts()
    overall_percent = calculate_percentage(overall_data.values, overall_data.sum())
    data_creation(barchart_data, overall_percent, group_labels, "overall")
    
    return jsonify(barchart_data)

if __name__ == '__main__':
    app.run(debug=True)
