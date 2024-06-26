[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://GitHub.com/Naereen/)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/reol224/spotify-clone-jos/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/reol224/spotify-clone-jos/tree/master)

# Spotify Clone JOS

A Spotify clone built by Java Open Source Group

# How to get involved

Find a task you want to work on from the [project board](https://github.com/IVIURRAY/spotify-clone-jos/projects)
   - [Backend Board](https://github.com/IVIURRAY/spotify-clone-jos/projects/1)
   - [Frontend Board](https://github.com/IVIURRAY/spotify-clone-jos/projects/3)

# How to Contribute?

First off, thank you for wanting to contribute! :thumbsup:

1) Fork this repo

2) Make your changes on a branch, for  example `feature/<my-cool-feature>`

3) Raise a pull request!
* Follow [this](https://www.dataschool.io/how-to-contribute-on-github/amp/) guide if the above does not make sense!

# How to setup Spotify Auth

For this to work, you need to have a Spotify [Application](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/) registered.

1) [Go here](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/) and register an application
2) This will allow you to get a `client id` and `secret id,` which you need to authenticate to Spotify.
3) Replace your `client id` and `secret id` in the [`application.properties`](https://github.com/IVIURRAY/spotify-clone-jos/blob/master/backend/src/main/resources/application.properties) file.
4) Make sure you add this URL `http://localhost:8080/api/spotify-auth` in the Spotify Dashboard, otherwise it will not work!

# How to run the backend?

1) Make sure your `client id` and `secret id` are in [application.properties](backend/src/main/resources/application.properties).
2) Run `SpotifyCloneApplication.java`

# How to run the frontend?

1) `cd frontend`
2) `npm i && npm start` (given you've `npm` installed)
