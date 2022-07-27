FROM ruby:2.6.5
ENV RUBYGEMS_VERSION=2.7.0

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

LABEL "com.github.actions.name"="Builds to GitHub Pages"
LABEL "com.github.actions.description"="Builds the project to GitHub Pages"
LABEL "com.github.actions.icon"="globe"
LABEL "com.github.actions.color"="green"

LABEL "repository"="http://github.com/BryanSchuetz/jekyll-deploy-gh-pages/tree/master/build"

ADD entrypoint.sh /entrypoint.sh


ENTRYPOINT ["/entrypoint.sh"]
