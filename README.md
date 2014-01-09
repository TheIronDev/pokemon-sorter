License
===

This Web-app was built with the intention of enhancing the Pokemon experience. It is an open source project that is copyright and licensed under the MIT license. (see LICENSE)

All Pokemon data and images are sole property of Nintendo and GameFreak, Inc. The location data was gathered from Serebii.net, image sprites gathered from pokemondb.net, and various other pokemon data was gathered from Veekun's pokedex project.

Contributers:
Tyler Stark
Michael Yao

Build Script
===
node r.js -o build.js

Version History
===
Version 2.0
Yes, I did just jump an entire number for versioning.  Between versions 1 and 2 I added the following:

* Import/Export
* All the Pokemon from X/Y
* The option to list pokemon based on different Pokedexes.

Version 1.0
I went back and cleaned up the javascript, moving the code over to the AMD model and minifying all javascript assets. Functionality is still the same, but cleaner code.

Version 0.9
The app now persists upon browser refresh using localStorage.js

Version 0.8
The app is in a workable state. Currently, data does not persist upon browser refresh, and the overall implementation does not work well on smaller devices. Those two features are my requirement for incrementing to version 1 and rolling this out live.
