# fullstack_template
Fullstack template with instructions to setup an AWS Lightsail Server with Apache2, React, Flask, and an RDS Postgresql DB. The frontend uses React, Apollo Client, Graphql, and Bootstrap

# Setup Instructions

## Software Require)ments
- [Bash CLI with Git](https://git-scm.com/downloads)

## Generate Public/Private Key Pairs For Each Server User To Handle Secure Authentication
- Open Git Bash CLI (if you don't have Git Bash, you may need to install and use [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) to generate and save key pairs
- For each user, repeat the following steps using the CLI to generate Private/Public Key Pairs on your local machine
```
$ ssh-keygen
```
- Give the file a unique name identifying the user (i.e. ubuntu) and save it in your .ssh directory on your local machine (on Windows this is /c/Users/<user>/.ssh/<project_name>/<unique_file_name>).
- Give the user a passhphrase  

## Setup AWS Lightsail
- Sign into the [aws console](https://aws.amazon.com/lightsail/)
- Next to your name in the upper right corner of the screen, select the region you wish to use
- In AWS Services, selct **Lightsail** in the Compute category
- Click the **Create instance** button
- Make sure the Instance location matches the region you wish to use
- Select the **Linux/Unix** platform
- Under blueprints select **OS Only**
- Select **Ubuntu** (current version 16.04 LTS)
- Under SSH key pair manager select **Upload New**
- Upload the .pub key file for the root user located in your .ssh directory on your local machine
- Choose an instance plan
- Name your instance
- Select the **Create** button
- Once the instance is running select the project
- Click on the **Networking** tab
- Under Firewall click **Edit rules** and add the following custom ports
    - Custom TCP 2200 (SSH)
    - Custom TCP 5432 (POSTGRESQL)
    - Custom UDP 123 (NTP)
- In the top right corner of the screen click **Account**
- On the Account page click **Advanced**
- Under VPC Peering click **Enable VPC peering**

## Log into Lightsail Ubuntu Machine from Bash CLI
- From the AWS Console go to Lightsail and open your instance
- You will use the Public IP and Username as well as your private key to log in
- Log in from the Bash CLI
```
$ ssh <Username>@<Public IP Address> -p 22 -i ~/.ssh/<project_name>/<private_key_file_name>
```
- If you receive a prompt that asks 'Are you sure you want to continue connecting?', type **yes**
- Enter the passphrase you created for the user

## Install Packages
```
$ sudo apt-get update
$ sudo apt-get -y upgrade
$ sudo apt-get install finger
$ sudo apt-get install -y python3 python3-venv python3-pip
$ sudo apt-get install -y apache2
$ sudo apt-get install libapache2-mod-wsgi-py3
$ sudo apt-get install -y postgresql postgresql-contrib
$ sudo apt-get install git
$ sudo apt-get autoremove -y
$ sudo apt-get install -y python-dev
$ sudo apt-get install -y libpq-dev
$ sudo pip3 install psycopg2
```

## Setup Uncomplicated Firewall
- Change the configured SSH port
```
$ sudo nano /etc/ssh/sshd_config
```
- Replace Port 22 with 2200 and save file
- Restart SSH
```
$ sudo /etc/init.d/ssh restart
```
- Type the following commands to setup the firewall. You will initially block all incoming and allow outgoing. Then you will allow the incoming ports you wish to use and enable the firewall.
```
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
$ sudo ufw allow 80/tcp
$ sudo ufw allow 2200/tcp
$ sudo ufw allow 5432/tcp
$ sudo ufw allow 123/udp
$ sudo ufw enable
$ y
$ sudo ufw status
$ exit
```
- Go back to your Lightsail instance in AWS
- Under the Networking tab click on **Edit rules**
- Delete SSH TCP Port 22 and click **Save**
- Log back into the ubuntu machine using the new ssh port
```
$ ssh <Username>@<Public IP Address> -p 2200 -i ~/.ssh/<project_name>/<private_key_file_name>
```

## Create New Ubuntu Users
- Repeat the following steps for each user
```
$ sudo adduser <username>
```
- Assign a password to the user (use <username> since we won't use password authentication)
- Give the user a name and any other details you want to fill out from the prompt
- In a different shell open the user's public key stored in their local .ssh folder and copy the contents
- Create a .ssh directory for the user
```
$ sudo mkdir /home/<username>/.ssh
```
- Create an authorized_keys file for the user
```
$ sudo nano /home/<username>/.ssh/authorized_keys
```
- Paste the user's public key and save the file
- Make the user the owner of the .ssh directory and authorized_keys file
```
$ sudo chown -R <username>:<username> /home/<username>/.ssh
```
- Set up permissions for .ssh directory and authorized_keys file
```
$ sudo chmod 700 /home/<username>/.ssh
$ sudo chmod 644 /home/<username>/.ssh/authorized_keys
```

### Give user sudo access
- Create a sudoers file for user
```
$ sudo nano /etc/sudoers.d/<username>
```
- Add the following line to the file and save it
```
<username> ALL=(ALL) NOPASSWD:ALL
```

## Configure Timezone
- Type the following command and follow the prompt in the terminal
```
$ sudo dpkg-reconfigure tzdata
```

## Setup RDS PostgreSQL Database
### Create New DB Instance
- Go back to the AWS Console
- Under AWS services click **Relational Database Service** under the Database category
- Click on the **Instances** tab
- Click **Launch DB Instance**
- Select **PostgreSQL**
- Select **Next**
- In the Bash CLI check what version of PostgreSQL is on your server
```
$ psql --version
```
- Under Instance specifications in the Select the DB version on your Ubuntu machine or the closest one below it.
- For the other items under Instance specifications use the default settings and select **Free tier**
- Under Settings fill out the following:
    - DB instance identifier <your instance identifer>
    - Master username <**ubuntu**> (should match the Lightsail username)
    - Master password <your master password>
- Click **Next**
- Under Network & Security keep default settings, leave Public Accessibility at **No**
- Under Database options keep default settings but type in <**ubuntu**> for Database name to match PostgreSQL Master username and Lightsail username
- Keep all other settings at the default value unless you feel a need to change them such as the backup retention period
- Select **Launch DB instance**
- Click **Database instance details**
- Under the details section find the endpoint for future reference, you will use this to configure your SQLALCHEMY_DATABASE_URI and to connect to the database from your server or via PG Admin. Each of these connections will require this endpoint, the port number 5432, the Master username, the Master password, and the database you wish to connect to.

### Add lighthouse VPC to RDS Security Group
- In the top left corner of your screen click on **Services**
- Click on **VPC** under the Networking & Content Deliver category   
- Under VPC resources click on **VPC Peering Connections**
- If there isn't an active vpc repeat the steps earlier to enable vpc peering from lightsail
- Copy the value in the Requester CIDRs column
- In the top left corner of your screen click on **Services**
- Click on **EC2** under the Compute category
- Under Resources click on **Security Groups**
- Click on the **rds-launch-wizard** security group
- At the bottom of the screen click on **Inbound**
- Click on **Edit**
- Click on **Add Rule**
- Change the type to **PostgreSQL**
- Paste in the CIDR and click **Save**

## Login to PostgreSQL from Ubuntu Machine
```
$ psql --host=<RDS instance endpoint> --port=5432 --username=<username> --password --dbname=<database>
```

## Create Database
```
=> CREATE DATABASE <db name> OWNER ubuntu;
```

## Create PostgreSQL users
```
=> CREATE USER <username> WITH PASSWORD <'password'>;
```
- Grant user permissions to connect to database
```
=> GRANT CONNECT ON DATABASE <db name> TO <username>;
=> \q
```

## Configure Server
- Configure Flask run.py (wsgi.py)
```
#!/usr/bin/env python
import os
import sys
from app import app as application  # application for apache entry


sys.path.insert(0, 'var/www/<app name>)  # path to app on apache server


if __name__ == '__main__':
    application.run()
```
- Replace <app name> with app name
- Configure site static and template folders in site __init__.py
```
# Setup site blueprint
site = Blueprint(
    'site',
    __name__,
    template_folder='../../../frontend/dist/templates',
    static_folder='../../../frontend/dist/static',
    static_url_path='/frontend/dist/static'
)
```
- Configure database in config.py
```
POSTGRES_USER = 'USER'
POSTGRES_PW = 'PASSWORD'
POSTGRES_URL = 'RDS INSTANCE URI'
POSTGRES_PORT = '5432'
POSTGRES_DB = 'DB NAME'
```

## Configure Frontend React Apollo Client HttpLink
- Configure React Apollo Client HttpLink to domain path
```
const httpLink = new HttpLink({ uri: 'http://domain/graphql' });
```
- Build Webpack
```
$ npm run build:prod
```
- Commit all github repository changes and push branch to origin

## Install Project And Configure Apache
- Clone github repository
```
$ cd /usr/local
$ sudo mkdir www
$ sudo git clone https://github.com/usr/repository.git www/<app name>
```
- Change owner of app
```
$ sudo chown -R <user>:<group> www/<app name>
```
- Create virtual environment and activate it
```
$ sudo mkdr venvs
$ sudo python3 -m venv venvs/<app name>
$ sudo chown -R <username>:<group> venvs/<app name>
$ source venvs/<app name>/bin/activate
```
- Upgrade pip3
```
$ pip3 install --upgrade pip
```
- Install requirements.txt packages
```
$ cd www/<app name>/server
$ pip3 install -r requirements.txt
$ deactivate
```

## Give Lightsail Public IP a Domain Name
- Purchase a domain from [GoDaddy.com](https://www.godaddy.com/)
- Under Domain Settings click on **Manage DNS** near the bottom of the page
- Edit Type A and paste your Lightsail public IP address in the Points to input box then save
- Edit the Type CNAME with Name www and type the @ symbol in the Points to input box then save

## Configure [WSGI Application](http://modwsgi.readthedocs.io/en/develop/user-guides/quick-configuration-guide.html)
- Create an Apache mod-wsgi configuration file
```
$ sudo nano /etc/apache2/sites-available/<app name>.conf
```
- Paste the following contents in the file
```
<VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port t$
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        #ServerName www.example.com

        ServerName www.example.com
        ServerAlias example.com
        ServerAdmin admin@example.com

        DocumentRoot /var/www/<app name>/frontend/dist/index.html

                Alias /static /usr/local/www/<app name>/frontend/dist/static
                <Directory /usr/local/<app name>/frontend/dist/static>
                        Require all granted
                </Directory>

                <Directory /var/www/test/server>
                        <Files run.py>
                                Require all granted
                        </Files>
                </Directory>

                WSGIDaemonProcess test python-path=/usr/local/www/<app name>/server python-home=/usr/local/venvs/<app name>
                       WSGIProcessGroup test
                       WSGIScriptAlias / /usr/local/www/<app name>/server/run.py

                       # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
                       # error, crit, alert, emerg.
                       # It is also possible to configure the loglevel for particular
                       # modules, e.g.
                       #LogLevel info ssl:warn

                       ErrorLog ${APACHE_LOG_DIR}/error.log
                       CustomLog ${APACHE_LOG_DIR}/access.log combined

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
</VirtualHost>
```
- Replace ServerName with Lightsail public IP address or Domain you will use
- Replace <app name> with name of your app
- Add any new Alias or Directory access that might be needed and save
- Enable the site
```
$ sudo a2ensite <app name>
```
- Disable the default site
```
$ sudo a2dissite 000-default.conf
```
- Reload Apache
```
$ sudo service apache2 reload
```
- Visit the Lightsail public IP address to view your running application
- If there are any errors, you can view them in the following log
```
$ sudo cat /var/log/apache2/error.log
```

## Open your running app at the new domain


## References
- [Digital Ocean: How to Deploy a Flask Application on an Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-application-on-an-ubuntu-vps)
- [Stack Overflow: Testing flask-oauthlib locally without https](https://stackoverflow.com/questions/27785375/testing-flask-oauthlib-locally-without-https)
- [Ubuntu: Sudoers](https://help.ubuntu.com/community/Sudoers)
- [Vsupalov: Using SQLAlchemy with Flask to Connect to PostgreSQL](https://vsupalov.com/flask-sqlalchemy-postgres/)
- [Deploy Django on Apache with Virtualenv and mod-wsgi](https://www.thecodeship.com/deployment/deploy-django-apache-virtualenv-and-mod_wsgi/)
- [mod_wsgi: Virtual Environments](http://modwsgi.readthedocs.io/en/develop/user-guides/virtual-environments.html)
