# jQuery.panelSnap [![Build Status](https://travis-ci.org/guidobouman/jquery-panelsnap.png)](https://travis-ci.org/guidobouman/jquery-panelsnap)
A jQuery plugin that provides snapping functionality to a set of panels within your interface. Based on [jQuery Plugin Boilerplate](https://github.com/guidobouman/jquery-plugin-boilerplate)

# Demo
Check out the homepage at [http://guidobouman.github.io/jquery-panelsnap](http://guidobouman.github.io/jquery-panelsnap) or the demos folder for a working demo that explains most of the features present in the plugin.

# Usage
## The Basics
The most basic setup will bind to body and snap all sections.

Javascript:
```html
<!doctype html>
<html>
  <head>
    <script src="/path/to/jquery.js"></script>
    <script src="/path/to/jquery.panelSnap.js"></script>
    <script>
      jQuery(function($) {
        $('body').panelSnap();
      });
    </script>
  </head>
  <body>
    <section>
      ...
    </section>
    <section>
      ...
    </section>
    <section>
      ...
    </section>
  </body>
</html>
```

## Options
The following is a list of available options. The values are their defaults within the plugin.
```javascript
var options = {
  $menu: false,
  menuSelector: 'a',
  panelSelector: '> section',
  namespace: '.panelSnap',
  onSnapStart: function(){},
  onSnapFinish: function(){},
  onActivate: function(){},
  directionThreshold: 50,
  slideSpeed: 200,
  delay: 0,
  easing: 'linear',
  offset: 0,
  navigation: {
    keys: {
      nextKey: false,
      prevKey: false,
    },
    buttons: {
      $nextButton: false,
      $prevButton: false,
    },
    wrapAround: false
  }
};

$('.panel_container').panelSnap(options);
```

`$menu`:
jQuery DOM object referencing a menu that contains menu items.

`menuSelector`:
A string containing the css selector to menu items (scoped within the menu).

`panelSelector`:
A string containg the css selector to panels (scoped within the container).

`namespace`:
A string containing the jQuery event namespace that's being used.

`onSnapStart`:
A callback function that is being fired before a panel is being snapped.

`onSnapFinish`:
A callback function that is being fired after a panel was snapped.

`onActivate`:
A callback function that is being fired after a panel was activated. (This callback will ALWAYS fire, where onSnapStart & onStapFinish only fire before and after the plugin is actually snapping (animating) towards a panel.)

`directionThreshold`:
An integer specifying the amount of pixels required to scroll before the plugin detects a direction and snaps to the next panel.

`slideSpeed`:
The amount of miliseconds in which the plugin snaps to the desired panel.

`delay`:
An integer representing the delay (in milliseconds) before snapping to a panel.

`easing`:
The jQuery easing animation to use.

`offset`:
An integer specifying the number of pixels to offset when snapping to a panel. (Useful when a fixed position menu is displayed at the top of the page)

`navigation`:
An object containing all the settings for next/prev navigation through buttons or keys.

`navigation.keys`:
An object containing nextKey and prevKey.

`navigation.keys.nextKey`:
The keycode which triggers the navigation to the next panel.

`navigation.keys.prevKey`:
The keycode which triggers the navigation to the previous panel.

`navigation.buttons`:
An object containing $nextButton and $prevButton.

`navigation.buttons.$nextButton`:
A jQuery Object to bind a click-event to to trigger the navigation to the next panel.

`navigation.buttons.$prevButton`:
A jQuery Object to bind a click-event to to trigger the navigation to the previous panel.

`navigation.wrapAround`:
Boolean telling the plugin wether or not next/prev navigation should wrap around the beginning and end of the panelset.

## Attaching a menu

```html
<!doctype html>
<html>
  <head>
    <script src="/path/to/jquery.js"></script>
    <script src="/path/to/jquery.panelSnap.js"></script>
    <script>
      jQuery(function($) {
        var options = {
          $menu: $('header .menu')
        };

        $('.panel_container').panelSnap(options);
      });
    </script>
  </head>
  <body>
    <header>
      <div class="menu">
        <a href="/first" data-panel="first">First</a>
        <a href="/second" data-panel="second">Second</a>
        <a href="/third" data-panel="third">Third</a>
      </div>
    </header>
    <div class="panel_container">
      <section data-panel="first">
        ...
      </section>
      <section data-panel="second">
        ...
      </section>
      <section data-panel="third">
        ...
      </section>
    </div>
  </body>
</html>
```

Note the `data-panel` attributes on the links and the panels. This way the plugin knows which link matches to which panel.

# Events
The plugin emits the following events on the container object in the `panelsnap` namespace:

`panelsnap:start`:
Fired before a panel is being snapped.

`panelsnap:finish`:
Fired after a panel was snapped.

`panelsnap:activate`:
Fired after a panel was activated. (This callback will ALWAYS fire when switching to a panel, where onSnapStart & onStapFinish only fire before and after the plugin is actually snapping (animating) towards a panel.)

# Credits
- [jellea](https://github.com/jellea) for early feedback and brainpickings.
- [aalexandrov](https://github.com/aalexandrov) for small improvements & bugfixes.
- [akreitals](https://github.com/akreitals) for fixing keyboard navigation when disabled.
- [brumm](https://github.com/brumm) far a panel count bug.
- [dpaquette](https://github.com/dpaquette) for the offset option.
- [wudi96](https://github.com/wudi96) for button navigation.
