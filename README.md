# Wi DAQ Node-Red nodes (Alpha)
The Rasberry Pi end of the Wi-DAQ control system.  Install this in the node-red userDir (~/.node-red by default) to use Wi-DAQ nodes which can make the Pi visible to your Wi-DAQ server and able send and recieve data and remote control.
## Installation
- Navigate to your node-red user folder in your terminal of choice.  By default the user folder is $HOME/.node-red. You can set it to something else by passing the --userDir argument when running node-red from the command line, [*according to this docs page*](https://nodered.org/docs/user-guide/runtime/configuration).
- Once you're there run

    ```
    npm i node-red-widaq
    ```
    or
    ```
    yarn add node-red-widaq
    ```
    if you perfer yarn.
- (Optional step) The widaq type system uses [the GraphQL Type language](https://graphql.org/learn/schema/#type-language) to help validate MQTT input and output as well as making it easier to use the website by providing topic and property descriptions.  By default node-red's text editor does not include highlighting or syntax linting for GraphQL. Unfortunately, node-red make adding this quite difficult and provides no way for npm package to install new highlighting. Skiping this step does not stop you from writting in the text editor, but if you would like highlighting and linting while editing run the command bellow from the userDir.
    ```
    node node_modules/node-red-widaq/config/install-mode-graphqlschema.js
    ```
    __Warning:__ Installation scripts like the one above are very dificult to test, and you may run into and error using the one above.  When you run into an error with it, please leave an issue on this GitHub repository.  To manually install, see the [Manually Installing GraphQL Highlighting and Linting](#manual) section below.

## Useage

## Manually Installing GraphQL Highlighting and Linting <a name="manual"></a>
- Navigate to your node-red install.  If you installed it locally in folder, navigate to that. If you installed globally the path will be the following
    ### Mac OS/Linux
    ```
    /usr/local/lib/node_modules/node-red
    ```
    ### Windows 7, 8, and 10
    ```
    %USERPROFILE%\AppData\Roaming\npm\node_modules\node-red
    ```
    ### Windows XP
    ```
    %USERPROFILE%\AppData\npm\node_modules\node-red
    ```
    *Note: These paths are denpendent on how you have installed npm and node, so they maybe incorrect for you.  If these don't work try* `echo $NODE_PATH` *to see if the global node_modules path is set to something else.  If that still doesn't work the* `npm list -g` *tells you where all global packages are installed.  Look for node-red package and navigate to the install folder.*
- Now that you're there, you're going to need to navigate to the ace editor folder inside node-red's @node-red package. The path relative to the node-red folder is
    ```
    /node-red/node_modules/@node-red/editor-client/public/vendor/ace
    ```
- Now that you're in the vendor folder we need to add the [mode-graphqlschema.js](/config/mode-graphqlschema.js) file to this folder.  Run the following command to do that.
    ### Mac OS/Linux
    ```
    wget -d https://raw.githubusercontent.com/henhen724/node-red-widaq/master/config/mode-graphqlschema.js
    ```
    ### Windows Powershell
    ```
    Invoke-WebRequest https://raw.githubusercontent.com/henhen724/node-red-widaq/master/config/mode-graphqlschema.js -OutFile mode-graphqlschema.js
    ```
    ### Windows CMD
    Extraordinarily, CMD does not have a tool to make a HTTP get request.  Please either use powershell, or install wget and use the wget command above.
