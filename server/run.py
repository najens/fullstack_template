#!/usr/bin/env python
import os
import sys
from app import app as application  # application for apache entry


sys.path.insert(0, '/usr/local/www/<app name>')  # path to app on apache server


if __name__ == '__main__':
    application.run(host='0.0.0.0', port=8080)  # use for development
    # application.run()  # use for production
