# Nsp

Nsp is a small library that helps you build unusual webpages. Get rid of boring scrollbar, instead make something more interesting with nsp.

## How to use nsp

### 0. Download and add files to your project
Download files from this repo, add the nsp catalog to your project and add nsp-style.css before </head> tag and also nsp-script.js before </body> tag. Your code should look something like this:

```
<head>
  <!-- Your <head> contnet -->
    <link rel="stylesheet" href="nsp/nsp-style.css">
</head>

<body>
    <!-- Your <body> content -->
    <script src="nsp/nsp-script.js"></script>
</body>
```

#### 1. Stacked sections
All sections are stacked one on another. When u 'scroll' page down the top section slides nad hides 'above' the page.

To achieve this effect u have to do a few simple things:

- Create a structure of your page using any tag u want (for example <section></section> or <div></div>) and to every one of them add 'nsp-container' class:

```
<body>
    <section class="nsp-container">1</section>
    <section class="nsp-container">2</section>
    <section class="nsp-container">3</section>
    <section class="nsp-container">4</section>

    <script src="nsp/nsp-script.js"></script>
</body>
```

## Important things to know

#### 1. Configure
At the start of nsp-script.js there is a Conf object in which you can change some values to adjust teh script for your needs. For example you can turn on or off some of the scrolling possibilities or change time offset between 

#### 2. Z-index
Sections' z-index value starts at 50 so first section's z-index value is 50, next section's value is 49 an so on. Container's for dots z-index value is 51.

