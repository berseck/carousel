# Carousel
## Usage

This carousel was made to easy slide between images with the capability of changing how many slides you want to move and how many you want to view at time

### Basic Usage
```javascript
$(document).ready(function(){ 
	var config = { 
		id:'#slideshow',
		visible: 3,
		slidesPerMove: 3,
		timeout: 500
	}
	cycle = new myCycle(config);
	cycle.init();
});
```


## Browser Compatibility

#### The Test Suite succeeds in the following browsers that were tested:

* Firefox 3+
* Safari 3+
* Chrome 7+
* Opera 10+
* IE 8+
* Mobile Safari on iPad 4.2.2
* Fennec 4b on Android 2.2
* Opera Mobile 10.1b on Android 2.2