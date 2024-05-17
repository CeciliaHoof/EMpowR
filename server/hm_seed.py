import random
from datetime import date, timedelta, datetime

from app import app
from models import db, HealthMetric, Alert, MetricType
            
if __name__ == '__main__':
    with app.app_context():
        print('Clearing tables...')
        HealthMetric.query.delete()
        Alert.query.delete()

        count = 0
        curr_date = date.today()

        bps = []
        hrs = []
        sugars = []

        while count < 50:
            if count < 10:
                dbp = random.randint(65, 70)
                sbp = random.randint(110,120)
                hr = random.randint(70,80)  

            elif count < 20:
                dbp = random.randint(70,75)
                sbp = random.randint(120,130)
                hr = random.randint(75,85)

            elif count < 30:
                dbp = random.randint(75,80)
                sbp = random.randint(130,140)
                hr = random.randint(80,90)

            elif count < 40:
                dbp = random.randint(80,85)
                sbp = random.randint(140,150)
                hr = random.randint(85,95)
        
            else:
                dbp = random.randint(85,90)
                sbp = random.randint(150,160)
                hr = random.randint(90,100)
            
            bp = f'{sbp}/{dbp}'
            glucose = random.randint(150, 170)

            d = curr_date - timedelta(days=count)
            d_str = d.strftime('%m-%d-%Y') + " 08:00"
            d = datetime.strptime(d_str, '%m-%d-%Y %H:%M')
            
            new_bp = HealthMetric(time_taken=d, content=bp, metric_type_id=1, user_id=1)
            bps.append(new_bp)

            new_hr = HealthMetric(time_taken=d, content=hr, metric_type_id=2, user_id=1)
            hrs.append(new_hr)

            new_sugar = HealthMetric(time_taken=d, content=glucose, metric_type_id=7, user_id=1)
            sugars.append(new_sugar)

            count += 1
        
        db.session.add_all(bps)
        print('BPs added...')

        db.session.add_all(hrs)
        print('HRs added...')

        db.session.add_all(sugars)
        print('Sugars added...')

        db.session.commit()
        print('All metrics committed')

        bp_metric = MetricType.query.filter(MetricType.id == 1).first()
        hr_metric = MetricType.query.filter(MetricType.id == 2).first()
        gluc_metric = MetricType.query.filter(MetricType.id == 7).first()

        print("Creating BP alerts...")
        bp_alerts = []

        bps = HealthMetric.query.filter(HealthMetric.metric_type_id == 1).all()

        for pressure in bps:
            content_int = int(pressure.content.split('/')[0])
            if(content_int < bp_metric.green_params or content_int > bp_metric.red_params):
                new_alert = Alert(severity = "red", health_metric_id = pressure.id, user_id = pressure.user_id)
                bp_alerts.append(new_alert)
            elif(bp_metric.yellow_params < content_int < bp_metric.red_params):
                new_alert = Alert(severity = "yellow", health_metric_id = pressure.id, user_id = pressure.user_id)
                bp_alerts.append(new_alert)
        
        db.session.add_all(bp_alerts)

        print("Creating HR alerts...")
        hr_alerts = []

        hrs = HealthMetric.query.filter(HealthMetric.metric_type_id == 2).all()

        for rate in hrs:
            content_int = int(rate.content)
            if(content_int < hr_metric.green_params or content_int > hr_metric.red_params):
                new_alert = Alert(severity = "red", health_metric_id = rate.id, user_id = rate.user_id)
            elif(hr_metric.yellow_params < content_int < hr_metric.red_params):
                new_alert = Alert(severity = "yellow", health_metric_id = rate.id, user_id = rate.user_id)
            hr_alerts.append(new_alert)
        
        db.session.add_all(hr_alerts)

        print("Creating Sugar alerts...")
        gluc_alerts = []

        sugars = HealthMetric.query.filter(HealthMetric.metric_type_id == 7).all()

        for sug in sugars:
            content_int = int(sug.content)
            if(content_int < gluc_metric.green_params or content_int > gluc_metric.red_params):
                new_alert = Alert(severity = "red", health_metric_id = sug.id, user_id = sug.user_id)
            elif(gluc_metric.yellow_params < content_int < gluc_metric.red_params):
                new_alert = Alert(severity = "yellow", health_metric_id = sug.id, user_id = sug.user_id)
            gluc_alerts.append(new_alert)
        
        db.session.add_all(gluc_alerts)

        db.session.commit()