#!/usr/bin/env bash

if [ "${TRAVIS_PULL_REQUEST_BRANCH:-$TRAVIS_BRANCH}" != "deploy" ]; then
    REMOTE_URL="$(git config --get remote.origin.url)";
    # Clone the repository fresh..for some reason checking out master fails
    # from a normal PR build's provided directory
    cd ${TRAVIS_BUILD_DIR}/.. && \
    git clone ${REMOTE_URL} "${TRAVIS_REPO_SLUG}-bench" && \
    cd  "${TRAVIS_REPO_SLUG}-bench" && \
    # Bench master
    git checkout develop && \
    echo ${TRAVIS_COMMIT} > hellofile && \
    # Bench variable
    git checkout ${TRAVIS_COMMIT} && \
    echo ${TRAVIS_COMMIT} > byefile && \
    cat hellofile && \
    cat byefile
fi
