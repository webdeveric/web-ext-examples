function setOver18Cookie( url )
{
  return browser.cookies.set({
    url,
    domain: '.reddit.com',
    firstPartyDomain: '',
    name: 'over18',
    path: '/',
    value: '1',
  });
}

Promise.allSettled([
  setOver18Cookie('https://www.reddit.com/'),
  setOver18Cookie('https://old.reddit.com/'),
]).then( results => {
  console.log( results );
});
