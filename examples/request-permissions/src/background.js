import {
  defaultIcon,
  greenIcon,
  hasPermission,
  setBadge,
} from './helpers.js';
import LoopedItems from './LoopedItems.js';

const permissionRequests = new Map();

window.getPermissionRequests = () => permissionRequests;
window.addPermissionRequests = url => {
  permissionRequests.set( url, Date.now() );
};

const tabUrls = new Map();

const badgeText = new Map();

// https://www.unicode.org/emoji/charts/full-emoji-list.html
badgeText.set('loading', new LoopedItems([ '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦' ]) );
badgeText.set('complete', '👍');

function tabUpdated(tabId, changeInfo, tab)
{
  if ( tab.url ){
    tabUrls.set( tabId, tab.url );

    greenIcon( tabId );

    setBadge({
      text: `${badgeText.get( changeInfo.status )}`,
      tabId,
    });
  }
}

function listenForTabUpdates( callback, urls )
{
  if ( browser.tabs.onUpdated.hasListener( callback ) ) {
    browser.tabs.onUpdated.removeListener( callback );
  }

  browser.tabs.onUpdated.addListener( callback, {
    urls,
    properties: [ 'status' ],
  } );
}

async function setup()
{
  const { origins } = await browser.permissions.getAll();

  if ( origins.length ) {
    listenForTabUpdates( tabUpdated, origins );
  }
}

async function onPermissionsAdded( permissions )
{
  const tabs = await browser.tabs.query({
    url: permissions.origins,
  });

  tabs.forEach( tab => greenIcon( tab.id ) );

  permissions.origins.forEach( url => permissionRequests.delete( url ) );
}

async function onPermissionsRemoved( permissions )
{
  const tabs = await browser.tabs.query({
    url: permissions.origins,
  });

  tabs.forEach( tab => defaultIcon( tab.id ) );
}

browser.permissions.onAdded.addListener( onPermissionsAdded );

browser.permissions.onRemoved.addListener( onPermissionsRemoved );

browser.tabs.onActivated.addListener( async () => {
  const [ tab ] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  const allowed = await hasPermission( tab.url );

  allowed ? greenIcon( tab.id ) : defaultIcon( tab.id );
});

setBadge({
  color: '#FFF',
  background: '#000',
});

setup();
