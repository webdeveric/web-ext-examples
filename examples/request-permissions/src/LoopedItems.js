export default class LoopedItems
{
  currentIndex = 0;

  timeBetween;

  lastAccess;

  items;

  constructor( items, timeBetween = 0 )
  {
    this.items = items;
    this.timeBetween = timeBetween;
  }

  reset()
  {
    this.currentIndex = 0;
    this.lastAccess = undefined;
  }

  get()
  {
    const item = this.items[ this.currentIndex ];

    if ( this.timeBetween ) {
      if ( this.lastAccess !== undefined && Date.now() - this.lastAccess < this.timeBetween ) {
        return item;
      }

      this.lastAccess = Date.now();
    }

    ++this.currentIndex;

    if ( this.currentIndex >= this.items.length ) {
      this.currentIndex = 0;
    }

    return item;
  }

  toString()
  {
    return String( this.get() );
  }
}
