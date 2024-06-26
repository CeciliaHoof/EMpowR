#Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from email_validator import validate_email, EmailNotValidError

#Local imports
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable = False)
    email = db.Column(db.String, unique=True, nullable = False)
    terms_conditions = db.Column(db.Boolean)
    _password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default = db.func.now())
    updated_at =  db.Column(db.DateTime, onupdate = db.func.now())

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    
    @validates('email')
    def validate_email(self, key, value):
        try:
            validate_email(value)
        except EmailNotValidError as e:
            raise ValueError(str(e))
        return(value)
    
    @validates('first_name', 'last_name')
    def validate_names(self, key, value):
        if not value or not 2 <= len(value) <= 20:
            raise ValueError('First and last name must be between 2 and 20 characters')
        return value
    
    prescriptions = db.relationship('Prescription', back_populates = 'user', cascade='all, delete-orphan')
    medications = association_proxy('prescriptions', 'medication')

    health_metrics = db.relationship('HealthMetric', back_populates = 'user', cascade='all, delete-orphan')
    alerts = db.relationship('Alert', back_populates = 'user', cascade='all, delete-orphan')

    serialize_rules = ('-_password_hash', '-prescriptions.user', '-health_metrics.user', '-alerts.user')

    def __repr__(self):
        return f'< User {self.id} | {self.first_name} {self.last_name} | {self.email} >'
    
class Medication(db.Model, SerializerMixin):
    __tablename__ = 'medications'

    id = db.Column(db.Integer, primary_key = True)
    generic_name = db.Column(db.String)
    brand_names = db.Column(db.String)
    drug_class = db.Column(db.String)
    box_warning = db.Column(db.String)
    indications = db.Column(db.String)
    dosages = db.Column(db.String)
    contraindications_and_cautions = db.Column(db.String)
    adverse_effects = db.Column(db.String)
    administration = db.Column(db.String)

    prescriptions = db.relationship('Prescription', back_populates = 'medication')

    serialize_rules = ('-prescriptions.medication', )

    def __repr__(self):
        return f"< Medication {self.id} | {self.generic_name} >"
    
class Prescription(db.Model, SerializerMixin):
    __tablename__ = 'prescriptions'

    id = db.Column(db.Integer, primary_key = True)
    dosage = db.Column(db.String, nullable=False)
    frequency = db.Column(db.String, nullable=False)
    route = db.Column(db.String, nullable=False)
    time_of_day = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default = db.func.now())
    updated_at =  db.Column(db.DateTime, onupdate = db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    medication_id = db.Column(db.Integer, db.ForeignKey('medications.id'), nullable=False)

    user = db.relationship('User', back_populates = 'prescriptions')
    medication = db.relationship('Medication', back_populates = 'prescriptions')

    serialize_rules = ('-user.prescriptions', '-medication.prescriptions')

    def __repr__(self):
        return f'< Prescription {self.id} | {self.user_id} | {self.medication_id} >'
    
class HealthMetric(db.Model, SerializerMixin):
    __tablename__ = 'health_metrics'

    id = db.Column(db.Integer, primary_key = True)
    time_taken = db.Column(db.DateTime, nullable = False)
    content = db.Column(db.String, nullable = False)
    comment = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default = db.func.now())
    updated_at =  db.Column(db.DateTime, onupdate = db.func.now())

    metric_type_id = db.Column(db.Integer, db.ForeignKey('metric_types.id'), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)

    metric_type = db.relationship('MetricType', back_populates = 'health_metrics')
    user = db.relationship('User', back_populates = 'health_metrics')

    alert = db.relationship('Alert', uselist = False, back_populates = 'health_metric', cascade='all, delete-orphan')

    serialize_rules = ('-user.health_metrics', '-user.alerts', '-metric_type.health_metrics', '-alert.health_metric', '-alert.user')

    def __repr__(self):
        return f'< Health Metric {self.id} | {self.user_id} | {self.content} >'
    
class MetricType(db.Model, SerializerMixin):
    __tablename__ = 'metric_types'
    
    id = db.Column(db.Integer, primary_key = True)
    metric_type = db.Column(db.String)
    green_params = db.Column(db.Integer)
    yellow_params = db.Column(db.Integer)
    red_params = db.Column(db.Integer)
    units = db.Column(db.String)

    health_metrics = db.relationship('HealthMetric', back_populates = 'metric_type')

    serialize_rules = ('-health_metrics', )

    def __repr__(self):
        return f'< Metric Type {self.id} | {self.metric_type} >'

class Alert(db.Model, SerializerMixin):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key = True)
    created_at = db.Column(db.DateTime, server_default = db.func.now())
    updated_at =  db.Column(db.DateTime, onupdate = db.func.now())
    severity = db.Column(db.String)
    comment = db.Column(db.String)
    status = db.Column(db.String, default = "unacknowledged")

    health_metric_id = db.Column(db.Integer, db.ForeignKey('health_metrics.id'))
    health_metric = db.relationship('HealthMetric', back_populates = 'alert')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates = 'alerts')

    serialize_rules = ('-health_metric.alert', '-health_metric.user', '-user.alerts', '-user.health_metrics')

    def __repr__(self):
        return f'< Metric Type {self.id} | {self.status} | {self.health_metric_id}>'