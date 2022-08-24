<div align="center">
    <h1> Available commands </h1>
</div>

<div id="top"></div>

<!-- Table of contents -->
<details>
    <summary> List of all commands </summary>
    <ol>
        <li>
            <a href="#help">/help</a>
        </li>
        <li>
            <a href="#ai-story">/ai-story</a>
            <ul href="#ai-story">
                <li><a href="#open-ai">open-ai</a></li>            
            </ul>
        </li>
        <li>
            <a href="#ai-art">/ai-art</a>
            <ul>
                <li><a href="#dalle-mini">dalle-mini</a></li>
                <li><a href="#wombo-dream">wombo-dream</a></li>
                <li><a href="#cog-view2">cog-view2</a></li>
            </ul>
        </li>
    </ol>
</details>

<div id="help">
    <h2> /help </h2>
    <p>This command is used for displaying inside any Discord client. Help can be scrolled through by clicking buttons in the bottom part of <i>Help embed</i></p>
    <img src="https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/help-showcase.gif" alt="Gif showing how help looks and functions"> 
</div>

<div id="ai-story">
    <h2> /ai-story </h2>
    Container holding all commands related to text based art generation, where text based does not mean ASCII art or similar things but story like forms of <i>art</i> instead    
    <br>
    <div id="open-ai">
        <h3>open-ai</h3>
        <p> This command uses <a href="https://openai.com">Open Ai</a> models to generate short "stories" in given style and matching your short description </p>
        <h4>Parameters:</h4>
        <ul>
            <li>
                <b>headline:</b> headline you would give to your story
            </li>
            <li>
                <b>model:</b> model from OpenAI model collection you want to use (defaults to davinci-instruct2)
            </li>
        </ul>
        <i>⚠️ This command is currently not available in main deployment, in order to use it you have to deploy bot yourself., ⚠️</i>
    <br>
    </div>
</div>

<br>

<div id="ai-art">
    <h2> /ai-art </h2>
    Container holding all command related to visual art generators such as images or NFTs
    <br>
    <div id="dalle-mini">
        <h3>dalle-mini</h3>
        <p> This command uses <a href="https://www.craiyon.com/">DalleMini</a> model to generate images based on given prompt</p>
        <h4>Parameters:</h4>
        <ul>
            <li>
                <b>prompt:</b> prompt describing image you want to generate
            </li>
        </ul>
        <img src="https://raw.githubusercontent.com/karafra/ai-art/main/.github/images/showcase.gif" alt="GIF showcasing dalle mini command">
    </div>
    <br>
    <div id="wombo-dream">
        <h3>wombo-dream</h3>
        <p> This command uses <a href="https://app.wombo.art/">Wombo Dream</a> model to generate images based on given prompt and style</p>
        <h4>Parameters:</h4>
        <ul>
            <li>
                <b>prompt:</b> prompt describing image you want to generate
            </li>
            <li>
                <b>style:</b> style of image you want to generate. List of all styles can be seen <a href="https://app.wombo.art/">here</a>.   
            </li>
        </ul>
        <img src="https://cdn.discordapp.com/attachments/984920367535652927/1011648542399529010/preview.gif" alt="GIF showcasing wombo-dream command">
    </div>
    <br>
    <div id="cog-view2">
        <h3>cog-view2</h3>
        <p> This command uses <a href="https://github.com/THUDM/CogView2">CogView2</a> model to generate images based on given prompt and style</p>
        <h4>Parameters:</h4>
        <ul>
            <li>
                <b>prompt:</b> prompt describing image you want to generate
            </li>
            <li>
                <b>style:</b> style of image you want to generate..   
            </li>
        </ul>
        <i>⚠️ This command is currently being considered for removal as it was very unstable lately ⚠️</i>
    </div>
</div>