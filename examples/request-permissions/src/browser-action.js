import {
  hasPermission,
  isRequestableUrl,
  urlToMatchPattern,
} from './helpers.js';
import LoopedItems from './LoopedItems.js';

const clockFace = new LoopedItems(
  [ '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦' ],
  150,
);

function requestPermissions( url, permissions = [] )
{
  return () => browser.permissions.request({
    origins: [ url ],
    permissions,
  });
}

function animateClock()
{
  const loading = document.getElementById('loading');

  if ( ! loading ) {
    return;
  }

  const node = new Text(`${clockFace}`);

  if (loading.firstChild) {
    loading.firstChild.replaceWith( node );
  } else {
    loading.append( node );
  }

  animateClock.timer = requestAnimationFrame( animateClock );
}

animateClock.timer = null;

animateClock.stop = () => {
  cancelAnimationFrame( animateClock.timer );
};

browser.tabs.query({
  active: true,
  currentWindow: true,
}).then( async ([ tab ]) => {
  const loading = document.querySelector('#loading');
  const button = document.querySelector('#requestButton');
  const code = document.querySelector('#code');

  try {
    animateClock();

    if ( isRequestableUrl( tab.url ) ) {
      const backgroundPage = await browser.runtime.getBackgroundPage();
      const perms = await browser.permissions.getAll();
      const hasPerm = await hasPermission( tab.url );
      const urlPattern = urlToMatchPattern( tab.url );

      const requestUrlPermissions = requestPermissions( urlPattern );

      if ( backgroundPage.getPermissionRequests().has( urlPattern ) ) {
        code.append(`${urlPattern} has been requested before`);
      }

      button.addEventListener('click', () => {
        backgroundPage.addPermissionRequests( urlPattern );

        requestUrlPermissions().catch( console.dir );
      } );

      if ( hasPerm ) {
        code.classList.add('has-permissions');
      }

      code.append( JSON.stringify( perms, null, 2 ) );
    } else {
      button.setAttribute('disabled', 'disabled');

      code.append(`${tab.url} cannot be requested.`);
    }
  } catch ( error ) {
    console.error( error );
    button.setAttribute('disabled', 'disabled');
    code.append( error.message );
  } finally {
    animateClock.stop();
    loading.remove();
  }
}).catch( console.error );
