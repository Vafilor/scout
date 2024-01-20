Introduction
============

Scout is a cross platform File Browser. At the moment, functionality is pretty limited. Try back later.

![Sample video showing file browsing](/sample/demo.gif)

## Features
* List File names
* Navigate across directories and drives
* View basic image, video, and text files
* Use arrow keys (<- and ->) to navigate files while viewing in a directory
* Create and show icons for images, including heic files, and video files
* View heic files 


## Why?

Two problems

- [ ] Handle Why 1?

I have a lot of photos on a windows machine in HEIC format. Some folders have thousands of images.
My goal is to organize them into folders like cats, weather, etc. But it takes a while for windows explorer
to generate thumbnails for all of the photos and videos. Worse yet, there's no way (afaik) to trigger the process for all files in a folder - so I have to scroll, wait. Scroll, wait. Directory Opus does a decent job, 
but the image cache size seemed to be not working when I tried it last, so the images generated then regenerated later. Maybe this is fixed now.

- [x] Handle Why 2?

I want to be able to see images and navigate forward/back with arrow keys. Windows 10/11 kinda does this with the default photo app, but sometimes it has a hard time figuring next/previous images. I could swear it worked in Windows 7, but, who knows.

I want to see if I can create an electron program to help me with these problems.

## Build

The build produces different artifacts on different operating systems. 
If you encounter an issue with packaging or building (possibly with ffmpeg)
try clearing the `node_modules` folder and running npm install again.

See `Ffmpeg binary` below for more details. 

### Thumbnail Generation

#### Ffmpeg binary

To create video thumbnails, ffmpeg is used. This is bundled with the app.
The process is a bit round-a-bout right now. 

1. [Ffmpeg-static](https://github.com/eugeneware/ffmpeg-static), an NPM package, is used to download an appropriate version based on the OS
2. An environment variable, APP_MODE, is used to determine how to properly build for developoment vs packaging.
3. APP_MODE = dev: during the build process with Webpack, this binary is copied into the output. Then, the permissions are modified to make it executable.
4. APP_MODE != dev: the forge.config.js has `extraResources` set to copy ffmpeg
5. The app uses `src/configuration/constants.ts` to determine the proper path for the ffmpeg binary for the main app code, or for the workers.

Ideally this could be done with a loader, and this mostly works with asset/resource, but I haven't found a nice way to add execution permissions.

#### Fluent-ffmpeg

To use Ffmpeg, [Fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) is used. 
This doesn't play nicely with webpack as of `2.1.24` due to conditional imports in the `index.js` file.
It also seems to create issues with building on windows and loading other modules. For this reason, it
is currently copied over with `CopyPlugin` (see webpack.main.config.ts), and marked as external. 

## Sources

* Icons are from [Bootstrap](https://icons.getbootstrap.com/). Thanks Bootstrap!

## Next up

- [ ] Add modified timestamp, file type and size to table list
- [ ] Allow sorting table list
- [ ] Allow searching table list by prefix
- [x] When using arrow keys and viewing a file, go back/foward
- [ ] Add a UI to indicate going forward/back when viewing a file
- [ ] Add footer UI to indicate info: total files in directory, how many selected, total size selected
- [ ] View hidden files correctly on windows
- [x] Cache image icons
- [x] Create video thumbnails
- [ ] Set up left hand panel with favorites. Drag to change size.
- [x] View basic files like txt and images
- [ ] Move files
- [ ] Copy files
- [ ] Folder sizes
- [ ] Select file and multiple files 
- [ ] Upgrade to tslint strict
- [ ] remove unused packages
- [x] On windows, when you go to root "/", display the list of drives to go to
- [ ] Update top menu to indicate current state of file listing mode. Is it table or icons?
- [ ] Update top menu to have dropdowns with options like view hidden files 
- [ ] Support image caching for thumbnails of various sizes
- [ ] Choose a file thumbnail size
- [ ] Better Readme with screenshots and gifs