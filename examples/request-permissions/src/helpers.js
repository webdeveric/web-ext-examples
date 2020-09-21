export function setIcon( tabId, path )
{
  browser.browserAction.setIcon({
    path,
    tabId,
  });
}

export function defaultIcon( tabId )
{
  setIcon( tabId, 'grey.svg' );
}

export function greenIcon( tabId )
{
  setIcon( tabId, 'green.svg' );
}

export function redIcon( tabId )
{
  setIcon( tabId, 'red.svg' );
}

export function setBadge({
  tabId,
  text,
  color,
  background,
})
{
  const { browserAction } = browser;

  if ( text ) {
    browserAction.setBadgeText({
      text,
      tabId,
    });
  }

  if ( color && browserAction.setBadgeTextColor ) {
    browserAction.setBadgeTextColor({
      color,
      tabId,
    });
  }

  if ( background ) {
    browserAction.setBadgeBackgroundColor({
      color: background,
      tabId,
    });
  }
}

export function getEventNames( object )
{
  return Object.getOwnPropertyNames( object )
    .filter( name => name.startsWith('on') )
    .map( name => name.substring(2) );
}

export function filterByPatterns( data, patterns, inclusive = true )
{
  return data.filter( item => {
    for ( const pattern of patterns ) {
      if (
        ( pattern instanceof RegExp && pattern.test( item ) ) ||
        ( typeof pattern === 'string' && item === pattern )
      ) {
        return inclusive ? true : false;
      }
    }

    return inclusive ? false : true;
  });
}

export function logAllEvents( object )
{
  const eventNames = filterByPatterns(
    getEventNames( object ),
    [
      /mouse|pointer|transition|motion|orientation/,
      'resize',
    ],
    false
  );

  eventNames.forEach( eventName => {
    object.addEventListener( eventName, console.log );
  });

  return () => {
    eventNames.forEach( eventName => {
      object.removeEventListener( eventName, console.log );
    });
  };
}

export function allTrue( ...callbacks ) {
  for ( const cb of callbacks ) {
    if ( ! cb() ) {
      return false;
    }
  }

  return true;
}

const validScheme = /^(?:\*|https?|wss?|ftps?|data|file):/;
const validHostname = /^\*$|^(\*\.)?[a-z0-9-.]+$/;
const validPathname = /^\/.+/;

export function isRequestableUrl( url ) {
  try {
    const {
      protocol,
      hostname,
      pathname,
    } = new URL( url );

    if (
      ! validScheme.test(protocol) ||
      ( protocol !== 'file:' && ! validHostname.test(hostname) ),
      ! validPathname.test(pathname)
    ) {
      return false;
    }
  } catch (error) {
    console.error(error);

    return false;
  }

  return true;
}

export async function hasPermission( url )
{
  const allowed = await browser.permissions.contains({
    origins: [ url ],
  });

  return allowed;
}

export function urlToMatchPattern( url )
{
  if ( url.startsWith('about:') || url.startsWith('file:') || url.startsWith('resource:')  ) {
    return url;
  }

  const { origin } = new URL( url );

  return origin ? `${origin.replace(/:\d+$/, '')}/*` : url;
}
