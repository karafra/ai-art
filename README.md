<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/karafra/ai-art">
    <img src="https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">AI Art</h3>

  <p align="center">
    Discord bot generating AI art collages
    <br />
    <a href="https://karafra.github.io/ai-art/ "><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://discord.gg/VDKhbrc73Z">View Demo</a>
    ·
    <a href="https://github.com/karafra/ai-art/issues">Report Bug</a>
    ·
    <a href="https://github.com/karafra/ai-art/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">

  [![Product Name Screen Shot][product-screenshot]]()

</div>

Simple discord bot which generates collages based on any query you give it (most of the time). This bot uses model which you can find [here](https://huggingface.co/spaces/dalle-mini/dalle-mini)

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

-   [Typescript](https://www.typescriptlang.org/)
-   [Discord.js](https://discord.js.org/)
-   [Collage](https://www.npmjs.com/package/@settlin/collage)
-   [Canvas](https://www.npmjs.com/package/canvas)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1. Create Discord application on a free API Key at [https://discord.com/developers/](https://discord.com/developers/)

2. Click on *Bot* tab and save your token.

3. Clone the repo
    ```sh
    git clone https://github.com/karafra/ai-art.git
    ```
4. Install NPM packages
    ```sh
    npm install
    ```
5. Enter your API key and bot id into [.env](./.env). REquired scopes for 
    ```js
    BOTID = 'ENTER YOUR BOT ID';
    TOKEN = 'ENTER YOUR API';
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- DEPLOYMENT -->

## Deployment

Recommended method of deploying this bot is deployment on [Heroku](https://www.heroku.com/). To deploy to Heroku please click on button bellow.

<p align="center">
<a href="https://heroku.com/deploy?template=https://github.com/karafra/ai-art.git">
  <img src="https://img.shields.io/badge/%E2%86%91_Deploy_to-Heroku-7056bf.svg?style=for-the-badge" alt="Deploy">
</a>
</p>

##### IMPORTANT
After successful deployment you will have to switch dyno from `web` to `worker`. If you do not do this, app will not bind to port and fail. 

After successful deployment you can invite bot to your server by clicking on this link `https://discord.com/api/oauth2/authorize?client_id={CLIENT_ID}&permissions=34816&scope=applications.commands%20bot`, where `CLIENT_ID` is your bots client id.

Link already contains minimal scopes (_bot_, _application.commands_) and minimal bot permissions (_send messages_, _attach files_)

<img src="https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/heroku-dynos.png" />

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Simply type `/art {query}` into discord chat and bot will react.

_For more examples, please refer to the [Documentation](karafra.github.io/ai-art/)_

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the Apache2.0 License. See [LICENSE](./LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@Karafro](https://twitter.com/Karafro) - dariusKralovic@protonmail.com

Project Link: [https://github.com/karafra/ai-art](https://github.com/karafra/ai-art)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

-   [Dalle mini](https://github.com/borisdayma/dalle-mini)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/karafra/ai-art.svg?style=for-the-badge
[contributors-url]: https://github.com/karafra/ai-art/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/karafra/ai-art.svg?style=for-the-badge
[forks-url]: https://github.com/karafra/ai-art/network/members
[stars-shield]: https://img.shields.io/github/stars/karafra/ai-art.svg?style=for-the-badge
[stars-url]: https://github.com/karafra/ai-art/stargazers
[issues-shield]: https://img.shields.io/github/issues/karafra/ai-art.svg?style=for-the-badge
[issues-url]: https://github.com/karafra/ai-art/issues
[license-shield]: https://img.shields.io/github/license/karafra/ai-art.svg?style=for-the-badge
[license-url]: https://github.com/karafra/ai-art/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/showcase.gif