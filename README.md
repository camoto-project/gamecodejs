# gamecode.js
Copyright 2010-2020 Adam Nielsen <<malvineous@shikadi.net>>  

This is a Javascript library that can modify executable files for a number of
MS-DOS games from the 1990s.  It allows simple changes like modifying the text
displayed in the user interface, to more complex changes like patching the code
itself at runtime to change the game's behaviour.

Note that the library is still in the very early stages of development, so most
of this functionality has not yet been implemented!

Some game executables have large data chunks.  This library's focus is on small
bits of data and so it does not provide access to those large chunks.  Instead,
those are accessible through gamearchive.js as an archive file.

## Installation as an end-user

If you wish to use the command-line `gamecode` utility to work with game
executables directly, you can install the library globally on your system:

    npm install -g @camoto/gamecode

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

    import GameCode from '@camoto/gamecode';
    import GameCodeDecompress from '@camoto/gamecode/util/decompress.js';
    
    // Read an executable's attributes into memory.
    const handler = GameCode.getHandler('exe-cosmo');
    const content = {
        // Load the file and UNLZEXE it if needed.
        main: GameCodeDecompress(fs.readFileSync('cosmo1.exe')),
        // Some formats need additional files here, see handler.supps()
    };
    let exe = handler.extract(content);
    
    // List the attributes.
    console.log(exe.attributes);
    
    // Change an attribute.
    exe.attributes['filename.music.1'].value = 'newsong.mni';
    
    // Write the .exe back to disk with the modifications.
    const outBuffer = handler.patch(content, exe);
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
    
 2. Edit the main `index.js` and add a `require()` statement for your new file.
    
 3. Make a folder in `test/` for your new format and populate it with
    files similar to the other formats.  The tests work by creating
    a standard archive file with some preset files in it, and
    comparing the result to what is inside this folder.
    
    You can either create these archives by hand, with another utility, or if
    you are confident that your code is correct, from the code itself.  This is
    done by setting an environment variable when running the tests, which will
    cause the archive file produced by your code to be saved to a temporary
    file in the current directory:
    
        SAVE_FAILED_TEST=1 npm test
        mv error1.bin test/exe-myformat/default.bin

If your archive format has any sort of compression or encryption,
these algorithms should go into the `gamecomp` project instead.  This
is to make it easier to reuse the algorithms, as many of them
(particularly the compression ones) are used amongst many unrelated
archive formats.  All the `gamecomp` algorithms are available to be
used by any archive format in this library.

During development you can test your code like this:

    # Read a sample song and list its details, with debug messages on
    $ DEBUG='gamecode:*' ./bin/gamemus open -f mus-myformat example.dat list

    # Make sure the format is identified correctly or if not why not
    $ DEBUG='gamecode:*' ./bin/gamemus identify example.dat

If you use `debug()` rather than `console.log()` in your code then these
messages can be left in for future diagnosis as they will only appear when the
`DEBUG` environment variable is set correctly.
