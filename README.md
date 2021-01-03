# gamecode.js
Copyright 2010-2021 Adam Nielsen <<malvineous@shikadi.net>>  

This is a Javascript library that can modify executable files for a number of
MS-DOS games from the 1990s.  It allows simple changes like modifying the text
displayed in the user interface, to more complex changes like patching the code
itself at runtime to change the game's behaviour.

Note that the library is still in the very early stages of development, so most
of this functionality has not yet been implemented!

Some game executables have large data chunks.  This library's focus is on small
bits of data and so it does not provide access to those large chunks.  Instead,
those are accessible through gamearchive.js as an archive file.

## Game support

The library currently supports these games:

 * Cosmo's Cosmic Adventure (episode 1)

Eventually, the patching functionality will work on any .exe file, specific game
support is only needed for things like changing the text messages hard-coded
into the game.

## Installation as an end-user

If you wish to use the command-line `gamecode` utility to work with game
executables directly, you can install the library globally on your system:

    npm install -g @camoto/gamecode

For Arch Linux users the AUR package `gamecodejs` is also available.

### Command line interface

The `gamecode` utility can be used to manipulate executable files.
Commands are specified one after the other as parameters.  Use the
`--help` option to get a list of all the available commands.  Some
quick examples:

    # List available text strings that can be edited
    gamecode open cosmo1.exe list
    
    # Change a text string
    gamecode open cosmo1.exe set filenames.music.1 mysong.mni save cosmo1-new.exe
    
    # Build a run-time patch file from the differences between the new and
    # original file, so the original can be patched in-memory at run-time.
    gamecode open cosmo1-new.exe diff cosmo1.exe mycosmo.exe

To get a list of supported file formats, run:

    gamecode --formats

## Installation as a dependency

If you wish to make use of the library in your own project, install it in the
usual way:

    npm install @camoto/gamecode

See `cli/index.js` for example use.  The quick start is:

    import {
        all as gamecodeFormats,
        decompressEXE,
        exe_cosmo1 as formatHandler,
    } from '@camoto/gamecode';
    
    // Read an executable's attributes into memory.
    const content = {
        // Load the file and UNLZEXE it if needed.
        main: decompressEXE(fs.readFileSync('cosmo1.exe')),
        // Some formats need additional files here, see handler.supps()
    };
    let exe = formatHandler.extract(content);
    
    // List the attributes.
    console.log(exe.attributes);
    
    // Change an attribute.
    exe.attributes['filename.music.1'].value = 'newsong.mni';
    
    // Write the .exe back to disk with the modifications.
    const outBuffer = formatHandler.patch(content, exe);
    fs.writeFileSync('cosmo1a.exe', outBuffer.main);

## Installation as a contributor

If you would like to help add more file formats to the library, great!
Clone the repo, and to get started:

    npm install --dev

Run the tests to make sure everything worked:

    npm run -s test

You're ready to go!  To add a new file format:

 1. Create a new file in the `formats/` folder for your format.
    Copying an existing file that covers a similar format will help
    considerably.  If you're not sure, `arc-grp-build.js` is a good
    starting point as it is fairly simple.
    
 2. Edit `formats/index.js` and add a line for your new file.

If your file format has any sort of compression or encryption, these algorithms
should go into the [gamecompjs](https://github.com/Malvineous/gamecompjs)
project instead.  This is to make it easier to reuse the algorithms, as many of
them (particularly the compression ones) are used amongst many unrelated file
formats.  All the gamecompjs algorithms are available to be used by any format
in this library.

During development you can test your code like this:

    # Read a sample song and list its details, with debug messages on
    $ DEBUG='gamecode:*' ./bin/gamecode open -f exe-myformat example.exe list

    # Make sure the format is identified correctly or if not why not
    $ DEBUG='gamecode:*' ./bin/gamecode identify example.exe

If you use `debug()` rather than `console.log()` in your code then these
messages can be left in for future diagnosis as they will only appear when the
`DEBUG` environment variable is set correctly.
