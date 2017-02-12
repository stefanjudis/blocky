'use strict';

const { app, Menu, Tray, powerSaveBlocker } = require( 'electron' );
const path = require( 'path' );

let appTray        = null;
let currentBlocker = null;

/**
 * Icons to display inside of the tray
 *
 * @type {Object}
 */
const icons = {
  active    : path.join( __dirname, 'media', 'icon_active.png' ) ,
  notActive : path.join( __dirname, 'media', 'icon.png' )
}


/**
 * Menu to set inside of tray
 *
 * @type {Object}
 */
const menus = {
  active    : Menu.buildFromTemplate( [
    { label: 'Time for sleeping again', click : toggleSleepPermission },
    { label: 'Quit', click : app.quit }
  ] ),
  notActive : Menu.buildFromTemplate( [
    { label: 'Don\'t go to sleep', click : toggleSleepPermission },
    { label: 'Quit', click : app.quit }
  ] )
};


// kick off
app.on( 'ready', initTray );


/**
 * Initialize the tray
 */
function initTray() {
  if ( app.dock ) {
    app.dock.hide();
  }

  appTray = new Tray( path.resolve( __dirname, 'media', 'icon.png' ) );
  appTray.setToolTip( 'Block screensaver' );
  appTray.setContextMenu( menus.notActive );
}


/**
 * Toggle sleep blocking functionality
 */
function toggleSleepPermission() {
  let state;

  if ( currentBlocker === null ) {
    currentBlocker = powerSaveBlocker.start( 'prevent-display-sleep' );
    state = 'active';
  } else {
    powerSaveBlocker.stop( currentBlocker );
    currentBlocker = null;
    state = 'notActive';
  }

  appTray.setContextMenu( menus[ state ] );
  appTray.setImage( icons[ state ] );
}
