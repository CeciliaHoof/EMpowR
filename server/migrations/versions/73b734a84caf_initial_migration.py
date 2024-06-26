"""initial migration

Revision ID: 73b734a84caf
Revises: 
Create Date: 2024-05-14 13:42:07.967395

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '73b734a84caf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('medications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('generic_name', sa.String(), nullable=True),
    sa.Column('brand_names', sa.String(), nullable=True),
    sa.Column('drug_class', sa.String(), nullable=True),
    sa.Column('box_warning', sa.String(), nullable=True),
    sa.Column('indications', sa.String(), nullable=True),
    sa.Column('dosages', sa.String(), nullable=True),
    sa.Column('contraindications_and_cautions', sa.String(), nullable=True),
    sa.Column('adverse_effects', sa.String(), nullable=True),
    sa.Column('administration', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_medications'))
    )
    op.create_table('metric_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('metric_type', sa.String(), nullable=True),
    sa.Column('green_params', sa.Integer(), nullable=True),
    sa.Column('yellow_params', sa.Integer(), nullable=True),
    sa.Column('red_params', sa.Integer(), nullable=True),
    sa.Column('units', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_metric_types'))
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('terms_conditions', sa.Boolean(), nullable=True),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
    sa.UniqueConstraint('email', name=op.f('uq_users_email'))
    )
    op.create_table('health_metrics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('time_taken', sa.DateTime(), nullable=False),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('comment', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('metric_type_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['metric_type_id'], ['metric_types.id'], name=op.f('fk_health_metrics_metric_type_id_metric_types')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_health_metrics_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_health_metrics'))
    )
    op.create_table('prescriptions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('dosage', sa.String(), nullable=False),
    sa.Column('frequency', sa.String(), nullable=False),
    sa.Column('route', sa.String(), nullable=False),
    sa.Column('time_of_day', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('medication_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['medication_id'], ['medications.id'], name=op.f('fk_prescriptions_medication_id_medications')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_prescriptions_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_prescriptions'))
    )
    op.create_table('alerts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('severity', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('health_metric_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['health_metric_id'], ['health_metrics.id'], name=op.f('fk_alerts_health_metric_id_health_metrics')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_alerts_user_id_users')),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_alerts'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('alerts')
    op.drop_table('prescriptions')
    op.drop_table('health_metrics')
    op.drop_table('users')
    op.drop_table('metric_types')
    op.drop_table('medications')
    # ### end Alembic commands ###
