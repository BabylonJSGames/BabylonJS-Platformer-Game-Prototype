# KZ Climbing - A BabylonJS and Colyseus game prototype
This project is a multiplayer 3d platformer game prototype. The game is similar to "KZ" maps in Counter Strike. It utilises the [BabylonJS](https://www.babylonjs.com/) framework for rendering and the [Colyseus](https://www.colyseus.io/) framework for the multiplayer aspect. It is a very strong boilerplate that can be used by beginners.

The project is written in TypeScript, HTML and CSS.

An online version of the game can be found here: https://kzclimbing.netlify.app

![Demo](play.gif)

What this project includes:
1. A well documented cliet side BabylonJS prototype
  - Animation, lightning and shadows, camera (1. and 3. person), 
  - UI and Audio
  - Homade "physics" and built-in collision system.
  - Easy and understandable gamme loop code setup.
2. A well decumented server side Colyseus prototype
  - Handling data from multiple clients
  - Implementation for cloyseus schema (client and server side)
  - Simple chat functionality
  - Colyseus monitor and loadtest for serverside
3. Contains a [config.ts](https://github.com/BabylonJSGames/BabylonJS-Platformer-Game-Prototype/blob/master/client/src/Config.ts) file used for changing important parameters
4. A guide on how to create your own level and import it to Babylon from blender.
5. Examples for how to setup webpack.xxx.js, tsconfig.json and package.json files
6. An easy guild on how to deploy the game locally and online using netlify with heroku

What this project does not include:
1. Client-side Liner interplation(LERP) funcitonality
2. BabylonJS NullEngine on server side for collision detection
  - Used to prevent clients from cheating
4. A Lobby
5. Leader scoreboard
6. Login authentication

## How to setup project locally
1. Download and install [Nodejs](https://nodejs.org/en/).
2. Download and install [Typescript](https://www.typescriptlang.org/).
3. Clone this repo to your local machine.
4. Open a terminal and navigate to the *server* directory and run the command `npm install` followed by `npm run dev` to start the server
5. Open a new terminal and navigate to the *client* directory and repeat the process above to start the client.
6. A browser window should now automatically open. If not, go to [localhost:8080](http://localhost:8080/).

### Colysues monitor
7. Go http://localhost:8081/colyseus/#/. You can now monitor clients in any room, read more about it her: https://docs.colyseus.io/tools/monitor/.

### Colysues Load testing
8. Open a terminal and navigate to the root folder *BabylonJS-Platformer-Game-Prototype*.
9. Install npx by running the command `npm install -g npx`.
10. Run the command `npx colyseus-loadtest server/src/loadtester/LoadTester.ts --room GameRoom --numClients 50 --endpoint ws://localhost:8081`.
    - You can adjust the numer of clients connected to the server by changing *--numClients*.
    - Go to *http://localhost:8081/colyseus/#/* to check out the number of clients connected in any rooms. 

## Setup using netlify(client side) and heroku(server side).
1. Create an account both on netlify and heroku.
2. Fork this [repo](https://github.com/BabylonJSGames/BabylonJS-Platformer-Game-Prototype.git) to your own github. 

### Heroku (Server side)
3. Create a new app and give it a name, then choose a region.
4. Choose github as deploy method and find the forked repo on your github then press *connect*.
5. Now press on *settings* tab and the press on *reveal config vars*.
6. Key should be `PROJECT_PATH` and value should be `server`, then press *add*.
7. Now press *add build pack* and add this: `https://github.com/timanovsky/subdir-heroku-buildpack.git` then press *save changes*.
8. Again press *add build pack* this time also add nodejs then press *save changes*.
    - Make sure that `https://github.com/timanovsky/subdir-heroku-buildpack.git` is highest up in the build pack!!!
9. Now go press on *deploy* tab and sroll down and press on *deploy branch*
    - You should see it build and after a few seconds it should be finished.
10. Now scroll up and press on *more* and choose *view logs*
    - If everything is well you should be able to spot the output *listening on http://localhost:xxxx* in the logs

### Netlify (client side) 
11. Create a new site *new site from git* and connect to your github choosing the forked repo.
12. Press *deploy site*.
13. Go to *site settings* and press *change site name* and change it to what ever you like then press *save*.
    - The site will be deployed at https://WhatEverYouNamedIt.netlify.app 
14. Then press on *build and deploy*.
15. Press *edit build settings*.
16. *Base birectory* should be set to *client*, *build command* should be *npm run build* and *publish directory* should be *client/public*, then press *save*.
17. Go to *deploy* and press *Trigger deploy* then choose *clear cashe and deploy site*.
    - Now client side should be up and running.
    - If you go to https://WhatEverYouNamedIt.netlify.app in your browser you should be able to play the game with friends now.

## Guide to making your own maps in Blender
1. Download and install [Blender](https://www.blender.org/).
2. Download and install the [Blender to .babylonjs exporter](https://doc.babylonjs.com/extensions/Exporters/Blender). In there you will also find additional information about the features that are supported by the exporter.
    - Make sure the exporter is compatible with your version of Blender.
3. Open the file *client/public/assets/scenes/blender/templateLevel.blend* in Blender.
4. You will create the level by placing new meshes. Feel free to use any mesh shape as you like. The following naming conventions for meshes are used to define the type of mesh:
    - Mesh contains the word __Collider__, e.g. *ColliderBox*, *SphereCollider*: The mesh will be part of the Babylonjs collision engine and collisions between the player and this mesh will be detected.
    - Mesh is named __Spawn__: The player will spawn at the position of this mesh. The mesh will be deleted from the scene on load. This mesh is required for the level to be valid.
    - Mesh is named __Goal__: When the player collides with this mesh, the level has been completed. This mesh is also required for the level to be valid.
    - Mesh is named __LookAt__: At spawn, the player will initially look towards the position of this mesh. The mesh will be deleted from the scene on load. If this mesh is not found, lookAt will default to the zero vector.
    - Mesh does not follow any of the naming rules above: These are decorative meshes and they won't be part of the collision system.
5. Feel free to add light source(s) and shadows as you see fit. If the scene does not include a light source, a hemispheric light will automatically be inserted after the level import.
6. Create Shadows by selecting meshes and checking the cast shadows and recieve shadows properties in blender.
7. Export your level by selecting *File->Export->Babylon.js ver 2.xx.x* (or whichever version you have).
8. Move your exported .babylonjs file into the project at *client/public/assets/scenes/*.
9. In the `Config.ts` file, set the `levelName` variable to the name of your exported file, e.g. if your file is located at *client/public/assets/scenes/level.babylonjs*, put in *level.babylonjs*.
10. If doing this locally, then just reload the page.
11. If on netlify push the changes to yor forked github repo and rebuild netlify, see step 17 under section Netlify (client side)
    - No need to update heroku.
12. You should now be able to play your level through.

### Additional notes:
- After importing the level, the following will be added to the scene:
    - Two cameras (First-person and third-person view).
    - A hemispheric ambient light (if no light source exists in the imported file).
- You are free to use whichever mesh shapes, sizes and textures as you please. This includes the Goal mesh and the Collider meshes as well.    
- The player has a width of 4 and a height of 8. The player can crouch to a height of 4 instead. Take this into account when creating your level. The cylinder mesh in `templateLevel.blend` has these metrics, so you can use this for reference.
- You will very likely have to play around with the level to ensure the player controls match well with the level design and layout.
- ~~Some lights and shadows functionalities is missing for the blender to BabylonJS exporter, this might help you out: https://forum.babylonjs.com/t/exporting-shadows-from-blender-to-babylon-js/18580/5. ~~ EDIT!! This seems to have been solved in the 2.93 version of the blendet exporter.
- For best shadows and light, look into the [level1.BABYLON](https://github.com/BabylonJSGames/BabylonJS-Platformer-Game-Prototype/blob/master/client/public/assets/scenes/Level1.babylon) for inspiration, scroll down to *Lights* and *shadowGenerators*, also check out the forum link above.

## Disclaimer
The project is work-in-progress, and contains several incomplete features and bugs. The project is only meant as a public demonstration of Babylonjs and Colyseus.

There is no intention of any future work on this project.

## Inspiration and thanks
Some inspiration for how to generally use Colyseus: 
1. https://github.com/endel/colyseus-babylonjs-boilerplate
2. https://github.com/colyseus/unity-demo-shooting-gallery
3. https://github.com/endel/mazmorra
4. https://github.com/creationspirit/multiplayer-browser-game-boilerplate
5. https://www.youtube.com/watch?v=s3ZrQbI5o_k&ab_channel=Moby
6. https://www.youtube.com/watch?v=x-bbflZvuXE&ab_channel=Ourcade
7. https://www.youtube.com/watch?v=M9RDYkFs-EQ

Thanks to all of those who created the repos and youtube video. 

Thanks to especially the Colyseus and BabylonJS community. 

## License
This project is made by [Jacob Pjetursoon](https://github.com/JacobPjetursson) and [Fadi Bunni](https://github.com/orgs/BabylonJSGames/people/FadiBunni)

See the [LICENSE](https://github.com/BabylonJSGames/BabylonJS-Platformer-Game-Prototype/blob/master/LICENSE.MD) file for license rights and limitations (MIT).
