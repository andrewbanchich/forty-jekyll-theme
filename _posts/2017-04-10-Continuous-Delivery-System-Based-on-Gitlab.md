---
layout: post
title: Continuous Delivery System Based on Gitlab
description: How to setup a Continuous delivery system
image: assets/images/pic-ci.png
---
## [Setup Gitlab](https://docs.gitlab.com/omnibus/docker/README.html)
**Run the following command to install gitlab on your machine.**

```shell
sudo docker run -d --hostname 10.211.55.5 \
-p 80:80 -p 443:443 -p 22:22 \
--restart always gitlab/gitlab-ce
```
> Please follow [official installation docs](https://docs.docker.com/engine/installation/) to install docker if it's not been installed.
> Do NOT forget change `10.211.55.5` and `/srv/gitlab/` to your own.(I have a virtual machine with that ip.)
> If your docker is behind a proxy, please see [the search results from Google](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#newwindow=1&q=docker+behind+corporate+proxy).

**After several mins, access `http://10.211.55.5` (the host you set above), you will the following picture.**
![pic-create-password](/assets/images/pic-create-password.png)

**Set your admin password, and login again.**

![Gitlab Home Page](/assets/images/pic-gitlab-homepage.png)

**Create new project `hello-world` as the following:**

![Create new project](/assets/images/pic-gitlab-create-project.png)

Once you create the project, follow the instruction to upload demo code to the repo. When you finish you will see a similar picture.

![Gitlab project setup ci](/assets/images/pic-gitlab-project-setup-ci.png)

Click the `Set up CI` button, add the following code and commit.

```yaml
test:
  script:
  - echo 'hello world'
```
A pending icon will appear on the result page.

![Gitlab commit pending to run](/assets/images/pic-gitlab-commit-pending-to-run.png)

Click the icon, you will see a `stuk` tag on your commit. That means you have to add gitlab-runner to this project.

![](/assets/images/pic-gitlab-pipeline-stuk.png)
##  Setup Gitlab Runner

1. Open `CI/CD Pipeline` tab in project settings 
![Gitlab project runner setup](/assets/images/pic-gitlab-project-ruuner-setup.png)

1. Install setup runner on your local machine
    
    ``` shell
    brew install gitlab-ci-multi-runner
    ```
2. Register your local machine as a runner to the gitlab

    ![Gitlab runner register](/assets/images/pic-gitlab-runner-register.png)

3. Runner list

    ![Project runner list](/assets/images/pic-gitlab-project-runner-list.png)
4. Go back to the `Pipelines` of your project and click the `retry` button

    ![](/assets/images/pic-gitlab-pipelies-state.png)

5. You runner has been set up successfully when you see the picture
    ![](/assets/images/pic-gitlab-pipeline-passed.png)

6. Change the `.gitlab-ci.yml` to the following:

    ```yaml
    test:
      script:
      - ./gradlew aR
      artifacts:
        paths:
        - app/build/outputs/apk/app-release*.apk
    ```

7. Now you will get the release apk file from the download button.
    ![](/assets/images/pic-gitlab-pipeline-with-artifats.png)

