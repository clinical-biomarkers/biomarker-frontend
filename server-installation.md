## Installation of source code on the respective servers
Steps for deploying source code to a server with maven script.

+ VPN to GW server: 

  GW vpn server

+ connect to the GW server (ex.: GW test server)

  Open your terminal and type the following

  ssh <user_name>@server
  ```
  ssh <user_name>@<server>
  ```
  you'll be prompted for your username and password, enter them.

+ (if you are a new user do this step else skip to next).

  Clone the git repository:
  ```
  git clone https://github.com/clinical-biomarkers/biomarker-frontend.git
  ```

+ Move to folder "\biomarker-frontend"
  ```
  cd biomarker-frontend
  ```
+ (do this step if you are deploying this branch for the first time else skip to next).

  ```
  git pull
  ```
  Or use 
  ```
  git pull origin biomarker_prod
  ```
  you'll be prompted for your GitHub username and password, enter them.

+ Change to the GitHub branch you wish to update on the server.
+ Use "biomarker_prod" branch for production server deployment and "master" branch for dev server deployment.
  git checkout <branch_name>
  ```
  git checkout biomarker_prod
  ```

+ Check whether it's switched to the desired branch
  ```
  git branch
  ```

  The current working branch will be displayed with a "*" before it.
  ```shell
    master
    react_19_migration
  * biomarker_prod
  ```

+ update this repository, pull the latest GitHub changes
  ```
  git pull origin biomarker_prod
  ```
  you'll be prompted for your GitHub username and password, enter them.

+ Deploying code by running script. For 'sudo' command please use server password.
    + For Dev server:
      ```
      make -f MakeFile biom-dev

      Start the container using below command if service fails to start it.
      docker start glygen-biomarker-dev
      ```
    + For Production server:
      ```
      make -f MakeFile biom-prod

      Start the container using below command if service fails to start it.
      docker start glygen-biomarker-prod
      ```

  You'll receive a message, stating "Container glygen-biomarker-prod  Recreated " and a list of deleted dangling images. If this is not the message, please contact your supervisor or Rene.

+ Exit the server
  ```
  exit
  ```

That's it, you are done.

## Installation phases
* **During Development phase:**
  Production have the code from the biomarker_prod branch. Dev has the code from the master.

* **During Test phase:**
  Production has the code from the biomarker_prod branch. Dev have the code from the master.

* **Release:**
  biomarker_prod is used. Production get the code from the branch. Dev remains master.
