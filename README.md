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
  panelSelector: 'section',
  namespace: '.panelSnap',
  onSnapStart: function(){},
  onSnapFinish: function(){},
  onActivate: function(){},
  directionThreshold: 50,
  slideSpeed: 200,
  keyboardNavigation: {
    enabled: false,
    nextPanelKey: 40,
    previousPanelKey: 38,
    wrapAround: true
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

`keyboardNavigation`:
An object containing all the settings for keyboard navigation.

`keyboardNavigation.enabled`:
Boolean telling the plugin wether or not to use keyboard navigation.

`keyboardNavigation.nextPanelKey`:
The keycode which triggers the navigation to the next panel.

`keyboardNavigation.previousPanelKey`:
The keycode which triggers the navigation to the previous panel.

`keyboardNavigation.previousPanelKey`:
Boolean telling the plugin wether or not keyboard navigation should wrap around the begining and end of the panelset.

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
- [aalexandrov](https://github.com/aalexandrov) for lots of small improvements & bugfixes.
