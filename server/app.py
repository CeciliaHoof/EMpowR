#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from datetime import datetime
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
from models import *


# Views go here!
class Medications(Resource):
    def get(self):
        return make_response([med.to_dict() for med in Medication.query.all()], 200)

api.add_resource(Medications, '/medications')

class MedicationsById(Resource):
    def get(self, id):
        med = Medication.query.filter(Medication.id == id).first()

        if not med:
            return make_response({'error' : 'Medication not found'}, 404)
        
        return make_response(med.to_dict(), 200)

api.add_resource(MedicationsById, '/medications/<int:id>')

class Prescriptions(Resource):
    
    def get(self):
        return make_response([prescription.to_dict() for prescription in Prescription.query.all()], 200)

    def post(self):
        prescription_data = request.get_json()
        try:
            new_prescription = Prescription()
            for key, value in prescription_data.items():
                setattr(new_prescription, key, value)
            if 'prescribed_on' in prescription_data.keys():
                date_str = prescription_data['prescribed_on']
                prescribed_date = datetime.strptime(date_str, '%m-%d-%Y')
                new_prescription.prescribed_on = prescribed_date
            db.session.add(new_prescription)
            db.session.commit()
            resp_body = new_prescription.to_dict()
            status = 201
        except Exception as e:
            resp_body = str(e)
            status = 422
        return make_response(resp_body, status)
    
api.add_resource(Prescriptions, '/prescriptions')

class PrescriptionsById(Resource):
    # GET, PATCH, DELETE
    def get(self, id):
        prescription = Prescription.query.filter(Prescription.id == id).first()

        if not prescription:
            return make_response({'error' : 'Prescription not found'}, 404)
        
        return make_response(prescription.to_dict(), 200)

    def delete(self, id):
        prescription = Prescription.query.filter(Prescription.id == id).first()

        if not prescription:
            return make_response({'error' : 'Prescription not found'}, 404)
        
        db.session.delete(prescription)
        db.session.commit()
        return make_response({}, 204)
    
    def patch(self, id):
        prescription = Prescription.query.filter(Prescription.id == id).first()

        if not prescription:
            return make_response({'error' : 'Prescription not found'}, 404)
        
        prescription_data = request.get_json()
        try:
            for key, value in prescription_data.items():
                setattr(prescription, key, value)
            if 'prescribed_on' in prescription_data.keys():
                date_str = prescription_data['prescribed_on']
                prescribed_date = datetime.strptime(date_str, '%m-%d-%Y')
                prescription.prescribed_on = prescribed_date
            db.session.commit()
            resp_body = prescription.to_dict()
            status = 201
        except Exception as e:
            resp_body = str(e)
            status = 422
        return make_response(resp_body, status)
        
api.add_resource(PrescriptionsById, '/prescriptions/<int:id>')

class HealthMetrics(Resource):
    
    def get(self):
        return make_response([metric.to_dict() for metric in HealthMetric.query.all()], 200)

    def post(self):
        metric_data = request.get_json()
        try:
            new_metric = HealthMetric()
            for key, value in metric_data.items():
                setattr(new_metric, key, value)
            if 'time_taken' in metric_data.keys():
                time_str = metric_data['time_taken']
                time = datetime.strptime(time_str, '%m-%d-%Y %H:%M')
                new_metric.time_taken = time
            if metric_data['metric_type_id'] > 9:
                raise Exception('That is not a valid health metric type.')
            
            db.session.add(new_metric)
            db.session.commit()
            resp_body = new_metric.to_dict()
            status = 201
        except Exception as e:
            resp_body = {'error': str(e)}
            status = 422
        return make_response(resp_body, status)
    
api.add_resource(HealthMetrics, '/health_metrics')

class HealthMetricsById(Resource):
    # GET, PATCH, DELETE
    def get(self, id):
        metric = HealthMetric.query.filter(HealthMetric.id == id).first()

        if not metric:
            return make_response({'error' : 'Metric not found'}, 404)
        
        return make_response(metric.to_dict(), 200)

    def delete(self, id):
        metric = HealthMetric.query.filter(HealthMetric.id == id).first()

        if not metric:
            return make_response({'error' : 'Metric not found'}, 404)
        
        db.session.delete(metric)
        db.session.commit()
        return make_response({}, 204)
    
    def patch(self, id):
        metric = HealthMetric.query.filter(HealthMetric.id == id).first()

        if not metric:
            return make_response({'error' : 'Metric not found'}, 404)
        
        metric_data = request.get_json()
        try:
            for key, value in metric_data.items():
                setattr(metric, key, value)
            if 'time_taken' in metric_data.keys():
                time_str = metric_data['time_taken']
                time = datetime.strptime(time_str, '%m-%d-%Y %H:%M')
                metric.time_taken = time

            if 'metric_type_id' in metric_data.keys() and metric_data['metric_type_id'] > 9:
                raise Exception('That is not a valid health metric type.')
            
            db.session.commit()
            resp_body = metric.to_dict()
            status = 201
        except Exception as e:
            resp_body = str(e)
            status = 422
        return make_response(resp_body, status)
        
api.add_resource(HealthMetricsById, '/health_metrics/<int:id>')

class CheckSession(Resource):
    
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if not user:
            return make_response({'error': "Unauthorized: you must be logged in to make that request"}, 401)
        else:
            return make_response(user.to_dict(), 200)

api.add_resource(CheckSession, '/check_session', endpoint='check_session')

class Signup(Resource):
    
    def post(self):
        json = request.get_json()
        try:
            user = User(
                first_name=json['first_name'],
                last_name=json['last_name'],
                email = json['email']
            )
            user.password_hash = json['password']
            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            return make_response(user.to_dict(), 201)
        except IntegrityError:
            return make_response({'error': 'Email already in use.'}, 422)
        except Exception as e:
            return make_response({'error': str(e)}, 422)
    
api.add_resource(Signup, '/signup', endpoint='signup')

class Login(Resource):

    def post(self):
        email = request.get_json()['email']

        user = User.query.filter(User.email == email).first()
        password = request.get_json()['password']

        if not user:
            response_body = {'error': 'User not found'}
            status = 404
        else:
            if user.authenticate(password):
                session['user_id'] = user.id
                response_body = user.to_dict()
                status = 200
            else:
                response_body = {'error': 'Invalid email address or password'}
                status = 401
        return make_response(response_body, status)

api.add_resource(Login, '/login', endpoint='login')

class Logout(Resource):
    
    def delete(self):
        session['user_id'] = None
        return {}, 204
    
api.add_resource(Logout, '/logout', endpoint='logout')


if __name__ == '__main__':
    app.run(port=5555, debug=True)