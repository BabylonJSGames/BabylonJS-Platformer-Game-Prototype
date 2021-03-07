# KZ Climbing - A BabylonJS game prototype
This project is a BabylonJS 3d platformer game prototype, in some ways similar to "KZ" maps in Counter Strike. It uses the built-in BabylonJS collision system for detecting collisions between the player and the platforms.

The project is written in TypeScript both server and client side.

## Disclaimer
The project is work-in-progress, and contains several incomplete features and bugs.

There is no intention of any future work on this project.

This is only ment as a public demonstration of how to use babylonjs and colyseus.

## Setup locally
1. Download and install [Nodejs](https://nodejs.org/en/) if you haven't already.
2. Download and install [Typescript](https://www.typescriptlang.org/).
3. Clone this [repo](https://github.com/BabylonJSGames/BabylonJS-Platformer-Game-Prototype.git) to your local machine.
4. Open a terminal and navigate to the *server* directory and run the command `npm install` followed by `npm run dev` to start the server
5. Open a new terminal and navigate to the *client* directory and repeat the process above to start the client.
6. A browser window should now automatically open. If not, go to [localhost:8080](http://localhost:8080/).

### Colysues monitor
7. Go http://localhost:8081/colyseus/#/. You can now monitor clients in any room, read more about it her: https://docs.colyseus.io/tools/monitor/.

### Colysues Load testing
8. Open a terminal and navigate to the root folder *BabylonJS-Platformer-Game-Prototype*.
9. Install npx by running the command `npm install -g npx`.
10. Run the command `npx colyseus-loadtest server/src/loadtester/LoadTester.ts --room GameRoom --numClients 50 --endpoint ws://localhost:8081`.
11. You can adjust the numer of clients connected to the server by changing *--numClients*.
12. Go to *http://localhost:8081/colyseus/#/* to check out the number of clients connected in which room. 

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
9. Make sure that `https://github.com/timanovsky/subdir-heroku-buildpack.git` is highest up in the build pack!!!
10. Now go press on *deploy* tab and sroll down and press on *deploy branch*
11. You should see it build and after a few seconds it should be finished.
12. Now scroll up and press on *more* and choose *view logs*
13. If everything is well you should be able to spot the output *listening on http://localhost:xxxx* in the logs

### Netlify (client side) 
14. Create a new site *new site from git* and connect to your github choosing the forked repo.
15. Press *deploy site*.
16. Go to *site settings* and press *change site name* and change it to what ever you like then press *save*.
17. The site will be deployed at https://WhatEverYouNamedIt.netlify.app/client/public/index.html. 
18. Then press on *build and deploy*.
19. Press *edit build settings*.
20. *Base birectory* should be set to *client*, *build command* should be *npm run build* and *public directory* should be *client/*, then press *save*.
21. Go to *deploy* and press *Trigger deploy* then choose *clear cashe and deploy site*.
22. Now client side should be up and running.
23. If you go to https://WhatEverYouNamedIt.netlify.app/client/public/index.html in your browser you should be able to play the game with friends now.

## Guide to making your own maps in Blender3D
1. Download and install [Blender](https://www.blender.org/).
2. Download and install the [Blender to Babylon.js exporter](https://doc.babylonjs.com/extensions/Exporters/Blender). In there you will also find additional information about the various features that are supported by the exporter.
    - Make sure the exporter is compatible with your version of Blender, otherwise you might have to downgrade it.
3. Open the file *client/public/assets/scenes/blender/templateLevel.blend* in Blender.
4. You will create the level by placing new meshes. Feel free to use any mesh shape or form as you like. The following naming conventions for meshes are used to define the type of a mesh:
    - Mesh contains the word __Collider__, e.g. *ColliderBox*, *SphereCollider*: The mesh will be part of the babylonjs collision engine and collisions between the player and this mesh will be detected.
    - Mesh is named __Spawn__: The player will spawn at the position of this mesh. The mesh will be deleted from the scene on load. This mesh is required for the level to be valid.
    - Mesh is named __Goal__: When the player collides with this mesh, the level has been completed. This mesh is also required for the level to be valid.
    - Mesh is named __LookAt__: At spawn, the player will initially look towards the position of this mesh. The mesh will be deleted from the scene on load. If this mesh is not found, lookAt will default to the zero vector.
    - Mesh does not follow any of the naming rules above: These are decorative meshes and they won't be part of the collision system.
5. Create light source(s) and name them as you like. If the scene does not include a light source, a hemispheric light will automatically be inserted after the level import.
6. Export your level by selecting *File->Export->Babylon.js ver 2.xx.x* (or whichever version you have).
7. Move your exported .babylonjs file into the project at *client/public/assets/scenes/*.
8. In the `Config.ts` file, set the `levelName` variable to the name of your exported file, e.g. if your file is located at *client/public/assets/scenes/level.babylonjs*, put in *level.babylonjs*, without the full path.
9. Rebuild the project.

### Additional notes:
- After importing the level, the following will be added to the scene:
    - Two cameras (First-person and third-person view).
    - A hemispheric ambient light (although you can provide your own light source in the blender scene and this will be replaced).
- You are free to use whichever mesh shapes, sizes and textures as you please. This includes the __Goal__ mesh and the __Collider__ meshes as well.
- The player has a width of 4 and a height of 8. The player can crouch to a height of 4 instead. Take this into account when creating your level.
- You will very likely have to play around with the level to ensure the player controls match well with the level design and layout.
