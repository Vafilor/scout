Introduction
============

Scout is a cross platform File Browser. At the moment, functionality is pretty limited. Try back later.

![Sample video showing file browsing](/sample/demo.gif)

## Features
* List File names
* Navigate across directories and drives
* View basic image, video, and text files
* Use arrow keys (<- and ->) to navigate files while viewing in a directory

## Why?

Two problems

- [ ] Handle Why 1?

I have a lot of photos on a windows machine in HEIC format. Some folders have thousands of images.
My goal is to organize them into folders like cats, weather, etc. But it takes a while for windows explorer
to generate thumbnails for all of the photos and videos. Worse yet, there's no way (afaik) to trigger the process for all files in a folder - so I have to scroll, wait. Scroll, wait. Directory Opus does a decent job, 
but the image cache size seemed to be not working when I tried it last, so the images generated then regenerated later. Maybe this is fixed now.

- [ ] Handle Why 2?

I want to be able to see images and navigate forward/back with arrow keys. Windows 10/11 kinda does this with the default photo app, but sometimes it has a hard time figuring next/previous images. I could swear it worked in Windows 7, but, who knows.

I want to see if I can create an electron program to help me with these problems.

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
- [ ] Cache image icons
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