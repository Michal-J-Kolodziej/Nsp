# Nsp

Nsp is a small library that helps you build unusual webpages. Get rid of boring scrollbar, instead make something more interesting with nsp.

## How to use nsp

### 0. Download and add files to your project
Download files from this repo, add the nsp catalog to your project and add nsp-style.css before </head> tag and also nsp-script.js before </body> tag. Your code should look something like this:

```html
<head>
  <!-- Your <head> contnet -->
    <link rel="stylesheet" href="nsp/nsp-style.css">
</head>

<body>
    <!-- Your <body> content -->
    <script src="nsp/nsp-script.js"></script>
</body>
```

### 1. Stacked sections
All sections are stacked one on another. When u 'scroll' page down the top section slides nad hides 'above' the page.

To achieve this effect you have to do a few simple things:

- Create a structure of your page using any tag u want (for example 'section' or 'div') and to every one of them add 'nsp-container-stacked' class:

```html
<body>
    <section class="nsp-container-stacked"></section>
    <section class="nsp-container-stacked"></section>
    <section class="nsp-container-stacked"></section>
    <section class="nsp-container-stacked"></section>

    <script src="nsp/nsp-script.js"></script>
</body>
```
##### At this point you are ready to go! Your page should be working flawless. But you can add navigation that I call 'dots'. You can learn more about them [below](#3-dots-navigation).

### 2. Slide sections
All sections are just a usual sections with {display: block; width: 100vw; height: 100vh;} properties. But page isn't scrolling like it usually would do, instead after using mousewheel or triggering any other event set in Conf object in nsp-script.js file, page is 'sliding' from one section to another.

In order to achieve this effect you have to take similar steps to the previous method:

- Create a structure of your page using any tag u want (for example 'section' or 'div') and to every one of them add 'nsp-container-slide' class:

```html
<body>
    <div class="nsp-container-slide"></div>
    <div class="nsp-container-slide"></div>
    <div class="nsp-container-slide"></div>
    <div class="nsp-container-slide"></div>

    <script src="nsp/nsp-script.js"></script>
</body>
```
##### At this point you are ready to go! Your page should be working flawless. But you can add navigation that I call 'dots'. You can learn more about them [below](#3-dots-navigation).
  
### 3. Dots (navigation)

- Above your 'section' tags add a 'div' tag with 'nsp-dots-left' or 'nsp-dots-right' class ('left' or 'right' means where the dots appear on your page). In this 'div' tag add children which should also be a 'div' tag but with 'nsp-dot' class. Their number must be the same as the number of your tags with 'nsp-container' class. Your code should look something like this: 
  
  ```html
  <body>
    <div class="nsp-dots-left">
        <div class="nsp-dot"></div>
        <div class="nsp-dot"></div>
        <div class="nsp-dot"></div>
        <div class="nsp-dot"></div>
    </div>
    <section class="nsp-container-stacked"></section>
    <section class="nsp-container-stacked"></section>
    <section class="nsp-container-stacked"></section>
    <section class="nsp-container-stacked"></section>

    <script src="nsp/nsp-script.js"></script>
  </body>
  ```

## Important things to know

#### 1. Configure
At the start of nsp-script.js there is a Conf object in which you can change some values to adjust the script for your needs. For example you can turn on or off some of the scrolling possibilities or change time offset between scrolls.

#### 2. Z-index
Sections's z-index value starts at 50 so first section's z-index value is 50, next section's value is 49 an so on. Container's for dots z-index value is 51.

## Author
- Michał Kołodziej

