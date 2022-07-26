# AiArt changelog

## 2.1.4 --26th July, 2022

 * :envelope: When you add reaction ":envelope" to any message with images bot will them to you in DM

 * :card_file_box: Add mongo database

  * :monocle_face: Add graphql for data exploration

  * :whale: Update docker files

  * :bug: Fix bug wih command scoping
## 2.0.0 -- 18th July, 2022

* :bricks: Switched to NestJs framework

* :white_check_mark: Added tests

* :white_check_mark: Added codecov coverage reporter

* :white_check_mark: Added automated testing workflow

* :goal_net: Added support for [sentry.io](https://sentry.io) error reporter

* :whale: Fixed docked files

* :art: Switched documentatin generation engine to [compodoc](https://compodoc.app)

* :necktie: Created custom amqp client wrapper for Nestjs

* :memo: Added ToS and Privacy policy files for github bot verification process

* :wrench: Switch configuration from .env file to yaml file with environment variable substitution


## 1.6.0 -- 11t July, 2022

* :necktie: Fully containerized deployment 

* :rabbit: RabbitMQ channels are now being closed automatically

* :rabbit: RabbitMQ connection is started before in started class.

* :art: Graceful shutdown 

## 1.5.0 -- 4th July, 2022

* :necktie: Added command queueing

## 1.4.5 -- 27th June, 2022

<p>

* :robot: Add `/help` command showing all other commands
    
    <p align="center">
        <img src="https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/help-showcase.gif" />
    </p>

</p>

## 1.4.0 -- 27th June, 2022
<p>

* :whale: Add Dockerfile and docker-compose.yml

</p>

<p>

* :robot: Add `/cog-view-2` command for generating images using CogView2 model  

</p>

<p>

* :capital_abcd: Add command categorization

    <p align="center">
        <img src="https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/command-selection.png"/>
    </p>

</p>

<p>

 * :bulb: Improve comments

</p>


<p>

 * :bulb: Improve comments

</p>

<p>

 * :loud_sound: Improve logging 

</p>


<p>

* :wastebasket: General code cleanup

</p>

## 1.3.0 -- 20th June, 2022

<p>
* Add `/story command`
</p>

## 1.2.0 -- 16th June, 2022

<p>
    * Bot does not mention user when processing of command fails (produced ugly output)
</p>
<p>
    * Bot loads commands automatically after joining guild, no need for restart anymore. 
        <img src="https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/auto-add-commands-log.png" /> 
</p>
<p>
* Fix frequent timeout from dall-e mini
</p>
<p>
* Improve code readability
</p>
* Add canvas library build as it was not triggering
</p>
