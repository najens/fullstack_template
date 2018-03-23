from flask import Blueprint


# Setup site blueprint
site = Blueprint(
    'site',
    __name__,
    template_folder='../../../frontend/dist/templates',
    static_folder='../../../frontend/dist/static',
    static_url_path='/frontend/dist/static'
)

# Import blueprint views
from .views import home  #noqa
