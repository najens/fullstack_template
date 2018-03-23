#!/usr/bin/env python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


# Initialize app
app = Flask(__name__)
app.config.from_object('config')

# Initialize Flask_SQLAlchemy
db = SQLAlchemy(app)

# Needed to send requtest between Webpack Dev Server and Flask Server
CORS(app)  # remove in production

# Import blueprints
from app.site import site as site_blueprint  # noqa
from app.api import api as api_blueprint  # noqa
#
# # Register the blueprints
app.register_blueprint(site_blueprint)
app.register_blueprint(api_blueprint, url_prefix="/api/v1")
