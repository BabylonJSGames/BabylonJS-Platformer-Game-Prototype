# KZ Climbing - A BabylonJS game prototype
This project is a BabylonJS 3d platformer game prototype, in some ways similar to "KZ" maps in Counter Strike. It uses the built-in BabylonJS collision system for detecting collisions between the player and the platforms.

The project is written in TypeScript..

## Disclaimer
The project is work-in-progress, and contains several incomplete features and bugs.

There is no intention of any future work on this project.

## Setup
1. Download and install [npm](https://www.npmjs.com/get-npm) if you haven't already.
2. Open a terminal and navigate to the *server* directory and run the command `npm install` followed by `npm run dev` to start the server
3. Open a new terminal and navigate to the *client* directory and repeat the process above to start the client.
4. A browser window should now automatically open. If not, go to [localhost:8080](http://localhost:8080/).

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
