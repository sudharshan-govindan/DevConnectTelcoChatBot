## Bluemix account

1. Ensure that you have an account on [IBM Bluemix](https://bluemix.net/)

2. If you already have a Bluemix account, then sign in to your account


## Deploy the App

1. Click on the 'Deploy to Bluemix' button.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/sudharshan-govindan/DevConnectTelcoChatBot)

2. Name your app, select the Region, Organization and Space where the app will be deployed. Click 'DEPLOY'.

3. The deployment process performs the following actions:
    - Creates the application
    - Creates an instance of Conversation and Cloudant DB services


## Configure the Services

### WCS

1. Click on "conversation-service" from Bluemix Dashboard. In the landing page, click on "Launch Tool" button.

2. Sign in to Watson Conversation editor. Import the workspace - *telcobot-workspace.json* from resources folder.

3. In the editor, click on "Deploy" from left hand navigation page. Copy the value of Workspace ID.

4. Click on the deployed app from Bluemix Dashboard

5. Go to Runtime -> Environment variables section

6. Under "User defined" section at the botton, click on Add button

7. Under Name, enter WORKSPACE_ID (with out quotes) and under Value, copy the workspace id from step 3 above

8. Click on Save button. The app will automatically restart.

### Cloudant

1. Click on "cloudant-db" from the Bluemix Dashboard. In the landing page, click on Launch button.

2. Click on Databases from left hand navigation. Click on "Create Database" from top right corner.

3. Give a name to the database, like <b>telco-users</b>

4. To load demo / sample data to the database, two versions of data are available under resources folder: *telco-users-cloudant.json* and *telco-users-cloudant.txt*

5. Install couchimport tool to upload / download data to cloudant

sudo npm install -g couchimport  

export COUCH_URL="https://username:password@xxx-bluemix.cloudant.com"  

export COUCH_DATABASE="telco-users"  

cat telco-users-cloudant.txt | couchimport --db telco-users


## Running the app

1. Launch the application from bluemix dashboard

2. Enter an username, say, ajay to login and see the chat bot working


## License

This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).


## Open Source @ IBM

Find more open source projects on the [IBM Github Page](http://ibm.github.io/).
