# KZ Climbing - A BabylonJS and Colyseus game prototype
This project is a multiplayer 3d platformer game prototype. The game is similar to "KZ" maps in Counter Strike. It utilises the [BabylonJS](https://www.babylonjs.com/) framework for rendering and the [Colyseus](https://www.colyseus.io/) framework for the multiplayer aspect.

The project is written purely in TypeScript.

An online version of the game can be found here: https://kzclimbing.netlify.app/client/public/index.html

![Demo](play.gif)

## How to setup project locally
1. Download and install [Nodejs](https://nodejs.org/en/) if you haven't already.
2. Download and install [Typescript](https://www.typescriptlang.org/).
3. Clone this repo to your local machine.
4. Open a terminal and navigate to the *server* directory and run the command `npm install` followed by `npm run dev` to start the server
5. Open a new terminal and navigate to the *client* directory and repeat the process above to start the client.
6. A browser window should now automatically open. If not, go to [localhost:8080](http://localhost:8080/).

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
7. Export your level by selecting *File->Export->Babylon.js ver 2.xx.x* (or whichever version you have).
8. Move your exported .babylonjs file into the project at *client/public/assets/scenes/*.
9. In the `Config.ts` file, set the `levelName` variable to the name of your exported file, e.g. if your file is located at *client/public/assets/scenes/level.babylonjs*, put in *level.babylonjs*.
10. Reload the page.

### Additional notes:
- After importing the level, the following will be added to the scene:
    - Two cameras (First-person and third-person view).
    - A hemispheric ambient light (if no light source exists in the imported file).
- The player has a width of 4 and a height of 8. The player can crouch to a height of 4 instead. Take this into account when creating your level. The cylinder mesh in `templateLevel.blend` has these metrics, so you can use this for reference.
- You will very likely have to play around with the level to ensure the player controls match well with the level design and layout.

## Disclaimer
The project is work-in-progress, and contains several incomplete features and bugs. The project is only meant as a public demonstration of Babylonjs and Colyseus.

There is no intention of any future work on this project.
