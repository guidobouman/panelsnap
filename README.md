# jQuery.panelSnap [![Build Status](https://travis-ci.org/guidobouman/jquery-panelsnap.png)](https://travis-ci.org/guidobouman/jquery-panelsnap)
A jQuery plugin that provides snapping functionality to a set of panels within your interface.

# Demo
A working development version of the code can be seen at http://dev.guido.vc/

# Usage
## The Basics
The most basic setup will bind to body and snap all sections.

Javascript:
```html
<html>
  <head>
    <script src="/path/to/jquery-panelSnap-0.4.2.js"></script>
    <script>
      $('body').panelSnap();
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
  directionThreshold: 50,
  slideSpeed: 200
};

$('.panel_container').panelSnap(options);
```

`$menu`:
jQuery object referencing a menu that contains menu items

`menuSelector`:
A string containing the css selector to menu items (scoped within the menu)

`panelSelector`:
A string containg the css selector to panels (scoped within the container)

`namespace`:
A string containing the jQuery event namespace that's being used

`onSnapStart`:
A callback function that is being fired before a panel is being snapped

`onSnapStop`:
A callback function that is being fired after a panel was snapped

`directionThreshold`:
An integer specifying the ammount of pixels required to scroll before the plugin detects a direction and snaps to the next panel.

`slideSpeed`:
The ammount of miliseconds in which the plugin snaps to the desired panel

## Attaching a menu

```html
<html>
  <head>
    <script src="/path/to/jquery-panelSnap-0.4.2.js"></script>
    <script>
      var options = {
        $menu: $('header .menu')
      };
      
      $('.panel_container').panelSnap(options);
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
```
