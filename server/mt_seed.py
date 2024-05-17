# Remote library imports
import requests
import re

# Local imports
from app import app
from models import db, MetricType
            
if __name__ == '__main__':
    with app.app_context():
        print('Clearing tables...')
        MetricType.query.delete()

        print('Seeding metric types')

        metric_types = []

        BP = MetricType(metric_type = 'Blood Pressure', green_params = 90, yellow_params = 125, red_params = 161, units='mmHg')
        metric_types.append(BP)
        
        # DBP = MetricType(metric_type = 'Diasystolic Blood Pressure', green_params = 60, yellow_params = 81, red_params = 91, units='mmHg')
        # metric_types.append(DBP)

        HR = MetricType(metric_type = 'Heart Rate', green_params = 60, yellow_params = 101, red_params = 121, units='beats per minute')
        metric_types.append(HR)
        
        RR = MetricType(metric_type = 'Respiratory Rate', green_params = 12, yellow_params = 21, red_params = 30, units='breaths per minute')
        metric_types.append(RR)
        
        BLOOD_OXYGEN = MetricType(metric_type = 'Blood Oxygen', units='%')
        metric_types.append(BLOOD_OXYGEN)

        TEMPERATURE = MetricType(metric_type = 'Temperature', units='°F')
        metric_types.append(TEMPERATURE)

        PAIN = MetricType(metric_type = 'Pain Level', green_params = 0, yellow_params = 4, red_params = 7, units='out of 10')
        metric_types.append(PAIN)

        BG = MetricType(metric_type = 'Blood Glucose', green_params = 80, yellow_params = 150, red_params = 200, units='mg/dL')
        metric_types.append(BG)

        WEIGHT = MetricType(metric_type = 'Weight', units = 'lbs')
        metric_types.append(WEIGHT)

        MED = MetricType(metric_type = 'Medication Taken')
        metric_types.append(MED)

        SYM = MetricType(metric_type = 'Symptom')
        metric_types.append(SYM)

        db.session.add_all(metric_types)

        db.session.commit()