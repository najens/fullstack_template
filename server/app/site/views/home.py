from flask import render_template, g
from app.site import site


@site.route('/')
def index():
    """
    Displays the home page.
    This is a public non-protected endpoint.
    """
    return render_template('index.html'), 200
